var $width = $("#width");
var $height = $("#height");
var $rotate = $("#rotate");
var $top = $("#top");
var $left = $("#left");
var $image, cropper;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

document.addEventListener('click', e => {
	let ele = e.target;
	let tagName = ele.tagName.toLowerCase();
	if( tagName === "img" ) {
		create_cropper(ele);
	} else if( tagName === "button" ) {
		let action = ele.innerText;
		if( action === "剪切" ) {
			crop();
		} else if( action === "复原" ) {
			reset();
		} else if( action === "全部保存" ) {
			images_save();
		} else if( action === '调整' ) {
			image_resize($('#onfocus')[0]);
		} else if( action === '全部调整' ) {
			images_resize();
		}
	} else if( ele.id === "left-button" ) {
		carousel(!0);
	} else if( ele.id === "right-button" ) {
		carousel(!1);
	}
})

function crop() {
	if( cropper ) {
		let data = cropper.getData();
		let type = $image[0].getAttribute('data-type');
		compute_img_class($image[0], data.width, data.height);
		$image[0].src = $image.cropper('getCroppedCanvas').toDataURL(type);
		$image.cropper('destroy');
	}
}

function reset() {
	let img = $('#onfocus')[0];
	if( cropper ) $image.cropper('destroy');
	if( img.src !== img.getAttribute("data-origin") ) {
		let width = img.getAttribute("data-origin-width"),
			height = img.getAttribute("data-origin-height");
		compute_img_class(img, width, height);
		img.src = img.getAttribute("data-origin");
		create_cropper(img);
	}
}

function create_cropper(img) {
	if( cropper ) {
		$image.cropper('destroy');
	}
	$image = $("#onfocus");
	$image.cropper({
  		aspectRatio: NaN,
  		viewMode: 2,
  		autoCropArea: 1,
  		crop: e => {
  			$top.val(Math.round(e.detail.y)),
  			$left.val(Math.round(e.detail.x)),
  			$width.val(Math.round(e.detail.width)),
			$height.val(Math.round(e.detail.height)),
			$rotate.val(e.detail.rotate)
  		}
  	})
  	cropper = $image.data('cropper');
}

function update_cropper() {
	if( !cropper ) return;
	let data = {
		width: parseInt( $width[0].value ),
		height: parseInt( $height[0].value ),
		rotate: parseInt( $rotate[0].value ),
		y: parseInt( $top[0].value ),
		x: parseInt( $left[0].value )
	}
	cropper.setData(data);
}

function carousel(isLeft) {
	let slide = $("#slide-visible")[0];
	let next_slide;
	if( isLeft && slide.previousSibling.className === 'slide') {
		next_slide = slide.previousSibling;
		$('#image-index')[0].innerText = parseInt($('#image-index')[0].innerText) - 1;
	} else if( !isLeft && slide.nextSibling ) {
		next_slide = slide.nextSibling;
		$('#image-index')[0].innerText = parseInt($('#image-index')[0].innerText) + 1;
	}
	
	if( next_slide ) {
		slide.removeAttribute('id');
		slide.querySelector('img').removeAttribute('id');
		next_slide.id = "slide-visible";
		next_slide.querySelector('img').id = "onfocus";
		let img = next_slide.querySelector('img');
		$('#image-width')[0].innerText = img.getAttribute("data-origin-width");
	 	$('#image-height')[0].innerText = img.getAttribute("data-origin-height");
	}
}

function input_number_add(input, delta) {
	input.value = parseInt(input.value) + delta;
	update_cropper();
}

function image_resize(img) {
	if( cropper ) $image.cropper('destroy');
	let width = parseInt($('#resize-width')[0].value),
		height = parseInt($('#resize-height')[0].value);
	canvas.width = width;
	canvas.height = height;
	ctx.clearRect(0, 0, width, height);
	ctx.drawImage(img, 0, 0, width, height);
	compute_img_class(img, width, height);
	img.src = canvas.toDataURL(img.getAttribute('data-type'));
}

function images_resize() {
	let imgs = document.querySelectorAll('img');
	for(let img of imgs) {
		image_resize(img);
	}
}

function images_save() {
	let imgs = document.querySelectorAll('img');
	for(let img of imgs) {
		let a = document.createElement('a');
		a.href = img.src;
		a.download = img.getAttribute('name');
		let event = new MouseEvent('click');
		a.dispatchEvent(event);
	}
}

document.addEventListener('keydown', e => {
	let tagName = e.target.tagName.toLowerCase();
	let keycode = get_keycode(e);
	if( keycode == '' ) return;
	switch( keycode ) {
		case "上":
			if( tagName === "input" && cropper ) {
				input_number_add(e.target, 1);
			}
			break;
		case "下":
			if( tagName === "input" && cropper ) {
				input_number_add(e.target, -1);
			}
			break;
		case "左":
			carousel(!0);
			break;
		case "右":
			carousel(!1);
			break;
		default:
			break;
	}
})