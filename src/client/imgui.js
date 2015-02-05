//-----------------------------------------------------------------------------
// Remote Imgui for https://github.com/ocornut/imgui
// https://github.com/JordiRos/remoteimgui
// Jordi Ros
//-----------------------------------------------------------------------------

// utility function to parse an arraybuffer like a stream
function DataStream( data ) {
    var stream = {};
    stream.buffer = new DataView( data );
    stream.idx = 0;
    stream.endian = true;
    stream.readInt8    = function() { var r = this.buffer.getInt8   ( this.idx, this.endian ); this.idx+=1; return r; }
    stream.readUint8   = function() { var r = this.buffer.getUint8  ( this.idx, this.endian ); this.idx+=1; return r; }
    stream.readInt16   = function() { var r = this.buffer.getInt16  ( this.idx, this.endian ); this.idx+=2; return r; }
    stream.readUint16  = function() { var r = this.buffer.getUint16 ( this.idx, this.endian ); this.idx+=2; return r; }
    stream.readInt32   = function() { var r = this.buffer.getInt32  ( this.idx, this.endian ); this.idx+=4; return r; }
    stream.readUint32  = function() { var r = this.buffer.getUint32 ( this.idx, this.endian ); this.idx+=4; return r; }
    stream.readFloat32 = function() { var r = this.buffer.getFloat32( this.idx, this.endian ); this.idx+=4; return r; }
    stream.readInt16AsFloat32  = function() { var r = this.readInt16(); return r * ( 1.0 ); }
    stream.readInt16pAsFloat32 = function() { var r = this.readInt16(); return r * ( 1.0 / 32767.0 ); }
    stream.readUint8AsFloat32  = function() { var r = this.readUint8(); return r * ( 1.0 / 255.0 ); }
    return stream;
}

// threejs shader to render with clipping region
var ImVS = [
    "attribute float alpha;",

    "varying vec3 vColor;",
    "varying vec2 vUv;",
    "varying vec4 vPos;",
    "varying float vAlpha;",

    "void main() {",

        "vColor = color;",
        "vUv = uv;",
        "vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "vAlpha = alpha;",
        "gl_Position = vPos;",

    "}" ].join("\n");

var ImFS = [
    "varying vec3 vColor;",
    "varying vec2 vUv;",
    "varying vec4 vPos;",
    "varying float vAlpha;",

    "uniform vec4 uClip;",
    "uniform sampler2D tTex;",

    "void main() {",
        "if( ( vPos.x >= uClip.x && vPos.y >= uClip.y && vPos.x < uClip.z && vPos.y < uClip.w ) || uClip.z == -9999.0 && uClip.w == -9999.0 )",
            "gl_FragColor = vec4( vColor, texture2D( tTex, vUv ).a * vAlpha );",
        "else",
            "gl_FragColor = vec4( 0.0, 0.0, 0.0, 0.0 );",
    "}" ].join("\n");

var ImguiGui = function() {
  this.window = 'Origin';
  this.windows = [ 'Origin' ];
};

