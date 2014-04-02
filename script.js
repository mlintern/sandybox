$(document).ready(function() {

	setTimeout(function(){runCode();},1000)
	
	editor.getSession().on('change', function(e) {
    	runCode();
	});
	
	$('.all-code').bind('click', function() {
		$('.preview-pane').css('width','0%');
		$('.content').css('width','100%');
		$('.screen-ctrl').removeClass('btn-warning');
		$(this).addClass('btn-warning');
	});
	
	$('.split').bind('click', function() {
		$('.preview-pane').css('width','60%');
		$('.preview-pane').css('left','40%');
		$('.content').css('width','40%');
		$('.screen-ctrl').removeClass('btn-warning');
		$(this).addClass('btn-warning');
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
	
	$("select[name=font-size]").change(function(){
		var font_size = $("select[name=font-size] option:selected").val();
		console.log(font_size);
		editor.setFontSize(font_size);
	});
	
	$("select[name=tab-size]").change(function(){
		var tab_size = $("select[name=tab-size] option:selected").val();
		editor.getSession().setTabSize(tab_size);
	});
	
	$("input[name=showInvisibles]").change(function(){
		editor.setShowInvisibles($(this).is(":checked"));
	});
	
});

function menuToggle() {
	if ( $('.editor-menu').hasClass('open') ) {
		$('.editor-menu').css('width', '0%');
		$('.content-section').css('width','100%');
		$('.content-section').css('left', '0%');
		$('.editor-menu').removeClass('open');
	}else{
		$('.editor-menu').css('width', '20%');
		$('.content-section').css('width', '80%');
		$('.content-section').css('left', '20%');
		$('.editor-menu').addClass('open');
	}
}

function reset() {
	$('#preview').remove();
	$('.preview-pane').append('<iframe name="preview" id="preview" src=""></iframe>');
	runCode();
}

function runCode() {
	window['preview'].document.write(editor.getValue());
	window['preview'].document.close();
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}

function download_html() {
	console.log('here');
	var filename = $('#filename').val();
	if (filename.length > 0) {
		var name = filename
	}else{
		var name = new Date().getTime();
		name = name.toString();
	}
	var iframeDoc = document.getElementById('preview').contentWindow.document.documentElement.innerHTML;
	var html_code = "<!DOCTYPE html>\n<html>\n" + iframeDoc + "\n</html>"
	console.log(html_code);
	
	if ( name.indexOf('.html') == -1 ) {
		name = name + ".html";
	}
	
	download(name, html_code);
	return false;
}