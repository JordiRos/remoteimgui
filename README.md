Remote ImGui
============

Remote ImGui is an extension for https://github.com/ocornut/imgui to allow viewing and interacting with an ImGui app from another device in the same network. To make it easier client is a web application, so just open a browser with WebGL/Websockets (v13) compatibility and enjoy!

The basic principle is that ImGui app will encode and send all rendering data to a Websockets client, so it will render exactly what you see in your device.
Encoded data uses a previous frema delta + LZ4 encoding. Delta ensures that most of the time there will be zeroes, so this is very easy and fast to compress. Keyframes of full data are/can be sent periodically.

Host device can also listen to remote input messages (mouse/keyboard), allowing interacting from the remote too.


Setup Client
============

HTML is reduced to this simple line for the whole app

StartImgui(container, "ws://host:port", width,height, font, compressed, background);

Container - the element where to render ImGui

Host:Port - is address of remote device ImGui app

Width/Height - target device resolution

Font - the exact same font file you used in your device

Compressed - compression flag (recommended!)

Background - background image


As WebGL needs to load images for the font and background, I've included a simple NodeJS server that will create a remote ImGui connection in a simple, fullscreen app

Run "node server.js"

Open browser and type "http://localhost/imgui?host=device_ip"

I've included some default options, edit server.js/imgui.html to fully configure

Dependencies
============

ThreeJS - https://github.com/mrdoob/three.js

Modified LZ4.js - https://github.com/ukyo/lz4.js

Dat.Gui - https://github.com/dataarts/dat.gui


Setup Host
==========

This relies on your imconfig implementation, so I've included a utility file with some instructions that can be easily fit into any app (remoteimgui.cpp). No core ImGui modifications required at all

Dependencies
============

LZ4 - https://code.google.com/p/lz4/

WebSockets - this is very platform specific, so you will have to include your Websockets server implementation. 
Sad news is that I spent far more time looking for / building a C++ websockets server than coding the real thing, and depending on your platform, you might end up building one. I'm sorry about this! :( Hope there will be more with the time

ToDo
============

- It would be nice if remote worked on touch devices
