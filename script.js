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
		$('.preview-pane').css('margin-left','40%');
		$('.content').css('width','40%');
		$('.screen-ctrl').removeClass('btn-warning');
		$(this).addClass('btn-warning');
	});
	
	$('.all-display').bind('click', function() {
		$('.preview-pane').css('width','100%');
		$('.preview-pane').css('margin-left','0%');
		$('.content').css('width','0%');
		$('.screen-ctrl').removeClass('btn-warning');
		$(this).addClass('btn-warning');
	});
	
	$(".theme-change").submit(function(event){
		event.preventDefault();
	});
	
});

function reset() {
	$('#preview').remove();
	$('.preview-pane').append('<iframe name="preview" id="preview" src=""></iframe>');
	runCode();
}

function runCode() {
	window['preview'].document.write(editor.getValue());
	window['preview'].document.close();
}

function themeUpdate() {
	var theme = $("select[name=theme] option:selected").val();
	console.log(theme);
	
	editor.setTheme("ace/theme/"+theme);
	
	return false;
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
	}
	var iframeDoc = document.getElementById('preview').contentWindow.document.documentElement.innerHTML;
	var html_code = "<!DOCTYPE html>\n<html>\n" + iframeDoc + "\n</html>"
	console.log(html_code);
	download(name+".html", html_code);
	return false;
}