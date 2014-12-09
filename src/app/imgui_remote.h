//-----------------------------------------------------------------------------
// Remote Imgui for https://github.com/ocornut/imgui
// https://github.com/JordiRos/remoteimgui
// Jordi Ros
//-----------------------------------------------------------------------------

#include "lz4/lz4.h"      // https://code.google.com/p/lz4/
#include <stdio.h>
#include <vector>

#define IMGUI_REMOTE_KEY_FRAME    30  // send keyframe every 30 frames
#define IMGUI_REMOTE_INPUT_FRAMES 120 // input valid during 120 frames

namespace ImGui {

//------------------
// ImGuiRemoteInput
// - a structure to store input received from remote imgui, so you can use it on your whole app (keys, mouse) or just in imgui engine
// - use GetImGuiRemoteInput to read input data safely (valid for IMGUI_REMOTE_INPUT_FRAMES)
//------------------
struct RemoteInput
{
	ImVec2	MousePos;
	bool	MouseButtons[5];
	float	MouseWheel;
	bool	KeyCtrl;
	bool	KeyShift;
	bool	KeysDown[256];
};


//------------------
// IWebSocketServer
// - WebSocketServer interface
//------------------
/*
struct IWebSocketServer
{
	enum OpCode
	{
		Text,
		Binary,
		Disconnect,
		Ping,
		Pong
	};
	void Init(const char *bind_address, int port);
	void Shutdown();
	void SendText(const void *data, int size);
	void SendBinary(const void *data, int size);
  	virtual void OnMessage(OpCode opcode, const void *data, int size) { }
	virtual void OnError() { }
};
*/

#include "imgui_remote_webby.h"


//------------------
// WebSocketServer
// - ImGui web socket server connection
//------------------
struct WebSocketServer : public IWebSocketServer
{
	bool ClientActive;
	int Frame;
	int FrameReceived;
	int KeyFrame;
	int PrevMessageSize;
	std::vector<unsigned char> Message;
	std::vector<unsigned char> PrevMessage;
	RemoteInput Input;

