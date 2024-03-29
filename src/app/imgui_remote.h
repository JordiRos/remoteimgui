//-----------------------------------------------------------------------------
// Remote ImGui https://github.com/JordiRos/remoteimgui
// Uses
// ImGui https://github.com/ocornut/imgui 1.3
// Webby https://github.com/deplinenoise/webby
// LZ4   https://code.google.com/p/lz4/
//-----------------------------------------------------------------------------

#include "lz4/lz4.h"
#include <stdio.h>

#define IMGUI_REMOTE_KEY_FRAME    60  // send keyframe every 30 frames
#define IMGUI_REMOTE_INPUT_FRAMES 60 // input valid during 120 frames

namespace ImGui {

	//------------------
	// ImGuiRemoteInput
	// - a structure to store input received from remote imgui, so you can use it on your whole app (keys, mouse) or just in imgui engine
	// - use GetImGuiRemoteInput to read input data safely (valid for IMGUI_REMOTE_INPUT_FRAMES)
	//------------------
	struct RemoteInput
	{
		ImVec2	MousePos;
		int		MouseButtons;
		float	MouseWheelDelta;
		bool	KeyCtrl;
		bool	KeyShift;
		bool	KeysDown[ 256 ];
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

	template<typename T> class Vector
	{
	private:
		T * Items;
		unsigned int Size;
		unsigned int Capacity;
	public:
		Vector()
			: Items( NULL )
			, Size( 0 )
			, Capacity( 0 )
		{
			reserve( 16 );
		}
		Vector( unsigned int initialCapacity )
			: Items( NULL )
			, Size( 0 )
			, Capacity( 0 )
		{
			reserve( initialCapacity );
		}
		~Vector()
		{
			if ( Items )
			{
				ImGui::MemFree( Items );
				Items = nullptr;
			}
		}
		void push_back( T item )
		{
			if ( Size >= Capacity )
			{
				reserve( Capacity * 2 );
			}
			Items[ Size++ ] = item;
		}
		void clear()
		{
			Size = 0;
		}
		void reserve( const unsigned int newCapacity )
		{
			if ( newCapacity <= Capacity )
			{
				return;
			}
			T * newItems = (T*) ImGui::MemAlloc( newCapacity * sizeof( T ) );
			if ( Items )
			{
				memcpy( newItems, Items, Capacity * sizeof( T ) );
				ImGui::MemFree( Items );
			}

			Items = newItems;
			Capacity = newCapacity;
		}
		const unsigned int size()
		{
			return Size;
		}
		T & operator[]( unsigned int index )
		{
			return Items[ index ];
		}
	};

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
		int PrevPacketSize;
		bool IsKeyFrame;
		bool ForceKeyFrame;
		Vector<unsigned char> Packet;
		Vector<unsigned char> PrevPacket;
		RemoteInput Input;
 		bool Supports32BitIndexBuffers;