function StartImgui( element, serveruri, targetwidth, targetheight, compressed ) {

    if( !Detector.webgl ) Detector.addGetWebGLMessage();

    var gui = new dat.GUI();
    var datgui = new ImguiGui();
    var datgui_window = gui.add( datgui, 'window', datgui.windows );
    datgui_window.onChange( onFocusWindow );
    var websocket, connecting, connected;
    var server;

    var width = window.innerWidth;
    var height = window.innerHeight;
    var targetwidth = targetwidth;
    var targetheight = targetheight;
    var clientactive = false;
    var frame = 0;
    var mouse = { x: 0, y: 0, l: 0, r: 0, w: 0, update: false };
    var cur_vtx;
    var prev_data;

    var camera_offset = { x: 0, y: 0 };
    var camera_drag = false;
    var camera_drag_pos = { x: 0, y: 0 };
    var mouse_left = 0;
    var mouse_right = 0;
    var mouse_wheel = 0;

    // renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.autoClear = false;
    renderer.setSize( width, height );

    // scene
    var scene = new THREE.Scene();

    // camera
    var camera = new THREE.OrthographicCamera( 0, width, 0, height, -1, 1 );
    camera.position.z = 1;

    // plane
    var scene_background = new THREE.Scene();
    var plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( targetwidth, targetheight ), new THREE.MeshBasicMaterial( { color: 0x72909A, side: THREE.DoubleSide }));
    plane.position.x = targetwidth/2;
    plane.position.y = targetheight/2;
    scene_background.add( plane );

    // imgui dynamic geometry / meshes
    // FIXME: Support for any number of triangles.
    var MAX_TRIANGLES = 10000;
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'index',    new THREE.BufferAttribute( new Uint32Array ( MAX_TRIANGLES * 1 * 3 ), 1 ) );
    geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( MAX_TRIANGLES * 3 * 3 ), 3 ) );
    geometry.addAttribute( 'uv',       new THREE.BufferAttribute( new Float32Array( MAX_TRIANGLES * 2 * 3 ), 2 ) );
    geometry.addAttribute( 'color',    new THREE.BufferAttribute( new Float32Array( MAX_TRIANGLES * 3 * 3 ), 3 ) );
    geometry.addAttribute( 'alpha',    new THREE.BufferAttribute( new Float32Array( MAX_TRIANGLES * 1     ), 1 ) );
    geometry.dynamic = true;
    geometry.offsets = [ { start: 0, index: 0, count: 0 } ];

    // material
    var guniforms = {
        tTex: { type: 't', value: null },
        uClip: { type: 'v4', value: new THREE.Vector4() },
    };
    var gattributes = {
        alpha: { type: 'f', value: null },
    };
    var material = new THREE.ShaderMaterial( {
        uniforms: guniforms,        
        attributes: gattributes,
        vertexShader: ImVS,
        fragmentShader: ImFS,
        vertexColors: THREE.VertexColors,
        transparent: true,
        side: THREE.DoubleSide } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.frustumCulled = false;
    scene.add( mesh );

    // geometry shortcuts
    var gindices = geometry.attributes.index.array;
    var gpositions = geometry.attributes.position.array;
    var guvs = geometry.attributes.uv.array;
    var gcolors = geometry.attributes.color.array;
    var galphas = geometry.attributes.alpha.array;
    var gcmdcount = 0;
    var gvtxcount = 0;
    var gclips = [];

    // fill indices (fixed for the whole geometry)
    for( var i = 0; i < MAX_TRIANGLES*3; i++ )
        gindices[i] = i;
    geometry.attributes.index.needsUpdate = true;

    // add to element
    element.appendChild( renderer.domElement )

    // canvas events (will send to imgui)
    var elem = renderer.domElement;
    elem.addEventListener( 'mousemove', onMouseMove, false );
    elem.addEventListener( 'mousedown', onMouseDown, false );
    elem.addEventListener( 'mouseup', onMouseUp, false );
    elem.addEventListener( 'mousewheel', onMouseWheel, false );
    window.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'keyup', onKeyUp, false );
    window.addEventListener( 'keypress', onKeyPress, false );
    window.addEventListener( 'paste', onPaste, false );
    window.addEventListener( 'resize', onWindowResize, false );
    document.oncontextmenu = document.body.oncontextmenu = function() { return false; }

    // connect websocket to server
    websocketConnect( serveruri );

    // initial render
    onRender();    

    // keep connected
    setInterval(function() { if ( !connecting && !connected ) websocketConnect( serveruri ); }, 5000);

    // init websockets
    function websocketConnect( serveruri ) {
        console.log( "Remote ImGui: Connecting to " + serveruri + "..." );
        connecting = true;
        connected = false;
        websocket = new WebSocket( serveruri );
        websocket.binaryType = "arraybuffer";
        websocket.onopen = function( evt ) {
            console.log( "Remote ImGui: Connected" );
            clientactive = false;
            connecting = false;
            connected = true;
            websocket.send("ImInit")
            gclips.length = 0;
            onRender();
        };
        websocket.onclose = function( evt ) {
            console.log( "Remote ImGui: Disconnected" );
            clientactive = false;
            connecting = false;
            connected = false;
            gclips.length = 0;
            onRender();
        };
        websocket.onmessage = function( evt ) {
            if( typeof evt.data == "string" ) {
                if( evt.data == "ImInit" )
                {
                    console.log( "ImInit OK" );
                    clientactive = true;
                }
                else
                    console.log( "Unknown message: " + evt.data ); 
            }
            else {
                var data;
                if( compressed ) {
                    // log decompress time
                    //var t = performance.now();
                    data = lz4.decompress( new Uint8Array( evt.data ) ).buffer;
                    //console.log("Decompress: " + (performance.now() - t));
                }
                else
                    data = evt.data;

                // message type
                var type = { TEX_FONT : 255, FRAME_KEY : 254, FRAME_DIFF : 253 };
                var stream = new DataStream( data );
                var message_type = stream.readUint8();
                switch( message_type ) {
                    // load font texture
                    case type.TEX_FONT:
                        var w = stream.readUint32();
                        var h = stream.readUint32();
                        var src = new Uint8Array( data, 9 );
                        // canvas
                        var canvas = document.createElement( 'canvas' );
                        canvas.id     = "CursorLayer";
                        canvas.width  = w;
                        canvas.height = h;
                        var ctx = canvas.getContext( '2d' );
                        var imageData = ctx.getImageData( 0, 0, w,h );
                        var buf = new ArrayBuffer( imageData.data.length );
                        var buf8 = new Uint8ClampedArray( buf );
                        var data = new Uint32Array( buf );
                        for( var i = 0; i < w*h; i++ )
                            data[ i ] = ( src[ i ] << 24 ) | 0xFFFFFF;
                        imageData.data.set( buf8 );
                        ctx.putImageData( imageData, 0, 0 );
                        // texture
                        var map = new THREE.Texture( canvas );
                        map.needsUpdate = true;
                        map.minFilter = map.magFilter = THREE.NearestFilter;
                        guniforms.tTex.value = map;
                        break;
                    // full frame data
                    case type.FRAME_KEY:
                        onMessage( stream );
                        prev_data = data;
                        break;                    
                    // use previous frame to compose current frame
                    case type.FRAME_DIFF:
                        var buffer = new Uint8Array( data );
                        var prev_buffer = new Uint8Array( prev_data );
                        for( var i = 1; i < buffer.length; i++ ) {
                            if( i < prev_buffer.length ) {
                                buffer[ i ] = buffer[ i ] + prev_buffer[ i ];
                            }
                        }
                        onMessage( stream );
                        prev_data = data;
                        break;
                }

            }
        };
        websocket.onerror = function( evt ) {
            console.log( "ERROR: " + evt.data );
            clientactive = false;
            connecting = false;
            connected = false;
            gclips.length = 0;
            onRender();
        };
    }

    function onWindowResize() {
        width = window.innerWidth;
        height = window.innerHeight; 
        renderer.setSize( window.innerWidth, window.innerHeight );
        camera = new THREE.OrthographicCamera( 0, width, 0, height, -1, 1 );
        camera.position.z = 1;
    }

    function onMouseMove( event ) {
        if( !event ) event = window.event;
        
        if( camera_drag ) {
            camera_offset.x += camera_drag_pos.x - event.clientX;
            camera_offset.y += camera_drag_pos.y - event.clientY;
            camera_drag_pos.x = event.clientX;
            camera_drag_pos.y = event.clientY;
        }
        else {
            var x = event.clientX + camera.position.x;
            var y = event.clientY + camera.position.y;
            if( clientactive )
                websocket.send("ImMouseMove=" + x + "," + y);
        }
    }

    function onMouseDown( event ) {
        if( !event ) event = window.event;
        event.preventDefault();
        if( event.button == 0 ) mouse_left = 1;
        if( event.button == 2 ) mouse_right = 1;
        camera_drag = event.ctrlKey;
        if( camera_drag ) {
            camera_drag_pos.x = event.clientX;
            camera_drag_pos.y = event.clientY;
        }
        else {
            if( clientactive )
                websocket.send("ImMousePress=" + mouse_left + "," + mouse_right);
        }
    }    

    function onMouseUp( event ) {
        if( !event ) event = window.event;
        event.preventDefault();
        if( event.button == 0 ) mouse_left = 0;
        if( event.button == 2 ) mouse_right = 0;
        if( camera_drag ) {
            camera_drag = false;
        }
        else {
            if (clientactive)
                websocket.send("ImMousePress=" + mouse_left + "," + mouse_right);
        }
    }

    function onMouseWheel( event ) {
        if( !event ) event = window.event;
        event.preventDefault();
        if( event.which == 1 ) mouse_wheel += event.wheelDelta;
        if( clientactive )
            websocket.send("ImMouseWheel=" + mouse_wheel);
    }            

    function onKeyDown( event ) {
        if( !event ) event = window.event;
        // do not prevent paste
        if( event.which == 86 && event.ctrlKey )
            return;
        // prevent special keys
        if( event.which < 32 || ( event.which >= 112 && event.which <= 123 ) ) {
            event.preventDefault();
            if( clientactive )
                websocket.send( "ImKeyDown=" + event.which + "," + ( event.shiftKey?1:0 ) + "," + ( event.ctrlKey?1:0 ) );
        }
    }

    function onKeyUp( event ) {
        if( !event ) event = window.event;
        if( event.which != 0 ) {
            if( clientactive )
                websocket.send( "ImKeyUp=" + event.which );
        }
    }

    function onKeyPress( event ) {
        if( !event ) event = window.event;
        if( clientactive ) {
            websocket.send( "ImKeyPress=" + String.fromCharCode( event.charCode ) );
        }
    }

    function onPaste( event ) {
        if (!event) event = window.event;
        event.preventDefault();
        if (event.which != 0) {
            if( clientactive ) {
                websocket.send( "ImClipboard=" + event.clipboardData.getData('Text') );
                websocket.send( "ImKeyDown=86,0,1" );
            }
        }
    }

    function onMessage( data ) {
        gcmdcount = data.readUint32();
        gvtxcount = data.readUint32();
        gclips.length = 0;
        cur_vtx = 0;
        // command lists
        for( var i = 0; i < gcmdcount; i++ ) {
            var num = data.readUint32();
            var x = data.readFloat32();
            var y = data.readFloat32();
            var w = data.readFloat32();
            var h = data.readFloat32();
            var clip_x = x * 2 / width - 1;
            var clip_y = y * 2 / height - 1;
            var clip_w = w * 2 / width - 1;
            var clip_h = h * 2 / height - 1;
            gclips.push( { start: cur_vtx, index: 0, count: num, clip: new THREE.Vector4( clip_x, clip_y, clip_w, clip_h ) } );
            cur_vtx+= num;
        }
        // all vertices
        for( var i = 0; i < gvtxcount; i++ ) {
            addVtx( data, i )
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.uv.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.alpha.needsUpdate = true;

        // update render and dat.gui
        onRender();
        onUpdateGui();
    }

    function addVtx( data, idx ) {
        var vidx = idx*3;
        var uidx = idx*2;
        var cidx = idx*3;
        var aidx = idx;
        gpositions[ vidx+0 ] = data.readInt16AsFloat32();
        gpositions[ vidx+1 ] = data.readInt16AsFloat32();
        gpositions[ vidx+2 ] = 0;
        guvs      [ uidx+0 ] = data.readInt16pAsFloat32();
        guvs      [ uidx+1 ] = 1 - data.readInt16pAsFloat32();
        gcolors   [ cidx+0 ] = data.readUint8AsFloat32();
        gcolors   [ cidx+1 ] = data.readUint8AsFloat32();
        gcolors   [ cidx+2 ] = data.readUint8AsFloat32();
        galphas   [ aidx   ] = data.readUint8AsFloat32();
    }    

    function onRender() {

        // Use this to only render selected window
        //var idx = ( datgui.window == 'All' ) ? -1 : parseInt( datgui.window ) - 1;

        camera.position.x = camera_offset.x;
        camera.position.y = camera_offset.y;

        if (clientactive) {
            renderer.setClearColor( 0x72909A );
            renderer.clear( true, true, false );

            // render background (visual reference of device canvas)
            renderer.render( scene_background, camera );

            // render command lists (or selected one)
            for( var i = 0; i < gclips.length; i++ ) {
                //if ( idx == -1 || idx == i ) {
                {
                    geometry.offsets[ 0 ].start = gclips[ i ].start;
                    geometry.offsets[ 0 ].index = gclips[ i ].index;
                    geometry.offsets[ 0 ].count = gclips[ i ].count;
                    guniforms.uClip.value.x = gclips[ i ].clip.x - (camera.position.x*2) / width;
                    guniforms.uClip.value.y = - ( gclips[ i ].clip.w - (camera.position.y*2) / height );
                    guniforms.uClip.value.z = ( i == 0 ) ? -9999 : gclips[ i ].clip.z - (camera.position.x*2) / width;
                    guniforms.uClip.value.w = ( i == 0 ) ? -9999 : - ( gclips[ i ].clip.y - (camera.position.y*2) / height );
                    renderer.render( scene, camera );
                }
            }
        }
        else {
            // darken background
            renderer.setClearColor( 0x546A71 );
            renderer.clear( true, true, false );
        }
    }

    function onUpdateGui() {
        if( datgui.windows.length != ( gcmdcount+1 ) ) {
            datgui.windows = [ 'Origin' ];
            for ( var i = 0; i < gcmdcount; i++ )
                datgui.windows[ i+1 ] = i+1;
            gui.remove( datgui_window );
            datgui_window = gui.add( datgui, 'window', datgui.windows );
            datgui_window.onChange( onFocusWindow );
        }
    }

    function onFocusWindow( value ) {
        if( value == 'Origin' ) {
            camera_offset.x = 0;
            camera_offset.y = 0;
        }
        else {
            var idx = parseInt( value ) - 1;
            camera_offset.x = Math.round( - 50 + ( gclips[ idx ].clip.x + 1 ) * width / 2.0 );
            camera_offset.y = Math.round( - 50 + ( gclips[ idx ].clip.y + 1 ) * height / 2.0 );
        }
    }    
}