	WebSocketServer()
	{
		ClientActive = false;
		Frame = 0;
		FrameReceived = 0;
		KeyFrame = -1;
		PrevMessageSize = 0;
	}
	
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
						KeyFrame = -1;
						// Send confirmation
						SendText("ImInit", 6);
					}
				}
				else if (strstr((char *)data, "ImMouse"))
				{
					int x, y, l, r, w;
					if (sscanf_s((char *)data, "ImMouse=%d,%d,%d,%d,%d", &x, &y, &l, &r, &w) == 5)
					{
						FrameReceived = Frame;
						Input.MousePos.x = (float)x;
						Input.MousePos.y = (float)y;
						Input.MouseButtons[0] = l != 0;
						Input.MouseButtons[1] = r != 0;
						Input.MouseWheel = (float)w;
						//printf("MouseMove: %d,%d\n", x,y);
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
		int   vtx_count;
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
		short x,y; // 16 short
		short u,v; // 16 fixed point
		unsigned char r,g,b; // 8
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

	bool IsKey() { return KeyFrame == 0; }

	void Write(unsigned char c) { Message.push_back(c); }
	void Write(unsigned int i)
	{
		if (IsKey())
			Write(&i, sizeof(unsigned int));
		else
			WriteDiff(&i, sizeof(unsigned int));
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
		unsigned char *src = (unsigned char *)data;
		for (int i = 0; i < size; i++)
		{
			int pos = Message.size();
			Write(src[i]);
			PrevMessage[pos] = src[i];
		}
	}
	void WriteDiff(void *data, int size)
	{
		unsigned char *src = (unsigned char *)data;
		for (int i = 0; i < size; i++)
		{
			int pos = Message.size();
			Write((unsigned char)(src[i] - (pos < PrevMessageSize ? PrevMessage[pos] : 0)));
			PrevMessage[pos] = src[i];
		}
	}

	void PrepareMessage(unsigned int cmd_count, unsigned int vtx_count)
	{
		KeyFrame = (KeyFrame+1) % IMGUI_REMOTE_KEY_FRAME;
		unsigned int size = sizeof(unsigned char) + 2*sizeof(unsigned int) + cmd_count*sizeof(Cmd) + vtx_count*sizeof(Vtx);
		Message.clear();
		Message.reserve(size);
		PrevMessage.reserve(size);
		while (size > PrevMessage.size())
			PrevMessage.push_back(0);
		Write((unsigned char)(IsKey()?1:0));
		Write(cmd_count);
		Write(vtx_count);
		//printf("ImWebSocket PrepareMessage: cmd_count = %i, vtx_count = %i ( %lu bytes )\n", cmd_count, vtx_count, sizeof(unsigned int) + sizeof(unsigned int) + cmd_count * sizeof(Cmd) + vtx_count * sizeof(Vtx));
	}

	void SendMessage()
	{
		static int buffer[65536];
		int size = Message.size();
		int csize = LZ4_compress_limitedOutput((char *)&Message[0], (char *)(buffer+3), size, 65536*sizeof(int)-12);
		buffer[0] = 0xBAADFEED; // Our LZ4 header magic number (used in custom lz4.js to decompress)
		buffer[1] = size;
		buffer[2] = csize;
		//printf("ImWebSocket SendMessage: %s %d / %d (%.2f%%)\n", IsKey() ? "(KEY)" : "", size, csize, (float)csize * 100.f / size);
		SendBinary(buffer, csize+12);
		PrevMessageSize = size;
	}
};


static WebSocketServer GServer;


//------------------
// RemoteGetInput
// - get input received from remote safely (valid for 30 frames)
//------------------
bool RemoteGetInput(RemoteInput & input)
{
	if (GServer.ClientActive)
	{
		if (GServer.Frame - GServer.FrameReceived < IMGUI_REMOTE_INPUT_FRAMES)
		{
			input = GServer.Input;
			return true;
		}
		memset(GServer.Input.KeysDown, 0, 256*sizeof(bool));
		GServer.Input.KeyCtrl = false;
		GServer.Input.KeyShift = false;
	}
	return false;
}


//------------------
// RemoteInit
// - initialize RemoteImGui on top of your ImGui
//------------------
void RemoteInit(const char *bind_address, int port, float vwidth, float vheight)
{
	ImGui::GetStyle().WindowRounding = 0.f;
	ImGui::GetIO().DisplaySize = ImVec2(vwidth, vheight);
	GServer.Init(bind_address, port);
}


//------------------
// RemoteUpdate
// - update RemoteImGui stuff
//------------------
void RemoteUpdate()
{
	GServer.Update();
}


//------------------
// RemoteDraw
// - send draw list commands to connected client
//------------------
void RemoteDraw(ImDrawList** const cmd_lists, int cmd_lists_count)
{
	GServer.Frame++;

	if (GServer.ClientActive)
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
			GServer.PrepareMessage(cmd_count, vtx_count);
			// Add all drawcmds
			WebSocketServer::Cmd cmd;
			for (int n = 0; n < cmd_lists_count; n++)
			{
				const ImDrawList* cmd_list = cmd_lists[n];
				const ImDrawCmd* pcmd_end = cmd_list->commands.end();
				for (const ImDrawCmd* pcmd = cmd_list->commands.begin(); pcmd != pcmd_end; pcmd++)
				{
					cmd.Set(*pcmd);
					GServer.Write(cmd);
				}
			}
			// Add all vtx
			WebSocketServer::Vtx vtx;
			for (int n = 0; n < cmd_lists_count; n++)
			{
				const ImDrawList* cmd_list = cmd_lists[n];
				const ImDrawVert* vtx_src = cmd_list->vtx_buffer.begin();
				int vtx_remaining = cmd_list->vtx_buffer.size();
				while (vtx_remaining-- > 0)
				{
					vtx.Set(*vtx_src++);
					GServer.Write(vtx);
				}
			}
			// Send
			GServer.SendMessage();
		}
	}
}


} // namespace
