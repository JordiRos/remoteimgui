//-----------------------------------------------------------------------------
// Remote Imgui for https://github.com/ocornut/imgui
// https://github.com/JordiRos/remoteimgui
// Jordi Ros
//-----------------------------------------------------------------------------

#if 0

//------------------
// WebSocketServer
// - you need to provide your own implementation, from which you can inherit OnMessage, OnError, SendText and SendBinary functions
//------------------
/*
	struct WebSocketServer {

		enum OpCode
		{
			Text,
			Binary,
			Disconnect,
			Ping,
			Pong
		};
		void Init(int port);

		virtual void OnMessage(OpCode opcode, const void *data, int size) { }
		virtual void OnError() { }

		virtual void SendText(const void *data, int size);
		virtual void SendBinary(const void *data, int size);
	};
*/

//------------------
// ImGuiRemoteInput
// - a structure to store input received from remote imgui, so you can use it on your whole app (keys, mouse) or just in imgui engine, up to you and your needs
// - in this example input is not fully included, but it should be easy to just attach to ImGui input in the same way you set input from your app
// - use GetImGuiRemoteInput to read input data safely (only valid if the input is < 30 frames old)
//------------------
/*
	struct ImGuiRemoteInput
	{
	    float2		MousePos;
	    int			MouseButtons;
	    int         MouseWheel;
	    bool        KeyCtrl;
	    bool        KeyShift;
	    bool        KeysDown[256];
	};
*/

//------------------
// During InitImGui
// - best set rounding to 0 (less data) and a really big virtual canvas so no clipping occurs based on your devices size
// - you might also like changing colours a bit, as Remote ImGui does not use alpha channel
// - call server.Init(port) to initialize, then if you need to pull network code, add it somewhere (depends on your implementation)
//------------------
/*
	ImGui::GetStyle().WindowRounding = 0.f;
	ImGui::GetIO().DisplaySize = _float2(8000, 8000);
	GImWebSocket.Init(7002);
*/

//------------------
// Render
// - first count cmd lists and vertices to prepare packet message, then just send them via the provided functions
// - compression is handled internally, enabled by default
//------------------
/* Count
	if (GImWebSocket.ClientActive)
	{
		// Count
		int cmd_count = 0;
		int vtx_count = 0;
		for (int n = 0; n < cmd_lists_count; n++)
		{
			const ImDrawList * cmd_list = cmd_lists[n];
			const ImDrawVert * vtx_src = cmd_list->vtx_buffer.begin();
			cmd_count += cmd_list->commands.size();
			vtx_count += cmd_list->vtx_buffer.size();
		}

		// Send 
		static int sendframe = 0;
		if (sendframe++ >= 2) // every 2 frames, @TWEAK
		{
			sendframe = 0;
			GImWebSocket.PrepareMessage(cmd_count, vtx_count);
			// Add all drawcmds
			ImWebSocketServer::Cmd cmd;
			for (int n = 0; n < cmd_lists_count; n++)
			{
				const ImDrawList* cmd_list = cmd_lists[n];
				const ImDrawCmd* pcmd_end = cmd_list->commands.end();
				for (const ImDrawCmd* pcmd = cmd_list->commands.begin(); pcmd != pcmd_end; pcmd++)
				{
					cmd.Set(*pcmd);
					GImWebSocket.Write(cmd);
				}
			}
			// Add all vtx
			ImWebSocketServer::Vtx vtx;
			for (int n = 0; n < cmd_lists_count; n++)
			{
				const ImDrawList* cmd_list = cmd_lists[n];
				const ImDrawVert* vtx_src = cmd_list->vtx_buffer.begin();
				int vtx_remaining = cmd_list->vtx_buffer.size();
				while (vtx_remaining-- > 0)
				{
					vtx.Set(*vtx_src++);
					GImWebSocket.Write(vtx);
				}
			}
			// Send
			GImWebSocket.SendMessage();
		}
	}
*/

//------------------
// LZ4
// - https://code.google.com/p/lz4/
//------------------

#endif

#include <stdio.h>
#include <lz4/lz4.h>

#define IMGUI_REMOTE_KEY_FRAME 30 // Send key frame every 30 frames

struct ImWebSocketServer : public WebSocketServer
{
	bool ClientActive=false;
	int Frame=0;
	int FrameReceived=0;
	ImGuiRemoteInput Input;

