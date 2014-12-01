// Remote Imgui for https://github.com/ocornut/imgui
// https://github.com/JordiRos/remoteimgui
// Jordi Ros

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

// ThreeJS shader to render with clipping region
var ImVS = [
    "varying vec3 vColor;",
    "varying vec2 vUv;",
    "varying vec4 vPos;",

    "void main() {",

        "vColor = color;",
        "vUv = uv;",
        "vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "gl_Position = vPos;",

    "}" ].join("\n");

var ImFS = [
    "varying vec3 vColor;",
    "varying vec2 vUv;",
    "varying vec4 vPos;",

    "uniform vec4 uClip;",
    "uniform sampler2D tTex;",

    "void main() {",
        "if ( ( vPos.x >= uClip.x && vPos.y >= uClip.y && vPos.x < uClip.z && vPos.y < uClip.w ) || uClip.z == -9999.0 && uClip.w == -9999.0 )",
            "gl_FragColor = texture2D( tTex, vUv ) * vec4( vColor, 1.0 );",
        "else",
            "gl_FragColor = vec4( 0.0, 0.0, 0.0, 0.0 );",
    "}" ].join("\n");

var ImguiGui = function() {
  this.window = 'Origin';
  this.windows = [ 'Origin' ];
};

function StartImgui( element, serveruri, targetwidth, targetheight, targetfonttex, compressed, backgroundtex ) {

    if ( !Detector.webgl ) Detector.addGetWebGLMessage();

    var gui = new dat.GUI();
    var datgui = new ImguiGui();
    var datgui_window = gui.add( datgui, 'window', datgui.windows );
    datgui_window.onChange( onFocusWindow );

    var width = window.innerWidth;
    var height = window.innerHeight;
    var targetwidth = targetwidth;
    var targetheight = targetheight;
    var fonttex = THREE.ImageUtils.loadTexture( targetfonttex );
    var clientactive = false;
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
    var plane = new THREE.Mesh( new THREE.PlaneBufferGeometry( targetwidth, targetheight ), new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, map: THREE.ImageUtils.loadTexture( backgroundtex ) }));
    plane.position.x = 960;
    plane.position.y = 540;
    scene_background.add( plane );

    // imgui dynamic geometry / meshes
    var MAX_TRIANGLES = 10000;
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'index',    new THREE.BufferAttribute( new Uint32Array ( MAX_TRIANGLES * 1 * 3 ), 1 ) );
    geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( MAX_TRIANGLES * 3 * 3 ), 3 ) );
    geometry.addAttribute( 'uv',       new THREE.BufferAttribute( new Float32Array( MAX_TRIANGLES * 2 * 3 ), 2 ) );
    geometry.addAttribute( 'color',    new THREE.BufferAttribute( new Float32Array( MAX_TRIANGLES * 3 * 3 ), 3 ) );
    geometry.dynamic = true;
    geometry.offsets = [ { start: 0, index: 0, count: 0 } ];

    // material
    var gattributes = {};
    var guniforms = {
        tTex: { type: 't', value: fonttex },
        uClip: { type: 'v4', value: new THREE.Vector4() },
    };
    var material = new THREE.ShaderMaterial( {
        attributes: gattributes,
        uniforms: guniforms,        
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
    var gcmdcount = 0;
    var gvtxcount = 0;
    var gclips = [];

    // fill indices (fixed for the whole geometry)
    for ( var i = 0; i < MAX_TRIANGLES*3; i++ )
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
    window.addEventListener( 'keypress', onKeyPress, false );
    window.addEventListener( 'keydown', onKeyDown, false );
    window.addEventListener( 'keyup', onKeyUp, false );
    document.oncontextmenu = document.body.oncontextmenu = function() { return false; }

    window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize(){
        width = window.innerWidth;
        height = window.innerHeight; 
        renderer.setSize( window.innerWidth, window.innerHeight );
        camera = new THREE.OrthographicCamera( 0, width, 0, height, -1, 1 );
        camera.position.z = 1;
    }    

    // init websockets
    var websocket = new WebSocket( serveruri );
    websocket.binaryType = "arraybuffer";
    websocket.onopen = function( evt ) {
        console.log( "Remote ImGui: Connected to " + serveruri );
        websocket.send("ImInit")
        gclips.length = 0;
        onRender();
    };
    websocket.onclose = function( evt ) {
        console.log( "Remote ImGui: Disconnected" );
        clientactive = false;
        gclips.length = 0;
        onRender();
    };
    websocket.onmessage = function( evt ) {
        if ( typeof evt.data == "string" ) {
            if ( evt.data == "ImInit" )
            {
                console.log( "ImInit OK" );
                clientactive = true;
            }
            else
                console.log( "Unknown message: " + evt.data ); 
        }
        else {
            var data;
            if ( compressed ) {
                // log decompress time
                //var t = performance.now();
                data = lz4.decompress( new Uint8Array( evt.data ) ).buffer;
                //console.log("Decompress: " + (performance.now() - t));
            }
            else
                data = evt.data;

            // IsKey frame? compose with previous data
            var buffer = new Int8Array( data );
            if ( buffer[ 0 ] == 0 ) {
                var prev_buffer = new Int8Array( prev_data );
                for ( var i = 1; i < buffer.length; i++ ) {
                    if ( i < prev_buffer.length ) {
                        buffer[ i ] = buffer[ i ] + prev_buffer[ i ];
                    }
                }
            }

            // parse message
            onMessage( new DataStream( data ) );

            // save previous buffer
            prev_data = data;
        }
    };
    websocket.onerror = function( evt ) {
        console.log( "ERROR: " + evt.data );
        clientactive = false;
        gclips.length = 0;
        onRender();        
    };

    // initial render
    onRender();

    function onMouseMove( event ) {
        if (!event) event = window.event;
        
        if (camera_drag) {
            camera_offset.x += camera_drag_pos.x - event.clientX;
            camera_offset.y += camera_drag_pos.y - event.clientY;
            camera_drag_pos.x = event.clientX;
            camera_drag_pos.y = event.clientY;
        }
        else {
            var x = event.clientX + camera.position.x;
            var y = event.clientY + camera.position.y;
            if (clientactive)
                websocket.send("ImMouseMove=" + x + "," + y);
        }
    }

    function onMouseDown( event ) {
        if (!event) event = window.event;
        event.preventDefault();
        if (event.button == 0) mouse_left = 1;
        if (event.button == 2) { mouse_right = 1; }
        camera_drag = event.ctrlKey;
        if (camera_drag) {
            camera_drag_pos.x = event.clientX;
            camera_drag_pos.y = event.clientY;
        }
        else {
            if (clientactive)
                websocket.send("ImMousePress=" + mouse_left + "," + mouse_right);
        }
    }    

    function onMouseUp( event ) {
        if (!event) event = window.event;
        event.preventDefault();
        if (event.button == 0) mouse_left = 0;
        if (event.button == 2) mouse_right = 0;
        if (camera_drag) {
            camera_drag = false;
        }
        else {
            if (clientactive)
                websocket.send("ImMousePress=" + mouse_left + "," + mouse_right);
        }
    }

    function onMouseWheel( event ) {
        if (!event) event = window.event;
        event.preventDefault();
        if (event.which == 1) mouse_wheel += event.wheelDelta;
        if (clientactive)
            websocket.send("ImMouseWheel=" + mouse_wheel);
    }            

    function onKeyDown( event ) {
        if (!event) event = window.event;
        event.preventDefault();
        if (event.which != 0) {
            websocket.send("ImKeyDown=" + event.which);
        }
    }

    function onKeyUp( event ) {
        if (!event) event = window.event;
        event.preventDefault();
        if (event.which != 0) {
            websocket.send("ImKeyUp=" + event.which);
        }
    }    

    function onKeyPress( event ) {
        if (!event) event = window.event;
        event.preventDefault();
        if (event.which != 0) {
            websocket.send("ImKeyPress=" + event.which);
        }
    }

    function onMessage( data ) {
        var key = data.readUint8();
        gcmdcount = data.readUint32();
        gvtxcount = data.readUint32();
        gclips.length = 0;
        cur_vtx = 0;
        // command lists
        for ( var i = 0; i < gcmdcount; i++ ) {
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
        for ( var i = 0; i < gvtxcount; i++ ) {
            addVtx( data, i )
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.uv.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;

        // update render and dat.gui
        onRender();
        onUpdateGui();
    }

    function addVtx( data, idx ) {
        var vidx = idx*3;
        var uidx = idx*2;
        var cidx = idx*3;
        gpositions[ vidx+0 ] = data.readInt16AsFloat32();
        gpositions[ vidx+1 ] = data.readInt16AsFloat32();
        gpositions[ vidx+2 ] = 0;
        guvs      [ uidx+0 ] = data.readInt16pAsFloat32();
        guvs      [ uidx+1 ] = 1 - data.readInt16pAsFloat32();
        gcolors   [ cidx+0 ] = data.readUint8AsFloat32();
        gcolors   [ cidx+1 ] = data.readUint8AsFloat32();
        gcolors   [ cidx+2 ] = data.readUint8AsFloat32();
    }    

    function onRender() {

        // Use this to only render selected window
        //var idx = ( datgui.window == 'All' ) ? -1 : parseInt( datgui.window ) - 1;

        camera.position.x = camera_offset.x;
        camera.position.y = camera_offset.y;

        if (clientactive) {
            renderer.setClearColor( 0x303030 );
            renderer.clear( true, true, false );

            // render background (visual reference)
            renderer.render( scene_background, camera );

            // render command lists (or selected one)
            for ( var i = 0; i < gclips.length; i++ ) {
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
            renderer.setClearColor( 0 );
            renderer.clear( true, true, false );
        }

        // no need, will render each time we receive a packet
        //requestAnimationFrame( onRender );
    }

    function onUpdateGui() {
        if  ( datgui.windows.length != ( gcmdcount+1 ) ) {
            datgui.windows = [ 'Origin' ];
            for ( var i = 0; i < gcmdcount; i++ )
                datgui.windows[ i+1 ] = i+1;
            gui.remove( datgui_window );
            datgui_window = gui.add( datgui, 'window', datgui.windows );
            datgui_window.onChange( onFocusWindow );
        }
    }

    function onFocusWindow( value ) {
        if ( value == 'Origin' ) {
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
