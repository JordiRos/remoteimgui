Remote ImGui
============

Remote ImGui is an extension for https://github.com/ocornut/imgui to allow viewing and interacting with an ImGui app from another device in the same network. Client is an HTML5/WebGL/WebSockets(v13) application, so just open a compatible browser and enjoy!

The basic principle is that ImGui app will encode and send all rendering data to a Websockets client, so client will render exactly what you see in your host app.
Encoded data uses a previous frema delta + LZ4 encoding - this ensures that most of the time there will be zeroes or offset patterns, so this is very easy and fast to compress and decompress (even with JS). Keyframes of full data are/can be sent periodically.

Client also sends input from mouse/keyboard, allowing interaction with host app from remote.


Setup Host
==========

Usage is simple, #include "imgui_remote.h" header and use the provided functions

*#include "../imgui_remote.h"*

- RemoteInit to initialize: *void ImGui::RemoteInit(bind_address, bind_port, vcanvas_width, vcanvas_height);*
- RemoteUpdate on update to pump network code: *void ImGui::RemoteUpdate();*
- RemoteDraw on render to send render data to client: *void ImGui::RemoteDraw(cmd_lists, cmd_lists_count);*
- RemoteShutdown to terminate: *void ImGui::RemoteShutdown();*
- RemoteGetInput to get input from remote: *bool ImGui::RemoteGetInput(input);*
 
Have a look at app/example/main.cpp on how to use it. RemoteInput might conflict with your actual app input, so you will have to decide which one is focused and decide what input send to ImGui

Dependencies
============

LZ4 - https://code.google.com/p/lz4/

Modified Webby -  https://github.com/deplinenoise/webby

I've added a Webby implementation for the WebSocketServer connection. It supports Win32 + Unix, but it should be quite easy to add other platforms. I included Webby on the repo as I added a function to allow sending WebSocket packets in a single frame.


Setup Client
============

Client is reduced to this simple Javascript line for the whole app

*StartImgui(container, "ws://host:port", width,height, font, compressed, background);*

Container - the element where to render ImGui

Host:Port - is address of remote device ImGui app

Width/Height - target device resolution

Font - the exact same font file you used in your device

Compressed - compression flag (set to true for now! host app always compresses atm)

Background - background image


As WebGL needs to load images for the font and background, I've included a simple NodeJS server that will create a remote ImGui connection in a simple, fullscreen app

Run *"node server.js"*

Open browser and type *"http://localhost/imgui?host=hostapp_ip"*

I've included some default options, edit **server.js** and **imgui.html** to configure

Dependencies
============

ThreeJS - *https://github.com/mrdoob/three.js*

Dat.Gui - *https://github.com/dataarts/dat.gui*

Modified LZ4.js - *https://github.com/ukyo/lz4.js*


ToDo
============

- Use color alpha channel from ImGui colors

- Client tested on iOS / Android + WebGL, but input is not handled...