		WebSocketServer()
		{
			ClientActive = false;
			Frame = 0;
			FrameReceived = 0;
			IsKeyFrame = false;
			PrevPacketSize = 0;
			Supports32BitIndexBuffers = false;
		}
		inline bool mapRemoteKey( int* remoteKey, bool isCtrlPressed )
		{
			if ( *remoteKey == 37 )
				*remoteKey = ImGuiKey_LeftArrow;
			else if ( *remoteKey == 40 )
				*remoteKey = ImGuiKey_DownArrow;
			else if ( *remoteKey == 38 )
				*remoteKey = ImGuiKey_UpArrow;
			else if ( *remoteKey == 39 )
				*remoteKey = ImGuiKey_RightArrow;
			else if ( *remoteKey == 46 )
				*remoteKey = ImGuiKey_Delete;
			else if ( *remoteKey == 9 )
				*remoteKey = ImGuiKey_Tab;
			else if ( *remoteKey == 8 )
				*remoteKey = ImGuiKey_Backspace;
			else if ( *remoteKey == 65 && isCtrlPressed )
				*remoteKey = 'a';
			else if ( *remoteKey == 67 && isCtrlPressed )
				*remoteKey = 'c';
			else if ( *remoteKey == 86 && isCtrlPressed )
				*remoteKey = 'v';
			else if ( *remoteKey == 88 && isCtrlPressed )
				*remoteKey = 'x';
			else
				return true;

			return false;
		}
		virtual void OnMessage( OpCode opcode, const void *data, int /*size*/ )
		{
			switch ( opcode )
			{
				// Text message
			case WebSocketServer::Text:
				if ( !ClientActive )
				{
					if ( strstr( (char *) data, "ImInit" ) )
					{
						// The browser lets us know if it can do 32-bit indexbuffers
						int supports32bitIB = 0;
						if ( sscanf( (char *) data, "ImInit;IB32=%d", &supports32bitIB ) == 1 )
						{
							Supports32BitIndexBuffers = ( supports32bitIB != 0 );
						}
						ClientActive = true;
						ForceKeyFrame = true;
						// Send confirmation with the indexbuffer size we negotiated
						// (This is for backwards compatibility, where if we don't send this header,
						// a newer client won't increase the element size)
						char sz[ 32 ];
						snprintf( sz, 32, "ImInit;IB32=%d", Supports32BitIndexBuffers ? 1 : 0 );
						SendText( sz, strlen( sz ) );
						// Send font texture
						unsigned char* pixels;
						int width, height;
						ImGui::GetIO().Fonts->GetTexDataAsAlpha8( &pixels, &width, &height );
						PreparePacketTexFont( pixels, width, height );
						SendPacket();
					}
				}
				else if ( strstr( (char *) data, "ImMouseMove" ) )
				{
					int x, y, mouse_left, mouse_right;
					if ( sscanf( (char *) data, "ImMouseMove=%d,%d,%d,%d", &x, &y, &mouse_left, &mouse_right ) == 4 )
					{
						FrameReceived = Frame;
						Input.MousePos.x = (float) x;
						Input.MousePos.y = (float) y;
						Input.MouseButtons = mouse_left | ( mouse_right << 1 );
					}
				}
				else if ( strstr( (char *) data, "ImMousePress" ) )
				{
					int l, r;
					if ( sscanf( (char *) data, "ImMousePress=%d,%d", &l, &r ) == 2 )
					{
						FrameReceived = Frame;
						Input.MouseButtons = l | ( r << 1 );
					}
				}
				else if ( strstr( (char *) data, "ImMouseWheelDelta" ) )
				{
					float mouseWheelDelta;
					if ( sscanf( (char *) data, "ImMouseWheelDelta=%f", &mouseWheelDelta ) == 1 )
					{
						FrameReceived = Frame;
						Input.MouseWheelDelta = mouseWheelDelta *0.01f;
					}
				}
				else if ( strstr( (char *) data, "ImKeyDown" ) )
				{
					int key, shift, ctrl;
					if ( sscanf( (char *) data, "ImKeyDown=%d,%d,%d", &key, &shift, &ctrl ) == 3 )
					{
						//update key states
						FrameReceived = Frame;
						Input.KeyShift = shift > 0;
						Input.KeyCtrl = ctrl > 0;
						mapRemoteKey( &key, Input.KeyCtrl );
						Input.KeysDown[ key ] = true;
					}
				}
				else if ( strstr( (char *) data, "ImKeyUp" ) )
				{
					int key;
					if ( sscanf( (char *) data, "ImKeyUp=%d", &key ) == 1 )
					{
						//update key states
						FrameReceived = Frame;
						Input.KeysDown[ key ] = false;
						Input.KeyShift = false;
						Input.KeyCtrl = false;
					}
				}
				else if ( strstr( (char *) data, "ImKeyPress" ) )
				{
					unsigned int key;
					if ( sscanf( (char *) data, "ImKeyPress=%d", &key ) == 1 )
						ImGui::GetIO().AddInputCharacter( ImWchar( key ) );
				}
				else if ( strstr( (char *) data, "ImClipboard=" ) )
				{
					char *clipboard = &( (char *) data )[ strlen( "ImClipboard=" ) ];
					ImGui::GetIO().SetClipboardTextFn( clipboard );
				}
				break;
				// Binary message
			case WebSocketServer::Binary:
				//printf("ImGui client: Binary message received (%d bytes)\n", size);
				break;
				// Disconnect
			case WebSocketServer::Disconnect:
				printf( "ImGui client: DISCONNECT\n" );
				ClientActive = false;
				break;
				// Ping
			case WebSocketServer::Ping:
				printf( "ImGui client: PING\n" );
				break;
				// Pong
			case WebSocketServer::Pong:
				printf( "ImGui client: PONG\n" );
				break;
			default:
				assert( 0 );
				break;
			}
		}

#pragma pack(1)
		struct Cmd
		{
			int   elemCount;
			float clip_rect[ 4 ];
			void Set( const ImDrawCmd &draw_cmd )
			{
				elemCount = draw_cmd.ElemCount;
				clip_rect[ 0 ] = draw_cmd.ClipRect.x;
				clip_rect[ 1 ] = draw_cmd.ClipRect.y;
				clip_rect[ 2 ] = draw_cmd.ClipRect.z;
				clip_rect[ 3 ] = draw_cmd.ClipRect.w;
				//printf("DrawCmd: %d ( %.2f, %.2f, %.2f, %.2f )\n", vtx_count, clip_rect[0], clip_rect[1], clip_rect[2], clip_rect[3]);
			}
		};
		struct Vtx
		{
			short x, y; // 16 short
			short u, v; // 16 fixed point
			unsigned char r, g, b, a; // 8*4
			void Set( const ImDrawVert &vtx )
			{
				x = (short) ( vtx.pos.x );
				y = (short) ( vtx.pos.y );
				u = (short) ( vtx.uv.x * 32767.f );
				v = (short) ( vtx.uv.y * 32767.f );
				r = ( vtx.col >> 0 ) & 0xff;
				g = ( vtx.col >> 8 ) & 0xff;
				b = ( vtx.col >> 16 ) & 0xff;
				a = ( vtx.col >> 24 ) & 0xff;
			}
		};
		struct Idx32
		{
			unsigned int idx;

