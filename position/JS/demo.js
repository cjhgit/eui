jQuery(document).ready(function($) {

	// default position
	$('#positionedBox').pot({
		relativeTo: $('#staticBox'),
		x: 'leftEdge',
		y: 'bottomEdge',
		z: 1000
	});

	// prepare code for code generation area
	function generateCode() {
		var codeStart = "jQuery('#positionedBox').pot({\n";

			// initialize
			var relativeTo = $('#relativeTo option:selected').val();
			relativeTo = ((/\b(?:window|document)\b/.test(relativeTo)) ? relativeTo : ("jQuery('" + relativeTo + "')"));

			var position = $('#position option:selected').val();

			var x = $('#x option:selected').val(), y = $('#y option:selected').val();
			var offsetX = $('#offsetX').val(), offsetY = $('#offsetY').val(), z = $('#z').val();

			var inBoundX = (($('#inBoundX:checkbox:checked').val() === 'true') ? true : false), inBoundY = (($('#inBoundY:checkbox:checked').val() === 'true') ? true : false);

			var boundingBox = $('#boundingBox option:selected').val();
			boundingBox = ((/\b(?:window|document)\b/.test(boundingBox)) ? boundingBox : ("jQuery('" + boundingBox + "')"));

			var includeMargin = (($('#includeMargin:checkbox:checked').val() === 'true') ? true : false);


			// relativeTo, position
			var code = ("\trelativeTo: " + relativeTo);
			code	+= ((position === 'absolute') ? '' : (", \n\tposition: '" + position + "'"));

			// x, y, z
			code	+= ((x === 'left') ? '' : (", \n\tx: '" + x + "'"));
			code	+= ((y === 'top') ? '' : (", \n\ty: '" + y + "'"));
			code	+= ((z === 'auto') ? '' : (", \n\tz: " + z));

			// offsets
			code	+= ((offsetX == '0') ? '' : (", \n\toffsetX: " + offsetX));
			code	+= ((offsetY == '0') ? '' : (", \n\toffsetY: " + offsetY));

			// bounds
			code	+= ((inBoundX) ? '' : (", \n\tinBoundX: " + inBoundX));
			code	+= ((inBoundY) ? '' : (", \n\tinBoundY: " + inBoundY));
			code	+= ((!inBoundX && !inBoundY || boundingBox === 'window') ? '' : (", \n\tboundingBox: " + boundingBox));

			// includeMargin
			code	+= ((includeMargin) ? (", \n\tincludeMargin: " + includeMargin) : '');

		var codeEnd = "\n});";


		// code
		code = codeStart + code + codeEnd;
		$('#code').val(code);
	}

	// at first run
	generateCode();

	// update values of fields to match pre-sets
	function updateFields() {

		// relativeTo, position
		var relativeTo = $('#positionedBox').pot('relativeTo');
		relativeTo = (relativeTo === window) ? 'window' : ((relativeTo === document) ? 'document' : ('#' + $(relativeTo).attr('id')));
		$('#relativeTo option[value="' + relativeTo + '"]').attr('selected', true);

		$('#position option[value="' + $('#positionedBox').pot('position') + '"]').attr('selected', true);


		// x, y, z
		$('#x option[value="' + $('#positionedBox').pot('x') + '"]').attr('selected', true);
		$('#y option[value="' + $('#positionedBox').pot('y') + '"]').attr('selected', true);

		$('#offsetX').val($('#positionedBox').pot('offsetX'));
		$('#offsetY').val($('#positionedBox').pot('offsetY'));

		$('#z').val($('#positionedBox').pot('z'));


		// bounds
		var inBoundX = $('#positionedBox').pot('inBoundX'), inBoundY = $('#positionedBox').pot('inBoundY');

		if(!inBoundX) {
			$('#inBoundX').removeAttr('checked');
		}
		else {
			$('#inBoundX').attr('checked', 'checked');
		}

		if(!inBoundY) {
			$('#inBoundY').removeAttr('checked');
		}
		else {
			$('#inBoundY').attr('checked', 'checked');
		}

		// disable bounding box
		if(!inBoundX && !inBoundY) {
			$('#boundingBox').attr('disabled', true);
		}
		else {
			$('#boundingBox').attr('disabled', false);

			var boundingBox = $('#positionedBox').pot('boundingBox');
			boundingBox = (boundingBox === window) ? 'window' : ((boundingBox === document) ? 'document' : ('#' + $(boundingBox).attr('id')));

			$('#boundingBox option[value="' + boundingBox + '"]').attr('selected', true);
		}


		// includeMargin
		var includeMargin = $('#positionedBox').pot('includeMargin');

		if(!includeMargin) {
			$('#includeMargin').removeAttr('checked');
		}
		else {
			$('#includeMargin').attr('checked', 'checked');
		}
	}

	// monitor value change in select fields
	$('#position, #x, #y, #relativeTo, #boundingBox').change(function(e) {
		var property = $(this).attr('id');
		var value = $(this).find('option:selected').val();

		if(/\b(?:relativeTo|boundingBox)\b/.test(property)) {
			// normalize values
			if(value === 'window') {
				value = window;
			}
			else if(value === 'document') {
				value = document;
			}
			else {
				value = $(value);
			}
		}

		// apply
		$('#positionedBox').pot(property, value);

		// generate code
		generateCode();
	});

	// update value change in text fields
	$('#offsetX, #offsetY, #z').keyup(function() {
		var property = $(this).attr('id');
		var value = parseInt($(this).val());

		// validate
		if(isNaN(value) || null === value) {
			value = (property === 'z') ? 'auto' : 0;
		}

		// apply
		$('#positionedBox').pot(property, value);
	});

	$('#offsetX, #offsetY, #z').blur(function() {
		var property = $(this).attr('id');
		var value = parseInt($(this).val());

		// validate
		if(isNaN(value) || null === value) {
			$(this).val(((property === 'z') ? 'auto' : 0));
		}

		// generate code
		generateCode();
	});

	$('#inBoundX, #inBoundY, #includeMargin').click(function() {
		var property = $(this).attr('id');
		var value = $('#' + property + ':checkbox:checked').val() === 'true' ? true : false;

		// apply
		$('#positionedBox').pot(property, value);

		// toggle boundingBox "disabled" attribute
		if(property === 'inBoundX' || property === 'inBoundY') {
			// checkboxes unchecked
			if(null == jQuery('#inBoundX:checkbox:checked').val() && null == jQuery('#inBoundY:checkbox:checked').val()) {
				$('#boundingBox').attr('disabled', true);
			}
			else {
				$('#boundingBox').attr('disabled', false);
			}
		}

		// generate code
		generateCode();
	});

	// auto-select text fields
	$('input[type="text"], textarea').click(function() {
		// select text
		this.select();
	});


});
