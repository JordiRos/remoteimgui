Remote ImGui
============

Remote ImGui is an extension for https://github.com/ocornut/imgui, sending output and receiving input from a target client in another device. Remote ImGui is based on ImGui 1.3 (included in package)

Remote ImGui works by sending all rendering data to a Websockets client, so client will render exactly what you see in your host app. Current client is an HTML5/WebGL/WebSockets(v13) application, so just open a compatible browser and enjoy!
Client also sends input from mouse/keyboard, allowing interaction with host app from remote.

You can also set a bigger virtual canvas and drag windows around, so you can see some windows on remote and others on the app. Use Ctrl+Left mouse on client to drag around virtual canvas.

* Seems Firefox is not working at the moment, try Chrome if others do not work.


Setup Host
==========

Tried to make usage simple, but might need a bit of work depending on your platform (mainly due to Websockets server)

*#include "../imgui_remote.h"*

- RemoteInit to initialize: *void ImGui::RemoteInit(bind_address, bind_port, vcanvas_width, vcanvas_height);*
- RemoteUpdate on update to pump network code: *void ImGui::RemoteUpdate();*
- RemoteDraw on render to send render data to client: *void ImGui::RemoteDraw(cmd_lists, cmd_lists_count);*
- RemoteShutdown to terminate: *void ImGui::RemoteShutdown();*
- RemoteGetInput to get input from remote: *bool ImGui::RemoteGetInput(input);*
 
Have a look at app/example on how to use it. RemoteInput might conflict with your actual app input, so you will have to decide which one is focused and decide what input send to ImGui.

**Dependencies**

LZ4 - https://code.google.com/p/lz4/

Modified Webby - https://github.com/deplinenoise/webby

I've used Webby for the WebSocketServer connection. It supports Win32 + Unix, but it should be quite easy to add other platforms. I included Webby on the repo as I added a function to allow sending WebSocket packets in a single frame.


Setup Client
============

Client is reduced to a single Javascript line for the whole app

*StartImgui(container, "ws://host:port", width,height, compressed);*

Container - the element where to render ImGui

Host:Port - is address of remote device ImGui app

Width/Height - target device resolution

Compressed - compression flag (set to true for now! host app always compresses atm)

**Install**

I've included a simple NodeJS server that will create a remote ImGui connection in a simple, fullscreen app.

Run *"node server.js"*.

Open browser and type *"http://localhost/imgui?host=hostapp_ip"*.

I've included some default options, edit **server.js** and **imgui.html** to configure.

You can also open a simple HTML and hardcode your host/port settings.

**Dependencies**

ThreeJS - *https://github.com/mrdoob/three.js*

Dat.Gui - *https://github.com/dataarts/dat.gui*

Modified LZ4.js - *https://github.com/ukyo/lz4.js*


ToDo
============

- Client tested on iOS / Android + WebGL, but input is not handled
- Does not work on Firefox
- More multiplatform support for Webby