			void Set( ImDrawIdx _idx )
			{
				idx = _idx;
			}
		};
		struct Idx16
		{
			unsigned short idx;

			void Set( ImDrawIdx _idx )
			{
				assert( _idx <= 0xFFFF );
				idx = (unsigned short) _idx;
			}
		};

#pragma pack()

		void Write( unsigned char c ) { Packet.push_back( c ); }
		void Write( unsigned int i )
		{
			if ( IsKeyFrame )
				Write( &i, sizeof( unsigned int ) );
			else
				WriteDiff( &i, sizeof( unsigned int ) );
		}
		void Write( Cmd const &cmd )
		{
			if ( IsKeyFrame )
				Write( (void *) &cmd, sizeof( Cmd ) );
			else
				WriteDiff( (void *) &cmd, sizeof( Cmd ) );
		}
		void Write( Vtx const &vtx )
		{
			if ( IsKeyFrame )
				Write( (void *) &vtx, sizeof( Vtx ) );
			else
				WriteDiff( (void *) &vtx, sizeof( Vtx ) );
		}
		void Write( Idx16 const &idx )
		{
			if ( IsKeyFrame )
				Write( (void *) &idx, sizeof( Idx16 ) );
			else
				WriteDiff( (void *) &idx, sizeof( Idx16 ) );
		}
		void Write( Idx32 const &idx )
		{
			if ( IsKeyFrame )
				Write( (void *) &idx, sizeof( Idx32 ) );
			else
				WriteDiff( (void *) &idx, sizeof( Idx32 ) );
		}

