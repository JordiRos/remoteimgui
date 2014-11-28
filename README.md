Remote ImGui
===========

Remote ImGui is an extension for https://github.com/ocornut/imgui to allow viewing and interacting with an ImGui app from another device in the same network. To make it easier client is a web application, so just open a browser with WebGL/Websockets (v13) compatibility and enjoy!

How it works
============

The basic principle is that ImGui app will encode and send all rendering data to a Websockets client, so it will render exactly what you could see in your device.
Encoded data uses a previous frema delta + LZ4 encoding. Delta ensures that most of the time there will be zeroes, so this is very easy and fast to compress. Keyframes of full data can be sent periodically.

Host device can also listen to remote device messages (mouse and keyboard events), allowing interacting from the remote side too.

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

Open browser and type "http://localhost/imgui?host=your_host"

I've included some default options, open server.js/imgui.html and help yourself

Client Dependencies
===================

ThreeJS - https://github.com/mrdoob/three.js

Modified LZ4.js - https://github.com/ukyo/lz4.js

Dat.Gui - https://github.com/dataarts/dat.gui

Setup Host
==========

This relies on your imconfig implementation, so what I've included is an implementation over one of the existing Imgui examples.
It should be easy to copy & paste from this example to your app (just an include and a few blocks of code)

Websockets
==========

The utility class I made for ImGui is meant to be an inherit of a WebSockets server, but as this is very platform specific, you will also have to include your Websockets server.
Sad news is that I spent far more time looking for / building a C++ websockets server than coding the real thing, and depending on your platform, you might end up building one. I'm sorry about this! :( Hope there will be more with the time
