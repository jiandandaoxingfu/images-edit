var slide_width = document.body.clientWidth * .9 * .85;
var slide_height = document.body.clientHeight * .9;
var images_array = [];

function compute_img_class(img, width, height) {
	if( slide_width / slide_height > width / height ) {
		img.setAttribute("class", "vertical");
	} else {
		img.setAttribute("class", "horizon");
	}
}

function init_images() {
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
			images_array.push({
				origin_height: img.height,
				origin_width: img.width,
				origin_src: reader.result,
				type: image.type,
				name: image.name,
				is_crop: !1,
				is_resize: !1
			});
			div.appendChild(img);
			$('#images-list')[0].appendChild(div);
			img.onload = null;
			display_images();
		}
		img.src = reader.result;
	};
	reader.readAsDataURL(image);
}

function display_images() {
	let images_length = $('#upload')[0].files.length;
	if( $('#images-list')[0].getElementsByTagName('img').length ===  images_length ) {
	 	document.querySelector('.slide').id = "slide-visible";
	 	document.querySelector('img').id = "onfocus";

	 	$('#image-length')[0].innerText = images_length;
	 	$('#image-width')[0].innerText = images_array[0].origin_width;
	 	$('#image-height')[0].innerText = images_array[0].origin_height;

		$('#images-select')[0].style.opacity = 0;
		setTimeout(() => {
			$('#images-select')[0].style.display = "none";
		}, 1000);

		$('#images-list')[0].style.opacity = 1;
		$('#images-edit')[0].style.opacity = 1;
	 }
}