		void Write( const void *data, int size )
		{
			unsigned char *src = (unsigned char *) data;
			for ( int i = 0; i < size; i++ )
			{
				int pos = (int) Packet.size();
				Write( src[ i ] );
				PrevPacket[ pos ] = src[ i ];
			}
		}
		void WriteDiff( const void *data, int size )
		{
			unsigned char *src = (unsigned char *) data;
			for ( int i = 0; i < size; i++ )
			{
				int pos = (int) Packet.size();
				Write( (unsigned char) ( src[ i ] - ( pos < PrevPacketSize ? PrevPacket[ pos ] : 0 ) ) );
				PrevPacket[ pos ] = src[ i ];
			}
		}

		void SendPacket()
		{
			static int buffer[ 65536 ];
			unsigned int * bufferU32 = ( unsigned int * )buffer;
			int originalSize = ( int )Packet.size();
			int size = originalSize;
			int offset = 0;
			const unsigned int magicHeaderStart = 0xDEADDA7A; // Incomplete packet
			const unsigned int magicHeaderEnd = 0xBAADFEED; // Final packet
			do
			{
				int csize = LZ4_compress_limitedOutput( ( char * )&Packet[ offset ], ( char * )( buffer + 3 ), size, 65536 * sizeof( int ) - 12 );
				if ( csize == 0 )
				{
					// If packet fails to compress, halve the data and try again
					size /= 2;
					continue;
				}
				// If this is the final packet, mark it as final and finish
				bool isFinalPacket = offset + size == originalSize;
				bufferU32[ 0 ] = isFinalPacket ? magicHeaderEnd : magicHeaderStart; // Our LZ4 header magic number (used in custom lz4.js to decompress)
				bufferU32[ 1 ] = size;
				bufferU32[ 2 ] = csize;
				SendBinary( buffer, csize + 12 );
				if ( isFinalPacket )
				{
					break;
				}
				// Otherwise, try to compress the rest in one go
				offset += size;
				size = originalSize - offset;
			} while ( true );
			//printf("ImWebSocket SendPacket: %s %d / %d (%.2f%%)\n", IsKeyFrame ? "(KEY)" : "", size, csize, (float)csize * 100.f / size);
			PrevPacketSize = size;
		}

		void PreparePacket( unsigned char data_type, unsigned int data_size )
		{
			unsigned int size = sizeof( unsigned char ) + data_size;
			Packet.clear();
			Packet.reserve( size );
			PrevPacket.reserve( size );
			while ( size > PrevPacket.size() )
				PrevPacket.push_back( 0 );
			Write( data_type );
		}

		// packet types
		enum { TEX_FONT = 255, FRAME_KEY = 254, FRAME_DIFF = 253 };

		void PreparePacketTexFont( const void *data, unsigned int w, unsigned int h )
		{
			IsKeyFrame = true;
			PreparePacket( TEX_FONT, sizeof( unsigned int ) * 2 + w*h );
			Write( w );
			Write( h );
			Write( data, w*h );
			ForceKeyFrame = true;
		}

		void PreparePacketFrame( unsigned int size )//unsigned int cmd_count, unsigned int vtx_count, unsigned int idx_count)
		{
			IsKeyFrame = ( Frame%IMGUI_REMOTE_KEY_FRAME ) == 0 || ForceKeyFrame;
			PreparePacket( (unsigned char) ( IsKeyFrame ? FRAME_KEY : FRAME_DIFF ), size );
			//printf("ImWebSocket PreparePacket: cmd_count = %i, vtx_count = %i ( %lu bytes )\n", cmd_count, vtx_count, sizeof(unsigned int) + sizeof(unsigned int) + cmd_count * sizeof(Cmd) + vtx_count * sizeof(Vtx));
			ForceKeyFrame = false;
		}
	};


	static WebSocketServer GServer;


	//------------------
	// RemoteGetInput
	// - get input received from remote safely (valid for 30 frames)
	//------------------
	bool RemoteGetInput( RemoteInput & input )
	{
		bool res = false;
		if ( GServer.ClientActive )
		{

			if ( GServer.Frame - GServer.FrameReceived < IMGUI_REMOTE_INPUT_FRAMES )
			{
				input = GServer.Input;
				res = true;
			}
		}
		memset( GServer.Input.KeysDown, 0, 256 * sizeof( bool ) );
		GServer.Input.KeyCtrl = false;
		GServer.Input.KeyShift = false;
		GServer.Input.MouseWheelDelta = 0;
		return res;
	}


