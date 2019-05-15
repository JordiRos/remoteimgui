Remote ImGui
============

Remote ImGui is an extension for https://github.com/ocornut/imgui (currently 1.3), sending output and receiving input from a target client in another device running an HTML5/WebGL/WebSockets(v13) application.
You will view all ImGui output from host app, but can also set a bigger virtual canvas and drag windows around. Use Ctrl+LeftMouse on web client to move around it.
Client also sends input from mouse/keyboard, allowing interaction with host app.

* Using Chrome works out of the box; on Firefox you have to toggle `network.websocket.allowInsecureFromHTTPS` in `about:config` to `true`


Setup Host
==========

*#include "../imgui_remote.h"*

- RemoteInit to initialize: *void ImGui::RemoteInit(bind_address, bind_port, vcanvas_width, vcanvas_height);*
- RemoteUpdate on update to pump network code: *void ImGui::RemoteUpdate();*
- RemoteDraw on render to send render data to client: *void ImGui::RemoteDraw(cmd_lists, cmd_lists_count);*
- RemoteShutdown to terminate: *void ImGui::RemoteShutdown();*
- RemoteGetInput to get input from remote: *bool ImGui::RemoteGetInput(input);*
 
Check app/example for a working example (ImGui 1.3 included).

* RemoteInput might conflict with your actual app input, you will have to decide which one is focused and decide what input send to ImGui.

**Dependencies**

LZ4 - https://code.google.com/p/lz4/

Modified Webby - https://github.com/deplinenoise/webby

I've used Webby for the WebSocketServer connection. It supports Win32 + Unix, but it should be easy to add other platforms. I included Webby on the repo as I added a function to allow sending WebSocket packets in a single frame.


Setup Client
============

Double click index.html, add your host address and click connect. You can also create an autoconnect index.html bookmark with *index.html?host=address*

**Dependencies**

ThreeJS - *https://github.com/mrdoob/three.js*

Dat.Gui - *https://github.com/dataarts/dat.gui*

Modified LZ4.js - *https://github.com/ukyo/lz4.js*


ToDo
============

- Web client tested on iOS / Android + WebGL, but input is not handled