	virtual void OnMessage(OpCode opcode, const void *data, int size)
	{
		switch (opcode)
		{
			// Text message
			case WebSocketServer::Text:
				if (!ClientActive)
				{
					if (!memcmp(data, "ImInit", 6))
					{
						ClientActive = true;
						key_frame = -1;
						// Send confirmation
						SendText("ImInit", 6);
					}
				}
				else if (strstr((char *)data, "ImMouseMove"))
				{
					int x, y;
					if (sscanf_s((char *)data, "ImMouseMove=%d,%d", &x, &y) == 2)
					{
						FrameReceived = Frame;
						Input.MousePos.x = (float)x;
						Input.MousePos.y = (float)y;
					}
				}
				else if (strstr((char *)data, "ImMousePress"))
				{
					int l, r;
					if (sscanf((char *)data, "ImMousePress=%d,%d", &l, &r) == 2)
					{
						FrameReceived = Frame;
						Input.MouseButtons = l | (r<<1);
					}
				}
				else if (strstr((char *)data, "ImMouseWheel"))
				{
					int new_wheel;
					if (sscanf((char *)data, "ImMouseWheel=%d", &new_wheel) == 1)
					{
						FrameReceived = Frame;
						Input.MouseWheel = new_wheel;
					}
				}
				else if (strstr((char *)data, "ImKeyDown"))
				{
					int key;
					if (sscanf((char *)data, "ImKeyDown=%d", &key) == 1)
					{
						//update key states
						FrameReceived = Frame;
						Input.KeysDown[key] = true;
					}
				}
				else if (strstr((char *)data, "ImKeyUp"))
				{
					int key;
					if (sscanf((char *)data, "ImKeyUp=%d", &key) == 1)
					{
						//update key states
						FrameReceived = Frame;
						Input.KeysDown[key] = false;
					}
				}
				else
				break;
			// Binary message
			case WebSocketServer::Binary:
				//printf("ImGui client: Binary message received (%d bytes)\n", size);
				break;
			// Disconnect
			case WebSocketServer::Disconnect:
				printf("ImGui client: DISCONNECT\n");
				ClientActive=false;
				break;
			// Ping
			case WebSocketServer::Ping:
				printf("ImGui client: PING\n");
				break;
			// Pong
			case WebSocketServer::Pong:
				printf("ImGui client: PONG\n");
				break;
		}
	}

#pragma pack(1)
	struct Cmd
	{
		u32   vtx_count;
		float clip_rect[4];
		void Set(const ImDrawCmd &draw_cmd)
		{
			vtx_count = draw_cmd.vtx_count;
			clip_rect[0] = draw_cmd.clip_rect.x;
			clip_rect[1] = draw_cmd.clip_rect.y;
			clip_rect[2] = draw_cmd.clip_rect.z;
			clip_rect[3] = draw_cmd.clip_rect.w;
			//printf("DrawCmd: %d ( %.2f, %.2f, %.2f, %.2f )\n", vtx_count, clip_rect[0], clip_rect[1], clip_rect[2], clip_rect[3]);
		}
	};
	struct Vtx
	{
		s16 x,y; // 16 short
		s16 u,v; // 16 fixed point
		u8  r,g,b; // 8
		void Set(const ImDrawVert &vtx)
		{
			x = (short)(vtx.pos.x);
			y = (short)(vtx.pos.y);
			u = (short)(vtx.uv.x * 32767.f);
			v = (short)(vtx.uv.y * 32767.f);
			r = (vtx.col>>0 ) & 0xff;
			g = (vtx.col>>8 ) & 0xff;
			b = (vtx.col>>16) & 0xff;
		}
	};
#pragma pack()

	Vector<u8> message;
	Vector<u8> prev_message;
	int prev_message_size = 0;
	int key_frame = -1;

	bool IsKey() { return key_frame==0; }

	void Write(u8 c) { message.push_back(c); }
	void Write(u32 i)
	{
		if (IsKey())
			Write(&i, sizeof(u32));
		else
			WriteDiff(&i, sizeof(u32));
	}
	void Write(Cmd const &cmd)
	{
		if (IsKey())
			Write((void *)&cmd, sizeof(Cmd));
		else
			WriteDiff((void *)&cmd, sizeof(Cmd));
	}
	void Write(Vtx const &vtx)
	{
		if (IsKey())
			Write((void *)&vtx, sizeof(Vtx));
		else
			WriteDiff((void *)&vtx, sizeof(Vtx));
	}
	void Write(void *data, int size)
	{
		u8 *src = (u8 *)data;
		for (int i = 0; i < size; i++)
		{
			int pos = message.size();
			Write(src[i]);
			prev_message[pos] = src[i];
		}
	}
	void WriteDiff(void *data, int size)
	{
		u8 *src = (u8 *)data;
		for (int i = 0; i < size; i++)
		{
			int pos = message.size();
			Write((u8)(src[i] - (pos < prev_message_size ? prev_message[pos] : 0)));
			prev_message[pos] = src[i];
		}
	}

	void PrepareMessage(u32 cmd_count, u32 vtx_count)
	{
		key_frame = (key_frame+1) % IMGUI_REMOTE_KEY_FRAME;
		int size = sizeof(u8) + 2*sizeof(u32) + cmd_count*sizeof(Cmd) + vtx_count*sizeof(Vtx);
		message.clear();
		message.reserve(size);
		prev_message.reserve(size);
		while (size > prev_message.size())
			prev_message.push_back(0);
		Write((u8)(IsKey()?1:0));
		Write(cmd_count);
		Write(vtx_count);
		//printf("ImWebSocket PrepareMessage: cmd_count = %i, vtx_count = %i ( %lu bytes )\n", cmd_count, vtx_count, sizeof(u32) + sizeof(u32) + cmd_count * sizeof(Cmd) + vtx_count * sizeof(Vtx));
	}

	void SendMessage()
	{
		static int buffer[65536];
		int size = message.size();
		int csize = LZ4_compress_limitedOutput((char *)message.begin(), (char *)(buffer+3), size, 65536*sizeof(int)-12);
		buffer[0] = 0xBAADFEED; // Our LZ4 header magic number (used in custom lz4.js to decompress)
		buffer[1] = size;
		buffer[2] = csize;
		//printf("ImWebSocket SendMessage: %s %d / %d (%.2f%%)\n", IsKey() ? "(KEY)" : "", size, csize, (float)csize * 100.f / size);
		SendBinary(buffer, csize+12);
		prev_message_size = size;
	}
};

// ImServer instance
ImWebSocketServer GImWebSocket;

bool GetImGuiRemoteInput(ImGuiRemoteInput & input)
{
	if (GImWebSocket.ClientActive)
	{
		if (GImWebSocket.FrameReceived > (GImWebSocket.Frame - 30))
		{
			input = GImWebSocket.Input;
			return true;
		}
		memset(GImWebSocket.Input.KeysDown, 0, 256*sizeof(bool));
		GImWebSocket.Input.KeyCtrl = false;
		GImWebSocket.Input.KeyShift = false;
	}
	return false;
}
