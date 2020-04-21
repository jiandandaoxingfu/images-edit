var slide_width = document.body.clientWidth * .9 * .85;
var slide_height = document.body.clientHeight * .9;

function compute_img_class(img, width, height) {
	if( slide_width / slide_height > width / height ) {
		img.setAttribute("class", "vertical");
	} else {
		img.setAttribute("class", "horizon");
	}
}

function display_images() {
	let images = $('#upload')[0].files;
	for( let image of images ) {
		create_image(image);
	}
}

function create_image(image) {
	let reader = new FileReader();
	reader.onload = function() {
		let div = document.createElement('div');
		div.setAttribute('class', 'slide');
		let img = new Image();
		img.onload = () => {
			compute_img_class(img, img.width, img.height);
			img.setAttribute("data-origin", reader.result);
			img.setAttribute('data-type', image.type);
			img.setAttribute('data-origin-height', img.height);
			img.setAttribute('data-origin-width', img.width);
			img.setAttribute('name', image.name);
			div.appendChild(img);
			$('#images-list')[0].appendChild(div);
			img.onload = null;
			let images_length = $('#upload')[0].files.length;
			if( $('#images-list')[0].getElementsByTagName('img').length ===  images_length ) {
	 			document.querySelector('.slide').id = "slide-visible";
	 			$('#image-length')[0].innerText = images_length;
	 			document.querySelector('img').id = "onfocus";
				$('#select-images')[0].style.display = "none";
				$('#images-list')[0].style.opacity = 1;
				$('#images-edit')[0].style.opacity = 1;
	 		}
		}
		img.src = reader.result;
	};
	reader.readAsDataURL(image);
}