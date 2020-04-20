var $width = $("#width");
var $height = $("#height");
var $rotate = $("#rotate");
var $top = $("#top");
var $left = $("#left");
var $image, cropper;

document.addEventListener('click', e => {
	let ele = e.target;
	let tagName = ele.tagName.toLowerCase();
	if( tagName === "img" ) {
		create_cropper(ele);
	} else if( tagName === "button" ) {
		let action = ele.innerText;
		if( action === "全部调整" ) {
			
		} else if( action === "单个调整" ) {
			save_croper_single();
		}
	} else if( ele.id === "left-button" ) {

	} else if( ele.id === "right-button" ) {

	}
})

function save_croper_single() {
	if( $('#onfocus').length === 1 ) {
		let type = $image[0].getAttribute('data-type');
		$image[0].src = $image.cropper('getCroppedCanvas').toDataURL(type);
		$image[0].removeAttribute('id');
		$image.cropper('destroy');
	}
}

function create_cropper(img) {
	if( cropper ) {
		$image.cropper('destroy');
		$image[0].removeAttribute('id');
	}
	img.id = 'onfocus';
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
	if( isLeft ) {
		
	} else {
		
	}
}