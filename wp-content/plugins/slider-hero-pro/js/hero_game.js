jQuery(document).ready(function($){

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

var gameplaying = false;
var hitDetect;
var enemyInt;
var stage = $('#hg_stage');
var gameCredits;

showWelcome();
$('#hg_stage').css({'animation-play-state':'paused'});

$('.hg_ctaRestartGame').click(function(e){
	e.preventDefault();
  $('.hg_item').remove();
  $('#hg_bird').removeClass().attr('style', '');
  $('.hg_restartGamePop').fadeOut();
  setTimeout(function(){
	$("#hg_msg").show().delay(2000).fadeOut();
    $('#hg_stage').css({'animation-play-state':'running'});
    gameplaying = true;
    gravitypull();
    hitDetect = setInterval(charHit, 5);
    enemyInt = setInterval(createItems, 600);
  },500);
});

$('.hg_ctaStartGame').click(function(e){
	e.preventDefault();
	$('#hg_credits').show();
  $('.hg_welcomePop').fadeOut();
  //
  setTimeout(function(){
	$("#hg_msg").show().delay(2000).fadeOut();
    $('#hg_stage').css({'animation-play-state':'running'});
    gameplaying = true;
    gravitypull();
    hitDetect = setInterval(charHit, 5);
    enemyInt = setInterval(createItems, 600);
  },500);
});

$(document).keydown( function(e){

  if(e.keyCode == 32){
    if(gameplaying){
      $('#hg_bird').removeClass('hg_goDown').addClass('hg_birdMove');
    }
	return false;
  }

}); //end keydown

$(document).keyup(function(evt) {
  if (evt.keyCode == 32) {
    if(gameplaying){
      $('#hg_bird').removeClass('hg_birdMove').addClass('hg_goDown');
    }
	return false;
  }
});//end keyup

function gravitypull(){

  if(gameplaying){
    $('#hg_bird').removeClass('hg_birdMove').addClass('hg_goDown');
  }
}


function charHit(){
  //check for enemies
  $('.hg_enemy').each( function(){
    if( rectHit($('#hg_bird'), $(this)) ){
      var birdPos = $('#hg_bird').position().top;
      //remove enemies
      $(this).stop();
      $('#hg_bird').css('top', birdPos);
      gameplaying = false;
      clearInterval(hitDetect);
      clearInterval(enemyInt);
      showRestartGame();
      $('#hg_stage').css({'animation-play-state':'paused'});
    }
  });
  
  //check for credits
  $('.hg_gold').each( function(){
    if( rectHit($('#hg_bird'), $(this)) ){
      $(this).addClass('hg_goldFound');
      //$('#bird').css('top', birdPos);
      updateCredits();
      setTimeout(function(){
        $(this).remove();
      },300);
    }
  });
}

function updateCredits() {
  gameCredits = Number($('#hg_credits span').html());
  $('#hg_credits span').html(gameCredits + 1);
}

function createItems(){
  //console.log('createItems');
  //create enemy
  var item = $('<div>').addClass('hg_item');
  //decide if this is an enemy 1 or 2
  if(Math.random() > 0.3){
    item.addClass('hg_enemy');
  }else{
    item.addClass('hg_gold');        
  }

  //starting location for my enemies
  var eleft = stage.width() + 50;
  var etop = Math.random() * (stage.height()-50); //0 to (gameheight-50);

  item.css({top:etop, left:eleft});

  //add to stage:
  stage.append(item);

  //move enemy from right to left    
  item.animate({left: -100}, 3000, 'linear', function(){
    //callback function runs after animation is complete
    $(this).remove();

  });//end animate    

}//end createItems()    


//hit detect:
function rectHit(rectone, recttwo){
  //console.log('recthit called');
  var r1 = $(rectone);
  var r2 = $(recttwo);

  var r1x = r1.offset().left;
  var r1w = r1.width();
  var r1y = r1.offset().top;
  var r1h = r1.height();

  var r2x = r2.offset().left;
  var r2w = r2.width();
  var r2y = r2.offset().top;
  var r2h = r2.height();

  if( r1y+r1h < r2y ||
     r1y > r2y+r2h ||
     r1x > r2x+r2w ||
     r1x+r1w < r2x ){
    //console.log('recthit-false')
    return false;
  }else{
    //console.log('recthit-true')
    return true;
  }

}//end function 

function showWelcome() {
  $('.hg_welcomePop').fadeIn();
  $('#hg_credits').hide();
}
function showRestartGame() {
  $('.hg_restartGamePop').fadeIn();
}
})