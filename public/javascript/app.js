$(document).ready(function () {
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyA_oyWpCsZ91yjI_YU9fVEu8Tjji17XBko",
		authDomain: "image-upload-test-a6531.firebaseapp.com",
		databaseURL: "https://image-upload-test-a6531.firebaseio.com",
		storageBucket: "image-upload-test-a6531.appspot.com",
	};
	firebase.initializeApp(config);

	console.log('yay?');

	// Create a root reference
	var storageRef = firebase.storage().ref();

	// Create a child reference
	var imagesRef = storageRef.child('images');
	// imagesRef now points to 'images'

//////Upload
	var mountainsRef = storageRef.child('mountains.jpg');

	// var newImagesRef = imagesRef.child('mountains.jpg');


	var inputElement = document.getElementById("input");
	inputElement.addEventListener("change", handleFiles, false);
	
	function handleFiles() {
  		var fileList = this.files; /* now you can work with the file list */
  		console.log(fileList);
  		var file = fileList[0];
  		console.log(file);
  		console.log(file.name);

  		var formData = new FormData();
  		console.log(formData);
  		formData.append('File', file);
  		console.log(formData);

  		var currentURL = window.location.origin;
  		console.log(currentURL);

  // 		$.ajax({
  //     		url : currentURL+'/upload',
	 //        type : 'POST',
	 //        data : formData,
	 //        processData: false,  // tell jQuery not to process the data
	 //        contentType: false,  // tell jQuery not to set contentType
	 //        success : function(data) {
	 //        	console.log(data);
	 //            // alert(data);
  //       	}
		// });

		// var fileJSON = {
		// 	file: file
		// }

		// var xhr = new XMLHttpRequest;
		// xhr.open('POST', currentURL+'/upload', true);
		// xhr.send(file);

		var newImagesRef = imagesRef.child(file.name);
		console.log(newImagesRef);

  		newImagesRef.put(file).then(function (snapshot) {
  			console.log('snapshot');
  			console.log(snapshot);
  			console.log(snapshot.downloadURL);
  			var imgURL = snapshot.downloadURL;
  			$.post('/upload', { imgURL: imgURL }, function (data) {
  				//this is where i give the server the image URL
  				//maybe i should attach the .then here
  			});
  		}).then(function () {
  			var color = getImageColor();
  			console.log(color);
  			var shirtsImageRef = storageRef.child('shirts');
  			var selectedShirt = shirtsImageRef.child(color+'-shirt.jpg');
  			selectedShirt.getDownloadURL().then(function (url) {
  				var shirtImg = $('<img>', {
  					src: url, 
  					height: 700,
  					width: 500, 
  					position: 'relative', 
  					class: 'tshirt'
  				});
  				shirtImg.appendTo($('#image'));
  			}).then(function () {
  				console.log('ok?');
  				newImagesRef.getDownloadURL().then(function (url) {
		  			var img = $('<img>', {
		  				src: url,
	  					height: 64,
	  					width: 64, 
	  					class: 'image'
		  			});
		  			console.log('did that work?')
		  			img.appendTo($('#image'));
		  			console.log('where am i?');
  				});
  			});
  		});
	}

	$('.form').on('submit', function () {
		// console.log('something');
		// console.log($('.color option:selected').val());
		return false;
	});

	function getImageColor() {
		return $('.color option:selected').val();
	} 





})