function display_images() {
	let images = document.getElementById('upload').files;
	for( let image of images ) {
		create_image(image);
	}
}

function create_image(image) {
	let reader = new FileReader();
	reader.onload = function() {
		let div = document.createElement('div');
		div.setAttribute('class', 'slide');
		let img = document.createElement("img");
		img.src = reader.result;
		img.setAttribute("data-origin", reader.result);
		img.setAttribute('name', image.name);
		img.setAttribute('data-type', image.type);
		div.appendChild(img);
		document.getElementById('images-list').appendChild(div);
		if( document.getElementById('images-list')
			.getElementsByTagName('img').length ===  
			document.getElementById('upload').files.length
	 	) {
			document.getElementById('select-images').style.display = "none";
			document.getElementById('images-list').style.opacity = 1;
			document.getElementById('images-edit').style.opacity = 1;
	 	}
	};
	reader.readAsDataURL(image);
}