var dynamicLoading = {
    css: function (path) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function (path, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        script.async = false
        script.onload = script.onreadystatechange = function () {
            callback && callback()
        };
        head.appendChild(script);
    },
    type: 't2021082401',
    time: new Date().getTime()
}
function getQueryString (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var search = decodeURI(window.location.search)
    var r = search.substr(1).match(reg);
    if (r != null) return (r[2]); return '';
}
var code = getQueryString('code');
var code_str = code == '' ? '' : '&code=' + code;
var time = new Date().getTime()
var pageEditorJs = './files/pageEditor.js?' + time + code_str;
var editorTextSvgConfigJs = './files/textSvgConfig.js?'+time + code_str;
var indexEditorAppCss = 'https://static.fliphtml5.com/resourceFiles/yzReader/templates/Slide/css/app.css';
var indexEditorChunkVendorsCss = 'https://static.fliphtml5.com/resourceFiles/yzReader/templates/Slide/css/chunk-vendors.css';
var indexEditorAppJs = 'https://static.fliphtml5.com/resourceFiles/yzReader/templates/Slide/js/app.js';
var indexEditorChunkVendorsJs = 'https://static.fliphtml5.com/resourceFiles/yzReader/templates/Slide/js/chunk-vendors.js';
			
dynamicLoading.js(pageEditorJs, function () {
	dynamicLoading.css(indexEditorAppCss)
    dynamicLoading.css(indexEditorChunkVendorsCss)
	dynamicLoading.js(editorTextSvgConfigJs)
	dynamicLoading.js(indexEditorAppJs)
	dynamicLoading.js(indexEditorChunkVendorsJs)
})