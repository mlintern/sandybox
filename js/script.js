var editor = ace.edit("editor");
var session = editor.getSession();
var renderer = editor.renderer;

var SANDYBOX_STORAGE_NAME = 'sandybox_html';

var save_html = _.throttle(function () {
	storage.save(SANDYBOX_STORAGE_NAME, editor.getValue());
}, 5000, { 'trailing': true, 'leading': true });

var get_html = function () {
	var code = storage.get(SANDYBOX_STORAGE_NAME);
	session.setValue(code);
};

var default_html = function () {
	$.get( "html-sandbox.html", function( data ) {
		session.setValue(data);
		storage.save(SANDYBOX_STORAGE_NAME, data);
	});
};

if (storage.get(SANDYBOX_STORAGE_NAME) === null) {
	console.log('Using Default HTML');
	default_html();
} else {
	console.log('Using Saved HTML');
	get_html();
}

function updateWrap() {
	var value = $("select[name=wrap] option:selected").val();
	switch (value) {
		case "off":
			session.setUseWrapMode(false);
			session.setWrapLimitRange(null, null);
			renderer.setShowPrintMargin(false);
			break;
		case "free":
			session.setUseWrapMode(false);
			session.setUseWrapMode(true);
			session.setWrapLimitRange(null, null);
			renderer.setShowPrintMargin(false);
			break;
		default:
			session.setUseWrapMode(true);
			var col = parseInt(value, 10);
			session.setWrapLimitRange(col, col);
			renderer.setPrintMarginColumn(col);
			break;
	}
}

function runCode() {
	window.preview.document.write(editor.getValue());
	window.preview.document.close();
}

function download(filename, text) {
	var pom = document.createElement('a');
	pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	pom.setAttribute('download', filename);
	pom.click();
}

function download_html() {
	var filename = $('#filename').val();
	var name = '';
	if (filename.length > 0) {
		name = filename;
	}else{
		name = new Date().getTime();
		name = name.toString();
	}
	var iframeDoc = document.getElementById('preview').contentWindow.document.documentElement.innerHTML;
	var html_code = "<!DOCTYPE html>\n<html>\n" + iframeDoc + "\n</html>";

	if ( name.indexOf('.html') == -1 ) {
		name = name + ".html";
	}

	download(name, html_code);
	return true;
}

$(document).ready(function() {

	$('.offcanvas-menu').offcanvasMenu();

	setTimeout(function(){runCode();},1000);

	session.on('change', function(e) {
		runCode();
		save_html();
	});

	$('.refresh').bind('click', function() {
		$('#preview').remove();
		$('.preview-pane').append('<iframe name="preview" id="preview" src=""></iframe>');
		$('.fa.fa-refresh').addClass('fa-spin');
		setTimeout(function(){
			runCode();
			$('.fa.fa-refresh').removeClass('fa-spin');
		}, 500);
	});

	$('.reset').bind('click', function() {
		default_html();
	});

	$('.all-code').bind('click', function() {
		$('.preview-pane').css('width','0%');
		$('.content').css('width','100%');
		$('.screen-ctrl').removeClass('btn-warning');
		$(this).addClass('btn-warning');
		updateWrap();
	});

	$('.split').bind('click', function() {
		$('.preview-pane').css('width','60%');
		$('.preview-pane').css('left','40%');
		$('.content').css('width','40%');
		$('.screen-ctrl').removeClass('btn-warning');
		$(this).addClass('btn-warning');
		updateWrap();
	});

	$('.all-display').bind('click', function() {
		$('.preview-pane').css('width','100%');
		$('.preview-pane').css('left','0%');
		$('.content').css('width','0%');
		$('.screen-ctrl').removeClass('btn-warning');
		$(this).addClass('btn-warning');
	});

	$("select[name=theme]").change(function(){
		var theme = $("select[name=theme] option:selected").val();
		editor.setTheme("ace/theme/"+theme);
	});

	$("input[name=font-size]").change(function(){
		var font_size = $("input[name=font-size]").val();
		document.getElementById('editor').style.fontSize=font_size+'px';
	});

	$("input[name=tab-size]").change(function(){
		var tab_size = $("input[name=tab-size]").val();
		editor.getSession().setTabSize(tab_size);
	});

	$("input[name=showInvisibles]").change(function(){
		editor.setShowInvisibles($(this).is(":checked"));
	});

	$("select[name=wrap]").change(function(){
		updateWrap();
	});

});

// Set Defaults
editor.setTheme("ace/theme/monokai");
session.setMode("ace/mode/html");
session.setTabSize(2);
renderer.setShowPrintMargin(false);
editor.setShowInvisibles(true);

// Activate Chosen
$(".chosen-select").chosen({width: "100%"});

//Activate Clipboard
var clipboard = new Clipboard('.btn-copy', {
	text: function(trigger) {
		var iframeDoc = document.getElementById('preview').contentWindow.document.documentElement.innerHTML;
		var html_code = "<!DOCTYPE html>\n<html>\n" + iframeDoc + "\n</html>";
		return html_code;
	}
});

clipboard.on('success', function(e) {
	$('.menu-alert').show();
	$('.menu-alert').removeClass('alert-danger');
	$('.menu-alert').addClass('alert-success');
	$('.menu-alert').html('Copied!');
	setTimeout(function () { $('.menu-alert').hide(); }, 3000);
});

clipboard.on('error', function(e) {
	$('.menu-alert').show();
	$('.menu-alert').removeClass('alert-success');
	$('.menu-alert').addClass('alert-danger');
	$('.menu-alert').html('Press Ctrl+C to copy');
	setTimeout(function () { $('.menu-alert').hide(); }, 8000);
});
