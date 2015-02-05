//-----------------------------------------------------------------------------
// Remote Imgui for https://github.com/ocornut/imgui
// https://github.com/JordiRos/remoteimgui
// Jordi Ros
//-----------------------------------------------------------------------------

// usage: http://localhost/imgui?host=your_device_ip
// set target app port, device_width and device_height, but could be done 

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    server_port = process.argv[2] || 80;

http.createServer( function( request, response ) {

  	var parts = url.parse( request.url, true );
  	var filename = path.join( process.cwd(), parts.pathname );

  	if( parts.pathname == "/imgui" ) {
		
		console.log( ">> GET Imgui" );

    	fs.readFile( process.cwd() + "/imgui.html", "binary", function( err, file ) {
	      	if( err ) {
	        	response.writeHead(500, {"Content-Type": "text/plain"});
	        	response.write(err + "\n");
	        	response.end();
	        	return;
	      	}
	      	file = file.replace( "$$host", parts.query['host'] );
	      	file = file.replace( "$$port", "7002" );
	      	file = file.replace( "$$device_width", "1920" );
	      	file = file.replace( "$$device_height", "1080" );
	      	file = file.replace( "$$compressed", "true" );
	      	response.writeHead( 200 );
	      	response.write( file, "binary" );
	      	response.end();
    	});
  	}
  	else {
  		console.log( "GET: " + filename );

  		fs.exists( filename, function( exists ) {
	    	if( !exists || fs.statSync( filename ).isDirectory() ) {
	      		response.writeHead( 404, { "Content-Type": "text/plain" } );
	      		response.write( "404 Not Found\n" );
	      		response.end();
	      		return;
	    	}
    		fs.readFile( filename, "binary", function( err, file ) {
		      	if( err ) {
	        		response.writeHead( 500, { "Content-Type": "text/plain" } );
	        		response.write( err + "\n" );
	        		response.end();
	        		return;
	      		}
	      		file = file.replace( "$$host", parts.query['host'] );
	      		file = file.replace( "$$port", "7002");
	      		file = file.replace( "$$device_width", "1920" );
	      		file = file.replace( "$$device_height", "1080" );
	      		file = file.replace( "$$compressed", "true" );
	      		response.writeHead( 200 );
	      		response.write( file, "binary" );
	      		response.end();
	      	});
    	});
  	}
}).listen( parseInt( server_port, 10 ) );

console.log( "Remote ImGui server running at => http://localhost:" + server_port + "/\nCTRL + C to shutdown" );
