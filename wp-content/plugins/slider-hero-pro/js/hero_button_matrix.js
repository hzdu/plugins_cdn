
var $lines = jQuery('.hero_prompt p');
$lines.hide();
var lineContents = new Array();

var terminal = function() {
	
  var skip = 0;
  typeLine = function(idx) {
    idx == null && (idx = 0);
    var element = jQuery('.hero_prompt:visible p');
	
    var content = lineContents[idx];
	
    if(typeof content == "undefined") {
      jQuery('.skip').hide();
      return;
    }
    var charIdx = 0;

    var typeChar = function() {
      var rand = Math.round(Math.random() * 150) + 25;

      setTimeout(function() {
        var char = content[charIdx++];
        element.append(char);
        if(typeof char !== "undefined")
          typeChar();
        else {
          element.append('<br/><span class="hero_output">' + element.text().slice(9, -1) + '</span>');
          element.removeClass('hero_active');
          typeLine(++idx);
        }
      }, skip ? 0 : rand);
    }
    content = '' + content + '';
    element.append(' ').addClass('hero_active');
    typeChar();
  }

  
    lineContents[0] = jQuery('.hero_prompt:visible p').html();
	jQuery('.hero_prompt:visible p').html('');
    jQuery('.hero_prompt:visible p').show();
  
	
  typeLine();
}
