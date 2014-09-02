
document.addEventListener("deviceready", onDeviceReady, false);
		
function onDeviceReady() {
	
	//alert("Device ready");
	//alert("cordova version : " +device.cordova +"\nModel : " +device.model+ "\nOS : " +device.platform+ "\nOS ver : " +device.version);
		
	document.addEventListener("online", onOnline, false);
	document.addEventListener("offline", onOffline, false);
	
}

function invokeCamera(){
	if (navigator.connection.type != 'none') {
		navigator.camera.getPicture(cameraSuccess, cameraFail, { 
			quality: 100,
		    destinationType: Camera.DestinationType.DATA_URL,
		    sourceType : Camera.PictureSourceType.CAMERA,
			allowEdit : false,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 100,
			targetHeight: 100,
			correctOrientation:true,
			//popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: false,
			//cameraDirection:Camera.Direction.BACK
		});
	
		//navigator.camera.cleanup(cleanSuccess, cleanFail);	//iOS support only when source= camera and destination= file_uri
	}
	else{
		alert("This app needs to be connected to work");
		if(device.platform == "Android"){
			navigator.app.exitApp();
		}
	}
}

function cameraSuccess(imageData) {
	//alert("inside camera's success function");
	
    var image = document.getElementById('myImage');
    
    //destinationType: Camera.DestinationType.DATA_URL
    image.src = "data:image/jpeg;base64," + imageData;  
    
    /* //destinationType: Camera.DestinationType.FILE_URI
     * image.src = imageData;
     */
    
    document.getElementById('myLocation').innerHTML = "loading location....";
    document.getElementById('myPositionMap').innerHTML = "loading map..";
    
    /*if(device.platform == "iOS"){
    	navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError,{ 
	    	maximumAge: 30000, 
	    	timeout: 30000, 
	    	enableHighAccuracy: true 
	    });
    }
    else */if(device.platform == "Android"){
    	if (navigator.geolocation){
	    	navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError);
	    }
	  	else{
	  		alert("Geolocation is not supported by this browser");
	  	}
    }
    else{
    	alert("Implement geolocation for" +device.platform+ " OS");
    }
}

function cameraFail(message) {
	if(message != "Camera cancelled."){
		alert('Camera Failed because: ' + message);
	}  
}

function cleanSuccess() {
	console.log("Camera cleanup success.");
}
	
function cleanFail(message) {
    alert('Failed because: ' + message);
}

function onOnline(){
	//alert("Connected");
	
	navigator.notification.confirm(
	    'This app captures geolocation data and sends to relevant party as per your wish. Continue?', // message
	     onConfirm,            // callback to invoke with index of button pressed
	    'Privacy policy',           // title
	    ['Ok','Exit']     // buttonLabels
	);
}

function onOffline(){
	//alert("Disconnected");
	invokeCamera();
}

//dialog plugin function
function onConfirm(buttonIndex) {
    //alert('You selected button ' + buttonIndex);
    if(buttonIndex == 2){
    	if(device.platform == "Android"){
    		navigator.app.exitApp();
    	}
    	else{
    		alert("iOS & Windows - The app may not work as intended");
    	}	
    }
}

function geolocationSuccess(position) {
          
 	document.getElementById('myLocation').innerHTML = 
 			'Latitude: '          + position.coords.latitude          + '<br>' +
        	'Longitude: '         + position.coords.longitude         + '<br>' +
   /*       	'Altitude: '          + position.coords.altitude          + '<br>' +
          	'Accuracy: '          + position.coords.accuracy          + '<br>' +
          	'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '<br>' +
          	'Heading: '           + position.coords.heading           + '<br>' +
          	'Speed: '             + position.coords.speed             + '<br>' +
   */       	'Timestamp: '         + position.timestamp                + '<br>';
    
    /*
	var latlon = position.coords.latitude + "," + position.coords.longitude;
    document.getElementById('myMap').src = "http://maps.googleapis.com/maps/api/staticmap?center=" +latlon+ "&zoom=14&size=400x300&sensor=false";
   	*/
   	
   	latlon = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
	mapholder = document.getElementById('myPositionMap');
	mapholder.style.height='250px';
	mapholder.style.width='500px';
	
	var myOptions={
		center:latlon,zoom:14,
		mapTypeId:google.maps.MapTypeId.ROADMAP,
	  	mapTypeControl:false,
	  	navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
	};
	
	var map = new google.maps.Map(document.getElementById("myPositionMap"),myOptions);
	
	var marker = new google.maps.Marker({position:latlon,map:map,title:"Pic taken here!"});
	  
}


// onError Callback receives a PositionError object
function geolocationError(error) {

  	document.getElementById('myLocation').innerHTML = 'geolocation failed - code: '    + error.code    + '<br>' +
          'message: ' + error.message;
  	
}

/*
//Geolocation shortcut for testing only
function invokeGeolocation(){
	navigator.geolocation.getCurrentPosition(geolocationSuccess,geolocationError);
}
*/
