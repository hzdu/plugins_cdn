document.getElementsByTagName('html')[0].style.background = 'unset';
document.getElementsByTagName('html')[0].style.backgroundColor = 'unset';
document.getElementsByTagName('body')[0].style.background = '#ffffff00';
// document.getElementsByClassName('wpbot_embed_container')[0].style.right = wpChatBotVar.wp_chatbot_position_x + 'px';
// document.getElementsByClassName('wpbot_embed_container')[0].style.bottom =  wpChatBotVar.wp_chatbot_position_y + 'px';

window.onload = function() {

	document.body.innerHTML += '<div class="wpbot_embed_container "><iframe style="border:none;" id="wpbot_embed_iframe" src="'+wpIframeUrl+'" scrolling="no" width="100%" ></iframe></div><style type="text/css">.wpbot_embed_container{position:fixed;bottom:10px;right:10px;width: 455px;z-index:99999;}#wpbot_embed_iframe{height:300px}</style>';

	setTimeout(function(){
		if(document.getElementsByClassName('circleRollButton').length>0){
			document.getElementsByClassName('circleRollButton')[0].style.display = 'none';
		}
		if(document.getElementById('moove_gdpr_save_popup_settings_button')){
			document.getElementById('moove_gdpr_save_popup_settings_button').style.display = 'none';
		}
	},3000);

	document.querySelector("#wpbot_embed_iframe").addEventListener("load", function() {

		var json = {
			msg: 'parent',
			val: 'I am from parent window'
		}
		document.querySelector("#wpbot_embed_iframe").contentWindow.postMessage(json, '*');


		var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
		var eventer = window[eventMethod];
		var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
	
		// Listen to message from child window
		
		eventer(messageEvent,function(e) {
			
			if(e.data.msg=='chatbot_open'){
				setTimeout(function(){
					document.getElementById("wpbot_embed_iframe").style.height = screen.height+'px';
					document.getElementsByClassName("wpbot_embed_container")[0].style.width = '-webkit-fill-available';
					document.getElementsByClassName("wpbot_embed_container")[0].style.width = '-moz-available';
					document.getElementsByClassName("wpbot_embed_container")[0].classList.add("embed_width");
					
				},10)
			}
			if(e.data.msg=='chatbot_close'){
				setTimeout(function(){
					document.getElementById("wpbot_embed_iframe").style.height = '300px';
					document.getElementsByClassName("wpbot_embed_container")[0].style.width = '455px';
					document.getElementsByClassName("wpbot_embed_container")[0].classList.remove("embed_width");
					var x = window.matchMedia("(min-width: 700px)")
					embed_container_width(x)
				},10)
			}
		},false);
		function embed_container_width(x) {
			if (x.matches) { // If media query matches
				document.getElementsByClassName("wpbot_embed_container")[0].style.width = '455px';
			} else {
				document.getElementsByClassName("wpbot_embed_container")[0].style.width = '90px';
			}
		  }

			window.addEventListener('resize', function(event){
					
				var widowH = window.innerHeight - 50;
				var ballConH = parseInt(widowH) * 0.5;
				//document.getElementById('wpbot_embed_iframe').contentWindow.document.getElementById("wp-chatbot-ball-container").style.height = ballConH + "px";
			
				//document.getElementById('wpbot_embed_iframe').contentWindow.document.getElementById("wbca_chat_body").style.height  = ballConH + "px";
				
				document.getElementById('wpbot_embed_iframe').document.getElementsByClassName('wp-chatbot-start-container')[0] = (ballConH)+'px';
				var wp_chatbot_ball_inner  = document.getElementsByClassName('wp-chatbot-ball-inner');
				for(var i=0; i < wp_chatbot_ball_inner.length; i++) { 
					wp_chatbot_ball_inner[i].style.height = (ballConH -70)+'px';
				}
				
				
				document.getElementById('wpbot_embed_iframe').contentWindow.document.getElementById("wp-chatbot-ball").style.height = ballConH + "px";
				
				
				var wbcaBody = document.getElementsByClassName('wp-chatbot-start-container');
				for(var i=0; i < wbcaBody.length; i++) { 
				wbcaBody[i].style.height = (ballConH - 30)+'px';
				}
				var wp_chatbot_start_screen = document.getElementsByClassName('wp-chatbot-start-screen');
				for(var i=0; i < wp_chatbot_start_screen.length; i++) { 
				wp_chatbot_start_screen[i].style.height = (ballConH - 70)+'px';
				}
			});
				
			

			
			
	});

};