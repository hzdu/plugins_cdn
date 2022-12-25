jQuery(document).ready(function($) {
	
if (typeof tagcanvas_mainId === 'undefined' || tagcanvas_mainId === null) {
    tagcanvas_mainId = mainId;
}

if (typeof tagcanvas_text_color === 'undefined' || tagcanvas_text_color === null) {
    tagcanvas_text_color = '#ffffff';
}
if (typeof tagcanvas_outline_color === 'undefined' || tagcanvas_outline_color === null) {
    tagcanvas_outline_color = '#ff9999';
}	

	
var mainArea = document.getElementById(tagcanvas_mainId);
var createCanvas = mainArea.appendChild(document.createElement('canvas'));
createCanvas.setAttribute("id", "hero_tagcanvas");
createCanvas.setAttribute("width", $('#'+tagcanvas_mainId).width());
createCanvas.setAttribute("height", $('#'+tagcanvas_mainId).height());
window.onresize = function(){
	$('#hero_tagcanvas').width($('#'+tagcanvas_mainId).width())
};
  if(!$('#hero_tagcanvas').tagcanvas({
    textColour : tagcanvas_text_color,
    outlineColour : tagcanvas_outline_color,
    reverse: true,
    depth: 0.8,
    maxSpeed: 0.05,

	textHeight: 25,
    weightMode:'both',
    weight: true,
	wheelZoom: false,

  },'hero_tags')) {
    // something went wrong, hide the canvas container
    $('#'+tagcanvas_mainId).hide();
  }
});