	//------------------
	// RemoteInit
	// - initialize RemoteImGui on top of your ImGui
	//------------------
	void RemoteInit( const char *local_address, int local_port )
	{
		GServer.Init( local_address, local_port );
	}


	//------------------
	// RemoteShutdown
	// - shutdown RemoteImGui
	//------------------
	void RemoteShutdown()
	{
		GServer.Shutdown();
	}


	//------------------
	// RemoteUpdate
	// - update RemoteImGui stuff
	//------------------
	void RemoteUpdate()
	{
		GServer.Frame++;
		GServer.Update();
	}


	//------------------
	// RemoteDraw
	// - send draw list commands to connected client
	//------------------
	void RemoteDraw( ImDrawList** const cmd_lists, int cmd_lists_count )
	{
		if ( GServer.ClientActive )
		{
			static int sendframe = 0;
			if ( sendframe++ < 2 ) // every 2 frames, @TWEAK
			{
				return;
			}
			sendframe = 0;

			unsigned int totalSize = sizeof( unsigned int ); // cmd_lists_count
			for ( int n = 0; n < cmd_lists_count; n++ )
			{
				const ImDrawList* cmd_list = cmd_lists[ n ];
				int cmd_count = cmd_list->CmdBuffer.size();
				int vtx_count = cmd_list->VtxBuffer.size();
				int idx_count = cmd_list->IdxBuffer.size();
				totalSize += 3 * sizeof( unsigned int ); //cmd_count, vtx_count and idx_count
				totalSize += cmd_count * sizeof( WebSocketServer::Cmd ) + vtx_count * sizeof( WebSocketServer::Vtx ) + idx_count * sizeof( WebSocketServer::Idx );
			}

			GServer.PreparePacketFrame( totalSize );
			GServer.Write( (unsigned int) cmd_lists_count );

			for ( int n = 0; n < cmd_lists_count; n++ )
			{
				const ImDrawList* cmd_list = cmd_lists[ n ];
				const ImDrawVert * vtx_src = cmd_list->VtxBuffer.begin();
				const ImDrawIdx * idx_src = cmd_list->IdxBuffer.begin();
				unsigned int cmd_count = cmd_list->CmdBuffer.size();
				unsigned int vtx_count = cmd_list->VtxBuffer.size();
				unsigned int idx_count = cmd_list->IdxBuffer.size();
				GServer.Write( cmd_count );
				GServer.Write( vtx_count );
				GServer.Write( idx_count );
				// Send 
				// Add all drawcmds
				WebSocketServer::Cmd cmd;
				const ImDrawCmd* pcmd_end = cmd_list->CmdBuffer.end();
				for ( const ImDrawCmd* pcmd = cmd_list->CmdBuffer.begin(); pcmd != pcmd_end; pcmd++ )
				{
					cmd.Set( *pcmd );
					GServer.Write( cmd );
				}
				// Add all vtx
				WebSocketServer::Vtx vtx;
				int vtx_remaining = vtx_count;
				while ( vtx_remaining-- > 0 )
				{
					vtx.Set( *vtx_src++ );
					GServer.Write( vtx );
				}

				// Add all idx
				if ( GServer.Supports32BitIndexBuffers )
				{
					WebSocketServer::Idx32 idx;

					int idx_remaining = idx_count;
					while ( idx_remaining-- > 0 )
					{
						idx.Set( *idx_src++ );
						GServer.Write( idx );
					}
				}
				else
				{
					WebSocketServer::Idx16 idx;

					int idx_remaining = idx_count;
					while ( idx_remaining-- > 0 )
					{
						idx.Set( *idx_src++ );
						GServer.Write( idx );
					}
				}

			}
			// Send
			GServer.SendPacket();
		}
	}


} // namespace
