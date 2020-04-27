var $width = $("#width");
var $height = $("#height");
var $rotate = $("#rotate");
var $top = $("#top");
var $left = $("#left");
var $aspectRatio = $('#aspectRatio');
var $image, cropper;
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

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
		width: Math.round( parseFloat(  $width[0].value  ) ) ,
		height: Math.round( parseFloat(  $height[0].value  ) ) ,
		rotate: Math.round( parseFloat(  $rotate[0].value  ) ) ,
		y: Math.round( parseFloat(  $top[0].value  ) ) ,
		x: Math.round( parseFloat(  $left[0].value  ) ) 
	}
	cropper.setData(data);
}

function update_aspectRatio() {
	if( !cropper ) return;
	let ratio = $aspectRatio[0].value.split(':').map( d => parseFloat(d) );
	ratio = ratio[0] / ratio[1];
	let aspectRatio = cropper.options.aspectRatio;
	let is_both_NaN = isNaN(aspectRatio) + isNaN(ratio);
	let is_equal = Math.abs( aspectRatio - ratio ) < 0.05;
	if( !is_both_NaN || !is_equal ) {
		cropper.options.aspectRatio = ratio;
	}
	update_cropper();
}

function crop() {
	if( cropper ) {
		let index = parseInt(  $('#image-index' )[0].innerText ) - 1;
		let data = cropper.getData();
		images_array[index].crop_height = data.height;
		images_array[index].crop_width = data.width;
		images_array[index].is_crop = !0;
		let type = images_array[index].type;
		compute_img_class($image[0], data.width, data.height);
		$image[0].src = $image.cropper('getCroppedCanvas').toDataURL(type);
		$image.cropper('destroy');
		$('#image-width')[0].innerText = Math.round(data.width);
	 	$('#image-height')[0].innerText = Math.round(data.height);
	}
}

function reset() {
	let img = $('#onfocus')[0];
	let index = parseInt(  $('#image-index' )[0].innerText ) - 1;
	let data = images_array[index];
	data.is_crop = !1;
	data.is_resize = !1;
	if( cropper ) $image.cropper('destroy');
	if( img.src !== data.origin_src ) {
		compute_img_class(img, data.origin_width, data.origin_height);
		img.src = data.origin_src;
		$('#image-width')[0].innerText = Math.round(data.origin_width);
	 	$('#image-height')[0].innerText = Math.round(data.origin_height);
		create_cropper(img);
	}
}

function images_save() {
	let imgs = document.querySelectorAll('img');
	for(let i=0; i<imgs.length; i++) {
		let data = images_array[i];
		let a = document.createElement('a');
		a.href = imgs[i].src;
		a.download = data.name;
		let event = new MouseEvent('click');
		a.dispatchEvent(event);
	}
}

function image_resize(img, index) {
	if( cropper ) $image.cropper('destroy');
	let width = Math.round( parseFloat( $('#resize-width' )[0].value ) ),
		height = Math.round( parseFloat( $('#resize-height' )[0].value ) );
	canvas.width = width;
	canvas.height = height;
	ctx.clearRect(0, 0, width, height);
	ctx.drawImage(img, 0, 0, width, height);
	compute_img_class(img, width, height);

	if( !index ) {
		index = parseInt(  $('#image-index' )[0].innerText ) - 1;
		$('#image-width')[0].innerText = Math.round(width);
		$('#image-height')[0].innerText = Math.round(height);
	}
	let data = images_array[index];
	data.resize_width = width;
	data.resize_height = height;
	data.is_resize = !0;
	img.src = canvas.toDataURL(data.type);
}

function images_resize() {
	let imgs = document.querySelectorAll('img');
	for(let i=0; i<imgs.length; i++) {
		image_resize(imgs[i], i);
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

function input_number_add(input, delta) {
	if( input.id === 'aspectRatio' ) return;
	input.value = Math.round( parseFloat( input.value ) )  + delta;
	update_cropper();
}

function carousel(isLeft) {
	let slide = $("#slide-visible")[0];
	let next_slide;
	if( isLeft && slide.previousSibling.className === 'slide') {
		next_slide = slide.previousSibling;
		$('#image-index')[0].innerText = parseInt( $('#image-index' ) [0].innerText) - 1;
	} else if( !isLeft && slide.nextSibling ) {
		next_slide = slide.nextSibling;
		$('#image-index')[0].innerText = parseInt( $('#image-index' ) [0].innerText) + 1;
	}
	
	if( next_slide ) {
		slide.removeAttribute('id');
		slide.querySelector('img').removeAttribute('id');
		next_slide.id = "slide-visible";
		next_slide.querySelector('img').id = "onfocus";
		let img = next_slide.querySelector('img');
		let index = parseInt(  $('#image-index' )[0].innerText ) - 1;
		let data = images_array[index];

		let width, height;
		if( data.is_crop ) {
			height = data.crop_height;
			width = data.crop_width;
		} else if( data.is_resize ) {
			height = data.resize_height;
			width = data.resize_width;
		} else {
			height = data.origin_height;
			width = data.origin_width;
		}
		$('#image-width')[0].innerText = Math.round(width);
	 	$('#image-height')[0].innerText = Math.round(height);
	}
}

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
		} else if( action === "打印" ) {
			if( cropper ) $image.cropper('destroy');
			window.print();
		}
	} else if( ele.id === "left-button" ) {
		carousel(!0);
	} else if( ele.id === "right-button" ) {
		carousel(!1);
	}
})