$(document).ready(function () {
	//this is very bad - I should have this on the server side. 
	//I put it here because I was having some trouble getting it working that way
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyA_oyWpCsZ91yjI_YU9fVEu8Tjji17XBko",
		authDomain: "image-upload-test-a6531.firebaseapp.com",
		databaseURL: "https://image-upload-test-a6531.firebaseio.com",
		storageBucket: "image-upload-test-a6531.appspot.com",
	};
	firebase.initializeApp(config);

	$('.order').hide();
	var fileChosenRef;

	$('.view').on('click', function () {
		$('#image').empty();
		var url = $(this).attr('data-img');
		var color = $(this).data('color');

		var shirtsImageRef = storageRef.child('shirts');
		var selectedShirt = shirtsImageRef.child(color+'-shirt.jpg');
		selectedShirt.getDownloadURL().then(function (colorURL) {
			var shirtImg = $('<img>', {
				src: colorURL, 
				height: 700,
				width: 500, 
				position: 'relative', 
				class: 'tshirt'
			});
			shirtImg.appendTo($('#image'));
		}).then(function () {
		var img = $('<img>', {
				src: url,
				height: 64,
				width: 64, 
				class: 'image'
			});
			img.appendTo($('#image'));
		});

	});

	// Create a root reference
	var storageRef = firebase.storage().ref();

	// Create a child reference
	var imagesRef = storageRef.child('images');
	// imagesRef now points to 'images'

//////Upload
	var inputElement = document.getElementById("input");
	inputElement.addEventListener("change", handleFiles, false);
	
	function handleFiles() {
  		var fileList = this.files; /* now you can work with the file list */
  		var file = fileList[0];

  		var formData = new FormData();
  		formData.append('File', file);

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
		fileChosenRef = newImagesRef;

  		newImagesRef.put(file).then(function (snapshot) {
  			var color = getImageColor();
  			var imgURL = snapshot.downloadURL;

  		}).then(function () {
			shirtToPage();
  		});
	}

	$('.order').on('click', function() {
		$(this).hide();
		var imgURL = $('.image').data('imgurl');
		var color = $('.tshirt').data('color');
		var shirtId = $('.color option:selected').data('id');
		console.log('LOOOOOOK');
		console.log(shirtId);
	    $.post('/upload', { 
			imgURL: imgURL,
			color: color, 
			shirtId: shirtId 
		}).then(function (data) {
			console.log(data);
			orderConfirm();
		});
	})

	$('.form').on('submit', function () {
		return false;
	});

	function getImageColor() {
		return $('.color option:selected').data('color');
	} 

///change color
	$('#colorSelect').change(function () {
		$('#image').empty();
		shirtToPage();
	});

	function shirtToPage() {
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
				class: 'tshirt', 
				'data-color': color
			});
			shirtImg.appendTo($('#image'));
		}).then(function () {
			fileChosenRef.getDownloadURL().then(function (url) {
				var img = $('<img>', {
					src: url,
					height: 64,
					width: 64, 
					class: 'image',
					'data-imgurl': url
				});
				img.appendTo($('#image'));
				$('.order').show();
			});
		});	
	}


	function orderConfirm() {
		$('h1').remove();
	}









})