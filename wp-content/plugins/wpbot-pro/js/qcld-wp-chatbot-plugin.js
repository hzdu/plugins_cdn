/*
 * Project:      wpwBot jQuery Plugin
 * Description:  wpwBot AI based Chatting functionality are handled .
 * Author:       QuantumCloud
 * Version:      1.0
 */
var globalwpw;
var wpwTree;
var wpwAction;
var wpwKits;
var wpwWelcome;
var wpwMsg;
var botaudiolist = [];
var botaudioisplay = false;
(function($) {
    "use strict";
    /*
     * Global variable as object will beused to handle
     * wpwbot chatting initialize, tree change transfer,
     * changing tree steps and cookies etc.
     */
    globalwpw={
        initialize:0,
        settings:{},
        wildCard:0,
        wildcards:'',
        wildcardsHelp:['start','support','reset', 'email subscription', 'unsubscribe' , 'livechat'],
        productStep:'asking',
        orderStep:'welcome',
        supportStep:'welcome',
        formStep: 'welcome',
        formfieldid:'',
        formid:'',
        formentry:0,
        bargainStep:'welcome', // bargin welcome message
        bargainId:0, // bargin product id
        bargainVId:0, // bargin product variation id
        bargainPrice:0, // bargin price
        bargainLoop:0, // bargin price
        hasNameCookie:$.cookie("shopper"),
        shopperUserName:'',
        shopperEmail:'',
        shopperMessage:'',
        emptymsghandler:0,
        repeatQueryEmpty:'',
        wpwIsWorking:0,
        ai_step:0,
        df_status_lock:0,
		counter:0,
		emailContent:[],
		resetStep: 'welcome',

    };
    /*
     * wpwbot welcome section coverd
     * greeting for new and already visited shopper
     * based the memory after asking thier name.
     */
   
    wpwWelcome={
        greeting:function () {
			
            //Very begining greeting.
            
            //generating unique session id.
            if(!localStorage.getItem('botsessionid')){

                var number = Math.random() // 0.9394456857981651
                number.toString(36); // '0.xtis06h6'
                var id = number.toString(36).substr(2); // 'xtis06h6'

                localStorage.setItem('botsessionid', id);
                
            }
			globalwpw.initialize=1
			if(globalwpw.wildCard == 9){
				wpwTree.bargain();
			}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Faq'){

                if(!localStorage.getItem('shopper')){
                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }
               
                globalwpw.wildCard=1;
                globalwpw.supportStep='welcome';
                wpwAction.bot('from wildcard support');
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("supportStep", globalwpw.supportStep);
                globalwpw.initialize=1;
                globalwpw.ai_step=1;

            }else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Email Subscription'){

                if(!localStorage.getItem('shopper')){
                    console.log(wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }

                globalwpw.wildCard=3;
                globalwpw.subscriptionStep='welcome';
                wpwTree.subscription();
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("supportStep", globalwpw.supportStep);
                globalwpw.initialize=1;
                globalwpw.ai_step=1;

            }else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Product Search'){

                if(!localStorage.getItem('shopper')){
                    console.log(wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }

                globalwpw.wildCard=20;
                globalwpw.productStep='asking'
                wpwAction.bot('from wildcard product');
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("productStep", globalwpw.productStep);
                globalwpw.initialize=1;
                globalwpw.ai_step=1;

            }else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Catalog'){

                if(!localStorage.getItem('shopper')){
                    console.log(wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }
                wpwAction.bot(wpwKits.render(globalwpw.settings.obj.sys_key_catalog).toLowerCase());
                globalwpw.initialize=1;
                globalwpw.ai_step=1;

            }else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Featured Products'){

                if(!localStorage.getItem('shopper')){
                    console.log(wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }
                globalwpw.wildCard=20;
                globalwpw.productStep='featured'
                wpwAction.bot('from wildcard product');
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("productStep", globalwpw.productStep);
                
                globalwpw.initialize=1;
                globalwpw.ai_step=1;

            }else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Products on Sale'){

                if(!localStorage.getItem('shopper')){
                    console.log(wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }
                globalwpw.wildCard=20;
                globalwpw.productStep='sale'
                wpwAction.bot('from wildcard product');
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("productStep", globalwpw.productStep);
                
                globalwpw.initialize=1;
                globalwpw.ai_step=1;

            }else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Order Status'){

                if(!localStorage.getItem('shopper')){
                    console.log(wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }
                globalwpw.wildCard=21;
                globalwpw.orderStep='welcome';
                wpwAction.bot('from wildcard order');
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("orderStep", globalwpw.orderStep);
                
                globalwpw.initialize=1;
                globalwpw.ai_step=1;

            }else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)==wpwKits.render(globalwpw.settings.obj.site_search)){

                if(!localStorage.getItem('shopper')){
                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }

                if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
                    var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }else{
                    var shopperName=globalwpw.hasNameCookie;
                }
                var askEmail= wpwKits.randomMsg(wp_chatbot_obj.asking_search_keyword)
                
                wpwMsg.single(askEmail.replace("#name", shopperName));
                //Now updating the support part as .
                globalwpw.supportStep='search';
                globalwpw.wildCard=1;
                globalwpw.ai_step=1;
                globalwpw.initialize=1;
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("supportStep",  globalwpw.supportStep);

            }else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Send Us Email'){

                if(!localStorage.getItem('shopper')){
                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }

                if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
                    var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }else{
                    var shopperName=globalwpw.hasNameCookie;
                }
                var askEmail= wpwKits.randomMsg(wp_chatbot_obj.asking_email);
                wpwMsg.single(askEmail);
                //Now updating the support part as .
                globalwpw.supportStep='email';
                globalwpw.wildCard=1;
                globalwpw.ai_step=1;
                globalwpw.initialize=1;
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("supportStep",  globalwpw.supportStep);

            }else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Leave A Feedback'){

                if(!localStorage.getItem('shopper')){
                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }

                if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
                    var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }else{
                    var shopperName=globalwpw.hasNameCookie;
                }

                    var askEmail= wpwKits.randomMsg(wp_chatbot_obj.asking_email);
                    wpwMsg.single(askEmail);
                    //Now updating the support part as .
                    globalwpw.supportStep='email';
                    globalwpw.wildCard=1;
                    globalwpw.ai_step=1;
                    globalwpw.initialize=1;
 
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("supportStep",  globalwpw.supportStep);

            }else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Request Callback'){

                if(!localStorage.getItem('shopper')){
                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }

                if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
                    var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }else{
                    var shopperName=globalwpw.hasNameCookie;
                }
                var askEmail= wpwKits.randomMsg(wp_chatbot_obj.asking_phone);
                setTimeout(function(){
                    wpwMsg.single(askEmail);
                    //Now updating the support part as .
                    globalwpw.supportStep='phone';
                    globalwpw.wildCard=1;
                    globalwpw.ai_step=1;
                    globalwpw.initialize=1;
                    //keeping value in localstorage
                    localStorage.setItem("wildCard",  globalwpw.wildCard);
                    localStorage.setItem("supportStep",  globalwpw.supportStep);
                },1000)

            }else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent) !='' ){
				
                if(!localStorage.getItem('shopper')){
                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }
                globalwpw.initialize=1;
                globalwpw.ai_step=1;
                globalwpw.wildCard=0;
                wpwAction.bot(wpwKits.render(globalwpw.settings.obj.clickintent));

            }else if( typeof(ldsuggestionObject) !=="undefined" ){
				console.log('testdd');
				globalwpw.wildCard = 30;
				wpwAction.bot('from wildcard ldsesson');
			}else{  // re targeting part .
				
				if(globalwpw.settings.obj.skip_wp_greetings==1){
					
					if(globalwpw.settings.obj.re_target_handler==0 && globalwpw.settings.obj.disable_first_msg!=1){
					var botJoinMsg="<strong>"+wpwKits.render(globalwpw.settings.obj.agent)+" </strong> "+wpwKits.randomMsg(globalwpw.settings.obj.agent_join);
					wpwMsg.single(botJoinMsg);
					}

					$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
					localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
					globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					globalwpw.ai_step=1;
					globalwpw.wildCard=0;
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					localStorage.setItem("aiStep", globalwpw.ai_step);
					
					setTimeout(function(){
						var firstMsg=wpwKits.randomMsg(globalwpw.settings.obj.hi_there)+' '+wpwKits.randomMsg(globalwpw.settings.obj.welcome)+" <strong>"+wpwKits.render(globalwpw.settings.obj.host)+"</strong> ";
						var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
						wpwMsg.single(firstMsg);
						
						setTimeout(function(){
							
							wpwMsg.double_nobg(serviceOffer, globalwpw.wildcards);
						}, globalwpw.settings.preLoadingTime);
						
					}, globalwpw.settings.preLoadingTime);
					
				}
				else if(globalwpw.settings.obj.order_login){
					
					
					if(globalwpw.settings.obj.re_target_handler==0 && globalwpw.settings.obj.disable_first_msg!=1){
					var botJoinMsg="<strong>"+wpwKits.render(globalwpw.settings.obj.agent)+" </strong> "+wpwKits.randomMsg(globalwpw.settings.obj.agent_join);
					wpwMsg.single(botJoinMsg);
					}

					$.cookie("shopper", globalwpw.settings.obj.order_user, { expires : 365 });
					localStorage.setItem('shopper',globalwpw.settings.obj.order_user);
					globalwpw.hasNameCookie=globalwpw.settings.obj.order_user;
					globalwpw.ai_step=1;
					globalwpw.wildCard=0;
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					localStorage.setItem("aiStep", globalwpw.ai_step);
					setTimeout(function(){
						var firstMsg=wpwKits.randomMsg(globalwpw.settings.obj.hi_there)+' '+wpwKits.randomMsg(globalwpw.settings.obj.welcome)+" <strong>"+wpwKits.render(globalwpw.settings.obj.host)+"</strong> ";
						wpwMsg.single(firstMsg);
						setTimeout(function(){
							//Greeting with name and suggesting the wildcard.
							var NameGreeting=wpwKits.randomMsg(globalwpw.settings.obj.i_am) +" <strong>"+wpwKits.render(globalwpw.settings.obj.agent)+"</strong>! "+wpwKits.randomMsg(globalwpw.settings.obj.name_greeting);

							//this data should be conditional
							var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
							//After completing two steps messaging showing wildcards.
							
							
							
							//After completing two steps messaging showing wildcards.                                        
							if(globalwpw.settings.obj.show_menu_after_greetings==1){
								wpwMsg.triple_nobg(NameGreeting,serviceOffer, globalwpw.wildcards);
							}else{
								wpwMsg.double(NameGreeting,serviceOffer);
							}
							
							
							globalwpw.ai_step=1;
							globalwpw.wildCard=0;
							localStorage.setItem("wildCard",  globalwpw.wildCard);
							localStorage.setItem("aiStep", globalwpw.ai_step);
						}, globalwpw.settings.preLoadingTime);
					}, globalwpw.settings.preLoadingTime);
					
				}else{
					
					if(wp_chatbot_obj.re_target_handler==0 && globalwpw.settings.obj.disable_first_msg!=1){
					var botJoinMsg="<strong>"+wpwKits.render(globalwpw.settings.obj.agent)+" </strong> "+wpwKits.randomMsg(globalwpw.settings.obj.agent_join);
					wpwMsg.single(botJoinMsg);
					}
					//Showing greeting for name in cookie or fresh shopper.
					setTimeout(function(){
						var firstMsg=wpwKits.randomMsg(globalwpw.settings.obj.hi_there)+' '+wpwKits.randomMsg(globalwpw.settings.obj.welcome)+" <strong>"+wpwKits.render(globalwpw.settings.obj.host)+"</strong> ";
						var secondMsg=wpwKits.randomMsg(globalwpw.settings.obj.asking_name);
						
						wpwMsg.double(firstMsg,secondMsg);
					}, globalwpw.settings.preLoadingTime);
				}
			}
			
        }
    };
    //Append the message to the message container based on the requirement.
    wpwMsg={
        replace_variable: function(msg) {
            if(globalwpw.hasNameCookie){
                var shopper=globalwpw.hasNameCookie;
            } else{
                var shopper=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
            }

            if(msg!='' && typeof msg !=='undefined'){
                return msg.toString().replace("%%username%%", '<strong>'+shopper+'</strong>');
          }
        },
        single:function (msg) {
            wpwKits.playsound();

            //tts code
            var tts_text = wpwKits.removeTags(msg); 
            wpwKits.playAudio(tts_text);
            

            globalwpw.wpwIsWorking=1;
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
            //Scroll to the last message
            wpwKits.scrollTo();
            setTimeout(function(){

               
                var matches = msg.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg|tiff))/i);
                matches = wpwKits.removeDups(matches);
                if(Array.isArray(matches)){
                jQuery.each(matches, function(i, match){
                    if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(match) && !msg.match(/<img/)){
                        msg = msg.replace(match, "<img src='"+match+"' class='wpbot_auto_image' />");
                    }

                })
            }

                msg = wpwMsg.replace_variable( msg );

                $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').html(msg);
                //If has youtube link then show video
                wpwKits.videohandler();
                //scroll to the last message
                wpwKits.scrollTo();
                //Enable the editor
                wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
                //keeping in history
                wpwKits.wpwHistorySave();
            }, globalwpw.settings.preLoadingTime);

        },

        single_nobg:function (msg) {

            wpwKits.playsound();
            //tts code
            
            if(msg.indexOf('qcld_back_to_start') == -1){
                var tts_text = wpwKits.removeTags(msg); 
                wpwKits.playAudio(tts_text);
            }
            

            globalwpw.wpwIsWorking=1;
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
            //Scroll to the last message
            wpwKits.scrollTo();
            setTimeout(function(){

                var matches = msg.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg|tiff))/i);
                matches = wpwKits.removeDups(matches);
                if(Array.isArray(matches)){
                jQuery.each(matches, function(i, match){
                    if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(match) && !msg.match(/<img/)){
                        msg = msg.replace(match, "<img src='"+match+"' class='wpbot_auto_image' />");
                    }

                })
            }

                msg = wpwMsg.replace_variable( msg );

                $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').parent().addClass('wp-chatbot-msg-flat');
                $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').parent().append(msg);
                $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').remove();
                //scroll to the last message
                wpwKits.scrollTo();
                wpwKits.videohandler();
                //Enable the editor
                wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
                //Keeping the chat history in localStorage
                wpwKits.wpwHistorySave();
                // disabled editor
                // wpwKits.disableEditor('Please choose an option.');
            }, globalwpw.settings.preLoadingTime);
        },

        double:function (fristMsg,secondMsg) {

            
            wpwKits.playsound();
            //tts code
            var tts_text = wpwKits.removeTags(fristMsg)+ ' ' +wpwKits.removeTags(secondMsg); 
            wpwKits.playAudio(tts_text);

            globalwpw.wpwIsWorking=1;
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
            //Scroll to the last message
            wpwKits.scrollTo();
			wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
            setTimeout(function(){


                var matches = fristMsg.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg|tiff))/i);
                matches = wpwKits.removeDups(matches);
                if(Array.isArray(matches)){
                jQuery.each(matches, function(i, match){
                    if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(match) && !fristMsg.match(/<img/)){
                        
                        fristMsg = fristMsg.replace(match, "<img src='"+match+"' class='wpbot_auto_image' />");
                    }

                })
            }
            fristMsg = wpwMsg.replace_variable( fristMsg );
                $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').html(fristMsg);
                wpwKits.videohandler();
                //Second Message with interval
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
                //Scroll to the last message
                wpwKits.scrollTo();
                setTimeout(function(){
                    
                    var matches = secondMsg.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg|tiff))/i);
                    matches = wpwKits.removeDups(matches);
                    if(Array.isArray(matches)){
                    jQuery.each(matches, function(i, match){
                        if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(match) && !secondMsg.match(/<img/)){
                            secondMsg = secondMsg.replace(match, "<img src='"+match+"' class='wpbot_auto_image' />");
                        }

                    })
                }
                secondMsg = wpwMsg.replace_variable( secondMsg );
                    $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').html(secondMsg);
                    //Scroll to the last message
                    wpwKits.scrollTo();
                    wpwKits.videohandler();
                    //Enable the editor
                    wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
                    //keeping in history
                    wpwKits.wpwHistorySave();
                }, globalwpw.settings.preLoadingTime);

            }, globalwpw.settings.preLoadingTime);

        },

        triple:function (fristMsg, secondMsg, thirdMsg) {


            wpwKits.playsound();
            //tts code
            var tts_text = wpwKits.removeTags(fristMsg)+ ' ' +wpwKits.removeTags(secondMsg); 
            wpwKits.playAudio(tts_text);
            globalwpw.wpwIsWorking=1;
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
            //Scroll to the last message
            wpwKits.scrollTo();
			wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
            setTimeout(function(){
                var matches = fristMsg.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg|tiff))/i);
                matches = wpwKits.removeDups(matches);
                if(Array.isArray(matches)){
                jQuery.each(matches, function(i, match){
                    if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(match)  && !fristMsg.match(/<img/)){
                        fristMsg = fristMsg.replace(match, "<img src='"+match+"' class='wpbot_auto_image' />");
                    }

                })
            }
            fristMsg = wpwMsg.replace_variable( fristMsg );
                $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').html(fristMsg);
                wpwKits.videohandler();
                //Second Message with interval
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
                //Scroll to the last message
                wpwKits.scrollTo();
                setTimeout(function(){
					var matches = secondMsg.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg|tiff))/i);
                    matches = wpwKits.removeDups(matches);
                    jQuery.each(matches, function(i, match){
                        if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(match) && !secondMsg.match(/<img/)){
                            secondMsg = secondMsg.replace(match, "<img src='"+match+"' class='wpbot_auto_image' />");
                        }

                    })
                    secondMsg = wpwMsg.replace_variable( secondMsg );
                    $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').html(secondMsg);
                    wpwKits.videohandler();

                    if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                        $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                    }
                    //Scroll to the last message
                    wpwKits.scrollTo();
                    
                    //Enable the editor
                    wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
                    //keeping in history
                    //wpwKits.wpwHistorySave();

                    setTimeout(function(){
                        var matches = thirdMsg.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg|tiff))/i);
                        matches = wpwKits.removeDups(matches);
                        if(Array.isArray(matches)){
                        jQuery.each(matches, function(i, match){
                            if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(match) && !thirdMsg.match(/<img/)){
                                thirdMsg = thirdMsg.replace(match, "<img src='"+match+"' class='wpbot_auto_image' />");
                            }
    
                        })
                    }
                    thirdMsg = wpwMsg.replace_variable( thirdMsg );
                        $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').html(thirdMsg);
                        //Scroll to the last message
                        wpwKits.scrollTo();
                        wpwKits.videohandler();
                        //Enable the editor
                        wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));

                        wpwKits.wpwHistorySave();

                    }, globalwpw.settings.preLoadingTime);

                }, globalwpw.settings.preLoadingTime);

            }, globalwpw.settings.preLoadingTime);

        },

        double_nobg:function (fristMsg,secondMsg) {


            wpwKits.playsound();
            //tts code
            var tts_text = wpwKits.removeTags(fristMsg)+' '+wpwKits.removeTags(secondMsg); 
            wpwKits.playAudio(tts_text);
            globalwpw.wpwIsWorking=1;
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
            //Scroll to the last message
            wpwKits.scrollTo();
            setTimeout(function(){

                if (typeof fristMsg === 'string') {

                    var matches = fristMsg.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg|tiff))/i);
                    matches = wpwKits.removeDups(matches);
                    if(Array.isArray(matches)){
                        jQuery.each(matches, function(i, match){
                            if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(match)  && !fristMsg.match(/<img/)){
                                fristMsg = fristMsg.replace(match, "<img src='"+match+"' class='wpbot_auto_image' />");
                            }

                        })
                    }
                }
                fristMsg = wpwMsg.replace_variable( fristMsg );
                $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').html(fristMsg);
                wpwKits.videohandler();
                //Second Message with interval
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
                //Scroll to the last message
                wpwKits.scrollTo();
                setTimeout(function(){

                    var matches = secondMsg.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg|tiff))/i);
                    matches = wpwKits.removeDups(matches);
                    if(Array.isArray(matches)){
                    jQuery.each(matches, function(i, match){
                        if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(match) && !secondMsg.match(/<img/)){
                            secondMsg = secondMsg.replace(match, "<img src='"+match+"' class='wpbot_auto_image' />");
                        }
    
                    })
                }
                secondMsg = wpwMsg.replace_variable( secondMsg );
                    if(globalwpw.wildCard>0){
                        $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').parent().addClass('wp-chatbot-msg-flat').html(secondMsg).append('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                    }else{
                        $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').parent().addClass('wp-chatbot-msg-flat').html(secondMsg);
                    }
                    //scroll to the last message
                    wpwKits.scrollTo();
                    wpwKits.videohandler();
                    //Enable the editor
                    if(globalwpw.wildCard==1 && globalwpw.supportStep=='welcome'){
                        //wpwKits.disableEditor('Support');
                    }else{
                        wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
                    }
                    //keeping in history
                    wpwKits.wpwHistorySave();
                    // disabled editor
                    // wpwKits.disableEditor('Please choose an option.');
                }, globalwpw.settings.preLoadingTime);

            }, globalwpw.settings.preLoadingTime);

        },
        triple_nobg:function (fristMsg,secondMsg,thirdMsg) {
            wpwKits.playsound();
            //tts code
            var tts_text = wpwKits.removeTags(fristMsg)+ ' ' +wpwKits.removeTags(secondMsg); 
            wpwKits.playAudio(tts_text);
            globalwpw.wpwIsWorking=1;
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }

            //Scroll to the last message
            wpwKits.scrollTo();
            setTimeout(function(){
                var matches = fristMsg.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg|tiff))/i);
                matches = wpwKits.removeDups(matches);
                if(Array.isArray(matches)){
                    jQuery.each(matches, function(i, match){
                        if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(match) && !fristMsg.match(/<img/)){
                            fristMsg = fristMsg.replace(match, "<img src='"+match+"' class='wpbot_auto_image' />");
                        }
    
                    })
                }
                fristMsg = wpwMsg.replace_variable( fristMsg );
                $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').html(fristMsg);
                wpwKits.videohandler();
                //Second Message with interval
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
                //Scroll to the last message
                wpwKits.scrollTo();

                setTimeout(function(){
                    var matches = secondMsg.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg|tiff))/i);
                    matches = wpwKits.removeDups(matches);
                    if(Array.isArray(matches)){
                    jQuery.each(matches, function(i, match){
                        if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(match) && !secondMsg.match(/<img/)){
                            secondMsg = secondMsg.replace(match, "<img src='"+match+"' class='wpbot_auto_image' />");
                        }
    
                    })
                }
                secondMsg = wpwMsg.replace_variable( secondMsg );
                    $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').html(secondMsg);
                    wpwKits.videohandler();
                    if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                        $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                    }
                    //Scroll to the last message
                    wpwKits.scrollTo();


                    setTimeout(function(){

                        var matches = thirdMsg.match(/(https?:\/\/.*\.(?:png|jpg|gif|jpeg|tiff))/i);
                        matches = wpwKits.removeDups(matches);
                        if(Array.isArray(matches)){
                        jQuery.each(matches, function(i, match){
                            if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(match) && !thirdMsg.match(/<img/)){
                                thirdMsg = thirdMsg.replace(match, "<img src='"+match+"' class='wpbot_auto_image' />");
                            }
        
                        })
                    }
                    thirdMsg = wpwMsg.replace_variable( thirdMsg );
                        if(globalwpw.wildCard>0){
                            $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').parent().addClass('wp-chatbot-msg-flat').html(thirdMsg).append('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                        }else{
                            $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').parent().addClass('wp-chatbot-msg-flat').html(thirdMsg);
                        }
                        //scroll to the last message
                        wpwKits.scrollTo();
                        wpwKits.videohandler();
                        //Enable the editor
                        if(globalwpw.wildCard==1 && globalwpw.supportStep=='welcome'){
                            //wpwKits.disableEditor('Support');
                        }else{
                            wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
                        }
                        //keeping in history
                        wpwKits.wpwHistorySave();
                        // disabled editor
                        // wpwKits.disableEditor('Please choose an option.');
                    }, globalwpw.settings.preLoadingTime);

                }, globalwpw.settings.preLoadingTime);

                

            }, globalwpw.settings.preLoadingTime);

        },
        shopper:function (shopperMsg) {
            $(globalwpw.settings.messageContainer).append(wpwKits.shopperMsgDom(shopperMsg));
            //scroll to the last message
            wpwKits.scrollTo();
            //keeping in history
            wpwKits.wpwHistorySave();
        },
        shopper_choice:function (shopperChoice) {
            $(globalwpw.settings.messageLastChild).fadeOut(globalwpw.settings.preLoadingTime);
            $(globalwpw.settings.messageContainer).append(wpwKits.shopperMsgDom(shopperChoice));
            //scroll to the last message
            wpwKits.scrollTo();
            //keeping in history
            wpwKits.wpwHistorySave();
        }

    };

    //Every tiny tools are implemented  in wpwKits as object literal.
    wpwKits={
        playAudio: function(tts_text){
            if( globalwpw.settings.obj.voice_addon && globalwpw.settings.obj.bot_read ){
                var data = {'action':'qcld_wp_tts_api_call', 'tts_text':tts_text, 'security':globalwpw.settings.obj.ajax_nonce};
                wpwKits.ajax(data).done(function (response) {
                    botaudiolist.push(response);
                    wpwKits.handleAudio();

                })
            } 
        },
        handleAudio: function(){
            if( botaudiolist.length > 0 && ! botaudioisplay ){
                jQuery('.wpbot_tts_wrapper').html(botaudiolist[0]);
                botaudiolist.shift();
                botaudioisplay = true;
                $('#bot_audio_voice').on('ended', function(){
                    botaudioisplay = false;
                    wpwKits.handleAudio();
                })
            }
            
        },
        removeTags: function(str) {
            if ((str===null) || (str===''))
                return false;
            else
                str = str.toString();
            return str.replace( /(<([^>]+)>)/ig, '');
         },
        render: function( obj ){
            
            if ( typeof(obj) == 'object' &&  obj.hasOwnProperty( globalwpw.settings.obj.language ) ){
                return obj[globalwpw.settings.obj.language];
            }
            if(typeof(obj) == 'object' && ! obj.hasOwnProperty( globalwpw.settings.obj.language )){
                return obj[globalwpw.settings.obj.default_language];
            }
            return obj;
        },
        playsound: function(e){
            if(globalwpw.settings.obj.sound_bot_message==1){
                var promise = document.querySelector('#wp-chatbot-proactive-audio').play();
                if (promise !== undefined) {
                    promise.then(function (success) {
                        //success to play
                    }).catch(function (error) {
                        //some error
                        
                    });
                }
            }
        },
		showtooltip: function(obj){
			var dir = obj.attr("data-tooltip"),
			  left = obj.offset().left,
			  top = obj.offset().top,
			  spanStr = "",
			  ttObj = {},
			  ttdiv = $("#bottooltip > div"),
			  //Getting info of data-title if not title
			  info = (obj.attr("title")!=undefined?obj.attr("title"): obj.attr("data-title"));
			 dir = 'bottom';
		  //Checking which side to put tooltip
		  //and giving css properties accordingly
		  switch (dir){
			case "left":
			  spanStr = "right: -4px; top: 8px;";
			  ttObj.top = top;
			  ttObj.left = left-60;
			  break;
			case "right":
			  spanStr = "left: -4px; top: 8px;";
			  ttObj.top = top;
			  ttObj.left = left+35;
			  break;
			case "top":
			  spanStr = "left: 43%; bottom: -4px;";
			  ttObj.top = top-50;
			  ttObj.left = left-10;
			  break;
			case "bottom":
			  spanStr = "left: 43%; top: -4px;";
			  ttObj.top = top+50;
			  ttObj.left = (left-(obj.width()/2)-32);
			  break;
			default:
			  break;
		  }
		  $("#bottooltip").css({"top":ttObj.top,"left":ttObj.left});
		  $("#bottooltip > span").css("cssText",spanStr);
		  
		  ttdiv.text(info);
		  
		  $("#bottooltip").show();
		},
		
		formatPhoneNumberUS: function(phoneNumberString) {
		  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
		  if(cleaned.length>10){
			  cleaned = cleaned.substring(0,10);
		  }
		  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
		  
		  if (match) {
			return '(' + match[1] + ') ' + match[2] + '-' + match[3]
		  }else{
			  return phoneNumberString;
		  }
		  
		},
        removeDups: function(names) {
            let unique = {};
            
            if(Array.isArray(names)){
                names.forEach(function(i) {
                if(!unique[i]) {
                    unique[i] = true;
                }
                });
                return Object.keys(unique);
            }else{
                return names;
            }
          },

        enableEditor:function(placeHolder){
            if(globalwpw.settings.editor_handler==0){
                if(globalwpw.settings.obj.disable_auto_focus!=1 && !globalwpw.settings.obj.is_mobile){
                    $("#wp-chatbot-editor").attr('disabled',false).focus();
                }
                
                $("#wp-chatbot-editor").attr('disabled',false);
                $("#wp-chatbot-editor").attr('placeholder',placeHolder);
                $("#wp-chatbot-send-message").attr('disabled',false);
            }
        },
        disableEditor:function (placeHolder) {
            if(globalwpw.settings.editor_handler==0){
                $("#wp-chatbot-editor").attr('placeholder',placeHolder);
                $("#wp-chatbot-editor").attr('disabled',true);
                $("#wp-chatbot-send-message").attr('disabled',true);
            }
            //Remove extra pre loader.
            if($('.wp-chatbot-messages-container').find('.wp-chatbot-comment-loader').length>0){
                $('.wp-chatbot-messages-container').find('.wp-chatbot-comment-loader').parent().parent().hide();
            }
        },
		wpwOpenWindow:function (url, title, w, h) {
			// Fixes dual-screen position                         Most browsers      Firefox
			var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
			var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

			var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
			var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

			var left = ((width / 2) - (w / 2)) + dualScreenLeft;
			var top = ((height / 2) - (h / 2)) + dualScreenTop;
			var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

			// Puts focus on the newWindow
			if (window.focus) {
				newWindow.focus();
			}
        },
        htmlEntities:function(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        },
        wpwHistorySave:function () {
            
            globalwpw.wpwIsWorking=0;
            var wpwHistory= $(globalwpw.settings.messageWrapper).html();
            localStorage.setItem("wpwHitory", wpwHistory);
            
            if(localStorage.getItem('botsessionid')){

                if(!localStorage.getItem('shopperemail')){
                    var useremail = '';
                }else{
                    var useremail = localStorage.getItem('shopperemail');
                }

                if(globalwpw.hasNameCookie){
                    var shopper=globalwpw.hasNameCookie;
                } else{
                    var shopper=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                }

                if(localStorage.getItem('shopperphone')){
                    var shopperphone = localStorage.getItem('shopperphone');
                }else{
                    var shopperphone = '';
                }
               
                var data = {'action':'qcld_wb_chatbot_conversation_save','session_id': localStorage.getItem('botsessionid'),'name':shopper,'email':useremail, 'phone':shopperphone, 'conversation':wpwKits.htmlEntities(wpwHistory), 'security':globalwpw.settings.obj.ajax_nonce, 'user_id': globalwpw.settings.obj.current_user_id};
                if(globalwpw.settings.obj.is_chat_session_active){
                    wpwKits.ajax(data).done(function (response) {
                        console.log(response);
                    })
                }
                
            }
        },

        randomMsg:function(arrMsg){


            if ( globalwpw.settings.obj.language in arrMsg ){
                arrMsg = arrMsg[globalwpw.settings.obj.language];
            }

            var index=Math.floor(Math.random() * arrMsg.length);
            
            if(globalwpw.hasNameCookie){
                var shopper=globalwpw.hasNameCookie;
            } else{
                var shopper=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
            }

            if(arrMsg[index]!='' && typeof arrMsg[index] !=='undefined'){
				return arrMsg[index].replace("%%username%%", '<strong>'+shopper+'</strong>');
			}
        },
        ajax:function (data) {
            return jQuery.post(globalwpw.settings.obj.ajax_url, data);

        },
        dailogCXAction: function( text, name, timezone='', languagecode='' ){
            if(!localStorage.getItem('botsessionid')){
                var number = Math.random() // 0.9394456857981651
                number.toString(36); // '0.xtis06h6'
                var id = number.toString(36).substr(2); // 'xtis06h6'
                localStorage.setItem('botsessionid', id);
            } 
            return jQuery.post(globalwpw.settings.obj.ajax_url, {
                'action': 'qcld_wp_df_api_cx',
                'dfquery': text,
                'sessionid': localStorage.getItem('botsessionid')?localStorage.getItem('botsessionid'):'wpwBot_df_2018071',
                'language': globalwpw.settings.obj.language,
                'name' : name,
                'timezone' : timezone,
                'defaultlanguageCode' : languagecode
            });
        },
        dailogAIOAction:function(text){

            if(!localStorage.getItem('botsessionid')){

                var number = Math.random() // 0.9394456857981651
                number.toString(36); // '0.xtis06h6'
                var id = number.toString(36).substr(2); // 'xtis06h6'

                localStorage.setItem('botsessionid', id);
                
            }

            if(globalwpw.settings.obj.df_api_version=='v1'){
                return  jQuery.ajax({
                    type : "POST",
                    url :"https://api.dialogflow.com/v1/query?v=20170712",
                    contentType : "application/json; charset=utf-8",
                    dataType : "json",
                    headers : {
                        "Authorization" : "Bearer "+globalwpw.settings.obj.ai_df_token
                    },
                    
                    data: JSON.stringify( {
                        query: text,
                        
                        lang : globalwpw.settings.obj.df_agent_lan,
                        sessionId: localStorage.getItem('botsessionid')?localStorage.getItem('botsessionid'):'wpwBot_df_2018071'
                    } )
                });
            }else{
                
                return jQuery.post(globalwpw.settings.obj.ajax_url, {
					'action': 'qcld_wp_df_api_call',
                    'dfquery': text,
                    'sessionid': localStorage.getItem('botsessionid')?localStorage.getItem('botsessionid'):'wpwBot_df_2018071',
                    'language': globalwpw.settings.obj.language
                });

            }
            
        },
        responseIsOk:function(response){
            if(globalwpw.settings.obj.df_api_version=='v1'){
                if(response.status.code==200 || response.status.code==206){
                    return true;
                }else{
                    return false;
                }
            }else{
                if(typeof(response.responseId) !== "undefined"){
                    return true;
                }else{
                    return false;
                }
            }
        },
        getIntentName:function(response){
            if(globalwpw.settings.obj.df_api_version=='v1'){
                return response.result.metadata.intentName;
            }else{
				
				if(typeof(response.queryResult.intent)!=="undefined" && typeof(response.queryResult.intent.displayName)!=="undefined"){
                    return response.queryResult.intent.displayName;
                }else{
                    return '';
                }
                
            }
        },
        getParameters:function(response){
            if(globalwpw.settings.obj.df_api_version=='v1'){
                return response.result.parameters;
            }else{
                return response.queryResult.parameters;
            }
            
        },
        getFulfillmentText:function(response){
            if(globalwpw.settings.obj.df_api_version=='v1'){
                return response.result.fulfillment.messages;
            }else{
				if (typeof(response.queryResult.fulfillmentText) === 'undefined') {
					return '';
				}else{
					return response.queryResult.fulfillmentText;
				}
				
            }
            
        },
        getFulfillmentSpeech:function(response){
            if(globalwpw.settings.obj.df_api_version=='v1'){
                return response.result.fulfillment.speech;
            }else{
                if (typeof response.queryResult.fulfillmentText === 'undefined') {
					return '';
				}else{
					return response.queryResult.fulfillmentText;
				}
            }
            
        },
        getScore:function(response){
            if(globalwpw.settings.obj.df_api_version=='v1'){
                return response.result.score;
            }else{
                return response.queryResult.intentDetectionConfidence;
            }
            
        },
        getAction:function(response){
            if(globalwpw.settings.obj.df_api_version=='v1'){
                return response.result.action;
            }else{
                if(typeof response.queryResult.action !=="undefined"){
                    return response.queryResult.action;
                }else{
                    return '';
                }
                
            }
            
        },
        queryText:function(response){
            if(globalwpw.settings.obj.df_api_version=='v1'){
                return response.result.resolvedQuery;
            }else{
                return response.queryResult.queryText;
            }
        },
		
        isActionComplete:function(response){
            if(globalwpw.settings.obj.df_api_version=='v1'){
                if(!response.result.actionIncomplete){
                    return true;
                }else{
                    return false;
                }
            }else{

                return response.queryResult.allRequiredParamsPresent;

            }
            
        },
        isConversationEnd:function(response){
            if(globalwpw.settings.obj.df_api_version=='v1'){
                if(typeof(response.result.metadata.endConversation)!=="undefined" && response.result.metadata.endConversation){
                    return true;
                }else{
                    return false;
                }
            }else{

                if(typeof response.queryResult.diagnosticInfo !=="undefined"){
                    if(typeof response.queryResult.diagnosticInfo.end_conversation !== "undefined"){
                        return response.queryResult.diagnosticInfo.end_conversation;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }

            }
        },
        sugestCat:function () {
            var productSuggest=wpwKits.randomMsg(globalwpw.settings.obj.product_suggest);
            var data={'action':'qcld_wb_chatbot_category'};
            var result=wpwKits.ajax(data);
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
            result.done(function( response ) {
                wpwMsg.double_nobg(productSuggest,response);
                if(globalwpw.settings.obj.ai_df_enable==1 && globalwpw.df_status_lock==0){
                    globalwpw.wildCard=0;
                    globalwpw.ai_step=1;
                    localStorage.setItem("wildCard",  globalwpw.wildCard);
                    localStorage.setItem("aiStep", globalwpw.ai_step);
                }
            });
        },
        subCats:function (parentId) {
            var subCatMsg=wpwKits.randomMsg(globalwpw.settings.obj.product_suggest);
            var data={'action':'qcld_wb_chatbot_sub_category','parent_id':parentId};
            var result=wpwKits.ajax(data);
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
            result.done(function( response ) {
                wpwMsg.double_nobg(subCatMsg,response);
            });
        },
        suggestEmail:function (emailFor) {
            var sugMsg=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
            var sugOptions= globalwpw.wildcards;
            wpwMsg.double_nobg(sugMsg,sugOptions);

        }
        ,
        videohandler:function () {
            $(globalwpw.settings.messageLastChild+' .wp-chatbot-paragraph').html(function(i, html) {
                if(globalwpw.settings.obj.disable_youtube_parse==1){
					return html;
				}else{
                    if( html.indexOf('iframe') < 0 ){
                        return html.replace(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="250" height="180" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');
                    }else{
                        return html;
                    }
				}
            });
        },
        scrollTo:function () {
			
			var totalheight = 0;
			var umh = [];
			$('ul#wp-chatbot-messages-container li:visible').each(function() {
			   totalheight += $(this).outerHeight(true);
			   if($(this).hasClass('wp-chat-user-msg')){
                   umh.push(totalheight);
                }
			});
			if(umh.length>0){
                var scrollto = parseFloat(umh[umh.length-1]);
			}else{
                var scrollto = $(globalwpw.settings.messageWrapper).prop("scrollHeight");
			}
			if(globalwpw.settings.obj.always_scroll_to_bottom==1){
                
                $(globalwpw.settings.botContainer).animate({ scrollTop: $(globalwpw.settings.messageWrapper).prop("scrollHeight")}, 'slow').parent().find('.slimScrollBar').css({'top':$(globalwpw.settings.botContainer).height()+'px'});
				
			}else{
				$(globalwpw.settings.botContainer).animate({ scrollTop: scrollto}, 'slow');
				setTimeout(function(){
					$(globalwpw.settings.botContainer).slimScroll({ scrollTo : scrollto + 'px' });
				},1000);
			}
			
        },
        botPreloader:function () {
            var typing_animation = globalwpw.settings.obj.image_path+'comment.gif';

            if(globalwpw.settings.obj.template=='template-06' || globalwpw.settings.obj.template=='template-07'){
                typing_animation = globalwpw.settings.obj.image_path+'loader.gif';
            }

            if(globalwpw.settings.obj.typing_animation!=''){
                typing_animation  = globalwpw.settings.obj.typing_animation;
            }

            var msgContent='<li class="wp-chatbot-msg" role="alert">' +
                '<div class="wp-chatbot-avatar">'+
                '<img src="'+globalwpw.settings.obj.agent_image_path+'" alt="">'+
                '</div>'+
                '<div class="wp-chatbot-agent">'+ wpwKits.render(globalwpw.settings.obj.agent)+'</div>'
                +'<div class="wp-chatbot-paragraph"><img class="wp-chatbot-comment-loader" src="'+typing_animation+'" alt="Typing..." /></div></li>';
            return msgContent;
        },
        shopperMsgDom:function (msg) {
            if(globalwpw.hasNameCookie){
                var shopper=globalwpw.hasNameCookie;
            } else{
                var shopper=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
            }

            var client_image = globalwpw.settings.obj.client_image;
            if(client_image==''){
                client_image = globalwpw.settings.obj.image_path+'client.png';
            }

            var msgContent='<li class="wp-chat-user-msg">' +
                '<div class="wp-chatbot-avatar">'+
                '<img src="'+client_image+'" alt="">'+
                '</div>'+
                '<div class="wp-chatbot-agent">'+shopper +'</div>'
                +'<div class="wp-chatbot-paragraph">'+msg+'</div></li>';
            return msgContent;
        },
        showCart:function () {
            var data = {'action':'qcld_wb_chatbot_show_cart'}
            this.ajax(data).done(function (response) {
                //if cart show on message board
                if($('#wp-chatbot-shortcode-template-container').length == 0) {
                    $(globalwpw.settings.messageWrapper).html(response.html);
                    $('#wp-chatbot-cart-numbers').html(response.items);
                    $('.wp-chatbot-ball-cart-items').html(response.items);
                    wpwKits.disableEditor(wpwKits.randomMsg(globalwpw.settings.obj.shopping_cart));
                }else{  //Cart show on shortcode
                    $('.wp-chatbot-cart-shortcode-container').html(response.html);

                }
                //Add scroll to the cart shortcode
                if($('#wp-chatbot-shortcode-template-container').length > 0  && $('.chatbot-shortcode-template-02').length==0) {
                    $('.wp-chatbot-cart-body').slimScroll({height: '200px', start: 'bottom'});
                }
            });
        },
        toTitlecase:function (msg) {
            return msg.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        },
        filterStopWords:function(msg){
            var spcialStopWords=",;,/,\\,[,],{,},(,),&,*,.,+ ,?,^,$,=,!,<,>,|,:,-";
            var userMsg="";
            //Removing Special Characts from last position.
            var msgLastChar=msg.slice(-1);
            if(spcialStopWords.indexOf(msgLastChar) >= 0 ){
                userMsg=msg.slice(0, -1);
            }else{
                userMsg=msg;
            }
            var stopWords=globalwpw.settings.obj.stop_words+spcialStopWords;
            var stopWordsArr=stopWords.split(',');
            var msgArr=userMsg.split(' ');
            var filtermsgArr = msgArr.filter(function myCallBack(el){
                return stopWordsArr.indexOf(el.toLowerCase()) < 0;
            });
            var filterMsg=filtermsgArr.join(' ');
            return filterMsg;
        },
		htmlTagsScape:function(userString) {
           var tagsToReplace = {
               '&': '&amp;',
               '<': '&lt;',
               '>': '&gt;'
           };
           return userString.replace(/[&<>]/g, function(tag) {
               return tagsToReplace[tag] || tag;
           });
       },
       updateGlobalMenu:function(){

            if(globalwpw.settings.obj.woocommerce){
                globalwpw.wildcardsHelp=[wpwKits.render(globalwpw.settings.obj.sys_key_help).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_support).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_reset).toLowerCase(), wpwKits.render(globalwpw.settings.obj.email_subscription).toLowerCase(), wpwKits.render(globalwpw.settings.obj.unsubscribe).toLowerCase(), wpwKits.render(globalwpw.settings.obj.sys_key_livechat).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_product).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_catalog).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_order).toLowerCase() ]
                if(globalwpw.settings.obj.ticket_url!='' && globalwpw.settings.obj.disable_open_ticket==""){
                    globalwpw.wildcardsHelp.push(wpwKits.render(globalwpw.settings.obj.open_a_ticket).toLowerCase())
                }
                
            }else{
                globalwpw.wildcardsHelp=[wpwKits.render(globalwpw.settings.obj.sys_key_help).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_support).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_reset).toLowerCase(), wpwKits.render(globalwpw.settings.obj.email_subscription).toLowerCase(), wpwKits.render(globalwpw.settings.obj.unsubscribe).toLowerCase(), wpwKits.render(globalwpw.settings.obj.sys_key_livechat).toLowerCase() ]
                if(globalwpw.settings.obj.ticket_url!='' && globalwpw.settings.obj.disable_open_ticket==""){
                    globalwpw.wildcardsHelp.push(wpwKits.render(globalwpw.settings.obj.open_a_ticket).toLowerCase())
                }
            }
            //updating wildcards
            globalwpw.wildcards='';

            //Adding custom Intents
            
            if(globalwpw.settings.obj.start_menu!=''){
                globalwpw.wildcards = wpwKits.render(globalwpw.settings.obj.start_menu);
            }else{
            
            
            
            if(globalwpw.settings.obj.disable_livechat=="" && globalwpw.settings.obj.is_livechat_active) {
                
                if(globalwpw.settings.obj.disable_livechat_operator_offline==1){
                    if(globalwpw.settings.obj.is_operator_online==1){
                        globalwpw.wildcards += '<span class="qcld-chatbot-custom-intent" data-text="'+wpwKits.render(globalwpw.settings.obj.sys_key_livechat)+'" >'+wpwKits.render(globalwpw.settings.obj.livechat_label)+'</span>';
                    }
                }else{
                    globalwpw.wildcards += '<span class="qcld-chatbot-custom-intent" data-text="'+wpwKits.render(globalwpw.settings.obj.sys_key_livechat)+'" >'+wpwKits.render(globalwpw.settings.obj.livechat_label)+'</span>';
                }
                
            }
            
            if(globalwpw.settings.obj.disable_email_subscription=="") {
                globalwpw.wildcards += '<span class="qcld-chatbot-default wpbd_subscription">' + wpwKits.render(globalwpw.settings.obj.email_subscription) + '</span>';
            }
            
            if(globalwpw.settings.obj.disable_str_categories=="") {
                globalwpw.wildcards += '<span class="qcld-chatbot-wildcard wpbd_str_categories">' + wpwKits.render(globalwpw.settings.obj.str_categories) + '</span>';
            }
            
            if(globalwpw.settings.obj.custom_intent[0]!='' && globalwpw.settings.obj.ai_df_enable==1){
                
                for(var i=0;i<globalwpw.settings.obj.custom_intent.length;i++){
                    
                    if(globalwpw.settings.obj.custom_intent[i]!='' && globalwpw.settings.obj.custom_intent_label[i]!=''){
                        globalwpw.wildcards += '<span class="qcld-chatbot-custom-intent" data-text="'+globalwpw.settings.obj.custom_intent_label[i]+'" >'+globalwpw.settings.obj.custom_intent_label[i]+'</span>';
                    }
                    
                }
                
            }
            
            if(globalwpw.settings.obj.custom_menu[0]!=''){
                
                for(var i=0;i<globalwpw.settings.obj.custom_menu.length;i++){
                    
                    if(globalwpw.settings.obj.custom_menu[i]!='' && globalwpw.settings.obj.custom_menu_link[i]!=''){
                        globalwpw.wildcards += '<span class="qcld-chatbot-wildcard qcld-chatbot-buttonlink" data-link="'+globalwpw.settings.obj.custom_menu_link[i]+'" data-target="'+globalwpw.settings.obj.custom_menu_target[i]+'" data-type="'+globalwpw.settings.obj.custom_menu_type[i]+'" >'+globalwpw.settings.obj.custom_menu[i]+'</span>';
                    }
                    
                }
                
            }

            if(globalwpw.settings.obj.livechat=='1' && !globalwpw.settings.obj.is_livechat_active) {
                console.log(dsad);
                globalwpw.wildcards += '<span class="qcld-chatbot-default wpbo_live_chat" >'+wpwKits.render(globalwpw.settings.obj.livechat_button_label)+'</span>';
            }
            if(globalwpw.settings.obj.woocommerce){
                if(globalwpw.settings.obj.disable_product_search!=1) {
                    globalwpw.wildcards += '<span class="qcld-chatbot-wildcard"  data-wildcart="product">' + wpwKits.randomMsg(globalwpw.settings.obj.wildcard_product) + '</span>';
                }
                if(globalwpw.settings.obj.disable_catalog!=1) {
                    globalwpw.wildcards += '<span class="qcld-chatbot-wildcard"  data-wildcart="catalog">' + wpwKits.randomMsg(globalwpw.settings.obj.wildcard_catalog) + '</span>';
                }
                if(globalwpw.settings.obj.disable_featured_product!=1){
                    globalwpw.wildcards+='<span class="qcld-chatbot-wildcard"  data-wildcart="featured">'+wpwKits.randomMsg(globalwpw.settings.obj.featured_products)+'</span>';
                }
            
                if(globalwpw.settings.obj.disable_sale_product!=1){
                    globalwpw.wildcards+='<span class="qcld-chatbot-wildcard"  data-wildcart="sale">'+wpwKits.randomMsg(globalwpw.settings.obj.sale_products)+' </span>';
                }
            
                if(globalwpw.settings.obj.disable_order_status!=1){
                    globalwpw.wildcards+='<span class="qcld-chatbot-wildcard"  data-wildcart="order">'+wpwKits.randomMsg(globalwpw.settings.obj.wildcard_order)+'</span>';
                }
            }
            
            
            if(globalwpw.settings.obj.disable_sitesearch=='') {
                globalwpw.wildcards += '<span class="qcld-chatbot-site-search" >'+wpwKits.render(globalwpw.settings.obj.site_search)+'</span>';
            }
            
            if(globalwpw.settings.obj.disable_faq=='') {
                globalwpw.wildcards+='<span class="qcld-chatbot-wildcard"  data-wildcart="support">'+wpwKits.render(globalwpw.settings.obj.wildcard_support)+'</span>';
            }
            
            
            if(globalwpw.settings.obj.enable_messenger==1) {
                globalwpw.wildcards += '<span class="qcld-chatbot-wildcard"  data-wildcart="messenger">'+wpwKits.randomMsg(globalwpw.settings.obj.messenger_label)+'</span>';
            }
            if(globalwpw.settings.obj.enable_whats==1) {
                globalwpw.wildcards += '<span class="qcld-chatbot-wildcard"  data-wildcart="whatsapp">'+wpwKits.randomMsg(globalwpw.settings.obj.whats_label)+'</span>';
            }
            
            if(globalwpw.settings.obj.disable_feedback=='') {
                globalwpw.wildcards += '<span class="qcld-chatbot-suggest-email">'+wpwKits.render(globalwpw.settings.obj.send_us_email)+'</span>';
            }
            if(globalwpw.settings.obj.disable_leave_feedback=='') {
                globalwpw.wildcards += '<span class="qcld-chatbot-suggest-email wpbd_feedback">'+wpwKits.render(globalwpw.settings.obj.leave_feedback)+'</span>';
            }
            
            if(globalwpw.settings.obj.call_gen=="") {
                globalwpw.wildcards += '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
            }
            
            if(globalwpw.settings.obj.form_ids[0]!=''){
                    
                for(var i=0;i<globalwpw.settings.obj.form_ids.length;i++){
                    
                    if(globalwpw.settings.obj.form_ids[i]!='' && globalwpw.settings.obj.forms[i]!=''){
                        globalwpw.wildcards += '<span class="qcld-chatbot-wildcard qcld-chatbot-form" data-form="'+globalwpw.settings.obj.form_ids[i]+'" >'+globalwpw.settings.obj.forms[i]+'</span>';
                    }
                    
                }
                
            }

       }
    }
    }
    /*
     * wpwbot Trees are basically product,order and support
     * product tree : asking,showing & shopping part will be covered.
     * order tree : showing order list and email to admin option.
     * support tree : List of support query-answer including text & video and email to admin option.
     */
    wpwTree={

        greeting:function (msg) {
			
            /**
             * When Enable DialogFlow then  or else
             */

            if(globalwpw.settings.obj.ai_df_enable==1 && globalwpw.df_status_lock==0){
				console.log('hello world', globalwpw.initialize, localStorage.getItem('shopper'), globalwpw.wildCard, globalwpw.ai_step );
                //When intialize 1 and don't have cookies then keep  the name of shooper in in cookie
				if(globalwpw.initialize==1 && !localStorage.getItem('shopper')  && globalwpw.wildCard==0 && globalwpw.ai_step==0 ){
                        
						var main_text = msg;
						msg=wpwKits.toTitlecase(msg);
						
						if(globalwpw.settings.obj.ask_name_confirmation!='' && localStorage.getItem('shoppername_recognized')){
						
							if(main_text=='yes'){
								var fullname = localStorage.getItem('shoppername_recognized');
								globalwpw.settings.obj.ask_name_confirmation = '';
								localStorage.removeItem('shoppername_recognized')
 
                                $.cookie("shopper", fullname, { expires : 365 });
                                localStorage.setItem('shopper',fullname);
                                globalwpw.hasNameCookie=fullname;
                                //Greeting with name and suggesting the wildcard.
                                var NameGreeting=wpwKits.randomMsg(globalwpw.settings.obj.i_am) +" <strong>"+wpwKits.render(globalwpw.settings.obj.agent)+"</strong>! "+wpwKits.randomMsg(globalwpw.settings.obj.name_greeting);
                                if(globalwpw.settings.obj.ask_email_wp_greetings==1){
                                    var emailsharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_emailaddress);
                                    if(globalwpw.settings.obj.enable_gdpr){
                                        wpwMsg.triple_nobg(NameGreeting, emailsharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                    }else{
                                        wpwMsg.double(NameGreeting, emailsharetext);
                                    }
                                    
                                }else if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
                                    var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                                    if(globalwpw.settings.obj.enable_gdpr){
                                        wpwMsg.triple_nobg(NameGreeting, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                    }else{
                                        wpwMsg.double(NameGreeting, phonesharetext);
                                    }
                                }else{
                                    
                                    //this data should be conditional
                                    var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                                    //After completing two steps messaging showing wildcards.                                        
                                    if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                        wpwMsg.triple_nobg(NameGreeting,serviceOffer, globalwpw.wildcards);
                                    }else{
                                        wpwMsg.double(NameGreeting,serviceOffer);
                                    }										
                                    globalwpw.ai_step=1;
                                    globalwpw.wildCard=0;
                                    localStorage.setItem("wildCard",  globalwpw.wildCard);
                                    localStorage.setItem("aiStep", globalwpw.ai_step);
                                    
                                }

							}else{
								localStorage.removeItem('shoppername_recognized')
								wpwMsg.single(wpwKits.randomMsg(globalwpw.settings.obj.asking_name));
							}
							
						}else if(globalwpw.settings.obj.ask_name_confirmation!='' || globalwpw.settings.obj.ask_name_confirmation==''){
						
						var dfReturns=wpwKits.dailogAIOAction(msg);
						if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                            $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                        }
                        
						dfReturns.done(function( response ) {

                            if(globalwpw.settings.obj.df_api_version=='v2'){
                                response = $.parseJSON(response);
                            }
                            
                           
                            
							if(wpwKits.responseIsOk(response)){
                                var intent = wpwKits.getIntentName(response);
                                
                                
								
								if(intent=="get name"){
									
									var given_name = wpwKits.getParameters(response).given_name;
									var last_name = wpwKits.getParameters(response).last_name;
									var fullname = given_name+' '+last_name;
									if(fullname.length<2){
										fullname = msg
									}
									
									if(globalwpw.settings.obj.ask_name_confirmation==''){
										

										$.cookie("shopper", fullname, { expires : 365 });
										localStorage.setItem('shopper',fullname);
										globalwpw.hasNameCookie=fullname;
										//Greeting with name and suggesting the wildcard.
										var NameGreeting=wpwKits.randomMsg(globalwpw.settings.obj.i_am) +" <strong>"+wpwKits.render(globalwpw.settings.obj.agent)+"</strong>! "+wpwKits.randomMsg(globalwpw.settings.obj.name_greeting);
										if(globalwpw.settings.obj.ask_email_wp_greetings==1){
											var emailsharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_emailaddress);
											if(globalwpw.settings.obj.enable_gdpr){
												wpwMsg.triple_nobg(NameGreeting, emailsharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
											}else{
												wpwMsg.double(NameGreeting, emailsharetext);
											}
											
										}else if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
											var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
											if(globalwpw.settings.obj.enable_gdpr){
												wpwMsg.triple_nobg(NameGreeting, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
											}else{
												wpwMsg.double(NameGreeting, phonesharetext);
											}
										}else{
											
											//this data should be conditional
											var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
											//After completing two steps messaging showing wildcards.                                        
											if(globalwpw.settings.obj.show_menu_after_greetings==1){
												wpwMsg.triple_nobg(NameGreeting,serviceOffer, globalwpw.wildcards);
											}else{
												wpwMsg.double(NameGreeting,serviceOffer);
											}										
											globalwpw.ai_step=1;
											globalwpw.wildCard=0;
											localStorage.setItem("wildCard",  globalwpw.wildCard);
											localStorage.setItem("aiStep", globalwpw.ai_step);
											
										}
									}else{
										
										var arrMsg = globalwpw.settings.obj.i_understand[globalwpw.settings.obj.language];
										var i_understand = '';
										var index=Math.floor(Math.random() * arrMsg.length);
										if(arrMsg[index]!='' && typeof arrMsg[index] !=='undefined'){
											i_understand = arrMsg[index].replace("%%username%%", '<strong>'+fullname+'</strong>');
										}
										localStorage.setItem('shoppername_recognized',fullname);
										var confirmBtn='<span class="qcld-chat-common qcld-name-confirm" data-res="yes" >'+wpwKits.render(globalwpw.settings.obj.yes)+'</span> <span> '+wpwKits.render(globalwpw.settings.obj.or)+' </span><span class="qcld-chat-common qcld-name-confirm"  data-res="no">'+wpwKits.render(globalwpw.settings.obj.no)+'</span>';
										wpwMsg.double_nobg(i_understand, confirmBtn);
										
										
									}

								}else if(intent=='Default Fallback Intent'){
                                    
                                    
                                    var filterMsg=wpwKits.filterStopWords(msg);
                                    
                                    if(filterMsg!=''){
										
										if(globalwpw.settings.obj.ask_name_confirmation==''){

											$.cookie("shopper", filterMsg, { expires : 365 });
											localStorage.setItem('shopper',filterMsg);
											globalwpw.hasNameCookie=filterMsg;

											var NameGreeting=wpwKits.randomMsg(globalwpw.settings.obj.i_am) +" <strong>"+wpwKits.render(globalwpw.settings.obj.agent)+"</strong>! "+wpwKits.randomMsg(globalwpw.settings.obj.name_greeting);
											if(globalwpw.settings.obj.ask_email_wp_greetings==1){
												var emailsharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_emailaddress);
												if(globalwpw.settings.obj.enable_gdpr){
													wpwMsg.triple(NameGreeting, emailsharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
												}else{
													wpwMsg.double(NameGreeting, emailsharetext);
												}
												
											}else if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
												var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
												if(globalwpw.settings.obj.enable_gdpr){
													wpwMsg.triple_nobg(NameGreeting, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
												}else{
													wpwMsg.double(NameGreeting, phonesharetext);
												}
											}else{
												
												//this data should be conditional
												var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
												//After completing two steps messaging showing wildcards.
												if(globalwpw.settings.obj.show_menu_after_greetings==1){
													wpwMsg.triple_nobg(NameGreeting,serviceOffer, globalwpw.wildcards);
												}else{
													wpwMsg.double(NameGreeting,serviceOffer);
												}
												
												
												globalwpw.ai_step=1;
												globalwpw.wildCard=0;
												localStorage.setItem("wildCard",  globalwpw.wildCard);
												localStorage.setItem("aiStep", globalwpw.ai_step);
												
											}
										}else{
											
											var arrMsg = globalwpw.settings.obj.i_understand[globalwpw.settings.obj.language];
											var i_understand = '';
											var index=Math.floor(Math.random() * arrMsg.length);
											if(arrMsg[index]!='' && typeof arrMsg[index] !=='undefined'){
												i_understand = arrMsg[index].replace("%%username%%", '<strong>'+filterMsg+'</strong>');
											}
											localStorage.setItem('shoppername_recognized',filterMsg);
											var confirmBtn='<span class="qcld-chat-common qcld-name-confirm" data-res="yes" >'+wpwKits.render(globalwpw.settings.obj.yes)+'</span> <span> '+wpwKits.render(globalwpw.settings.obj.or)+' </span><span class="qcld-chat-common qcld-name-confirm"  data-res="no">'+wpwKits.render(globalwpw.settings.obj.no)+'</span>';
											wpwMsg.double_nobg(i_understand, confirmBtn);
											
										}
										
                                    }else{
                                        $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                                        localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                                        globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                                        globalwpw.ai_step=1;
                                        globalwpw.wildCard=0;
                                        localStorage.setItem("wildCard",  globalwpw.wildCard);
                                        localStorage.setItem("aiStep", globalwpw.ai_step);
                                        var NameGreeting=wpwKits.render(globalwpw.settings.obj.shopper_call_you)+' '+wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                                        if(globalwpw.settings.obj.ask_email_wp_greetings==1){
                                            var emailsharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_emailaddress);
                                            if(globalwpw.settings.obj.enable_gdpr){
                                                wpwMsg.triple(NameGreeting, emailsharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                            }else{
                                                wpwMsg.double(NameGreeting, emailsharetext);
                                            }
                                            
                                        }else if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
                                            var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                                            if(globalwpw.settings.obj.enable_gdpr){
                                                wpwMsg.triple_nobg(NameGreeting, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                            }else{
                                                wpwMsg.double(NameGreeting, phonesharetext);
                                            }
                                        }else{
                                            //this data should be conditional
                                            var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                                            //After completing two steps messaging showing wildcards.
                                            if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                                wpwMsg.triple_nobg(NameGreeting,serviceOffer, globalwpw.wildcards);
                                            }else{
                                                wpwMsg.double(NameGreeting,serviceOffer);
                                            }

                                            
                                            globalwpw.ai_step=1;
                                            globalwpw.wildCard=0;
                                            localStorage.setItem("wildCard",  globalwpw.wildCard);
                                            localStorage.setItem("aiStep", globalwpw.ai_step);
                                            
                                        }


                                    }
									
									
								}else{
                                    
                                    if(wpwKits.getFulfillmentSpeech(response)!=''){
                                        var secondMsg=wpwKits.randomMsg(globalwpw.settings.obj.asking_name);

										wpwMsg.double(wpwKits.getFulfillmentSpeech(response),secondMsg);
                                    }else{

                                        var filterMsg=wpwKits.filterStopWords(msg);
                                        if( msg.length === 1 ){
                                            var filterMsg=msg;
                                        }
                                        if(filterMsg!=''){
                                            $.cookie("shopper", filterMsg, { expires : 365 });
                                            localStorage.setItem('shopper',filterMsg);
                                            globalwpw.hasNameCookie=filterMsg;
                                            var NameGreeting=wpwKits.randomMsg(globalwpw.settings.obj.i_am) +" <strong>"+wpwKits.render(globalwpw.settings.obj.agent)+"</strong>! "+wpwKits.randomMsg(globalwpw.settings.obj.name_greeting);
                                            if(globalwpw.settings.obj.ask_email_wp_greetings==1){
                                                var emailsharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_emailaddress);
                                                if(globalwpw.settings.obj.enable_gdpr){
                                                    wpwMsg.triple(NameGreeting, emailsharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                                }else{
                                                    wpwMsg.double(NameGreeting, emailsharetext);
                                                }
                                                
                                            }else if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
                                                var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                                                if(globalwpw.settings.obj.enable_gdpr){
                                                    wpwMsg.triple_nobg(NameGreeting, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                                }else{
                                                    wpwMsg.double(NameGreeting, phonesharetext);
                                                }
                                            }else{
                                                
                                                //this data should be conditional
                                                var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                                                //After completing two steps messaging showing wildcards.
                                                if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                                    wpwMsg.triple_nobg(NameGreeting,serviceOffer, globalwpw.wildcards);
                                                }else{
                                                    wpwMsg.double(NameGreeting,serviceOffer);
                                                }
                                                
                                                globalwpw.ai_step=1;
                                                globalwpw.wildCard=0;
                                                localStorage.setItem("wildCard",  globalwpw.wildCard);
                                                localStorage.setItem("aiStep", globalwpw.ai_step);
                                                
                                            }
                                        }else{
    
                                            $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                                            localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                                            globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                                            globalwpw.ai_step=1;
                                            globalwpw.wildCard=0;
                                            localStorage.setItem("wildCard",  globalwpw.wildCard);
                                            localStorage.setItem("aiStep", globalwpw.ai_step);
                                            var NameGreeting=wpwKits.render(globalwpw.settings.obj.shopper_call_you)+' '+wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                                            if(globalwpw.settings.obj.ask_email_wp_greetings==1){
                                                var emailsharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_emailaddress);
                                                if(globalwpw.settings.obj.enable_gdpr){
                                                    wpwMsg.triple(NameGreeting, emailsharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                                }else{
                                                    wpwMsg.double(NameGreeting, emailsharetext);
                                                }
                                                
                                            }else if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
                                                var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                                                if(globalwpw.settings.obj.enable_gdpr){
                                                    wpwMsg.triple_nobg(NameGreeting, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                                }else{
                                                    wpwMsg.double(NameGreeting, phonesharetext);
                                                }
                                            }else{
                                                //this data should be conditional
                                                var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                                                //After completing two steps messaging showing wildcards.
                                                if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                                    wpwMsg.triple_nobg(NameGreeting,serviceOffer, globalwpw.wildcards);
                                                }else{
                                                    wpwMsg.double(NameGreeting,serviceOffer);
                                                }
                                                
                                                globalwpw.ai_step=1;
                                                globalwpw.wildCard=0;
                                                localStorage.setItem("wildCard",  globalwpw.wildCard);
                                                localStorage.setItem("aiStep", globalwpw.ai_step);
                                                
                                            }
                                        }

                                    }
                                    
                                   
								}
							}else{
                                //if bad request or limit cross then
                                //globalwpw.df_status_lock=0;
                                var filterMsg=wpwKits.filterStopWords(msg);
                                if( msg.length === 1 ){
                                    var filterMsg=msg;
                                }  
                                if(filterMsg!=''){
                                    
                                    if(globalwpw.settings.obj.ask_name_confirmation==''){

                                        $.cookie("shopper", filterMsg, { expires : 365 });
                                        localStorage.setItem('shopper',filterMsg);
                                        globalwpw.hasNameCookie=filterMsg;

                                        var NameGreeting=wpwKits.randomMsg(globalwpw.settings.obj.i_am) +" <strong>"+wpwKits.render(globalwpw.settings.obj.agent)+"</strong>! "+wpwKits.randomMsg(globalwpw.settings.obj.name_greeting);
                                        if(globalwpw.settings.obj.ask_email_wp_greetings==1){
                                            var emailsharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_emailaddress);
                                            if(globalwpw.settings.obj.enable_gdpr){
                                                wpwMsg.triple(NameGreeting, emailsharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                            }else{
                                                wpwMsg.double(NameGreeting, emailsharetext);
                                            }
                                            
                                        }else if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
                                            var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                                            if(globalwpw.settings.obj.enable_gdpr){
                                                wpwMsg.triple_nobg(NameGreeting, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                            }else{
                                                wpwMsg.double(NameGreeting, phonesharetext);
                                            }
                                        }else{
                                            
                                            //this data should be conditional
                                            var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                                            //After completing two steps messaging showing wildcards.
                                            if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                                wpwMsg.triple_nobg(NameGreeting,serviceOffer, globalwpw.wildcards);
                                            }else{
                                                wpwMsg.double(NameGreeting,serviceOffer);
                                            }
                                            
                                            
                                            globalwpw.ai_step=1;
                                            globalwpw.wildCard=0;
                                            localStorage.setItem("wildCard",  globalwpw.wildCard);
                                            localStorage.setItem("aiStep", globalwpw.ai_step);
                                            
                                        }
                                    }else{
                                        
                                        var arrMsg = globalwpw.settings.obj.i_understand[globalwpw.settings.obj.language];
                                        var i_understand = '';
                                        var index=Math.floor(Math.random() * arrMsg.length);
                                        if(arrMsg[index]!='' && typeof arrMsg[index] !=='undefined'){
                                            i_understand = arrMsg[index].replace("%%username%%", '<strong>'+filterMsg+'</strong>');
                                        }
                                        localStorage.setItem('shoppername_recognized',filterMsg);
                                        var confirmBtn='<span class="qcld-chat-common qcld-name-confirm" data-res="yes" >'+wpwKits.render(globalwpw.settings.obj.yes)+'</span> <span> '+wpwKits.render(globalwpw.settings.obj.or)+' </span><span class="qcld-chat-common qcld-name-confirm"  data-res="no">'+wpwKits.render(globalwpw.settings.obj.no)+'</span>';
                                        wpwMsg.double_nobg(i_understand, confirmBtn);
                                        
                                    }
                                    
                                }else{
                                    $.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
                                    localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
                                    globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                                    globalwpw.ai_step=1;
                                    globalwpw.wildCard=0;
                                    localStorage.setItem("wildCard",  globalwpw.wildCard);
                                    localStorage.setItem("aiStep", globalwpw.ai_step);
                                    var NameGreeting=wpwKits.render(globalwpw.settings.obj.shopper_call_you)+' '+wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
                                    if(globalwpw.settings.obj.ask_email_wp_greetings==1){
                                        var emailsharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_emailaddress);
                                        if(globalwpw.settings.obj.enable_gdpr){
                                            wpwMsg.triple(NameGreeting, emailsharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                        }else{
                                            wpwMsg.double(NameGreeting, emailsharetext);
                                        }
                                        
                                    }else if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
                                        var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                                        if(globalwpw.settings.obj.enable_gdpr){
                                            wpwMsg.triple_nobg(NameGreeting, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                        }else{
                                            wpwMsg.double(NameGreeting, phonesharetext);
                                        }
                                    }else{
                                        //this data should be conditional
                                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                                        //After completing two steps messaging showing wildcards.
                                        if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                            wpwMsg.triple_nobg(NameGreeting,serviceOffer, globalwpw.wildcards);
                                        }else{
                                            wpwMsg.double(NameGreeting,serviceOffer);
                                        }

                                        
                                        globalwpw.ai_step=1;
                                        globalwpw.wildCard=0;
                                        localStorage.setItem("wildCard",  globalwpw.wildCard);
                                        localStorage.setItem("aiStep", globalwpw.ai_step);
                                        
                                    }


                                }
                            }
						})
					}
                }
                //When returning shopper then greeting with name and wildcards.
                else if(localStorage.getItem('shopper')  && globalwpw.wildCard==0 && globalwpw.ai_step==0){
					if(globalwpw.settings.obj.ask_email_wp_greetings==1 && !localStorage.getItem('shopperemail')){
                        var dfReturns=wpwKits.dailogAIOAction(msg);
                        if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                            $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                        }
						dfReturns.done(function( response ) {
                            if(globalwpw.settings.obj.df_api_version=='v2'){
                                response = $.parseJSON(response);
                            }
							if(wpwKits.responseIsOk(response)){
								var intent = wpwKits.getIntentName(response);
								if(intent=="get email"){
									var email = wpwKits.getParameters(response).email;
									$.cookie("shopperemail", email, { expires : 365 });
									localStorage.setItem('shopperemail',email);
									if(email!=''){
										var data = {'action':'qcld_wb_chatbot_email_subscription','name':localStorage.getItem('shopper'),'email':email, 'url':window.location.href};

										wpwKits.ajax(data).done(function (response) {
											//response.
										})
									}
									var emailgreetings = wpwKits.randomMsg(globalwpw.settings.obj.got_email);
									var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                                    //After completing two steps messaging showing wildcards.
                                    

                                    if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
                                        var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                                        if(globalwpw.settings.obj.enable_gdpr){
                                            wpwMsg.triple_nobg(emailgreetings, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                        }else{
                                            wpwMsg.double(emailgreetings, phonesharetext);
                                        }
                                    }else{
                                        if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                            wpwMsg.triple_nobg(emailgreetings,serviceOffer, globalwpw.wildcards);
                                        }else{
                                            wpwMsg.double(emailgreetings,serviceOffer);
                                        }
                                        
                                        
                                        globalwpw.ai_step=1;
                                        globalwpw.wildCard=0;
                                        localStorage.setItem("wildCard",  globalwpw.wildCard);
                                        localStorage.setItem("aiStep", globalwpw.ai_step);
                                    }

                                    
									
                                }
                                else{

                                    
                                    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                                    if( re.test(msg)!=true){
                                        //After asking service show the wildcards.
                                        var noemailtext = wpwKits.randomMsg(globalwpw.settings.obj.email_ignore);
                                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);                                        
                                        localStorage.setItem('shopperemail','no');
                                        if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
                                            var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                                            if(globalwpw.settings.obj.enable_gdpr){
                                                wpwMsg.triple_nobg(noemailtext, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                            }else{
                                                wpwMsg.double(noemailtext, phonesharetext);
                                            }
                                        }else{
                                            globalwpw.ai_step=1;
                                            globalwpw.wildCard=0;
                                            localStorage.setItem("wildCard",  globalwpw.wildCard);
                                            localStorage.setItem("aiStep", globalwpw.ai_step);
                                            

                                            if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                                wpwMsg.triple_nobg(noemailtext, serviceOffer, globalwpw.wildcards);
                                            }else{
                                                wpwMsg.double(noemailtext, serviceOffer);
                                            }
                                        }

                                        

                                    }else{

                                        var email = msg;
                                        $.cookie("shopperemail", email, { expires : 365 });
                                        localStorage.setItem('shopperemail',email);
                                        if(email!=''){
                                            var data = {'action':'qcld_wb_chatbot_email_subscription','name':localStorage.getItem('shopper'),'email':email, 'url':window.location.href};
    
                                            wpwKits.ajax(data).done(function (response) {
                                                //response.
                                            })
                                        }
                                        var emailgreetings = wpwKits.randomMsg(globalwpw.settings.obj.got_email);
                                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                                        //After completing two steps messaging showing wildcards.


                                        if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
                                            var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                                            if(globalwpw.settings.obj.enable_gdpr){
                                                wpwMsg.triple_nobg(emailgreetings, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                            }else{
                                                wpwMsg.double(emailgreetings, phonesharetext);
                                            }
                                        }else{
                                            if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                                wpwMsg.triple_nobg(emailgreetings, serviceOffer, globalwpw.wildcards);
                                            }else{
                                                wpwMsg.double(emailgreetings,serviceOffer);
                                            }
                                            
                                            globalwpw.ai_step=1;
                                            globalwpw.wildCard=0;
                                            localStorage.setItem("wildCard",  globalwpw.wildCard);
                                            localStorage.setItem("aiStep", globalwpw.ai_step);
                                        }

                                        

                                    }

									
								}
							}else{
                                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                                    if( re.test(msg)!=true){
                                        //After asking service show the wildcards.
                                        var noemailtext = wpwKits.randomMsg(globalwpw.settings.obj.email_ignore);
                                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);                                        
                                        localStorage.setItem('shopperemail','no');
                                        if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
                                            var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                                            if(globalwpw.settings.obj.enable_gdpr){
                                                wpwMsg.triple_nobg(noemailtext, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                            }else{
                                                wpwMsg.double(noemailtext, phonesharetext);
                                            }
                                        }else{
                                            globalwpw.ai_step=1;
                                            globalwpw.wildCard=0;
                                            localStorage.setItem("wildCard",  globalwpw.wildCard);
                                            localStorage.setItem("aiStep", globalwpw.ai_step);
                                            

                                            if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                                wpwMsg.triple_nobg(noemailtext, serviceOffer, globalwpw.wildcards);
                                            }else{
                                                wpwMsg.double(noemailtext, serviceOffer);
                                            }
                                        }

                                        

                                    }else{

                                        var email = msg;
                                        $.cookie("shopperemail", email, { expires : 365 });
                                        localStorage.setItem('shopperemail',email);
                                        if(email!=''){
                                            var data = {'action':'qcld_wb_chatbot_email_subscription','name':localStorage.getItem('shopper'),'email':email, 'url':window.location.href};
    
                                            wpwKits.ajax(data).done(function (response) {
                                                //response.
                                            })
                                        }
                                        var emailgreetings = wpwKits.randomMsg(globalwpw.settings.obj.got_email);
                                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                                        //After completing two steps messaging showing wildcards.


                                        if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
                                            var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                                            if(globalwpw.settings.obj.enable_gdpr){
                                                wpwMsg.triple_nobg(emailgreetings, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                            }else{
                                                wpwMsg.double(emailgreetings, phonesharetext);
                                            }
                                        }else{
                                            if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                                wpwMsg.triple_nobg(emailgreetings, serviceOffer, globalwpw.wildcards);
                                            }else{
                                                wpwMsg.double(emailgreetings,serviceOffer);
                                            }
                                            
                                            globalwpw.ai_step=1;
                                            globalwpw.wildCard=0;
                                            localStorage.setItem("wildCard",  globalwpw.wildCard);
                                            localStorage.setItem("aiStep", globalwpw.ai_step);
                                        }

                                        

                                    }
                            }
						})
					}else if(globalwpw.settings.obj.ask_phone_wp_greetings==1 && !localStorage.getItem('shopperphone')){

                        var phonegreetings = wpwKits.randomMsg(globalwpw.settings.obj.got_phone);
                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                        var nophonetext = wpwKits.randomMsg(globalwpw.settings.obj.phone_ignore);

                        var data = {'action':'qcld_wb_chatbot_phone_validate','name':globalwpw.hasNameCookie,'phone':msg};
                        wpwKits.ajax(data).done(function (response) {
                            var json = $.parseJSON(response);
                            if(json.status=='success'){
                                localStorage.setItem('shopperphone', msg);
                                if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                    wpwMsg.triple_nobg(phonegreetings,serviceOffer, globalwpw.wildcards);
                                }else{
                                    wpwMsg.double(phonegreetings,serviceOffer);
                                }
                                globalwpw.ai_step=1;
                                globalwpw.wildCard=0;
                                localStorage.setItem("wildCard",  globalwpw.wildCard);
                                localStorage.setItem("aiStep", globalwpw.ai_step);

                                if(localStorage.getItem('shopperemail')){
                                    var email = localStorage.getItem('shopperemail');
                                }else{
                                    var email = '';
                                }
                                

                                var data = {'action':'qcld_wb_chatbot_email_subscription','name':localStorage.getItem('shopper'),'email':email, 'phone':msg, 'url':window.location.href};

                                wpwKits.ajax(data).done(function (response) {
                                    //response.
                                })


                            }else if(json.status=='invalid'){

                                if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                    wpwMsg.triple_nobg(nophonetext,serviceOffer, globalwpw.wildcards);
                                }else{
                                    wpwMsg.double(nophonetext,serviceOffer);
                                }
                                globalwpw.ai_step=1;
                                globalwpw.wildCard=0;
                                localStorage.setItem("wildCard",  globalwpw.wildCard);
                                localStorage.setItem("aiStep", globalwpw.ai_step);

                            }
                        })

                    }else{
						//After asking service show the wildcards.
						var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
						globalwpw.ai_step=1;
						globalwpw.wildCard=0;
						localStorage.setItem("wildCard",  globalwpw.wildCard);
						localStorage.setItem("aiStep", globalwpw.ai_step);
						wpwMsg.single(serviceOffer);
					}

                }
                //When user asking needs then DialogFlow will given intent after NLP steps.
                else if(globalwpw.ai_step==1){
                    
                    //first do site search


                    var dfReturns=wpwKits.dailogAIOAction(msg);
                    if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                        $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                    }
                    dfReturns.done(function( response ) {

                        if(globalwpw.settings.obj.df_api_version=='v2'){
                            
                            response = $.parseJSON(response);

                        }

                        if(wpwKits.responseIsOk(response)){
                            var userIntent=wpwKits.getIntentName(response);


                            if(userIntent=='start'){
								
                                globalwpw.wildCard=0;
                                var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                                wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
								
                            }else if(userIntent=='welcome'){
								
                                var messages = wpwKits.getFulfillmentText(response);
                                
								wpwTree.df_reply(response);
								
							}else if(userIntent=='help'){
								
                                $(globalwpw.settings.messageWrapper).html(localStorage.getItem("wpwHitory"));
                                
								//Showing help message
                                setTimeout(function () {
                                    wpwKits.scrollTo();
                                    var helpWelcome = wpwKits.randomMsg(globalwpw.settings.obj.help_welcome);
                                    var helpMsg = wpwKits.randomMsg(globalwpw.settings.obj.help_msg);
                                    wpwMsg.double(helpWelcome,helpMsg);
                                    //dialogflow
                                    if(globalwpw.settings.obj.ai_df_enable==1 && globalwpw.df_status_lock==0){
                                        globalwpw.wildCard=0;
                                        globalwpw.ai_step=1;
                                        localStorage.setItem("wildCard",  globalwpw.wildCard);
                                        localStorage.setItem("aiStep", globalwpw.ai_step);
                                    }
                                },globalwpw.settings.preLoadingTime);
								
                            }else if(userIntent=='reset'){
                                var restWarning=wpwKits.render(globalwpw.settings.obj.reset);
                                var confirmBtn='<span class="qcld-chatbot-reset-btn" reset-data="yes" >'+wpwKits.render(globalwpw.settings.obj.yes)+'</span> <span> '+wpwKits.render(globalwpw.settings.obj.or)+' </span><span class="qcld-chatbot-reset-btn"  reset-data="no">'+wpwKits.render(globalwpw.settings.obj.no)+'</span>';
                                wpwMsg.double_nobg(restWarning,confirmBtn);
                            }else if(userIntent=='phone'){
								
                                if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
									var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
								}else{
									var shopperName=globalwpw.hasNameCookie;
								}
								var askEmail = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone);
								wpwMsg.single(askEmail);
								//Now updating the support part as .
								globalwpw.supportStep='phone';
								globalwpw.wildCard=1;
								//keeping value in localstorage
								localStorage.setItem("wildCard",  globalwpw.wildCard);
								localStorage.setItem("supportStep",  globalwpw.supportStep);

                            }else if(userIntent=='email'){
								
                                if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
									var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
								}else{
									var shopperName=globalwpw.hasNameCookie;
								}
								var askEmail= wpwKits.randomMsg(globalwpw.settings.obj.asking_email);
								wpwMsg.single(askEmail);
								//Now updating the support part as .
								globalwpw.supportStep='email';
								globalwpw.wildCard=1;
								//keeping value in localstorage
								localStorage.setItem("wildCard",  globalwpw.wildCard);
								localStorage.setItem("supportStep",  globalwpw.supportStep);

                            }else if(userIntent==wpwKits.render(globalwpw.settings.obj.site_search)){
								
								var parameters = wpwKits.getParameters(response);
								
								
								if(typeof parameters.products !=='undefined' && parameters.products!=''){
									
									var searchQuery= parameters.products;
									globalwpw.wildCard=1;
									globalwpw.productStep='search';
									wpwAction.bot(searchQuery);
									//keeping value in localstorage
									localStorage.setItem("wildCard",  globalwpw.wildCard);
                                    localStorage.setItem("productStep", globalwpw.productStep);
                                    
                                    //Now updating the support part as .
            
									
								}else{
									
									if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
										var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
									}else{
										var shopperName=globalwpw.hasNameCookie;
									}
									var askEmail='Pleae enter your keyword for searching';
									wpwMsg.single(askEmail);
									//Now updating the support part as .
									globalwpw.supportStep='search';
									globalwpw.wildCard=1;
									//keeping value in localstorage
									localStorage.setItem("wildCard",  globalwpw.wildCard);
									localStorage.setItem("supportStep",  globalwpw.supportStep);
									
								}
								

                            }else if(userIntent=='get name'){
								
								var given_name = wpwKits.getParameters(response).given_name;
								var last_name = wpwKits.getParameters(response).last_name;
								var fullname = given_name+' '+last_name;
								
								$.cookie("shopper", fullname, { expires : 365 });
								localStorage.setItem('shopper',fullname);
								globalwpw.hasNameCookie=fullname;
								//Greeting with name and suggesting the wildcard.
								var NameGreeting=wpwKits.randomMsg(globalwpw.settings.obj.i_am) +" <strong>"+wpwKits.render(globalwpw.settings.obj.agent)+"</strong>! "+wpwKits.randomMsg(globalwpw.settings.obj.name_greeting);
								var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
								//After completing two steps messaging showing wildcards.
								wpwMsg.double(NameGreeting,serviceOffer);
								globalwpw.ai_step=1;
								globalwpw.wildCard=0;
								localStorage.setItem("wildCard",  globalwpw.wildCard);
								localStorage.setItem("aiStep", globalwpw.ai_step);
								
							}
							else if(userIntent=='faq'){
								
                                globalwpw.wildCard=1;
                                globalwpw.supportStep='welcome';
                                wpwAction.bot('from wildcard support');
                                //keeping value in localstorage

                            }else if(userIntent=='email subscription'){
								
                                globalwpw.wildCard=3;
								globalwpw.subscriptionStep='welcome';
								wpwTree.subscription(msg);

                            }else if(userIntent=='product' && globalwpw.settings.obj.disable_product_search!=1){
								var parameters = wpwKits.getParameters(response);
								
								if(typeof parameters.products !=='undefined' && parameters.products!=''){
									var searchQuery= parameters.products;
									globalwpw.wildCard=20;
									globalwpw.productStep='search';
									wpwAction.bot(searchQuery);
									//keeping value in localstorage
									localStorage.setItem("wildCard",  globalwpw.wildCard);
									localStorage.setItem("productStep", globalwpw.productStep);
								}else{
									var searchQuery= wpwKits.queryText(response);
									globalwpw.wildCard=20;
									globalwpw.productStep='search'
									wpwAction.bot(searchQuery);
									//keeping value in localstorage
									localStorage.setItem("wildCard",  globalwpw.wildCard);
									localStorage.setItem("productStep", globalwpw.productStep);
								}
								
                                
                            }
                            else if(userIntent=='catalog' && globalwpw.settings.obj.disable_catalog != 1){
                                wpwAction.bot(wpwKits.render(globalwpw.settings.obj.sys_key_catalog).toLowerCase());
                            }else if(userIntent=='featured' && globalwpw.settings.obj.disable_featured_product!=1){
                                globalwpw.wildCard=20;
                                globalwpw.productStep='featured'
                                wpwAction.bot('from wildcard product');
                                //keeping value in localstorage
                                localStorage.setItem("wildCard",  globalwpw.wildCard);
                                localStorage.setItem("productStep", globalwpw.productStep);
                            }else  if(userIntent=='sale' && globalwpw.settings.obj.disable_sale_product !== 1){
                                globalwpw.wildCard=20;
                                globalwpw.productStep='sale'
                                wpwAction.bot('from wildcard product');
                                //keeping value in localstorage
                                localStorage.setItem("wildCard",  globalwpw.wildCard);
                                localStorage.setItem("productStep", globalwpw.productStep);
                            }else if(userIntent=='order' && globalwpw.settings.obj.disable_order_status!=1){
                                globalwpw.wildCard=21;
                                globalwpw.orderStep='welcome';
                                wpwAction.bot('from wildcard order');
                                //keeping value in localstorage
                                localStorage.setItem("wildCard",  globalwpw.wildCard);
                                localStorage.setItem("orderStep", globalwpw.orderStep);
                            }else if(userIntent=='Default Fallback Intent'){
                                
                                var data = {'action':'wpbo_search_response','name':globalwpw.hasNameCookie,'keyword':msg, 'language':globalwpw.settings.obj.language};
                                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                                }
                                wpwKits.ajax(data).done(function (respond) {

                                    var json=$.parseJSON(respond);
                                    if(json.status=='success'){
                                        if(typeof(json.category)!=="undefined" && json.category){
											
											var question='';
                                            $.each(json.data, function (i, obj) {
                                                question += '<span class="qcld-chatbot-wildcard qcld_simple_txt_response">'+ obj.query +'</span>';
                                            });
                                            
                                            
                                            wpwMsg.single_nobg(question);
											
										}
										else if(json.multiple){
                                            var question='';
                                            $.each(json.data, function (i, obj) {
                                                question += '<span class="qcld-chatbot-wildcard qcld_simple_txt_response">'+ obj.query +'</span>';
                                            });
                                            
                                            
                                            wpwMsg.double_nobg(wpwKits.randomMsg(globalwpw.settings.obj.did_you_mean),question);
                                               
                                        }else{
                                            
                                            wpwMsg.single(json.data[0].response);
                                            var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);

                                            if( typeof(json.data[0].followup)!=="undefined" && json.data[0].followup!='' ){
                                                setTimeout(function(){
                                                    wpwMsg.single(json.data[0].followup);
                                                }, globalwpw.settings.preLoadingTime*2);
                                            }else{
                                                if(globalwpw.settings.obj.disable_repeatative!=1){
                                                    setTimeout(function(){
                                                        wpwMsg.double_nobg(serviceOffer, globalwpw.wildcards);
                                                    }, globalwpw.settings.preLoadingTime*2);
                                                }else{
                                                    setTimeout(function(){
                                                        wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                                    }, globalwpw.settings.preLoadingTime*2);
                                                }
                                            }

                                            

                                        }
                                    } else{
								
                                        if(msg!='' && globalwpw.settings.obj.disable_sitesearch==''){
                                            msg = wpwKits.filterStopWords(msg);
                                            var data = {'action':'wpbo_search_site','name':globalwpw.hasNameCookie,'keyword':msg};

                                            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                                                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                                            }

                                            wpwKits.ajax(data).done(function (res) {
                                                var json=$.parseJSON(res);
                                                if(json.status=='success'){
                                                    $('span[data-wildcart="back"]').remove();
                                                    wpwMsg.single_nobg(json.html);
                                                    setTimeout(function(){
                                                        wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                                    },globalwpw.settings.preLoadingTime)
                                                    
                                                }else if( wp_chatbot_obj.open_ai_enable == "1"){
                                                    var data = {'action':'openai_response','name':globalwpw.hasNameCookie,'keyword':msg};
                                                    wpwKits.ajax(data).done(function (res) {
                                                        var json=$.parseJSON(res);
                                                        if(json.status=='success'){
                                                            setTimeout(function(){
                                                                wpwMsg.single( json.message );
                                                            },globalwpw.settings.preLoadingTime)
                                                        }
                                                    })
                                                }else{

                                                    var data = {'action':'wpbo_failed_response','name':globalwpw.hasNameCookie,'keyword':msg};
                                                    wpwKits.ajax(data).done(function (res) {
                                                        //
                                                    })

                                                    if(globalwpw.counter == globalwpw.settings.obj.no_result_attempt_count || globalwpw.settings.obj.no_result_attempt_count == 0 ){
                                                        
                                                        wpwMsg.single(wpwKits.randomMsg(json.html));
                                                        if(globalwpw.settings.obj.disable_repeatative!=1){
                                                            setTimeout(function(){
                                                                var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                                                wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                                                            },globalwpw.settings.preLoadingTime)
                                                        }else{
                                                            setTimeout(function(){
                                                                wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                                            }, globalwpw.settings.preLoadingTime*2);
                                                        }
                                                        globalwpw.counter = 0;
                                                        
                                                    }else{
                                                        globalwpw.counter++;
                                                        wpwTree.df_reply(response);
                                                    }
                                                }
                                                globalwpw.wildCard=0;
                                            });
                                        }else if(msg!='' && globalwpw.settings.obj.is_woowbot==1){
                                            globalwpw.wildCard=20;
                                            globalwpw.productStep='search';
                                            wpwAction.bot(msg);
                                            //keeping value in localstorage
                                            localStorage.setItem("wildCard",  globalwpw.wildCard);
                                            localStorage.setItem("productStep", globalwpw.productStep);
                                        }else{
                                            if(globalwpw.counter == globalwpw.settings.obj.no_result_attempt_count || globalwpw.settings.obj.no_result_attempt_count == 0 ){
                                                
                                                wpwTree.df_reply(response);
                                                if(globalwpw.settings.obj.disable_repeatative!=1){
                                                    setTimeout(function(){
                                                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                                        wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                                                    },globalwpw.settings.preLoadingTime)
                                                }else{
                                                    setTimeout(function(){
                                                        wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                                    }, globalwpw.settings.preLoadingTime*2);
                                                }
                                                globalwpw.counter = 0;
                                                
                                            }else{
                                                globalwpw.counter++;
                                                wpwTree.df_reply(response);
                                            }
                                        }
                                    }
                                })
								
							}else if(wpwKits.getScore(response)!=0){ // checking is reponsing from dialogflow.
                                
                                
								var sTalkAction=wpwKits.getAction(response);
								
								if(sTalkAction!='' && sTalkAction.indexOf('smalltalk') != -1 ){
									var sMgs=wpwKits.getFulfillmentText(response);
									wpwMsg.single(sMgs);
								}else{
                                   
									var messages = wpwKits.getFulfillmentText(response);
									
									
									
									if(userIntent.indexOf(globalwpw.settings.obj.tag_search_intent)> -1 && wpwKits.isActionComplete(response) && wpwKits.isConversationEnd(response)){
										
										var tags = [];
										$.each(response.queryResult.parameters, function( index, value ) {
										  if(value!=''){
											  tags.push(value);
										  }
										});
										
										if(tags.length > 0){
										
											var data = {'action':'qcld_wb_chatbot_search_product_by_tag','name':globalwpw.hasNameCookie, 'tags': tags.join(',')};

											if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                                                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                                            }
											wpwKits.ajax(data).done(function (presdata) {
												
												if(presdata.product_num==0){
													var productFail=wpwKits.randomMsg(globalwpw.settings.obj.product_fail)+" <strong>"+tags.join(',')+"</strong>!";
													
													wpwMsg.single(productFail);
												}else{
													
													var productSucces= wpwKits.randomMsg(globalwpw.settings.obj.product_success)+" <strong>"+tags.join(',')+"</strong>!";
													wpwMsg.double_nobg(productSucces,presdata.html);
												}
												
											})
										}else{
											wpwTree.df_reply(response);
										}
										
									}else{
										wpwTree.df_reply(response);
									}

									
									var emailSent = false;
									var emailIntent = '';
									$.each(globalwpw.settings.obj.custom_intent, function( index, value ) {
									  
									  if(userIntent.indexOf(value) > -1 ){
										  emailIntent = value;
									  }
									  
									});
									
									
									
									if(emailIntent != '' && globalwpw.settings.obj.custom_intent_email[globalwpw.settings.obj.custom_intent.indexOf(emailIntent)]=='1'){
										emailSent = true;
									}
									
									if(emailSent==true){
										globalwpw.emailContent.push({
											user: wpwKits.queryText(response),
											bot: wpwTree.df_reply2(response)
										})
									}
									
									if(wpwKits.isActionComplete(response) && wpwKits.isConversationEnd(response) && emailSent==true){
                                        
                                        var email = '';
                                        if(localStorage.getItem('shopperemail')!==null){
                                            email = localStorage.getItem('shopperemail');
                                        }
										var data = {'action':'qcld_wb_chatbot_send_query','name':globalwpw.hasNameCookie, 'email': email,'data':globalwpw.emailContent};

										
										wpwKits.ajax(data).done(function (resdata) {
											
											var json=$.parseJSON(resdata);
											if(json.status=='success'){
												var sucMsg=json.message;
												
												setTimeout(function(){
													
													wpwMsg.single(sucMsg);
													globalwpw.wildCard=0;
													var orPhoneSuggest='';
													setTimeout(function(){
														if(globalwpw.settings.obj.call_sup!=1) {
															orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
														}
                                                        var orEmailSuggest='<span class="qcld-chatbot-suggest-email">'+wpwKits.randomMsg(globalwpw.settings.obj.support_email)+'</span>';
                                                        if(globalwpw.settings.obj.disable_repeatative!=1){
                                                            wpwKits.suggestEmail(orPhoneSuggest+orEmailSuggest);
                                                        }else{
                                                            setTimeout(function(){
                                                                wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                                            }, globalwpw.settings.preLoadingTime*2);
                                                        }
													},globalwpw.settings.wildcardsShowTime);
													
												},parseInt(globalwpw.settings.preLoadingTime)*2);
												
											}else{
												
												var failMsg=json.message;
												setTimeout(function(){
													wpwMsg.single(failMsg);
													globalwpw.wildCard=0;
													var orPhoneSuggest='';
													setTimeout(function(){
														if(globalwpw.settings.obj.call_sup!=1) {
															orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
														}
                                                        var orEmailSuggest='<span class="qcld-chatbot-suggest-email">'+wpwKits.randomMsg(globalwpw.settings.obj.support_email)+'</span>';
                                                        if(globalwpw.settings.obj.disable_repeatative!=1){
                                                            wpwKits.suggestEmail(orPhoneSuggest+orEmailSuggest);
                                                        }else{
                                                            setTimeout(function(){
                                                                wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                                            }, globalwpw.settings.preLoadingTime*2);
                                                        }
													},globalwpw.settings.preLoadingTime);
													
												},parseInt(globalwpw.settings.preLoadingTime)*2);
												
												
											}
											
										});	
										globalwpw.emailContent = [];
									}
									


									
								}
									
                                

                            }else{
								
                                var dfDefaultMsg=globalwpw.settings.obj.df_defualt_reply;
								wpwMsg.double_nobg(dfDefaultMsg,globalwpw.wildcards);
                            }
                        }else{
                            //if bad request or limit cross then
                            //globalwpw.df_status_lock=0;
                            var dfDefaultMsg=globalwpw.settings.obj.df_defualt_reply;
                            wpwMsg.double_nobg(dfDefaultMsg,globalwpw.wildcards);
                        }
                    }).fail(function (error) {
						
                        var dfDefaultMsg=globalwpw.settings.obj.df_defualt_reply;
                        wpwMsg.double_nobg(dfDefaultMsg,globalwpw.wildcards);
                    });

                }
            }else{
				
                //When intialize 1 and don't have cookies then keep  the name of shooper in in cookie
				
                if(globalwpw.initialize==1 && !localStorage.getItem('shopper')  && globalwpw.wildCard==0){
					var mainmsg = msg;
                   // msg=wpwKits.toTitlecase(wpwKits.filterStopWords(msg));
                    if( msg.length === 1 ) {
                        msg=wpwKits.toTitlecase(msg);
                    } else {
                        msg=wpwKits.toTitlecase(msg);
                    }
					if(globalwpw.settings.obj.ask_name_confirmation!='' && localStorage.getItem('shoppername_recognized')){
						
					
                        if(mainmsg=='yes'){
							var name = localStorage.getItem('shoppername_recognized');
							globalwpw.settings.obj.ask_name_confirmation = '';
							localStorage.removeItem('shoppername_recognized')
							wpwTree.greeting(name);
						}else{
							localStorage.removeItem('shoppername_recognized')
							wpwMsg.single(wpwKits.randomMsg(globalwpw.settings.obj.asking_name));
						}
						
						
					}else if(globalwpw.settings.obj.ask_name_confirmation==''){
						
						
						$.cookie("shopper", msg, { expires : 365 });
						localStorage.setItem('shopper',msg);
						globalwpw.hasNameCookie=msg;
						//Greeting with name and suggesting the wildcard.
						var NameGreeting=wpwKits.randomMsg(globalwpw.settings.obj.i_am) +" <strong>"+wpwKits.render(globalwpw.settings.obj.agent)+"</strong>! "+wpwKits.randomMsg(globalwpw.settings.obj.name_greeting);
						var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
						
						//After completing two steps messaging showing wildcards.
						if(globalwpw.settings.obj.ask_email_wp_greetings==1){
							localStorage.setItem('default_asking_email',1);
							var emailsharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_emailaddress);
							if(globalwpw.settings.obj.enable_gdpr){
								wpwMsg.triple_nobg(NameGreeting, emailsharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
							}else{
								wpwMsg.double(NameGreeting, emailsharetext);
							}
							
						}
						else if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
							localStorage.setItem('default_asking_phone',1);
							var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
							if(globalwpw.settings.obj.enable_gdpr){
								wpwMsg.triple_nobg(NameGreeting, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
							}else{
								wpwMsg.double(NameGreeting, phonesharetext);
							}
						}else{
							
							if(globalwpw.settings.obj.show_menu_after_greetings==1){
								wpwMsg.triple_nobg(NameGreeting, serviceOffer, globalwpw.wildcards);
							}else{
								wpwMsg.double(NameGreeting,serviceOffer);
							}

						   
							
						}
					}else{
						
						var arrMsg = globalwpw.settings.obj.i_understand[globalwpw.settings.obj.language];
						var i_understand = '';
						var index=Math.floor(Math.random() * arrMsg.length);

                        var res = msg.split(" ");
                       if( res.length >= 2){
                          msg = wpwKits.filterStopWords(msg);
                       }
						if(arrMsg[index]!='' && typeof arrMsg[index] !=='undefined'){
							i_understand = arrMsg[index].replace("%%username%%", '<strong>'+msg+'</strong>');
						}
						localStorage.setItem('shoppername_recognized',msg);
						var confirmBtn='<span class="qcld-chat-common qcld-name-confirm" data-res="yes" >'+wpwKits.render(globalwpw.settings.obj.yes)+'</span> <span> '+wpwKits.render(globalwpw.settings.obj.or)+' </span><span class="qcld-chat-common qcld-name-confirm"  data-res="no">'+wpwKits.render(globalwpw.settings.obj.no)+'</span>';
						wpwMsg.double_nobg(i_understand, confirmBtn);
				
					}

					
                }
                //When returning shopper then greeting with name and wildcards.
                else if(localStorage.getItem('shopper')  && globalwpw.wildCard==0){

					

                    if(globalwpw.settings.obj.ask_email_wp_greetings==1 && !localStorage.getItem('shopperemail')){

						

                        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                        if( re.test(msg)!=true){
							
							var email = msg+' '+localStorage.getItem('shopper');
							$.cookie("shopperemail", email, { expires : 365 });
                            localStorage.setItem('shopperemail',email);
							
                            //After asking service show the wildcards.
                            var noemailtext = wpwKits.randomMsg(globalwpw.settings.obj.email_ignore);;
                            var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);                            
                            globalwpw.wildCard=0;
							
							if(email!=''){
								var data = {'action':'qcld_wb_chatbot_email_subscription','name':localStorage.getItem('shopper'),'email':email, 'url':window.location.href};

								wpwKits.ajax(data).done(function (response) {
									//response.
								})
							}
							
							if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
								localStorage.setItem('default_asking_phone',1);
								var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
								if(globalwpw.settings.obj.enable_gdpr){
									wpwMsg.triple_nobg(noemailtext, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
								}else{
									wpwMsg.double(noemailtext, phonesharetext);
								}
							}else{
								
								localStorage.setItem("wildCard",  globalwpw.wildCard);
								if(globalwpw.settings.obj.show_menu_after_greetings==1){
									wpwMsg.triple_nobg(noemailtext, serviceOffer, globalwpw.wildcards);
								}else{
									wpwMsg.double(noemailtext, serviceOffer);
								}
								
							}
							localStorage.removeItem('default_asking_email');
                        }else{

                            var email = msg;
                            $.cookie("shopperemail", email, { expires : 365 });
                            localStorage.setItem('shopperemail',email);

							if(email!=''){
								var data = {'action':'qcld_wb_chatbot_email_subscription','name':localStorage.getItem('shopper'),'email':email, 'url':window.location.href};

								wpwKits.ajax(data).done(function (response) {
									//response.
								})
							}
							var emailgreetings = wpwKits.randomMsg(globalwpw.settings.obj.got_email);
							var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
							//After completing two steps messaging showing wildcards.
							

							if(globalwpw.settings.obj.ask_phone_wp_greetings==1){
								localStorage.setItem('default_asking_phone',1);
								var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
								if(globalwpw.settings.obj.enable_gdpr){
									wpwMsg.triple_nobg(emailgreetings, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
								}else{
									wpwMsg.double(emailgreetings, phonesharetext);
								}
							}else{
								if(globalwpw.settings.obj.show_menu_after_greetings==1){
									wpwMsg.triple_nobg(emailgreetings,serviceOffer, globalwpw.wildcards);
								}else{
									wpwMsg.double(emailgreetings,serviceOffer);
								}
								
								globalwpw.wildCard=0;
								localStorage.setItem("wildCard",  globalwpw.wildCard);
							}
							localStorage.removeItem('default_asking_email');

                        }
                        localStorage.removeItem('default_asking_email');
                    }else if(globalwpw.settings.obj.ask_phone_wp_greetings==1 && !localStorage.getItem('shopperphone')){

                        var phonegreetings = wpwKits.randomMsg(globalwpw.settings.obj.got_phone);
                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                        var nophonetext = wpwKits.randomMsg(globalwpw.settings.obj.phone_ignore);

                        var data = {'action':'qcld_wb_chatbot_phone_validate','name':globalwpw.hasNameCookie,'phone':msg};
                        if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                            $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                        }
                        wpwKits.ajax(data).done(function (response) {
                            var json = $.parseJSON(response);
                            if(json.status=='success'){
                                localStorage.setItem('shopperphone', msg);
                                if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                    wpwMsg.triple_nobg(phonegreetings,serviceOffer, globalwpw.wildcards);
                                }else{
                                    wpwMsg.double(phonegreetings,serviceOffer);
                                }
                                
                                globalwpw.wildCard=0;
                                localStorage.setItem("wildCard",  globalwpw.wildCard);
                                

                                if(localStorage.getItem('shopperemail')){
                                    var email = localStorage.getItem('shopperemail');
                                }else{
                                    var email = '';
                                }
                                

                                var data = {'action':'qcld_wb_chatbot_email_subscription','name':localStorage.getItem('shopper'),'email':email, 'phone':msg, 'url':window.location.href};

                                wpwKits.ajax(data).done(function (response) {
                                    //response.
                                })


                            }else if(json.status=='invalid'){

                                if(globalwpw.settings.obj.show_menu_after_greetings==1){
                                    wpwMsg.triple_nobg(nophonetext,serviceOffer, globalwpw.wildcards);
                                }else{
                                    wpwMsg.double(nophonetext,serviceOffer);
                                }
                               
                                globalwpw.wildCard=0;
                                localStorage.setItem("wildCard",  globalwpw.wildCard);
                                

                            }
							localStorage.removeItem('default_asking_phone');
                        })
						
                    }else{
                        //After asking service show the wildcards.
                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                        wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                    }
					
                   
                }
            }
        },
        df_multi_handle:function(array){

            if(array.length>0){
                setTimeout(function(){
                    wpwMsg.single(array[0]);
                    array.splice(0, 1);
                    if(array.length>0){
                        setTimeout(function(){
                            wpwTree.df_multi_handle(array);
                        }, globalwpw.settings.preLoadingTime)
                    }
                    
                }, globalwpw.settings.preLoadingTime)
            }else{

                var dfDefaultMsg=globalwpw.settings.obj.df_defualt_reply;
                if(globalwpw.settings.obj.disable_repeatative!=1){
                    wpwMsg.double_nobg(dfDefaultMsg,globalwpw.wildcards);
                }else{
                    wpwTree.single(dfDefaultMsg);
                }

            }
        },
		df_reply:function(response){
			

			//checking for facebook platform
			var i = 0;
            var html = '';
            var responses = [];

            if(globalwpw.settings.obj.df_api_version=='v1'){
                var messages = response.result.fulfillment.messages;
                var action = response.result.actionIncomplete;
                jQuery.each( messages, function( key, message ) {
                    html = '';
                    i +=1;
                    if(message.type==2){
                        
                        html += "<p>" + message.title + "</p>";
                        var index = 0;
                        for (index; index<message.replies.length; index++) {
                            html += "<span class=\"wpb-quick-reply qcld-chat-common\">"+ message.replies[index] +"</span>";
                        }
                        
                        
                    }
                    //check for default reply
                    else if(message.type==0 && message.speech!=''){
                        
                        html += message.speech;
                        
                    }else if(message.type==1){
                        
                        html +='<div class="wpbot_card_wraper">';
                            html+='<div class="wpbot_card_image">';
                                if(message.imageUrl!=''){
                                    html+='<img src="'+message.imageUrl+'" />';								
                                }
                                html+='<div class="wpbot_card_caption">';
                                if(message.title!=''){
                                    html+='<h2>'+message.title+'</h2>';
                                }
                                if(message.subtitle!=''){
                                    html+='<p>'+message.subtitle+'</p>';
                                }
                                html+='</div>';
                            html+='</div>';
                            if(typeof message.buttons !== 'undefined'){
                                if(message.buttons.length>0){
                                    jQuery.each( message.buttons, function( k, btn ) {
                                        html+='<a href="'+btn.postback+'" target="_blank"><i class="fa fa-external-link"></i> '+btn.text+'</a>';
                                    })
                                }
                            }
                            
                        html +='</div>';
                        
                    }else if(message.type=='simple_response'){
                        html += message.textToSpeech;
                    }

                    if(html!=''){
                        responses.push(html);
                    }
                    /*
                    if(i==messages.length){
                        wpwMsg.single(html);    
                        //For back to start button              
                    if(action===false && !html.includes("?") && !html.includes("wpb-quick-reply")){
                            setTimeout(function(){
                                //wpwMsg.single('<span class="qcld-chatbot-wildcard"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                            }, globalwpw.settings.preLoadingTime*2)
                        }
                        
                    }
                    */
                })
            }else{
                var messages = response.queryResult.fulfillmentMessages;
                var actioncomplete = response.queryResult.allRequiredParamsPresent;

                jQuery.each( messages, function( key, message ) {

                    html = '';
                    i +=1;
                    //handeling quickreplies
                    if(typeof message.quickReplies !=="undefined"){
                        if(typeof message.quickReplies.title !=="undefined"){
                            html += "<p>" + message.quickReplies.title + "</p>";
                        }
                        if(typeof message.quickReplies.quickReplies !=="undefined" ){

                            var index = 0;
                            for (index; index<message.quickReplies.quickReplies.length; index++) {
                                html += "<span class=\"wpb-quick-reply qcld-chat-common\">"+ message.quickReplies.quickReplies[index] +"</span>";
                            }

                        }

                    }
                    //handleing default response
                    else if(typeof message.text !=="undefined"){
                        if(typeof message.text.text !=="undefined" && message.text.text.length>0){
                            html += message.text.text[0];
                        }
                    }
                    else if(typeof message.card !=="undefined"){

                        html +='<div class="wpbot_card_wraper">';
                            html+='<div class="wpbot_card_image">';
                                if(message.card.imageUri !=="undefined" && message.card.imageUri!=''){
                                    html+='<img src="'+message.card.imageUri+'" />';								
                                }
                                html+='<div class="wpbot_card_caption">';
                                if(message.card.title !=="undefined" && message.card.title !=""){
                                    html+='<h2>'+message.card.title+'</h2>';
                                }
                                if(message.card.subtitle !=="undefined" && message.card.subtitle !=""){
                                    html+='<p>'+message.card.subtitle+'</p>';
                                }
                                html+='</div>';
                            html+='</div>';

                            if(typeof message.card.buttons !== 'undefined'){
                                if(message.card.buttons.length>0){
                                    jQuery.each( message.card.buttons, function( k, btn ) {
                                        html+='<a href="'+btn.postback+'" target="'+(globalwpw.settings.obj.df_cardlink_open==1?'':'_blank')+'"><i class="fa fa-external-link"></i> '+btn.text+'</a>';
                                    })
                                }
                            }
                            
                        html +='</div>';

                    }
                    else if(typeof message.image !=="undefined"){
                        html +='<div class="wpbot_card_wraper">';
                        html+='<div class="wpbot_card_image">';
                            if(message.image.imageUri !=="undefined" && message.image.imageUri!=''){
                                html+='<img src="'+message.image.imageUri+'" />';								
                            }
                            html+='</div>';
                        html+='</div>';
                    }

                    if(html!=''){
                        responses.push(html);
                    }

                })

            }


            wpwTree.df_multi_handle(responses);
			
        },
        df_cx_reply: function( response ){

            var i = 0;
            var html = '';
            var responses = [];
            var messages = response.queryResult.responseMessages;
            var actioncomplete = response.queryResult.allRequiredParamsPresent;

            jQuery.each( messages, function( key, message ) {

                html = '';
                i +=1;
                //handeling quickreplies
                if(typeof message.quickReplies !=="undefined"){
                    if(typeof message.quickReplies.title !=="undefined"){
                        html += "<p>" + message.quickReplies.title + "</p>";
                    }
                    if(typeof message.quickReplies.quickReplies !=="undefined" ){

                        var index = 0;
                        for (index; index<message.quickReplies.quickReplies.length; index++) {
                            html += "<span class=\"wpb-quick-reply qcld-chat-common\">"+ message.quickReplies.quickReplies[index] +"</span>";
                        }

                    }

                }
                //handleing default response
                else if(typeof message.text !=="undefined"){
                    if(typeof message.text.text !=="undefined" && message.text.text.length>0){
                        html += message.text.text[0];
                    }
                }
                else if(typeof message.card !=="undefined"){

                    html +='<div class="wpbot_card_wraper">';
                        html+='<div class="wpbot_card_image">';
                            if(message.card.imageUri !=="undefined" && message.card.imageUri!=''){
                                html+='<img src="'+message.card.imageUri+'" />';								
                            }
                            html+='<div class="wpbot_card_caption">';
                            if(message.card.title !=="undefined" && message.card.title !=""){
                                html+='<h2>'+message.card.title+'</h2>';
                            }
                            if(message.card.subtitle !=="undefined" && message.card.subtitle !=""){
                                html+='<p>'+message.card.subtitle+'</p>';
                            }
                            html+='</div>';
                        html+='</div>';

                        if(typeof message.card.buttons !== 'undefined'){
                            if(message.card.buttons.length>0){
                                jQuery.each( message.card.buttons, function( k, btn ) {
                                    html+='<a href="'+btn.postback+'" target="'+(globalwpw.settings.obj.df_cardlink_open==1?'':'_blank')+'"><i class="fa fa-external-link"></i> '+btn.text+'</a>';
                                })
                            }
                        }
                        
                    html +='</div>';

                }
                else if(typeof message.image !=="undefined"){
                    html +='<div class="wpbot_card_wraper">';
                    html+='<div class="wpbot_card_image">';
                        if(message.image.imageUri !=="undefined" && message.image.imageUri!=''){
                            html+='<img src="'+message.image.imageUri+'" />';								
                        }
                        html+='</div>';
                    html+='</div>';
                }

                if(html!=''){
                    responses.push(html);
                }

            });

            wpwTree.df_multi_handle(responses);
        },
		df_reply2:function(response){
            
            if(globalwpw.settings.obj.df_api_version=='v1'){
                var messages = response.result.fulfillment.messages;
                switch (messages[0].type) {
                    case 0: // text response
                        return messages[0].speech;
                        break;
                    case 1: // TODO card response
                        
                        break;
                    case 2: // quick replies
                    
                        
                        return messages[0].title;
                        
                        break;
                    case 3: // image response
                        
                        break;
                    case 3: // custom payload

                        break;
                    default:
                }
            }else{

                var messages = response.queryResult.fulfillmentMessages;
                if(typeof messages[0].text !=="undefined"){
                    if(typeof messages[0].text.text !=="undefined" && messages[0].text.text.length>0){
                        return messages[0].text.text[0];
                    }
                }else if(typeof messages[0].quickReplies !=="undefined"){
                    if(typeof messages[0].quickReplies.title !=="undefined"){
                        return messages[0].quickReplies.title;
                    }

                }
            }
			
		},

        product:function (msg) {
            if(globalwpw.wildCard==20 && globalwpw.productStep=='asking'){
                var askingProduct=wpwKits.randomMsg(globalwpw.settings.obj.product_asking);
                wpwMsg.single(askingProduct);
                globalwpw.productStep='search';
            } else if(globalwpw.wildCard==20 && globalwpw.productStep=='search'){
				msg = wpwKits.filterStopWords(msg);
				if(msg!=''){
					var data = {'action':'qcld_wb_chatbot_keyword', 'keyword':msg};
                    //Products by string search ajax handler.
                    if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                        $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                    }
					wpwKits.ajax(data).done(function( response ) {
						if(response.product_num==0){
							var productFail=wpwKits.randomMsg(globalwpw.settings.obj.product_fail)+" <strong>"+msg+"</strong>!";
							//var productSuggest=wpwKits.randomMsg(globalwpw.settings.obj.product_suggest);
                            wpwMsg.single(productFail);
                            
                            var data = {'action':'wpbo_failed_response','name':globalwpw.hasNameCookie,'keyword':msg};
                            wpwKits.ajax(data).done(function (res) {
                                //
                            })

                            //Suggesting category.
                            setTimeout(function(){
                                wpwKits.sugestCat();
                            },parseInt(globalwpw.settings.preLoadingTime*2.1));

						}else {
							
							var productSucces= wpwKits.randomMsg(globalwpw.settings.obj.product_success)+" <strong>"+msg+"</strong>!";
							wpwMsg.double_nobg(productSucces,response.html);

                            if(response.per_page >= response.product_num){
                                setTimeout(function () {
                                    var searchAgain = wpwKits.randomMsg(globalwpw.settings.obj.product_infinite);
                                    wpwMsg.single(searchAgain);
                                    //keeping value in localstorage
                                    globalwpw.wildCard=20;
                                    globalwpw.productStep='search';
                                    localStorage.setItem("productStep",  globalwpw.productStep);
                                },globalwpw.settings.wildcardsShowTime);
                            }	
							
						}
						

					});
				}else{
					var askingProduct=wpwKits.randomMsg(globalwpw.settings.obj.product_asking);
					wpwMsg.single(askingProduct);
				}

            }else if(globalwpw.wildCard==20 && globalwpw.productStep=='category'){
                var msg=msg.split("#");
                var categoryTitle=msg[0];
                var categoryId=msg[1];
                var data = { 'action':'qcld_wb_chatbot_category_products','category':categoryId};
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
                //Product by category ajax handler.
                wpwKits.ajax(data).done(function (response) {
                    if(response.product_num==0){
                        //Since product does not found then show message and suggesting infinity search
                        var productFail = wpwKits.randomMsg(globalwpw.settings.obj.product_fail)+" <strong>"+categoryTitle+"</strong>!";
                        var searchAgain = wpwKits.randomMsg(globalwpw.settings.obj.product_infinite);
                        wpwMsg.double(productFail,searchAgain);
                        globalwpw.productStep='search';
                        //keeping value in localstorage
                        localStorage.setItem("productStep",  globalwpw.productStep);

                    } else{
                        //Now show chat message to choose the product.
                        var productSuccess = wpwKits.randomMsg(globalwpw.settings.obj.product_success)+" <strong>"+categoryTitle+"</strong>!";
                        var products=response.html;
                        wpwMsg.double_nobg(productSuccess,products);
                        //Infinite asking to break dead end.
                        if(response.per_page >= response.product_num){
                            setTimeout(function () {
                                var searchAgain = wpwKits.randomMsg(globalwpw.settings.obj.product_infinite);
                                wpwMsg.single(searchAgain);
                                globalwpw.productStep='search';
                                //keeping value in localstorage
                                localStorage.setItem("productStep",  globalwpw.productStep);
                            },globalwpw.settings.wildcardsShowTime);
                        }
                    }
                })
            }else if(globalwpw.wildCard==20 && globalwpw.productStep=='featured'){
                var data = {'action':'qcld_wb_chatbot_featured_products'};
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
                //Products by string search ajax handler.
                wpwKits.ajax(data).done(function( response ) {
                    if(response.product_num==0){
                        var productFail=wpwKits.randomMsg(globalwpw.settings.obj.product_fail)+" <strong>Featured Products</strong>!";
                        //var productSuggest=wpwKits.randomMsg(globalwpw.settings.obj.product_suggest);
                        wpwMsg.single(productFail);

                        //Suggesting category.
                        setTimeout(function(){
                            wpwKits.sugestCat();
                        },parseInt(globalwpw.settings.preLoadingTime*2.1));

                    }else {
                        var productSucces= wpwKits.randomMsg(globalwpw.settings.obj.product_success)+" <strong>Featured Products</strong>!";
                        wpwMsg.double_nobg(productSucces,response.html);
                        //Infinite asking to break dead end.
                        if(response.per_page >= response.product_num){
                            setTimeout(function () {
                                var searchAgain = wpwKits.randomMsg(globalwpw.settings.obj.product_infinite);
                                wpwMsg.single(searchAgain);
                                //For Dialogflow or else
                                if(globalwpw.settings.obj.ai_df_enable==1 && globalwpw.df_status_lock==0){
                                    globalwpw.wildCard=0;
                                    globalwpw.ai_step=1;
                                    localStorage.setItem("wildCard",  globalwpw.wildCard);
                                    localStorage.setItem("aiStep", globalwpw.ai_step);
                                }else{
                                    //keeping value in localstorage
                                    globalwpw.productStep='search';
                                    localStorage.setItem("wildCard",  globalwpw.wildCard);
                                    localStorage.setItem("productStep",  globalwpw.productStep);
                                }
                            },globalwpw.settings.wildcardsShowTime);
                        }else{
                            //For Dialogflow or else
                            if(globalwpw.settings.obj.ai_df_enable==1 && globalwpw.df_status_lock==0){
                                globalwpw.wildCard=0;
                                globalwpw.ai_step=1;
                                localStorage.setItem("wildCard",  globalwpw.wildCard);
                                localStorage.setItem("aiStep", globalwpw.ai_step);
                            }
                        }

                    }
                });

            }else if(globalwpw.wildCard==20 && globalwpw.productStep=='sale'){
                var data = {'action':'qcld_wb_chatbot_sale_products'};
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
                //Products by string search ajax handler.
                wpwKits.ajax(data).done(function( response ) {
                    if(response.product_num==0){
                        var productFail=wpwKits.randomMsg(globalwpw.settings.obj.product_fail)+'<strong>'+wpwKits.randomMsg(globalwpw.settings.obj.sale_products)+'</strong>!';
                        //var productSuggest=wpwKits.randomMsg(globalwpw.settings.obj.product_suggest);
                        wpwMsg.single(productFail);

                        //Suggesting category.
                        setTimeout(function(){
                            wpwKits.sugestCat();
                        },parseInt(globalwpw.settings.preLoadingTime*2.1));

                    }else {
                        var productSucces= wpwKits.randomMsg(globalwpw.settings.obj.product_success)+' <strong>'+wpwKits.randomMsg(globalwpw.settings.obj.sale_products)+'</strong>!';
                        wpwMsg.double_nobg(productSucces,response.html);
                        //Infinite asking to break dead end.
                        if(response.per_page >= response.product_num){
                            setTimeout(function () {
                                var searchAgain = wpwKits.randomMsg(globalwpw.settings.obj.product_infinite);
                                wpwMsg.single(searchAgain);
                                //For Dialogflow or else
                                if(globalwpw.settings.obj.ai_df_enable==1 && globalwpw.df_status_lock==0){
                                    globalwpw.wildCard=0;
                                    globalwpw.ai_step=1;
                                    localStorage.setItem("wildCard",  globalwpw.wildCard);
                                    localStorage.setItem("aiStep", globalwpw.ai_step);
                                }else{
                                    //keeping value in localstorage
                                    globalwpw.productStep='search';
                                    localStorage.setItem("productStep",  globalwpw.productStep);
                                }
                            },globalwpw.settings.wildcardsShowTime);
                        }else{
                            //For Dialogflow or else
                            if(globalwpw.settings.obj.ai_df_enable==1 && globalwpw.df_status_lock==0){
                                globalwpw.wildCard=0;
                                globalwpw.ai_step=1;
                                localStorage.setItem("wildCard",  globalwpw.wildCard);
                                localStorage.setItem("aiStep", globalwpw.ai_step);
                            }
                        }

                    }
                });
            }
        },

        order:function (msg) {
            //If user already logged In then
            if(globalwpw.settings.obj.order_login==1){
                var orderWelcome=wpwKits.render(globalwpw.settings.obj.order_welcome);
                var data = {'action': 'qcld_wb_chatbot_loged_in_user_orders'};
                //Orders for logged in user ajax handler.
                wpwKits.ajax(data).done(function (response) {
                    if(response.order_num>0){
                        var orderSucMsg=response.message;
                        var orderSucHtml=response.html;
                        wpwMsg.double(orderSucMsg,orderSucHtml);
                        //Calling the email to admin part
                        if(globalwpw.settings.obj.disable_repeatative!=1){
                            setTimeout(function(){
                                var orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
                                var orEmailSuggest='<span class="qcld-chatbot-suggest-email">'+wpwKits.randomMsg(globalwpw.settings.obj.order_email_support)+'</span>';
                                wpwKits.suggestEmail(orEmailSuggest+orPhoneSuggest);
                            },globalwpw.settings.wildcardsShowTime*2);
                        }else{
                            setTimeout(function(){
                                wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                            }, globalwpw.settings.preLoadingTime*2);
                        }
                    }else{
                        var orderFailMsg=response.message;
                        var orderFailHtml=response.html;
                        wpwMsg.double(orderFailMsg,orderFailHtml);
                        //Calling the email to admin part
                        if(globalwpw.settings.obj.disable_repeatative!=1){
                            setTimeout(function(){
                                var orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
                                var orEmailSuggest='<span class="qcld-chatbot-suggest-email">'+wpwKits.randomMsg(globalwpw.settings.obj.order_email_support)+'</span>';
                                wpwKits.suggestEmail(orEmailSuggest+orPhoneSuggest);
                            },globalwpw.settings.wildcardsShowTime*2);
                        }else{
                            setTimeout(function(){
                                wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                            }, globalwpw.settings.preLoadingTime*2);
                        }
                    }
                });
            }
            //If user is not logged In then
            else{

                if(globalwpw.settings.obj.order_status_without_login==1){

                    if( globalwpw.wildCard==21 && globalwpw.orderStep=='welcome'){

                        var orderWelcome=wpwKits.randomMsg(globalwpw.settings.obj.order_welcome);
                        var userNameAsking=wpwKits.randomMsg(globalwpw.settings.obj.order_email_asking);
                        
                        wpwMsg.double(orderWelcome,userNameAsking);
                        //updating the order steps
                        globalwpw.orderStep='orderid';
                        //keeping value in localstorage
                        localStorage.setItem("orderStep",  globalwpw.orderStep);
                    }else if(globalwpw.wildCard==21 && globalwpw.orderStep=='orderid'){
                        globalwpw.orderemail=msg;
                        var orderidasking=wpwKits.randomMsg(globalwpw.settings.obj.order_id_asking);
                        
                        wpwMsg.single(orderidasking);
                        //updating the order steps
                        globalwpw.orderStep='orderstatus';
                        //keeping value in localstorage
                        localStorage.setItem("orderStep",  globalwpw.orderStep);
                    }else if(globalwpw.wildCard==21 && globalwpw.orderStep=='orderstatus'){

                        var data = {'action': 'qcld_wb_chatbot_order_status_check','order_email': globalwpw.orderemail,'order_id': msg,'security': globalwpw.settings.obj.order_nonce};
                        //user loginajax handler.
                        wpwKits.ajax(data).done(function (response) {
                            if(response.status=='success') {
                                if (response.order_num > 0) {
                                    var loginSucMsg=response.message;
                                    var orderHtml=response.html;
                                    wpwMsg.double_nobg(loginSucMsg,orderHtml);
                                    //Now keep the user as login in by updating obj
                                    globalwpw.wildCard=0;
									globalwpw.orderStep='welcome';
                                    //Calling the email to admin part
                                    if(globalwpw.settings.obj.disable_repeatative!=1){
										setTimeout(function(){
											var orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
											var orEmailSuggest='<span class="qcld-chatbot-suggest-email">'+wpwKits.randomMsg(globalwpw.settings.obj.order_email_support)+'</span>';
											wpwKits.suggestEmail(orEmailSuggest+orPhoneSuggest);
										},globalwpw.settings.wildcardsShowTime*2);
									}
    
                                } else {
                                    var loginFailcMsg=response.message;
                                    var orderNoHtml=response.html;
                                    wpwMsg.double(loginFailcMsg,orderNoHtml);
                                    //Now keep the user as login in by updating obj
                                    globalwpw.wildCard=0;
									globalwpw.orderStep='welcome';
                                    //Calling the email to admin part
                                    if(globalwpw.settings.obj.disable_repeatative!=1){
										setTimeout(function(){
											var orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
											var orEmailSuggest='<span class="qcld-chatbot-suggest-email">'+wpwKits.randomMsg(globalwpw.settings.obj.order_email_support)+'</span>';
											wpwKits.suggestEmail(orEmailSuggest+orPhoneSuggest);
										},globalwpw.settings.wildcardsShowTime*2);
									}
                                }
                            }
                        });

                    }

                }else{
                    if( globalwpw.wildCard==21 && globalwpw.orderStep=='welcome'){
                        var orderWelcome=wpwKits.randomMsg(globalwpw.settings.obj.order_welcome);
                        var userNameAsking=wpwKits.randomMsg(globalwpw.settings.obj.order_username_asking);
                        
                        wpwMsg.double(orderWelcome,userNameAsking);
                        //updating the order steps
                        globalwpw.orderStep='user';
                        //keeping value in localstorage
                        localStorage.setItem("orderStep",  globalwpw.orderStep);
    
                    } else if( globalwpw.wildCard==21 && globalwpw.orderStep=='user'){
                        globalwpw.shopperUserName=msg;
                        var data = {'action': 'qcld_wb_chatbot_check_user', 'user_name': globalwpw.shopperUserName };
                        //Username checking ajax handler.
                        wpwKits.ajax(data).done(function (response) {
                            if(response.status=='success'){
                                var successMgs=response.message;
                                var sucessHtml=response.html;
                                wpwMsg.double(successMgs,sucessHtml);
                                globalwpw.orderStep='password';
                                //keeping value in localstorage
                                localStorage.setItem("orderStep",  globalwpw.orderStep);
    
                            } else{
                                var failMsg=response.message;
                                wpwMsg.single(failMsg);
                                globalwpw.orderStep='user';
                                //keeping value in localstorage
                                localStorage.setItem("orderStep",  globalwpw.orderStep);
                            }
                        });
                    }else if( globalwpw.wildCard==21 && globalwpw.orderStep=='password'){
                        var data = {'action': 'qcld_wb_chatbot_login_user','user_name': globalwpw.shopperUserName,'user_pass': msg,'security': globalwpw.settings.obj.order_nonce};
                        //user loginajax handler.
                        wpwKits.ajax(data).done(function (response) {
                            if(response.status=='success') {
                                if (response.order_num > 0) {
                                    var loginSucMsg=response.message;
                                    var orderHtml=response.html;
                                    wpwMsg.double_nobg(loginSucMsg,orderHtml);
                                    //Now keep the user as login in by updating obj
                                    globalwpw.settings.obj.order_login=1;
                                    //Calling the email to admin part
                                    if(globalwpw.settings.obj.disable_repeatative!=1){
										setTimeout(function(){
											var orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
											var orEmailSuggest='<span class="qcld-chatbot-suggest-email">'+wpwKits.randomMsg(globalwpw.settings.obj.order_email_support)+'</span>';
											wpwKits.suggestEmail(orEmailSuggest+orPhoneSuggest);
										},globalwpw.settings.wildcardsShowTime*2);
									}
    
                                } else {
                                    var loginFailcMsg=response.message;
                                    var orderNoHtml=response.html;
                                    wpwMsg.double(loginFailcMsg,orderNoHtml);
                                    //Now keep the user as login in by updating obj
                                    globalwpw.settings.obj.order_login=1;
                                    //Calling the email to admin part
                                    if(globalwpw.settings.obj.disable_repeatative!=1){
										setTimeout(function(){
											var orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
											var orEmailSuggest='<span class="qcld-chatbot-suggest-email">'+wpwKits.randomMsg(globalwpw.settings.obj.order_email_support)+'</span>';
											wpwKits.suggestEmail(orEmailSuggest+orPhoneSuggest);
										},globalwpw.settings.wildcardsShowTime*2);
									}
                                }
                            }else{
                                var loginFail= response.message;
                                wpwMsg.single(loginFail);
                                globalwpw.orderStep=='password';
                                //keeping value in localstorage
                                localStorage.setItem("orderStep",  globalwpw.orderStep);
                            }
                        });
                    }
                }

                
            }
        },
        unsubscription:function(msg){

            if($('.chatbot_intent_reload').length==0){
                $('#wp-chatbot-editor-container').append('<span class="chatbot_intent_reload" title="Restart the current intent" data-wildcard="6" data-step="welcome" data-intent-type="unsubscription" data-intent="unsubscription"><i class="fa fa-refresh" aria-hidden="true"></i></span>');
            }

            if(globalwpw.wildCard==6 && globalwpw.unsubscriptionStep=='welcome'){

                var restWarning=wpwKits.randomMsg(globalwpw.settings.obj.do_you_want_to_unsubscribe);
                var confirmBtn='<span class="qcld-chat-common qcld_unsubscribe_confirm" unsubscription="yes" >'+wpwKits.render(globalwpw.settings.obj.yes)+'</span> <span> '+wpwKits.render(globalwpw.settings.obj.or)+' </span><span class="qcld-chat-common qcld_unsubscribe_confirm"  unsubscription="no">'+wpwKits.render(globalwpw.settings.obj.no)+'</span>';
                wpwMsg.double_nobg(restWarning,confirmBtn);

            }else if(globalwpw.wildCard==6 && globalwpw.unsubscriptionStep=='getemail'){

                if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
					var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
				}else{
					var shopperName=globalwpw.hasNameCookie;
				}
				
				var askEmail= wpwKits.randomMsg(globalwpw.settings.obj.asking_email);
				wpwMsg.single(askEmail);
				globalwpw.unsubscriptionStep = 'collectemailunsubscribe';

            }else if(globalwpw.wildCard==6 && globalwpw.unsubscriptionStep=='collectemailunsubscribe'){

                var validate = "";
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if( re.test(msg)!=true){
                    validate = validate+wpwKits.randomMsg(globalwpw.settings.obj.invalid_email) ;
                }

                if(validate == ""){

                    var data = {'action':'qcld_wb_chatbot_email_unsubscription','email':msg};
                    wpwKits.ajax(data).done(function (response) {
                        var json=$.parseJSON(response);
                        if(json.status=='success'){
                            wpwMsg.single(wpwKits.randomMsg(globalwpw.settings.obj.you_have_successfully_unsubscribe));
                            if($('.chatbot_intent_reload').length>0){
                                $('.chatbot_intent_reload').remove();
                            }
                            setTimeout(function(){
                                var orPhoneSuggest = '';
								if(globalwpw.settings.obj.call_sup=="") {
									orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + globalwpw.wpwKits.render(settings.obj.support_phone) + '</span>';
								}
                                var orEmailSuggest='<span class="qcld-chatbot-suggest-email" >'+wpwKits.randomMsg(globalwpw.settings.obj.support_email)+'</span>';
                                if(globalwpw.settings.obj.disable_repeatative!=1){
                                    wpwKits.suggestEmail(orEmailSuggest+orPhoneSuggest);
                                }else{
                                    setTimeout(function(){
                                        wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                    }, globalwpw.settings.preLoadingTime*2);
                                }
								globalwpw.wildCard=0;
							},globalwpw.settings.preLoadingTime);
                        }else{
                            var restWarning=wpwKits.randomMsg(globalwpw.settings.obj.we_do_not_have_your_email);
                            var confirmBtn='<span class="qcld-chat-common qcld_unsubscribe_again" >Try again?</span>';
                            wpwMsg.double_nobg(restWarning,confirmBtn);
                            if($('.chatbot_intent_reload').length>0){
                                $('.chatbot_intent_reload').remove();
                            }
                        }
                    })
                    //wpwMsg.single('Collected valid email and trying to unsubscribe');

                }else{
                    globalwpw.unsubscriptionStep = 'collectemailunsubscribe';
                    wpwMsg.single(validate);
                }


            }
        },

		subscription:function(msg){

            if($('.chatbot_intent_reload').length==0){
                $('#wp-chatbot-editor-container').append('<span class="chatbot_intent_reload" title="Restart the current intent" data-wildcard="3" data-step="welcome" data-intent-type="subscription" data-intent="subscription"><i class="fa fa-refresh" aria-hidden="true"></i></span>');
            }
			
			if(globalwpw.subscriptionStep=='welcome'){
				var restWarning=wpwKits.randomMsg(globalwpw.settings.obj.do_you_want_to_subscribe);
                var confirmBtn='<span class="qcld-chat-common qcld_subscribe_confirm" subscription="yes" >'+wpwKits.render(globalwpw.settings.obj.yes)+'</span> <span> '+wpwKits.render(globalwpw.settings.obj.or)+' </span><span class="qcld-chat-common qcld_subscribe_confirm"  subscription="no">'+wpwKits.render(globalwpw.settings.obj.no)+'</span>';
                if(globalwpw.settings.obj.enable_gdpr){
                    wpwMsg.triple_nobg(restWarning, wpwKits.render(globalwpw.settings.obj.gdpr_text), confirmBtn);
                    setTimeout(function(){
                        wpwKits.disableEditor('');   
                    }, 2000)
                }else{
                    wpwMsg.double_nobg(restWarning,confirmBtn);
                    setTimeout(function(){
                        wpwKits.disableEditor('');   
                    }, 1500)
                }
				
			}
			else if(globalwpw.subscriptionStep=='getname'){

				if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
					var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
				}else{
					var shopperName=globalwpw.hasNameCookie;
				}
				
				var askEmail= wpwKits.randomMsg(globalwpw.settings.obj.asking_email);
				wpwMsg.single(askEmail);
				globalwpw.subscriptionStep = 'getemail';
				
			}
			else if(globalwpw.subscriptionStep=='getemail'){
				
				globalwpw.shopperEmail=msg;
                var validate = "";
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if( re.test(globalwpw.shopperEmail)!=true){
                    validate = validate+wpwKits.randomMsg(globalwpw.settings.obj.invalid_email) ;
                }
                if(validate == ""){
                    if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
						var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}else{
						var shopperName=globalwpw.hasNameCookie;
					}
					
					var data = {'action':'qcld_wb_chatbot_email_subscription','name':shopperName,'email':globalwpw.shopperEmail, 'url':window.location.href};

					wpwKits.ajax(data).done(function (response) {
						var json=$.parseJSON(response);
						
						if(json.status=='success'){
							var sucMsg=json.msg;
							wpwMsg.single(sucMsg);
                            if($('.chatbot_intent_reload').length>0){
                                $('.chatbot_intent_reload').remove();
                            }
							setTimeout(function(){
                                var orPhoneSuggest = '';
								if(globalwpw.settings.obj.call_sup=="") {
									orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
								}
                                var orEmailSuggest='<span class="qcld-chatbot-suggest-email" >'+wpwKits.randomMsg(globalwpw.settings.obj.support_email)+'</span>';
                                if(globalwpw.settings.obj.disable_repeatative!=1){
                                    wpwKits.suggestEmail(orEmailSuggest+orPhoneSuggest);
                                }else{
                                    setTimeout(function(){
                                        wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                    }, globalwpw.settings.preLoadingTime*2);
                                }
								globalwpw.wildCard=0;
							},globalwpw.settings.preLoadingTime);
						}else{
							var failMsg=json.msg;
                            wpwMsg.single(failMsg);
                            if($('.chatbot_intent_reload').length>0){
                                $('.chatbot_intent_reload').remove();
                            }
							setTimeout(function(){
								wpwAction.bot(wpwKits.render(globalwpw.settings.obj.sys_key_help).toLowerCase());
							},globalwpw.settings.preLoadingTime)
							
						}
					});
					

                }else{
					globalwpw.subscriptionStep = 'getemail';
                    wpwMsg.single(validate);
                    
                }
				
			}
		},
        support:function (msg) {
            if(globalwpw.wildCard==1 && globalwpw.supportStep=='welcome'){
                var welcomeMsg= wpwKits.randomMsg(globalwpw.settings.obj.support_welcome);

                var orPhoneSuggest = '';
                if(globalwpw.settings.obj.support_query[globalwpw.settings.obj.language].length>0){
                    var supportsItems = '';
                    var messenger = '';
                    if(globalwpw.settings.obj.enable_messenger==1) {
                        messenger += '<span class="qcld-chatbot-wildcard"  data-wildcart="messenger">'+wpwKits.randomMsg(globalwpw.settings.obj.messenger_label)+'</span>';
                    }
                    if(globalwpw.settings.obj.enable_whats==1) {
                        messenger += '<span class="qcld-chatbot-wildcard"  data-wildcart="whatsapp">'+wpwKits.randomMsg(globalwpw.settings.obj.whats_label)+'</span>';
                    }
                    if(globalwpw.settings.obj.disable_feedback=='') {
                        messenger+= '<span class="qcld-chatbot-suggest-email" >'+wpwKits.randomMsg(globalwpw.settings.obj.feedback_label)+'</span>';
                    }

                    $.each(globalwpw.settings.obj.support_query[globalwpw.settings.obj.language], function (i, obj) {
                        supportsItems += '<span class="qcld-chatbot-support-items"  data-query-index="' + i + '">' + obj + '</span>';
                    });
                    var orEmailSuggest = '<span class="qcld-chatbot-suggest-email" >' + wpwKits.randomMsg(globalwpw.settings.obj.support_email) + '</span>';
					
                    if(globalwpw.settings.obj.call_sup=="") {
                        orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
                    }
					
                     var queryOrEmail=supportsItems;
                }else {
                    if(globalwpw.settings.obj.call_sup=="") {
                        orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
                    }
                    var queryOrEmail='<span class="qcld-chatbot-suggest-email" >' + wpwKits.randomMsg(globalwpw.settings.obj.support_email) + '</span>'+orPhoneSuggest;

                }
                
                wpwMsg.double_nobg(welcomeMsg,queryOrEmail);
                wpwKits.disableEditor(wpwKits.render(globalwpw.settings.obj.agent)+' '+wpwKits.randomMsg('Please select item from FAQ'));
                globalwpw.wildCard=0;
            } else if(globalwpw.wildCard==1 && globalwpw.supportStep=='email'){


                globalwpw.shopperEmail=msg;
                var validate = "";
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if( re.test(globalwpw.shopperEmail)!=true){
                    validate = validate+wpwKits.randomMsg(globalwpw.settings.obj.invalid_email) ;
                }
                if(validate == ""){
                    var askingMsg=wpwKits.randomMsg(globalwpw.settings.obj.asking_msg);
                    wpwMsg.single(askingMsg);
                    globalwpw.supportStep='message';
                    //keeping value in localstorage
                    localStorage.setItem("supportStep",  globalwpw.supportStep);

                }else{
                    wpwMsg.single(validate);
                    globalwpw.supportStep='email';
                    //keeping value in localstorage
                    localStorage.setItem("supportStep",  globalwpw.supportStep);
                }
            }else if(globalwpw.wildCard==1 && globalwpw.supportStep=='message'){

                var data = {'action':'qcld_wb_chatbot_support_email','name':globalwpw.hasNameCookie,'email':globalwpw.shopperEmail,'message':msg, 'url': window.location.href};

                wpwKits.ajax(data).done(function (response) {
                    var json=$.parseJSON(response);
                    var orPhoneSuggest='';
                    if(json.status=='success'){
                        var sucMsg=wpwKits.render(json.message);
                        wpwMsg.single(sucMsg);
                        //Asking email after showing answer.
                        setTimeout(function(){
                            if(globalwpw.settings.obj.call_sup=="") {
                                orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
                            }
                            var orEmailSuggest='<span class="qcld-chatbot-suggest-email" >'+wpwKits.randomMsg(globalwpw.settings.obj.support_email)+'</span>';
                            if(globalwpw.settings.obj.disable_repeatative!=1){
                                wpwKits.suggestEmail(orEmailSuggest+orPhoneSuggest);
                            }else{
                                setTimeout(function(){
                                    wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                }, globalwpw.settings.preLoadingTime*2);
                            }
                            globalwpw.wildCard=0;
                        },globalwpw.settings.preLoadingTime);
                    }else{
                        var failMsg=wpwKits.render(json.message);
                        wpwMsg.single(failMsg);
                        //Asking email after showing answer.
                        setTimeout(function(){
                            if(globalwpw.settings.obj.call_sup=="") {
                                orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
                            }
                            var orEmailSuggest='<span class="qcld-chatbot-suggest-email" >'+wpwKits.randomMsg(globalwpw.settings.obj.support_email)+'</span>';
                            if(globalwpw.settings.obj.disable_repeatative!=1){
                                wpwKits.suggestEmail(orEmailSuggest+orPhoneSuggest);
                            }else{
                                setTimeout(function(){
                                    wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                }, globalwpw.settings.preLoadingTime*2);
                            }
                            globalwpw.wildCard=0;
                        },globalwpw.settings.preLoadingTime);
                    }
                });

            }else if(globalwpw.wildCard==1 && globalwpw.supportStep=='phone'){

                var data = {'action':'qcld_wb_chatbot_support_phone','name':globalwpw.hasNameCookie,'phone':msg};
                wpwKits.ajax(data).done(function (response) {
                    var json=$.parseJSON(response);
                    var orPhoneSuggest='';
                    if(json.status=='success'){
                        var sucMsg=wpwKits.render(json.message);
                        wpwMsg.single(sucMsg);
                        //Asking email after showing answer.
                        setTimeout(function(){
                            if(globalwpw.settings.obj.call_sup=="") {
                                orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
                            }
                            var orEmailSuggest='<span class="qcld-chatbot-suggest-email" >'+wpwKits.randomMsg(globalwpw.settings.obj.support_email)+'</span>';
                            if(globalwpw.settings.obj.disable_repeatative!=1){
                                wpwKits.suggestEmail(orEmailSuggest+orPhoneSuggest);
                            }else{
                                setTimeout(function(){
                                    wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                }, globalwpw.settings.preLoadingTime*2);
                            }
                            globalwpw.wildCard=0;
                        },globalwpw.settings.preLoadingTime);
                    }else if(json.status=='invalid'){

                        var failMsg=wpwKits.render(json.message);
                        wpwMsg.single(failMsg);
                        globalwpw.supportStep='phone';
                        globalwpw.wildCard=1;
                        //keeping value in localstorage
                        localStorage.setItem("wildCard",  globalwpw.wildCard);
                        localStorage.setItem("supportStep",  globalwpw.supportStep);

                    }else{
                        var failMsg=wpwKits.render(json.message);
                        wpwMsg.single(failMsg);
                        //Asking email after showing answer.
                        setTimeout(function(){
                            if(globalwpw.settings.obj.call_sup=="") {
                                orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
                            }
                            var orEmailSuggest='<span class="qcld-chatbot-suggest-email" >'+wpwKits.randomMsg(globalwpw.settings.obj.support_email)+'</span>';
                            if(globalwpw.settings.obj.disable_repeatative!=1){
                                wpwKits.suggestEmail(orEmailSuggest+orPhoneSuggest);
                            }else{
                                setTimeout(function(){
                                    wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                }, globalwpw.settings.preLoadingTime*2);
                            }
                            globalwpw.wildCard=0;
                        },globalwpw.settings.preLoadingTime);
                    }
                });

            }else if(globalwpw.wildCard==1 && globalwpw.supportStep=='search'){
                
                

				if(msg!='' && globalwpw.settings.obj.disable_sitesearch==''){
                    msg = wpwKits.filterStopWords(msg);
                    var data = {'action':'wpbo_search_site','name':globalwpw.hasNameCookie,'keyword':msg};
                    if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                        $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                    }
					wpwKits.ajax(data).done(function (response) {
						var json=$.parseJSON(response);
						if(json.status=='success'){
                            $('span[data-wildcart="back"]').remove();
                            wpwMsg.single_nobg(json.html);
                            setTimeout(function(){
                                wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                            },globalwpw.settings.preLoadingTime)
						}else if(wp_chatbot_obj.open_ai_enable == "1"){
                            var data = {'action':'openai_response','name':globalwpw.hasNameCookie,'keyword':msg};
                            wpwKits.ajax(data).done(function (res) {
                                var json=$.parseJSON(res);
                                if(json.status=='success'){
                                    setTimeout(function(){
                                        wpwMsg.single( json.message );
                                    },globalwpw.settings.preLoadingTime)
                                }
                            })
                        }else{

                            var data = {'action':'wpbo_failed_response','name':globalwpw.hasNameCookie,'keyword':msg};
                            wpwKits.ajax(data).done(function (res) {
                                //
                            })
                            if(globalwpw.counter == globalwpw.settings.obj.no_result_attempt_count || globalwpw.settings.obj.no_result_attempt_count == 0 ){
												
                                wpwMsg.single(wpwKits.randomMsg(json.html));
                                
                                    setTimeout(function(){
                                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                        wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                                    },globalwpw.settings.preLoadingTime)
                                
                                globalwpw.counter = 0;
                                
                            }else{
                                globalwpw.counter++;
                                wpwMsg.single(wpwKits.randomMsg(json.html));
                            }
							
						}
						globalwpw.wildCard=0;
					});
				}else{
					globalwpw.wildCard=0;
                    wpwMsg.single(wpwKits.randomMsg(globalwpw.settings.obj.empty_filter_msg));
                    if(globalwpw.settings.obj.disable_repeatative!=1){
                        setTimeout(function(){
                            var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                            wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                        },globalwpw.settings.preLoadingTime)
                    }else{
                        setTimeout(function(){
                            wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                        }, globalwpw.settings.preLoadingTime*2);
                    }
				}
            }

        },
        formbuilder:function(msg){

            
            //destroy date picker
            //if ( jQuery.isFunction(jQuery.fn.datetimepicker) ) {
            if ( typeof jQuery.fn.datetimepicker === 'function' ) {
                jQuery('#wp-chatbot-editor').datetimepicker('destroy');
            }
            jQuery('#wp-chatbot-editor').attr("type", "text");
            jQuery('#wp-chatbot-editor').prop("disabled", false);
			jQuery('#wp-chatbot-editor').removeAttr("multiple");

			jQuery('#wp-chatbot-editor').removeClass('qcphonebasicus');
			jQuery('#wp-chatbot-editor').removeClass("qcnumberfield");
			jQuery('#wp-chatbot-editor').removeAttr("minlength");
			jQuery('#wp-chatbot-editor').removeAttr("maxlength");
            

            if(globalwpw.wildCard==7 && globalwpw.formStep=='welcome'){
				
				if(!localStorage.getItem('botsessionid')){

                    var number = Math.random() // 0.9394456857981651
                    number.toString(36); // '0.xtis06h6'
                    var id = number.toString(36).substr(2); // 'xtis06h6'
    
                    localStorage.setItem('botsessionid', id);
                    
                }
				
                var data = {'action':'wpbot_get_form','formid':msg, 'session': localStorage.getItem('botsessionid')};
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
				wpwKits.ajax(data).done(function (response) {
                    var json=$.parseJSON(response);
                    
                    
					if(jQuery('.wp-chatbot-operation-option[data-option="chat"]').length>0 && jQuery('.wp-chatbot-operation-option[data-option="chat"]').is(':visible')){
						wpwKits.showtooltip(jQuery('.wp-chatbot-operation-option[data-option="chat"]'));
						setTimeout(function(){
							$("#bottooltip").hide('slow');
						}, 5000)
					}
                    globalwpw.prevform = json.ID;
                    globalwpw.formfieldid = json.ID;
                    localStorage.setItem("formfieldid",  globalwpw.formfieldid);
                    globalwpw.formStep='field';
                    localStorage.setItem("formStep",  globalwpw.formStep);
                    globalwpw.formid=msg;
                    localStorage.setItem("formid",  globalwpw.formid);
                    localStorage.setItem("wildCard",  globalwpw.wildCard);

                    var label = json.label;

					label = label.replace("#name", localStorage.getItem('shopper'));
                    if(json.type=='dropdown'){
                        var html = '';
                        jQuery.each(json.config.option, function(key, value){
                            html += '<span class="qcld-chatbot-wildcard qcld-chatbot-formanswer" data-form-value="'+value.value+'" >'+value.label+'</span>';
                        })
						
						if(json.hasOwnProperty("additional") && json.additional!=''){
							label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
						}
						if(label.length==0){
								wpwMsg.single(html);
							}else{
								wpwMsg.double(label, html);
							}
						

                        setTimeout(function(){
                            jQuery('#wp-chatbot-editor').prop("disabled", true);
                        }, globalwpw.settings.preLoadingTime*2.2)
						
                    }else if(json.type=='checkbox'){
                        var html = '';
                        jQuery.each(json.config.option, function(key, value){                            
                            html += '<input type="checkbox" class="qcld-chatbot-checkbox" value="'+value.value+'">'+value.label+'<br>';
                        })
						
                        if(json.hasOwnProperty("additional") && json.additional!=''){
							label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
						}
						wpwMsg.double(label, html);
						
						
                    }else if(json.type=='number'){

                        if(json.hasOwnProperty("additional") && json.additional!=''){
							label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
						}
						wpwMsg.single(label);
						
                        jQuery('#wp-chatbot-editor').addClass("qcnumberfield");
						
						if(json.hasOwnProperty("config") && json.config.hasOwnProperty("min") && json.config.min>0){
							jQuery('#wp-chatbot-editor').attr("minlength", json.config.min);
						}
						
						if(json.hasOwnProperty("config") && json.config.hasOwnProperty("max") && json.config.max>0){
							jQuery('#wp-chatbot-editor').attr("maxlength", json.config.max);
						}

                    }else if(json.type=='date_picker'){
                        
                        if(json.hasOwnProperty("additional") && json.additional!=''){
							label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
						}
						wpwMsg.single(label);
						
                        jQuery('#wp-chatbot-editor').blur();
                        jQuery('#wp-chatbot-editor').datetimepicker();
                    }else if(json.type=='email'){

                        if(json.hasOwnProperty("additional") && json.additional!=''){
							label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
						}
						wpwMsg.single(label);
						
                        jQuery('#wp-chatbot-editor').attr("type", "email");

                    }else if(json.type=='url'){

                        if(json.hasOwnProperty("additional") && json.additional!=''){
							label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
						}
						wpwMsg.single(label);
						
                        jQuery('#wp-chatbot-editor').attr("type", "url");

                    }else if(json.type=='phone'){
						
						wpwMsg.single(label);
						
						jQuery('#wp-chatbot-editor').addClass('qcphonebasicus');

                    }else if(json.type=='html'){

                        if(json.hasOwnProperty("show_as_menu") && json.show_as_menu==1){
                            wpwMsg.single_nobg(json.config.default.replace("#name", localStorage.getItem('shopper')));
                        }else{
                            wpwMsg.single(json.config.default.replace("#name", localStorage.getItem('shopper')));
                        }
                        
                        globalwpw.formfieldid = json.ID;
                        localStorage.setItem("formfieldid",  globalwpw.formfieldid);
                        globalwpw.formentry = json.entry;
                        localStorage.setItem("formentry",  globalwpw.formentry);
                        setTimeout(function(){
                            if(!json.hasOwnProperty("show_as_menu") || json.show_as_menu!=1){
                                wpwTree.formbuilder();
                            }
                        }, globalwpw.settings.preLoadingTime)
                        

                    }else if(json.type=='hidden' && json.slug=='name'){
                        var name = localStorage.getItem('shopper');
                        if( globalwpw.settings.obj.order_login == 1 ){
                            name = globalwpw.settings.obj.order_user;
                        }
						wpwTree.formbuilder(name);
					}else{
                        if(json.hasOwnProperty("additional") && json.additional!=''){
							label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
						}
						wpwMsg.single(label);
						
                    }
					
					
                })

            }else if(globalwpw.wildCard==7 && globalwpw.formStep=='field'){
                var data = {'action':'wpbot_capture_form_value','formid':globalwpw.formid, 'fieldid': globalwpw.formfieldid, 'answer': msg, 'entry':globalwpw.formentry, 'session': localStorage.getItem('botsessionid'), 'name':globalwpw.hasNameCookie, 'email':localStorage.getItem('shopperemail'), 'url': window.location.href};
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
				wpwKits.ajax(data).done(function (response) {
                    var json=$.parseJSON(response);
                   
                    

                    if(json.status=='incomplete'){

                        if( json.type !='html' ){

                            if($('.chatbot_intent_reload').length > 0){
                                $('.chatbot_intent_reload').remove();
                            }
                            wpwKits.render(globalwpw.settings.obj.go_back_tooltip)
                            $('#wp-chatbot-editor-container').append('<span class="chatbot_intent_reload" title="'+ wpwKits.render(globalwpw.settings.obj.go_back_tooltip)+'" data-wildcard="7" data-step="welcome" data-intent-type="formbuilder" data-intent="'+globalwpw.prevform+'"><i class="fa fa-undo" aria-hidden="true"></i></span>');
                            globalwpw.prevform = globalwpw.formfieldid;
                        }

                        globalwpw.formStep='field';
                        localStorage.setItem("formStep",  globalwpw.formStep);
                        globalwpw.formfieldid = json.ID;
                        localStorage.setItem("formfieldid",  globalwpw.formfieldid);
                        globalwpw.formentry = json.entry;
                        localStorage.setItem("formentry",  globalwpw.formentry);

                        var label = json.label;

                        if( label.length > 1 && typeof label === 'string' ){
                            label = label.replace("#name", localStorage.getItem('shopper'));
                        }
                        if(json.type=='dropdown'){
                            var html = '';
                            jQuery.each(json.config.option, function(key, value){
                                html += '<span class="qcld-chatbot-wildcard qcld-chatbot-formanswer" data-form-value="'+value.value+'" >'+value.label+'</span>';
                            })
                            if(json.hasOwnProperty("additional") && json.additional!=''){
								label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
							}
							
							if(label.length==0){
								wpwMsg.single(html);
							}else{
								wpwMsg.double(label, html);
							}
							
                            setTimeout(function(){
                                jQuery('#wp-chatbot-editor').prop("disabled", true);
                            }, globalwpw.settings.preLoadingTime*2.2)
                            
                        }else if(json.type=='checkbox'){
                            var html = '';
                            jQuery.each(json.config.option, function(key, value){                            
                                html += '<input type="checkbox" class="qcld-chatbot-checkbox" value="'+value.value+'">'+value.label+'<br>';
                            })
                            if(json.hasOwnProperty("additional") && json.additional!=''){
								label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
							}
							wpwMsg.double(label, html);
							
                        }else if(json.type=='html'){

                            if(json.hasOwnProperty("show_as_menu") && json.show_as_menu==1){
                                wpwMsg.single_nobg(json.config.default.replace("#name", localStorage.getItem('shopper')));
                            }else{
                                wpwMsg.single(json.config.default.replace("#name", localStorage.getItem('shopper')));
                            }
                            
                            setTimeout(function(){
                                if(!json.hasOwnProperty("show_as_menu") || json.show_as_menu!=1){
                                    wpwTree.formbuilder();
                                }
                                
                            }, globalwpw.settings.preLoadingTime)
                            

                        }else if(json.type=='date_picker'){
                            
                            if(json.hasOwnProperty("additional") && json.additional!=''){
								label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
							}
							wpwMsg.single(label);
							
                            jQuery('#wp-chatbot-editor').blur();
                            jQuery('#wp-chatbot-editor').datetimepicker();
                        }else if(json.type=='number'){

                            if(json.hasOwnProperty("additional") && json.additional!=''){
								label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
							}
							wpwMsg.single(label);
							
                            jQuery('#wp-chatbot-editor').addClass("qcnumberfield");
							if(json.hasOwnProperty("config") && json.config.hasOwnProperty("min") && json.config.min>0){
								jQuery('#wp-chatbot-editor').attr("minlength", json.config.min);
							}
							
							if(json.hasOwnProperty("config") && json.config.hasOwnProperty("max") && json.config.max>0){
								jQuery('#wp-chatbot-editor').attr("maxlength", json.config.max);
							}
    
                        }else if(json.type=='email'){

                            if(json.hasOwnProperty("additional") && json.additional!=''){
								label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
							}
							wpwMsg.single(label);
							
                            jQuery('#wp-chatbot-editor').attr("type", "email");
    
                        }else if(json.type=='url'){

                            if(json.hasOwnProperty("additional") && json.additional!=''){
								label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
							}
							wpwMsg.single(label);
							
                            jQuery('#wp-chatbot-editor').attr("type", "url");
    
                        }else if(json.type=='phone'){

                            
							wpwMsg.single(label);
							
                            jQuery('#wp-chatbot-editor').addClass('qcphonebasicus');
    
                        }else if(json.type=='calculation'){
                            wpwMsg.single(json.calresult);
                            setTimeout(function(){
                                wpwTree.formbuilder(json.calvalue);
                            }, globalwpw.settings.preLoadingTime)

                        }else if(json.type=='hidden'){
                            var email = json.config.default;
                            if( globalwpw.settings.obj.order_login == 1 && json.slug=='email' ){
                                email = globalwpw.settings.obj.order_email;
                            }
                            wpwTree.formbuilder(email);

                        }else if(json.type=='file'){
							if(json.hasOwnProperty("additional") && json.additional!=''){
								label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
							}
							
							jQuery('#wp-chatbot-editor').attr("type", "file");
							jQuery('#wp-chatbot-editor').attr("multiple", "multiple");
							
							
							wpwMsg.single(label);
						}else{
                            if(json.hasOwnProperty("additional") && json.additional!=''){
								label +='<i class="wpbot_addition_label">'+json.additional+'</i>'; 
							}
							wpwMsg.single(label);
							
                        }

                    }else{

                        
                        if( json.status == 'complete' && typeof(json.url) !=="undefined" ){
                            window.open(json.url, '_blank');
                        }
                        

                        if($('.chatbot_intent_reload').length > 0){
							$('.chatbot_intent_reload').attr('data-step', 'complete');
						}

                        globalwpw.formfieldid = '';
                        localStorage.setItem("formfieldid",  globalwpw.formfieldid);
                        globalwpw.formStep='welcome';
                        localStorage.setItem("formStep",  globalwpw.formStep);
                        globalwpw.formid='';
                        localStorage.setItem("formid",  globalwpw.formid);
                        globalwpw.wildCard = 0;
                        localStorage.setItem("wildCard",  globalwpw.wildCard);
                        globalwpw.formentry = 0;
                        localStorage.setItem("formentry",  globalwpw.formentry);
                        wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));

                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                        if(globalwpw.settings.obj.disable_repeatative!=1){
                            setTimeout(function(){
                                if(globalwpw.wildcards != ''){
                                    wpwMsg.double_nobg(serviceOffer, globalwpw.wildcards);
                                }else{
                                    wpwMsg.single(serviceOffer)
                                }
                            }, globalwpw.settings.preLoadingTime);
                        }else{
                            setTimeout(function(){
                                wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                            }, globalwpw.settings.preLoadingTime*2);
                        }

                        if(jQuery('.chatbot_intent_reload').length>0){
                            jQuery('.chatbot_intent_reload').remove();
                        }

                    }

                })
            }

        },
        formbuilder_force_complete:function(msg){
            //destroy date picker
            //if ( jQuery.isFunction(jQuery.fn.datetimepicker) ) {
                if ( typeof jQuery.fn.datetimepicker === 'function' ) {
                    jQuery('#wp-chatbot-editor').datetimepicker('destroy');
                }
                jQuery('#wp-chatbot-editor').attr("type", "text");
                jQuery('#wp-chatbot-editor').prop("disabled", false);
                jQuery('#wp-chatbot-editor').removeAttr("multiple");

                jQuery('#wp-chatbot-editor').removeClass('qcphonebasicus');
                jQuery('#wp-chatbot-editor').removeClass("qcnumberfield");
                jQuery('#wp-chatbot-editor').removeAttr("minlength");
                jQuery('#wp-chatbot-editor').removeAttr("maxlength");


                if(globalwpw.wildCard==7 && globalwpw.formStep=='field'){
                    var data = {'action':'wpbot_capture_form_value','formid':globalwpw.formid, 'fieldid': globalwpw.formfieldid, 'answer': msg, 'entry':globalwpw.formentry, 'session': localStorage.getItem('botsessionid'), 'name':globalwpw.hasNameCookie, 'email':localStorage.getItem('shopperemail'), 'url': window.location.href, 'do_complete': 1};

                    globalwpw.formfieldid = '';
                    localStorage.setItem("formfieldid",  globalwpw.formfieldid);
                    globalwpw.formStep='welcome';
                    localStorage.setItem("formStep",  globalwpw.formStep);
                    globalwpw.formid='';
                    localStorage.setItem("formid",  globalwpw.formid);
                    globalwpw.wildCard = 0;
                    localStorage.setItem("wildCard",  globalwpw.wildCard);
                    globalwpw.formentry = 0;
                    localStorage.setItem("formentry",  globalwpw.formentry);

                    wpwKits.ajax(data).done(function (response) {
                        var json=$.parseJSON(response);
                        if( json.status == 'complete' ){
                            //
                        }
                    })
                }
        },
        bargain:function(msg){

            if(globalwpw.wildCard==9 && globalwpw.bargainStep == 'welcome' && globalwpw.bargainId != ''){

                var data = {
                    'action':'qcld_woo_bargin_product',
                    'qcld_woo_map_product_id':globalwpw.bargainId,
                    'qcld_woo_map_variation_id':globalwpw.bargainVId,
                    'security': globalwpw.settings.obj.map_get_ajax_nonce

                };
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
                wpwKits.ajax(data).done(function (response) {

                    var restWarning = response.html;
                    var confirmBtn  = wpwKits.render(globalwpw.settings.obj.your_offer_price);
                    wpwMsg.double(restWarning,confirmBtn);

                    globalwpw.bargainStep = 'bargain';
                    globalwpw.bargainLoop  = 0;
                    globalwpw.bargainPrice = '';
                    globalwpw.bargainId = globalwpw.bargainId;
                    globalwpw.bargainVId = globalwpw.bargainVId;
                    localStorage.setItem("wildCard",  globalwpw.bargainStep);
                    localStorage.setItem("bargainLoop",  globalwpw.bargainLoop);
                    localStorage.setItem("bargainPrice",  globalwpw.bargainPrice);
                    localStorage.setItem("bargainId",  globalwpw.bargainId);
                    localStorage.setItem("bargainVId",  globalwpw.bargainVId);

                });


            }else if(globalwpw.wildCard==9 && globalwpw.bargainStep == 'bargain' && msg !== ""){
                
                    // setTimeout(function(){
                    var string = msg;
					
                    //var spliting = string.match(/\d+/g);
					var spliting = string.match(/\d+(?:\.\d+)?/g);
					
					if(spliting===null){
						wpwMsg.single(wpwKits.render(globalwpw.settings.obj.your_offer_price_again));

					}else{
						
					
						var msg = string.match(/\d+(?:\.\d+)?/g).map(Number);

						var data = {'action':'qcld_woo_bargin_product_price',
                                'qcld_woo_map_product_id':globalwpw.bargainId,
                                'qcld_woo_map_variation_id':globalwpw.bargainVId, 
                                'price': parseFloat(msg),
                                'security': globalwpw.settings.obj.map_get_ajax_nonce
                        };
                        if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                            $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                        }
						wpwKits.ajax(data).done(function (response) {
							
							globalwpw.bargainStep  = 'bargain';
							globalwpw.bargainPrice = response.sale_price;
							localStorage.setItem("bargainStep",  globalwpw.bargainStep);
							localStorage.setItem("bargainPrice",  globalwpw.bargainPrice);

							if(response.confirm == 'success'){
                                // If user provide price below minimum price
                                
                                var bargainModalLoop = parseFloat(localStorage.getItem("bargainModalLoop")) + 1;
                                localStorage.setItem("bargainModalLoop",  bargainModalLoop );

                                var qcld_bargain_allowed_timesss = parseInt(globalwpw.settings.obj.qcld_bargain_allowed_times) + 1;

                                if(localStorage.getItem("bargainModalLoop") == parseInt(qcld_bargain_allowed_timesss)){
								//if( globalwpw.bargainLoop == 1){
									var your_low_price_alert  = wpwKits.render(globalwpw.settings.obj.your_low_price_alert);
									var confirmBtn1  = your_low_price_alert.replace("{offer price}", parseFloat(msg) + globalwpw.settings.obj.currency_symbol);
									var your_too_low_price_alert  = wpwKits.render(globalwpw.settings.obj.your_too_low_price_alert);
									var restWarning  = your_too_low_price_alert.replace("{minimum amount}", globalwpw.bargainPrice + globalwpw.settings.obj.currency_symbol);

									var confirmBtn='<span class="qcld-bargin-bot-confirm-add-to-cart" confirm-data="yes" >'+wpwKits.render(globalwpw.settings.obj.yes)+'</span> <span> '+wpwKits.render(globalwpw.settings.obj.or)+' </span><span class="qcld-chatbot-bargin-confirm-btn"  confirm-data="no">'+wpwKits.render(globalwpw.settings.obj.no)+'</span>';
									wpwMsg.triple_nobg(confirmBtn1,restWarning,confirmBtn);

									globalwpw.bargainLoop  = 0;
									localStorage.setItem("bargainModalLoop",  globalwpw.bargainLoop);

								}else{
									var restWarning= response.html;
									wpwMsg.single(response.html);

									//globalwpw.bargainLoop  = 1;
									//localStorage.setItem("wildCard",  globalwpw.bargainLoop);
								}


							}else if(response.confirm == 'agree'){
								// if user provide resonable price.
								var restWarning= response.html;
								wpwMsg.single(restWarning);
								setTimeout(function(){
									var data = {'action':'qcld_woo_bargin_product_confirm',
                                    'qcld_woo_map_product_id':globalwpw.bargainId, 
                                    'price': globalwpw.bargainPrice,
                                    'security': globalwpw.settings.obj.map_get_ajax_nonce
                                };
                                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                                }
									wpwKits.ajax(data).done(function (response) {


                                        var confirmBtn='<span class="qcld-bargin-bot-confirm-add-to-cart" confirm-data="yes" >'+wpwKits.render(globalwpw.settings.obj.yes)+'</span> <span> '+wpwKits.render(globalwpw.settings.obj.or)+' </span><span class="qcld-chatbot-bargin-confirm-btn"  confirm-data="no">'+wpwKits.render(globalwpw.settings.obj.no)+'</span>';
                                    

                                            //wpwMsg.single(response.html);
											wpwMsg.double_nobg(response.html, confirmBtn);
											globalwpw.wildCard = 9;
											globalwpw.bargainStep  = 'bargain';
											globalwpw.bargainPrice =  globalwpw.bargainPrice;
											localStorage.setItem("wildCard",  globalwpw.wildCard);
											localStorage.setItem("wildCard",  globalwpw.bargainStep);
											localStorage.setItem("wildCard",  globalwpw.bargainPrice);
									});

								},globalwpw.settings.preLoadingTime);

							}else if(response.confirm == 'default'){

								wpwMsg.double_nobg(response.html, '');

							}else{
								wpwMsg.single(response.html);
							}
							
						});
					}
               // },globalwpw.settings.preLoadingTime);

            }else if(globalwpw.wildCard==9 && globalwpw.bargainStep == 'confirm'){

                setTimeout(function(){

                    var data = {'action':'qcld_woo_bargin_product_confirm',
                            'qcld_woo_map_product_id':globalwpw.bargainId, 
                            'price': globalwpw.bargainPrice,
                            'security': globalwpw.settings.obj.map_get_ajax_nonce
                        };
                        if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                            $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                        }
                    wpwKits.ajax(data).done(function (response) {

                        // map_acceptable_price
                        var restWarning = response.html;
                        var map_acceptable_price  = globalwpw.settings.obj.map_acceptable_price;
                        //var confirmBtn1  = map_acceptable_price.replace("{offer price}", globalwpw.bargainPrice + globalwpw.settings.obj.currency_symbol);
                        var confirmBtn1  = map_acceptable_price;
                        //var confirmBtn1  = '<p>Great! I am creating a one time discount coupon valid for you only.</p>';
                        wpwMsg.double(confirmBtn1,restWarning);

                        globalwpw.wildCard = 0;
                        globalwpw.bargainStep  = 'welcome';
                        globalwpw.bargainPrice = '';
                        localStorage.setItem("wildCard",  globalwpw.wildCard);
                        localStorage.setItem("bargainStep",  globalwpw.bargainStep);
                        localStorage.setItem("bargainPrice",  globalwpw.bargainPrice);
                        

                    });

                },globalwpw.settings.preLoadingTime);

            }else if(globalwpw.wildCard==9 && globalwpw.bargainStep == 'add_to_cart'){

                setTimeout(function(){

                    if(globalwpw.bargainVId != ''){

                        var data = {'action':'qcld_woo_bargin_product_variation_add_to_cart',
                                'product_id':globalwpw.bargainId,
                                'variation_id':globalwpw.bargainVId, 
                                'price': globalwpw.bargainPrice,
                                'security': globalwpw.settings.obj.map_get_ajax_nonce
                            };

                    }else{

                       var data = {
                        'action':'qcld_woo_bargin_product_add_to_cart',
                        'product_id':globalwpw.bargainId, 
                        'price': globalwpw.bargainPrice,
                        'security': globalwpw.settings.obj.map_get_ajax_nonce
                        };
                    }

                    if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                        $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                    }
                    wpwKits.ajax(data).done(function (response) {

                        // map_acceptable_price
                        var restWarning = response.html;

                        var confirmBtn='<div class="woo-chatbot-product-bargain-btn"><a href="'+globalwpw.settings.obj.map_get_checkout_url +'" class="qcld-modal-bargin-confirm-btn-checkout"> '+wpwKits.render(globalwpw.settings.obj.map_checkout_now_button_text)+' </a></div>';

                        //wpwMsg.single(restWarning);

                        wpwMsg.double_nobg(restWarning, confirmBtn);


                        globalwpw.wildCard = 0;
                        globalwpw.bargainStep  = 'welcome';
                        globalwpw.bargainVId = '';
                        globalwpw.bargainPrice = '';
                        localStorage.setItem("wildCard",  globalwpw.wildCard);
                        localStorage.setItem("bargainStep",  globalwpw.bargainStep);
                        localStorage.setItem("bargainVId",  globalwpw.bargainVId);
                        localStorage.setItem("bargainPrice",  globalwpw.bargainPrice);
                        

                    });

                },globalwpw.settings.preLoadingTime);

            }else if(globalwpw.wildCard==9 && globalwpw.bargainStep == 'disagree' && globalwpw.bargainLoop == 0){

                    //  map_talk_to_boss msg
                    var map_talk_to_boss  = wpwKits.render(globalwpw.settings.obj.map_talk_to_boss);
                    var confirmBtn  = map_talk_to_boss;
                    wpwMsg.single(confirmBtn);
                    globalwpw.bargainLoop = 1;
                    localStorage.setItem("bargainLoop",  globalwpw.bargainLoop);
    

            }else if(globalwpw.wildCard==9 && globalwpw.bargainStep == 'disagree' && globalwpw.bargainLoop == 1){

				var string = msg;
				var spliting = string.match(/\d+(?:\.\d+)?/g);
					
				if(spliting===null){
					wpwMsg.single(wpwKits.render(globalwpw.settings.obj.your_offer_price_again));

				}else{
					// map_get_email_address
					var map_get_email_address  = wpwKits.render(globalwpw.settings.obj.map_get_email_address);
					var confirmBtn  = map_get_email_address;
					wpwMsg.single(confirmBtn);  

				   // var string = msg;
					globalwpw.bargainPrice = msg.match(/\d+(?:\.\d+)?/g).map(Number);
					//globalwpw.bargainPrice = msg;
					//localStorage.setItem("wildCard",  globalwpw.bargainPrice);
					localStorage.setItem("finalprice",  globalwpw.bargainPrice);

					

					globalwpw.bargainLoop = 2;
					localStorage.setItem("bargainLoop",  globalwpw.bargainLoop);
				}
            }else if(globalwpw.wildCard==9 && globalwpw.bargainStep == 'disagree' && globalwpw.bargainLoop == 2){

                // map_get_email_address
                var map_thanks_test  = wpwKits.render(globalwpw.settings.obj.map_thanks_test);
                var confirmBtn  = map_thanks_test;

                setTimeout(function(){
                    
                    wpwMsg.single(confirmBtn); 

                    var data = {'action':'qcld_woo_bargin_send_query',
                                'qcld_woo_map_product_id':globalwpw.bargainId, 
                                'price':  localStorage.getItem("finalprice"), 
                                'email': msg,
                                'security': globalwpw.settings.obj.map_get_ajax_nonce
                            };
                    
                    wpwKits.ajax(data).done(function (response) {
                        //console.log(response);
                       // wpwMsg.single(confirmBtn);  

                    });

                },globalwpw.settings.preLoadingTime);

                globalwpw.bargainLoop = 0;
                localStorage.setItem("bargainLoop",  globalwpw.bargainLoop);
                globalwpw.wildCard = 0;
                globalwpw.bargainStep  = 'welcome';
                globalwpw.bargainPrice = '';
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("bargainStep",  globalwpw.bargainStep);
                localStorage.setItem("bargainPrice",  globalwpw.bargainPrice);

            }


		},
		reset: function(msg){
			
			if( globalwpw.wildCard == 25 && globalwpw.resetStep == 'welcome' ){
			
				var restWarning=wpwKits.render(globalwpw.settings.obj.reset);
				var confirmBtn='<span class="qcld-chatbot-reset-btn" reset-data="yes" >'+wpwKits.render(globalwpw.settings.obj.yes)+'</span> <span> '+wpwKits.render(globalwpw.settings.obj.or)+' </span><span class="qcld-chatbot-reset-btn"  reset-data="no">'+wpwKits.render(globalwpw.settings.obj.no)+'</span>';
				globalwpw.resetStep = 'answer'
				wpwMsg.double_nobg(restWarning,confirmBtn);
               
                setTimeout(function(){
                 //   wpwKits.disableEditor('');   
                }, 1500)
               
			}else if( globalwpw.wildCard == 25 && globalwpw.resetStep == 'answer' ){
				
				if( msg.toLowerCase() == wpwKits.render(globalwpw.settings.obj.yes).toLowerCase() ){
					console.log('Yes reset');
					$('#wp-chatbot-messages-container').html('');
                    localStorage.removeItem('shopper');
                    localStorage.removeItem('shopperphone');
                    localStorage.removeItem('shopperemail');
                    localStorage.removeItem("cx-name" );
                    localStorage.removeItem("cx-diaplayname" );
                    localStorage.removeItem("cx-languagecode" );
                    localStorage.removeItem("cx-timezone" );
					globalwpw.wildCard=0;
					globalwpw.ai_step=0;
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					localStorage.setItem("aiStep", globalwpw.ai_step);
					globalwpw.formfieldid = '';
					localStorage.setItem("formfieldid",  globalwpw.formfieldid);
					globalwpw.formStep='welcome';
					localStorage.setItem("formStep",  globalwpw.formStep);
					globalwpw.formid='';
					localStorage.setItem("formid",  globalwpw.formid);
					globalwpw.formentry = 0;
					localStorage.setItem("formentry",  globalwpw.formentry);
					var number = Math.random() // 0.9394456857981651
					number.toString(36); // '0.xtis06h6'
					var id = number.toString(36).substr(2); // 'xtis06h6'

					localStorage.setItem('botsessionid', id);
					wpwWelcome.greeting();
					wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
					
				}else if( msg.toLowerCase() == wpwKits.render(globalwpw.settings.obj.no).toLowerCase() ){
					console.log('No reset');
					wpwAction.bot(wpwKits.render(globalwpw.settings.obj.sys_key_help).toLowerCase());
                    wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
				}
				globalwpw.wildCard = 0;
				globalwpw.resetStep = 'welcome'
			}
        },
        dfcx: function( msg ){

            var dfReturns=wpwKits.dailogCXAction(msg, localStorage.getItem("cx-name"), localStorage.getItem("cx-timezone"), localStorage.getItem("cx-languagecode") );
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
            dfReturns.done(function( response ) {

                if(globalwpw.settings.obj.df_api_version=='v2'){
                    
                    response = $.parseJSON(response);
                    console.log( response );
                    wpwTree.df_cx_reply(response);

                    var currentPage = response.queryResult.currentPage.displayName;
                    if( currentPage == 'End Session' ){
                        globalwpw.wildCard = 0;
                        //keeping value in localstorage
                        localStorage.removeItem("wildCard",  globalwpw.wildCard);
                        localStorage.removeItem("cx-name" );
                        localStorage.removeItem("cx-diaplayname" );
                        localStorage.removeItem("cx-languagecode" );
                        localStorage.removeItem("cx-timezone" );
                    }

                }
            })

        },
		ldsuggestion: function(){
			var ldsesson_item = '';
			$.each(ldsuggestionObject.posts, function (i, post) {
				ldsesson_item += '<div class="wpbot_card_wraper"><div class="wpbot_card_image wpbot_card_image_saas"><a href="'+post.link+'"><div class="wpbot_card_caption wpbot_card_caption_saas"><h2>'+ post.title +'</h2></div></a></div></div>';
			});
			wpwMsg.double_nobg(ldsuggestionObject.main_title, ldsesson_item);
			globalwpw.wildCard = 0;
			
		}

    };
    /*
     * wpwbot Actions are divided into two part
     * shopper will response after initialize message,
     * then based on shopper activities shopper will act.
     */
    
    wpwAction={
        findkey:function(array, msg){
            var index = -1;
            $.each( array, function( key, value ) {
                value = jQuery.map(value, function(n,i){return n.toLowerCase();});
                if(value.indexOf(msg.toLowerCase()) > -1){
                    index = key;
                    return false;
                }

            });
            return index;
        },

        bot:function(msg){
            //Disable the Editor
            
//simple_response_intent
        

            wpwKits.disableEditor(wpwKits.render(globalwpw.settings.obj.agent)+' '+wpwKits.randomMsg(globalwpw.settings.obj.is_typing));

            var simple_response_intent = globalwpw.settings.obj.simple_response_intent;

            if(simple_response_intent.length>0){
                simple_response_intent = jQuery.map(simple_response_intent, function(n,i){return n.toLowerCase();});
            }

            var allformname = jQuery.map(globalwpw.settings.obj.forms, function(n,i){return n.toLowerCase();});
            var allformcommand = globalwpw.settings.obj.form_commands;

            
			
         //console.log(globalwpw.settings.obj.form_commands, allformname, globalwpw.settings.obj.form_ids);
            
         
         if(globalwpw.wildcardsHelp.indexOf(msg.toLowerCase())>-1){
             
             
                if(globalwpw.wildCard==7){
                    wpwTree.formbuilder_force_complete( msg );
                }
			
                if(msg.toLowerCase()==wpwKits.render(globalwpw.settings.obj.sys_key_help).toLowerCase()){
                    
                    globalwpw.wildCard=0;
                    var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
                    wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                }
				
                if(msg.toLowerCase()==wpwKits.render(globalwpw.settings.obj.sys_key_support).toLowerCase()){
                    globalwpw.wildCard=1;
                    globalwpw.supportStep='welcome';
                    wpwTree.support(msg);
                }
                
                if(msg.toLowerCase()==wpwKits.render(globalwpw.settings.obj.sys_key_product).toLowerCase()){
                    globalwpw.wildCard=20;
                    globalwpw.productStep='asking';
                    wpwTree.product(msg);
                }
                if(globalwpw.settings.obj.woocommerce){
                    if(msg.toLowerCase()==wpwKits.render(globalwpw.settings.obj.sys_key_catalog).toLowerCase()){
                        globalwpw.wildCard=20;
                        globalwpw.productStep='search';
                        wpwKits.sugestCat();
                    }

                    if(msg.toLowerCase()==wpwKits.render(globalwpw.settings.obj.sys_key_order).toLowerCase()){
                        globalwpw.wildCard=21;
                        globalwpw.orderStep='welcome';
                        wpwTree.order(msg);
                    }
                }

				if(msg.toLowerCase()==wpwKits.render(globalwpw.settings.obj.email_subscription).toLowerCase()){
                    globalwpw.wildCard=3;
                    globalwpw.subscriptionStep='welcome';
                    wpwTree.subscription(msg);
                }
				if(msg.toLowerCase()==wpwKits.render(globalwpw.settings.obj.open_a_ticket).toLowerCase() && globalwpw.settings.obj.ticket_url!=''){
                    //comming
					window.open(globalwpw.settings.obj.ticket_url, '_blank');
					wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
					
                }

                if(msg.toLowerCase()==wpwKits.render(globalwpw.settings.obj.unsubscribe).toLowerCase()){
                    globalwpw.wildCard=6;
                    globalwpw.unsubscriptionStep='welcome';
                    wpwTree.unsubscription(msg);
                }
				
                if(msg.toLowerCase()==wpwKits.render(globalwpw.settings.obj.sys_key_reset).toLowerCase()){
                    globalwpw.wildCard=25;
                    globalwpw.resetStep='welcome';
                    wpwTree.reset(msg);
                }
				if(msg.toLowerCase()==wpwKits.render(globalwpw.settings.obj.sys_key_livechat).toLowerCase()){
					wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
					if(globalwpw.settings.obj.is_livechat_active){
						if(globalwpw.settings.obj.disable_livechat_operator_offline==1){
							if(globalwpw.settings.obj.is_operator_online==1){
								$(globalwpw.settings.messageWrapper).html(localStorage.getItem("wpwHitory"));
                                if($('#wbca_signup_fullname').length>0){
                                    if(localStorage.getItem('shopper')!==null){
                                        $('#wbca_signup_fullname').val(localStorage.getItem('shopper'));
                                    }
                                    if(localStorage.getItem('shopperemail')!==null){
                                        $('#wbca_signup_email').val(localStorage.getItem('shopperemail'));
                                    }
                                }
                                $("#wp-chatbot-board-container").removeClass('active-chat-board');
                                $('.wp-chatbot-container').hide();
                                $('.wpbot-saas-live-chat').show();
							}else{
                                wpwMsg.single('All operator is Offline');
                            }
						}else{
							$(globalwpw.settings.messageWrapper).html(localStorage.getItem("wpwHitory"));
                            if($('#wbca_signup_fullname').length>0){
                                if(localStorage.getItem('shopper')!==null){
                                    $('#wbca_signup_fullname').val(localStorage.getItem('shopper'));
                                }
                                if(localStorage.getItem('shopperemail')!==null){
                                    $('#wbca_signup_email').val(localStorage.getItem('shopperemail'));
                                }
                            }
                            $("#wp-chatbot-board-container").removeClass('active-chat-board');
                            $('.wp-chatbot-container').hide();
                            $('.wpbot-saas-live-chat').show();
						}
					}
					
                }

            }else if(allformname.indexOf(msg.toLowerCase()) > -1 || this.findkey(allformcommand, msg)> -1){
                //Form builder commands form name

                if(globalwpw.wildCard==7){
                    wpwTree.formbuilder_force_complete( msg );
                }
                
                var index = (allformname.indexOf(msg.toLowerCase()) > -1?allformname.indexOf(msg.toLowerCase()):this.findkey(allformcommand, msg));


                var formid=globalwpw.settings.obj.form_ids[index];
                globalwpw.wildCard=7;
                globalwpw.formStep='welcome';
                wpwTree.formbuilder(formid);

            }else if(simple_response_intent.indexOf(msg.toLowerCase()) > -1){
                if(globalwpw.wildCard==7){
                    wpwTree.formbuilder_force_complete( msg );
                }
                var data = {'action':'wpbo_search_responseby_intent','name':globalwpw.hasNameCookie,'keyword':msg, 'language':globalwpw.settings.obj.language};
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
                wpwKits.ajax(data).done(function (response) {
                    var json=$.parseJSON(response);
                    if(json.status=='success'){
                        wpwMsg.single(json.html);
						
                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);

                        if( typeof(json.followup)!=="undefined" && json.followup!='' ){
                            setTimeout(function(){
                                wpwMsg.single(json.followup);
                            }, globalwpw.settings.preLoadingTime*2);
                        }else{
                            // if(globalwpw.settings.obj.disable_repeatative!=1){
                            //     setTimeout(function(){
                            //         wpwMsg.double_nobg(serviceOffer, globalwpw.wildcards);
                            //     }, globalwpw.settings.preLoadingTime*2);
                            // }else{
                                setTimeout(function(){
                                    wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                }, globalwpw.settings.preLoadingTime*2);
                         //   }
                        }


                    }
                })

            }else{

                /*
                 *   Greeting part
                 *   bot action
                 */
				
                if(globalwpw.wildCard==0){
					//When intialize 1 and don't have cookies then keep  the name of shooper in in cookie
					if(globalwpw.initialize==1 && !localStorage.getItem('shopper')  && globalwpw.wildCard==0){
						wpwTree.greeting(msg);
					}else if(globalwpw.settings.obj.ai_df_enable==1 && globalwpw.df_status_lock==0){
						wpwTree.greeting(msg);
					}else if(localStorage.getItem('default_asking_email')){
                        wpwTree.greeting(msg);
                    }else if(localStorage.getItem('default_asking_phone')){
                        wpwTree.greeting(msg);
                    }else{

                        //simple text response wrapper
                        var data = {'action':'wpbo_search_response','name':globalwpw.hasNameCookie,'keyword':msg, 'language':globalwpw.settings.obj.language};
                        if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                            $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                        }
                        wpwKits.ajax(data).done(function (response) {

                            var json=$.parseJSON(response);
                            if(json.status=='success'){
                                if(typeof(json.category)!=="undefined" && json.category){
											
									var question='';
									$.each(json.data, function (i, obj) {
										question += '<span class="qcld-chatbot-wildcard qcld_simple_txt_response">'+ obj.query +'</span>';
									});
									
									wpwMsg.single_nobg(question);
									
								}
								else if(json.multiple){
                                    var question='';
                                    $.each(json.data, function (i, obj) {
                                        question += '<span class="qcld-chatbot-wildcard qcld_simple_txt_response">'+ obj.query +'</span>';
                                    });
                                    wpwMsg.double_nobg(wpwKits.randomMsg(globalwpw.settings.obj.did_you_mean),question);
                                     
                                }else{
                                    
                                        wpwMsg.single(json.data[0].response);
                                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
										if( typeof(json.data[0].followup)!=="undefined" && json.data[0].followup!='' ){
                                            setTimeout(function(){
                                                wpwMsg.single(json.data[0].followup);
                                            }, globalwpw.settings.preLoadingTime*2);
                                        }else{
                                            if(globalwpw.settings.obj.disable_repeatative!=1){
                                                setTimeout(function(){
                                                    wpwMsg.double_nobg(serviceOffer, globalwpw.wildcards);
                                                }, globalwpw.settings.preLoadingTime*2);
                                            }else{
                                                setTimeout(function(){
                                                    wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                                }, globalwpw.settings.preLoadingTime*2);
                                            }
                                        }
                                    
                                }
                            }else{
                                //Default intents site search
                               var openai_msg = msg;
                                msg = wpwKits.filterStopWords(msg);
                                
                                if(globalwpw.settings.obj.woocommerce){

                                    var data = {'action':'qcld_wb_chatbot_keyword', 'keyword':msg};
                                    //Products by string search ajax handler.
                                    if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                                        $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                                    }
                                    wpwKits.ajax(data).done(function( response ) {
                                        if(response.product_num==0){
                                            
                                            if(msg!='' && globalwpw.settings.obj.disable_sitesearch==''){
                                    
                                                var data = {'action':'wpbo_search_site','name':globalwpw.hasNameCookie,'keyword':msg};
                                                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                                                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                                                }
                                                wpwKits.ajax(data).done(function (response) {
                                                    var json=$.parseJSON(response);
                                                   
                                                    if(json.status=='success'){
                                                        $('span[data-wildcart="back"]').remove();
                                                        wpwMsg.single_nobg(json.html+'<span class="qcld-chatbot-wildcard"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                                    }else if(wp_chatbot_obj.open_ai_enable == "1"){
                                                        var data = {'action':'openai_response','name':globalwpw.hasNameCookie,'keyword':openai_msg};
                                                        wpwKits.ajax(data).done(function (res) {
                                                            var json=$.parseJSON(res);
                                                            if(json.status=='success'){
                                                                setTimeout(function(){
                                                                    wpwMsg.single( json.message );
                                                                },globalwpw.settings.preLoadingTime)
                                                            }
                                                        })
                                                    }else{
                                                        
                                                        var data = {'action':'wpbo_failed_response','name':globalwpw.hasNameCookie,'keyword':msg};
                                                            wpwKits.ajax(data).done(function (res) {
                                                                //
                                                            })
                                                        
                                                        if(globalwpw.counter == globalwpw.settings.obj.no_result_attempt_count || globalwpw.settings.obj.no_result_attempt_count == 0 ){
                                                                
                                                            wpwMsg.single(wpwKits.randomMsg(json.html));
                                                            
                                                                setTimeout(function(){
                                                                    var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                                                    wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                                                                },globalwpw.settings.preLoadingTime)
                                                            
                                                            globalwpw.counter = 0;
                                                            
                                                        }else{
                                                            globalwpw.counter++;
                                                            wpwMsg.single(wpwKits.randomMsg(json.html));
                                                        }
                                                       
                                                    }
                                                    globalwpw.wildCard=0;
                                                });
                                            }else{
                                                globalwpw.wildCard=0;
                                                wpwMsg.single(wpwKits.randomMsg(globalwpw.settings.obj.empty_filter_msg));
                                                
                                                if(globalwpw.settings.obj.disable_repeatative!=1){
                                                    setTimeout(function(){
                                                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                                        wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                                                    },globalwpw.settings.preLoadingTime)
                                                }else{
                                                    setTimeout(function(){
                                                        wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                                    }, globalwpw.settings.preLoadingTime*2);
                                                }
            
                                                
                                            }
                
                                        }else {
                                            
                                            var productSucces= wpwKits.randomMsg(globalwpw.settings.obj.product_success)+" <strong>"+msg+"</strong>!";
                                            wpwMsg.double_nobg(productSucces,response.html);
                
                                            if(response.per_page >= response.product_num){
                                                setTimeout(function () {
                                                    var searchAgain = wpwKits.randomMsg(globalwpw.settings.obj.product_infinite);
                                                    wpwMsg.single(searchAgain);
                                                    //keeping value in localstorage
                                                    globalwpw.wildCard=20;
                                                    globalwpw.productStep='search';
                                                    localStorage.setItem("productStep",  globalwpw.productStep);
                                                },globalwpw.settings.wildcardsShowTime);
                                            }	
                                            
                                        }
                                        
                
                                    });

                                }else{

                                    if(msg!='' && globalwpw.settings.obj.disable_sitesearch==''){
                                    
                                        var data = {'action':'wpbo_search_site','name':globalwpw.hasNameCookie,'keyword':msg};
                                        if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                                            $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                                        }
                                        wpwKits.ajax(data).done(function (response) {
                                            var json=$.parseJSON(response);
                                            console.log(json.status)
                                            if(json.status=='success'){
                                                $('span[data-wildcart="back"]').remove();
                                                wpwMsg.single_nobg(json.html+'<span class="qcld-chatbot-wildcard"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                                
                                            }else if(globalwpw.settings.obj.open_ai_enable == "1"){
                                                var data = {'action':'openai_response','name':globalwpw.hasNameCookie,'keyword':openai_msg};
                                                wpwKits.ajax(data).done(function (res) {
                                                    var json=$.parseJSON(res);
                                                    if(json.status=='success'){
                                                        setTimeout(function(){
                                                            wpwMsg.single( json.message);
                                                        },globalwpw.settings.preLoadingTime)
                                                    }
                                                })
                                            }else{
                                                
                                                var data = {'action':'wpbo_failed_response','name':globalwpw.hasNameCookie,'keyword':msg};
                                                    wpwKits.ajax(data).done(function (res) {
                                                        //
                                                    })
                                                
                                                if(globalwpw.counter == globalwpw.settings.obj.no_result_attempt_count || globalwpw.settings.obj.no_result_attempt_count == 0 ){
                                                        
                                                    wpwMsg.single(wpwKits.randomMsg(json.html));
                                                    
                                                        setTimeout(function(){
                                                            var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                                            wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                                                        },globalwpw.settings.preLoadingTime)
                                                    
                                                    globalwpw.counter = 0;
                                                    
                                                }else{
                                                    globalwpw.counter++;
                                                    wpwMsg.single(wpwKits.randomMsg(json.html));
                                                }
                                               
                                            }
                                            globalwpw.wildCard=0;
                                        });
                                    }else if(wp_chatbot_obj.open_ai_enable == "1"){
                                        var data = {'action':'openai_response','name':globalwpw.hasNameCookie,'keyword':openai_msg};
                                        wpwKits.ajax(data).done(function (res) {
                                            var json=$.parseJSON(res);
                                            if(json.status=='success'){
                                                setTimeout(function(){
                                                    wpwMsg.single( json.message );
                                                },globalwpw.settings.preLoadingTime)
                                            }
                                        })
                                    }else{
                                        globalwpw.wildCard=0;
                                        wpwMsg.single(wpwKits.randomMsg(globalwpw.settings.obj.empty_filter_msg));
                                        
                                        if(globalwpw.settings.obj.disable_repeatative!=1){
                                            setTimeout(function(){
                                                var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                                wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                                            },globalwpw.settings.preLoadingTime)
                                        }else{
                                            setTimeout(function(){
                                                wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                            }, globalwpw.settings.preLoadingTime*2);
                                        }
    
                                        
                                    }
                                }

                            }

                        })
                        
                        
						
					}
					
					
					
                    //
					
                }
                if(globalwpw.settings.obj.woocommerce){
                    //Product
                    if(globalwpw.wildCard==20){
                        
                        wpwTree.product(msg);
                    }

                    /*
                    *   order status part
                    *   bot action
                    */
                    if(globalwpw.wildCard==21){
                        wpwTree.order(msg);
                    }
                }
              
                if(globalwpw.wildCard==1){
                    wpwTree.support(msg);
                }
				if(globalwpw.wildCard==3){
                    wpwTree.subscription(msg);
                }
                if(globalwpw.wildCard==6){
                    wpwTree.unsubscription(msg);
                }

                if(globalwpw.wildCard==7){
                    wpwTree.formbuilder(msg);
                }
                if(globalwpw.wildCard==9){
                    wpwTree.bargain(msg);
                }
				if(globalwpw.wildCard==25){
                    wpwTree.reset(msg);
                }
                
                if(globalwpw.wildCard==26){
                    wpwTree.dfcx(msg);
                }
                if(globalwpw.wildCard==30){
                    wpwTree.ldsuggestion();
                }

            }
        },
        shopper:function (msg) {
            wpwMsg.shopper(msg);
            if(globalwpw.wildCard==1) {
                this.bot(msg);
            }else if(globalwpw.settings.obj.ai_df_enable==1 && globalwpw.wildCard==0 && globalwpw.ai_step==1 && globalwpw.df_status_lock==0){
                this.bot(msg);
            } else{
				var filterMsg=msg;
                //Filtering the user given messages by stopwords
				if(!localStorage.getItem('shopper')){
					filterMsg = msg;
				}

                //handle empty filterMsg as repeat the message.
                if(filterMsg=="")  {
					//need to add condition for email collecting
					if(globalwpw.settings.obj.ask_email_wp_greetings==1){
						this.bot(msg);
					}else{
					
							globalwpw.repeatQueryEmpty=wpwKits.randomMsg(globalwpw.settings.obj.empty_filter_msg);
							globalwpw.emptymsghandler++;
						
                        wpwMsg.single(globalwpw.repeatQueryEmpty);
                        if(globalwpw.settings.obj.disable_repeatative!=1){
                            setTimeout(function(){
                                var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                            },globalwpw.settings.preLoadingTime)
                        }else{
                            setTimeout(function(){
                                wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                            }, globalwpw.settings.preLoadingTime*2);
                        }
					}

                }else {
                    globalwpw.emptymsghandler=0;
                    this.bot(filterMsg);
                }

            }

        }
    };



    //bargain initiate function
    $(document).on('click', '.woo_minimum_accept_price-bargin', function(e){

       

        var product_id = $(this).attr('product_id');
        var variation_id = '';

        var variable_check = $('.woo_minimum_accept_price-bargin').parent().parent().find('.variation_id');

        if($( variable_check ).hasClass( "variation_id" )){

            var variation_id = $('.variation_id').val();

            if( variation_id == '0' || variation_id == '' ) {
                alert('Please select some product options before adding this product to your cart.');
                return false;
            }

        }
        
        globalwpw.wildCard = 9;
        globalwpw.bargainStep = 'welcome';
        globalwpw.bargainId = product_id;
        globalwpw.bargainVId = variation_id;
        globalwpw.bargainPrice = '';
        localStorage.setItem("wildCard",  globalwpw.wildCard);
        localStorage.setItem("wildCard",  globalwpw.bargainStep);
        localStorage.setItem("wildCard",  globalwpw.bargainId);
        localStorage.setItem("wildCard",  globalwpw.bargainPrice);
        localStorage.setItem("bargainVId",  globalwpw.bargainVId);
        
        if(!localStorage.getItem('shopper')){
            $.cookie("shopper", "Guest", { expires : 365 });
            localStorage.setItem('shopper',"Guest");
        }
        globalwpw.ai_step==1;
        
        
        if($('.active-chat-board').length>0){
            wpwTree.bargain();
    
        }else{
            $('#wp-chatbot-ball').trigger('click');
            
            setTimeout(function(){
                wpwTree.bargain('');
            }, globalwpw.settings.preLoadingTime)
                
            
        }
        
    });

    // bargain confirm ...
    $(document).on('click','.qcld-chatbot-bargin-confirm-btn',function (e) {
        e.preventDefault();
        var shopperChoice=$(this).text();
        wpwMsg.shopper_choice(shopperChoice);
        var actionType=$(this).attr('confirm-data');
        if(actionType=='yes'){

            globalwpw.bargainStep = 'confirm';
            localStorage.setItem("wildCard",  globalwpw.bargainStep);
            wpwTree.bargain();
        } else if(actionType=='no'){
            globalwpw.bargainStep = 'disagree';
            localStorage.setItem("wildCard",  globalwpw.bargainStep);
            globalwpw.bargainLoop = 0;
            localStorage.setItem("wildCard",  globalwpw.bargainLoop);
            wpwTree.bargain();
        }
    });

    $(document).on('click','.qcld-bargin-bot-confirm-add-to-cart',function (e) {
        e.preventDefault();
        var shopperChoice=$(this).text();
        wpwMsg.shopper_choice(shopperChoice);

        globalwpw.bargainId = localStorage.getItem('bargainId');
        globalwpw.bargainVId = localStorage.getItem('bargainVId');
        globalwpw.bargainPrice = localStorage.getItem('bargainPrice');

        globalwpw.bargainStep = 'add_to_cart';
        localStorage.setItem("bargainStep",  globalwpw.bargainStep);
        wpwTree.bargain();

    });



    $(document).on('click','.qcld-modal-bargin-bot-confirm-exit-intent',function (e) {
        e.preventDefault();
        var shopperChoice=$(this).text();
        wpwMsg.shopper_choice(shopperChoice);
        var actionType=$(this).attr('confirm-data');
        if(actionType=='yes'){
            $('.woo_minimum_accept_price-bargin').trigger('click');
        }
    });

    

    /*
     * wpwBot Plugin Creation without selector and
     * wpwbot and shoppers all activities will be handled.
     */
    $.wpwbot = function(options) {
        
        //Using plugins defualts values or overwrite by options.
        var settings = $.extend({}, $.wpwbot.defaults, options);
        //Updating global settings
        globalwpw.settings=settings;
        //updating the helpkeywords

        if(globalwpw.settings.obj.woocommerce){

            globalwpw.wildcardsHelp=[wpwKits.render(globalwpw.settings.obj.sys_key_help).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_support).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_reset).toLowerCase(), wpwKits.render(globalwpw.settings.obj.email_subscription).toLowerCase(), wpwKits.render(globalwpw.settings.obj.unsubscribe).toLowerCase(), wpwKits.render(globalwpw.settings.obj.sys_key_livechat).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_product).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_catalog).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_order).toLowerCase() ]
			
			if(globalwpw.settings.obj.ticket_url!='' && globalwpw.settings.obj.disable_open_ticket==""){
				globalwpw.wildcardsHelp.push(wpwKits.render(globalwpw.settings.obj.open_a_ticket).toLowerCase())
			}
			
        }else{
            globalwpw.wildcardsHelp=[wpwKits.render(globalwpw.settings.obj.sys_key_help).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_support).toLowerCase(),wpwKits.render(globalwpw.settings.obj.sys_key_reset).toLowerCase(), wpwKits.render(globalwpw.settings.obj.email_subscription).toLowerCase(), wpwKits.render(globalwpw.settings.obj.unsubscribe).toLowerCase(), wpwKits.render(globalwpw.settings.obj.sys_key_livechat).toLowerCase() ]
			if(globalwpw.settings.obj.ticket_url!='' && globalwpw.settings.obj.disable_open_ticket==""){
				globalwpw.wildcardsHelp.push(wpwKits.render(globalwpw.settings.obj.open_a_ticket).toLowerCase())
			}
        }
        

        //updating wildcards
        globalwpw.wildcards='';
        
		
		
		//Adding custom Intents
        
        if(wpwKits.render(globalwpw.settings.obj.start_menu) !=''){
            var menu_html = '';
            var menu_items = $.parseHTML($.trim(wpwKits.render(globalwpw.settings.obj.start_menu)));
            $(menu_items).each(function(){
                
                if( $(this).prop('tagName') == 'SPAN' ){
                    //disable_voice_message
                    if( $(this).hasClass('wpbd_voice_message')){
                        if( globalwpw.settings.obj.disable_voice_message=="" ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('qcld-chatbot-site-search') ){
                        if( globalwpw.settings.obj.disable_sitesearch=="" ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('qcld-chatbot-suggest-email') && ! $(this).hasClass('wpbd_feedback') ){
                        if( globalwpw.settings.obj.disable_feedback=='' ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('wpbd_feedback') ){
                        if( globalwpw.settings.obj.disable_leave_feedback=='' ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('wpbo_live_chat') ){
                        if(globalwpw.settings.obj.disable_livechat_operator_offline==1){
                            if(globalwpw.settings.obj.is_operator_online==1){
                                if( globalwpw.settings.obj.livechat=='1' && !globalwpw.settings.obj.is_livechat_active ){
                                    menu_html += $(this).prop('outerHTML');
                                }
                            }
                        }
                    }else if( $(this).hasClass('qcld-chatbot-suggest-phone') ){
                        if( globalwpw.settings.obj.call_gen=="" ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('wpbd_subscription') ){
                        if( globalwpw.settings.obj.disable_email_subscription=="" ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('qcld-chatbot-wildcard') && $(this).attr('data-wildcart') == 'product' ){
                        if( globalwpw.settings.obj.disable_product_search!=1 ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('qcld-chatbot-wildcard') && $(this).attr('data-wildcart') == 'catalog' ){
                        if( globalwpw.settings.obj.disable_catalog!=1 ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('qcld-chatbot-wildcard') && $(this).attr('data-wildcart') == 'featured' ){
                        if( globalwpw.settings.obj.disable_featured_product!=1 ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('qcld-chatbot-wildcard') && $(this).attr('data-wildcart') == 'sale' ){
                        if( globalwpw.settings.obj.disable_sale_product!=1 ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('qcld-chatbot-wildcard') && $(this).attr('data-wildcart') == 'order' ){
                        if( globalwpw.settings.obj.disable_order_status!=1 ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('qcld-chatbot-wildcard') && $(this).attr('data-wildcart') == 'support' ){
                        if( globalwpw.settings.obj.disable_faq=='' ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('qcld-chatbot-wildcard') && $(this).attr('data-wildcart') == 'messenger' ){
                        if( globalwpw.settings.obj.enable_messenger==1 ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else if( $(this).hasClass('qcld-chatbot-wildcard') && $(this).attr('data-wildcart') == 'whatspp' ){
                        if( globalwpw.settings.obj.enable_whats==1 ){
                            menu_html += $(this).prop('outerHTML');
                        }
                    }else{
                        menu_html += $(this).prop('outerHTML');
                    }
                    
                }
            })

            if( menu_html != '' ){
                globalwpw.wildcards = menu_html;
            }else{
                globalwpw.wildcards = wpwKits.render(globalwpw.settings.obj.start_menu);
            }

            

        }else{

        

        if(globalwpw.settings.obj.disable_livechat=="" && globalwpw.settings.obj.is_livechat_active) {
			
			if(globalwpw.settings.obj.disable_livechat_operator_offline==1){
				if(globalwpw.settings.obj.is_operator_online==1){
					globalwpw.wildcards += '<span class="qcld-chatbot-custom-intent" data-text="'+wpwKits.render(globalwpw.settings.obj.sys_key_livechat)+'" >'+wpwKits.render(globalwpw.settings.obj.livechat_label)+'</span>';
				}
			}else{
				globalwpw.wildcards += '<span class="qcld-chatbot-custom-intent" data-text="'+wpwKits.render(globalwpw.settings.obj.sys_key_livechat)+'" >'+wpwKits.render(globalwpw.settings.obj.livechat_label)+'</span>';
			}
			
		}

		if(globalwpw.settings.obj.disable_email_subscription=="") {
			globalwpw.wildcards += '<span class="qcld-chatbot-default wpbd_subscription">' + wpwKits.render(globalwpw.settings.obj.email_subscription) + '</span>';
		}
		
		if(globalwpw.settings.obj.disable_str_categories=="") {
			globalwpw.wildcards += '<span class="qcld-chatbot-wildcard wpbd_str_categories">' + wpwKits.render(globalwpw.settings.obj.str_categories) + '</span>';
		}
		
		if(globalwpw.settings.obj.custom_intent[0]!='' && globalwpw.settings.obj.ai_df_enable==1){
			
			for(var i=0;i<globalwpw.settings.obj.custom_intent.length;i++){
				
				if(globalwpw.settings.obj.custom_intent[i]!='' && globalwpw.settings.obj.custom_intent_label[i]!=''){
					globalwpw.wildcards += '<span class="qcld-chatbot-custom-intent" data-text="'+globalwpw.settings.obj.custom_intent_label[i]+'" >'+globalwpw.settings.obj.custom_intent_label[i]+'</span>';
				}
				
			}
			
        }
        
        if(globalwpw.settings.obj.custom_menu[0]!=''){
			
			for(var i=0;i<globalwpw.settings.obj.custom_menu.length;i++){
				
				if(globalwpw.settings.obj.custom_menu[i]!='' && globalwpw.settings.obj.custom_menu_link[i]!=''){
					globalwpw.wildcards += '<span class="qcld-chatbot-wildcard qcld-chatbot-buttonlink" data-link="'+globalwpw.settings.obj.custom_menu_link[i]+'" data-target="'+globalwpw.settings.obj.custom_menu_target[i]+'" data-type="'+globalwpw.settings.obj.custom_menu_type[i]+'" >'+globalwpw.settings.obj.custom_menu[i]+'</span>';
				}
				
			}
			
		}
		
		
		
		if(globalwpw.settings.obj.livechat=='1' && !globalwpw.settings.obj.is_livechat_active) {
			globalwpw.wildcards += '<span class="qcld-chatbot-default wpbo_live_chat" >'+wpwKits.render(globalwpw.settings.obj.livechat_button_label)+'</span>';
		}
        if(globalwpw.settings.obj.woocommerce){
            if(globalwpw.settings.obj.disable_product_search!=1) {
                globalwpw.wildcards += '<span class="qcld-chatbot-wildcard"  data-wildcart="product">' + wpwKits.randomMsg(globalwpw.settings.obj.wildcard_product) + '</span>';
            }
            if(globalwpw.settings.obj.disable_catalog!=1) {
                globalwpw.wildcards += '<span class="qcld-chatbot-wildcard"  data-wildcart="catalog">' + wpwKits.randomMsg(globalwpw.settings.obj.wildcard_catalog) + '</span>';
            }
            if(globalwpw.settings.obj.disable_featured_product!=1){
                globalwpw.wildcards+='<span class="qcld-chatbot-wildcard"  data-wildcart="featured">'+wpwKits.randomMsg(globalwpw.settings.obj.featured_products)+'</span>';
            }
    
            if(globalwpw.settings.obj.disable_sale_product!=1){
                globalwpw.wildcards+='<span class="qcld-chatbot-wildcard"  data-wildcart="sale">'+wpwKits.randomMsg(globalwpw.settings.obj.sale_products)+' </span>';
            }
    
            if(globalwpw.settings.obj.disable_order_status!=1){
                globalwpw.wildcards+='<span class="qcld-chatbot-wildcard"  data-wildcart="order">'+wpwKits.randomMsg(globalwpw.settings.obj.wildcard_order)+'</span>';
            }
        }
        

		if(globalwpw.settings.obj.disable_sitesearch=='') {
			globalwpw.wildcards += '<span class="qcld-chatbot-site-search" >'+wpwKits.render(globalwpw.settings.obj.site_search)+'</span>';
		}
		
		if(globalwpw.settings.obj.disable_faq=='') {
			globalwpw.wildcards+='<span class="qcld-chatbot-wildcard"  data-wildcart="support">'+wpwKits.render(globalwpw.settings.obj.wildcard_support)+'</span>';
		}
		
		
        if(globalwpw.settings.obj.enable_messenger==1) {
            globalwpw.wildcards += '<span class="qcld-chatbot-wildcard"  data-wildcart="messenger">'+wpwKits.randomMsg(globalwpw.settings.obj.messenger_label)+'</span>';
        }
        if(globalwpw.settings.obj.enable_whats==1) {
            globalwpw.wildcards += '<span class="qcld-chatbot-wildcard"  data-wildcart="whatsapp">'+wpwKits.randomMsg(globalwpw.settings.obj.whats_label)+'</span>';
        }
		
        if(globalwpw.settings.obj.disable_feedback=='') {
            globalwpw.wildcards += '<span class="qcld-chatbot-suggest-email">'+wpwKits.render(globalwpw.settings.obj.send_us_email)+'</span>';
        }
		if(globalwpw.settings.obj.disable_leave_feedback=='') {
            globalwpw.wildcards += '<span class="qcld-chatbot-suggest-email wpbd_feedback">'+wpwKits.render(globalwpw.settings.obj.leave_feedback)+'</span>';
        }
		
        if(globalwpw.settings.obj.call_gen=="") {
            globalwpw.wildcards += '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
        }

        if(globalwpw.settings.obj.form_ids[0]!=''){
				
            for(var i=0;i<globalwpw.settings.obj.form_ids.length;i++){
                
                if(globalwpw.settings.obj.form_ids[i]!='' && globalwpw.settings.obj.forms[i]!=''){
                    globalwpw.wildcards += '<span class="qcld-chatbot-wildcard qcld-chatbot-form" data-form="'+globalwpw.settings.obj.form_ids[i]+'" >'+globalwpw.settings.obj.forms[i]+'</span>';
                }
                
            }
            
        }

        
        
    }



        //Initialize the wpwBot with greeting and if already initialize and given name then return greeting..
        if(localStorage.getItem("wpwHitory") && globalwpw.initialize==0 ){
            var wpwHistory=localStorage.getItem("wpwHitory");
            
            $(globalwpw.settings.messageWrapper).html(wpwHistory);
            //Scroll to the last element.
            wpwKits.scrollTo();
            //Now mainting the current stages tokens
            globalwpw.initialize=1;
            if(localStorage.getItem("wildCard")){
                globalwpw.wildCard=localStorage.getItem("wildCard");
            }
            if(localStorage.getItem("productStep")){
                globalwpw.productStep=localStorage.getItem("productStep");
            }
            if(localStorage.getItem("orderStep")){
                globalwpw.orderStep=localStorage.getItem("orderStep");
            }
            if(localStorage.getItem("supportStep")){
                globalwpw.supportStep=localStorage.getItem("supportStep");
            }
            if(localStorage.getItem("aiStep")){
                globalwpw.ai_step=localStorage.getItem("aiStep");
            }
            if(localStorage.getItem("formfieldid")){
                globalwpw.formfieldid=localStorage.getItem("formfieldid");
            }

            if(localStorage.getItem("formentry")){
                globalwpw.formentry=localStorage.getItem("formentry");
            }

            if(localStorage.getItem("formStep")){
                globalwpw.formStep=localStorage.getItem("formStep");
            }
            if(localStorage.getItem("formid")){
                globalwpw.formid=localStorage.getItem("formid");
            }



            //update the value for initializing.
            globalwpw.initialize=1;

        } else {
            if( wp_chatbot_obj.re_target_handler != 1 ){
                wpwWelcome.greeting();
            }
        }

        //When shopper click on send button
        $(document).on('click',settings.sendButton,function (e) {
            
            if(!$(settings.messageEditor)[0].checkValidity()){
                $(settings.messageEditor)[0].reportValidity();
            }else{
                var shopperMsg =$(settings.messageEditor).val();
                if(shopperMsg != ""){
                    wpwAction.shopper(wpwKits.htmlTagsScape(shopperMsg));
                    $(settings.messageEditor).val('');
                }
            }

            
        });

        /*
         * Or when shopper press the ENTER key
         * Then chatting functionality will be started.
         */
		
        $(document).on('keypress',settings.messageEditor,function (e) {
            if (e.which == 13||e.keyCode==13) {
                
                if(!$(settings.messageEditor)[0].checkValidity()){
                    $(settings.messageEditor)[0].reportValidity();
                }else{
                    var shopperMsg =$(settings.messageEditor).val();
                    if(shopperMsg != ""){
                        wpwAction.shopper(wpwKits.htmlTagsScape(shopperMsg));
                        $(settings.messageEditor).val('');
                    }
                }
                
                
                
            }
        });

        $(document).on('keypress','.qcwp-chatbot-search-article input',function (e) {
            
            if (e.which == 13||e.keyCode==13) {
                
                if($(this).val() != ''){
                    
                    $('.wp-chatbot-container').show();
                    $('.wp-chatbot-start-container').hide();

                    $('.wp-chatbot-container').show();
                    $('.wp-chatbot-start-container').hide();
                    var msg = $(this).val();
                    wpwMsg.shopper_choice(msg);
                    msg = wpwKits.filterStopWords(msg);
                    var data = {'action':'wpbo_search_site','name':globalwpw.hasNameCookie,'keyword':msg};
                    if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                        $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                    }
                    wpwKits.ajax(data).done(function (response) {
                        var json=$.parseJSON(response);
                        console.log(json.status)
                        if(json.status=='success'){
                            $('span[data-wildcart="back"]').remove();
                            wpwMsg.single_nobg(json.html);
                            setTimeout(function(){
                                wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                            },globalwpw.settings.preLoadingTime)
                        }else if(wp_chatbot_obj.open_ai_enable == "1"){
                            var data = {'action':'openai_response','name':globalwpw.hasNameCookie,'keyword':msg};
                            wpwKits.ajax(data).done(function (res) {
                                var json=$.parseJSON(res);
                                if(json.status=='success'){
                                    setTimeout(function(){
                                        wpwMsg.single( json.message );
                                    },globalwpw.settings.preLoadingTime)
                                }
                            })
                        }else{

                            var data = {'action':'wpbo_failed_response','name':globalwpw.hasNameCookie,'keyword':msg};
                            wpwKits.ajax(data).done(function (res) {
                                //
                            })
                            if(globalwpw.counter == globalwpw.settings.obj.no_result_attempt_count || globalwpw.settings.obj.no_result_attempt_count == 0 ){
                                                
                                wpwMsg.single(wpwKits.randomMsg(json.html));
                                
                                    setTimeout(function(){
                                        var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                        wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                                    },globalwpw.settings.preLoadingTime)
                                
                                globalwpw.counter = 0;
                                
                            }else{
                                globalwpw.counter++;
                                wpwMsg.single(wpwKits.randomMsg(json.html));
                            }

                        }

                        if( globalwpw.settings.obj.skip_wp_greetings!=1 && ! globalwpw.settings.obj.order_login && !localStorage.getItem('shopper')){
                            setTimeout(function(){
                            
                                var secondMsg=wpwKits.randomMsg(globalwpw.settings.obj.asking_name);
                                wpwMsg.single(secondMsg);
    
                            },globalwpw.settings.preLoadingTime)
                        }else if( globalwpw.settings.obj.skip_wp_greetings!=1 && ! globalwpw.settings.obj.order_login && globalwpw.settings.obj.ask_email_wp_greetings==1 && !localStorage.getItem('shopperemail') ){
                            setTimeout(function(){
                                var emailsharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_emailaddress);
                                if(globalwpw.settings.obj.enable_gdpr){
                                    wpwMsg.triple_nobg(NameGreeting, emailsharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                }else{
                                    wpwMsg.double(NameGreeting, emailsharetext);
                                }
                            },globalwpw.settings.preLoadingTime)
                        }else if( globalwpw.settings.obj.skip_wp_greetings!=1 && ! globalwpw.settings.obj.order_login && globalwpw.settings.obj.ask_phone_wp_greetings==1 && !localStorage.getItem('shopperphone')){
                            setTimeout(function(){
                                var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                                if(globalwpw.settings.obj.enable_gdpr){
                                    wpwMsg.triple_nobg(NameGreeting, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                                }else{
                                    wpwMsg.double(NameGreeting, phonesharetext);
                                }
                            },globalwpw.settings.preLoadingTime)
                        }

                    });

                    $('.qcwp-chatbot-search-article input').val('');
                }else{
                    
                    $('.qcwp-chatbot-search-article input')[0].reportValidity();
                }
                
            }
        });

        $('.qcwp-chatbot-search-article-submit').on('click', function(e){
            var obj = $('.qcwp-chatbot-search-article input')
            if(obj.val() != ''){

                $('.wp-chatbot-container').show();
                $('.wp-chatbot-start-container').hide();
                var msg = obj.val();
                wpwMsg.shopper_choice(msg);
                msg = wpwKits.filterStopWords(msg);
                var data = {'action':'wpbo_search_site','name':globalwpw.hasNameCookie,'keyword':msg};
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
                wpwKits.ajax(data).done(function (response) {
                    var json=$.parseJSON(response);
                    if(json.status=='success'){
                        $('span[data-wildcart="back"]').remove();
                        wpwMsg.single_nobg(json.html);
                        setTimeout(function(){
                            wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                        },globalwpw.settings.preLoadingTime)
                    }else if(wp_chatbot_obj.open_ai_enable == "1"){
                        var data = {'action':'openai_response','name':globalwpw.hasNameCookie,'keyword':msg};
                        wpwKits.ajax(data).done(function (res) {
                            var json=$.parseJSON(res);
                            if(json.status=='success'){
                                setTimeout(function(){
                                    wpwMsg.single( json.message );
                                },globalwpw.settings.preLoadingTime)
                            }
                        })
                    }else{

                        var data = {'action':'wpbo_failed_response','name':globalwpw.hasNameCookie,'keyword':msg};
                        wpwKits.ajax(data).done(function (res) {
                            //
                        })
                        if(globalwpw.counter == globalwpw.settings.obj.no_result_attempt_count || globalwpw.settings.obj.no_result_attempt_count == 0 ){
                                            
                            wpwMsg.single(wpwKits.randomMsg(json.html));
                            
                                setTimeout(function(){
                                    var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                    wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                                },globalwpw.settings.preLoadingTime)
                            
                            globalwpw.counter = 0;
                            
                        }else{
                            globalwpw.counter++;
                            wpwMsg.single(wpwKits.randomMsg(json.html));
                        }
                        
                    }
                    if( globalwpw.settings.obj.skip_wp_greetings!=1 && ! globalwpw.settings.obj.order_login && !localStorage.getItem('shopper')){
                        setTimeout(function(){
                        
                            var secondMsg=wpwKits.randomMsg(globalwpw.settings.obj.asking_name);
                            wpwMsg.single(secondMsg);

                        },globalwpw.settings.preLoadingTime)
                    }else if( globalwpw.settings.obj.skip_wp_greetings!=1 && ! globalwpw.settings.obj.order_login && globalwpw.settings.obj.ask_email_wp_greetings==1 && !localStorage.getItem('shopperemail') ){
                        setTimeout(function(){
                            var emailsharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_emailaddress);
                            if(globalwpw.settings.obj.enable_gdpr){
                                wpwMsg.triple_nobg(NameGreeting, emailsharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                            }else{
                                wpwMsg.double(NameGreeting, emailsharetext);
                            }
                        },globalwpw.settings.preLoadingTime)
                    }else if( globalwpw.settings.obj.skip_wp_greetings!=1 && ! globalwpw.settings.obj.order_login && globalwpw.settings.obj.ask_phone_wp_greetings==1 && !localStorage.getItem('shopperphone')){
                        setTimeout(function(){
                            var phonesharetext = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone_gt);
                            if(globalwpw.settings.obj.enable_gdpr){
                                wpwMsg.triple_nobg(NameGreeting, phonesharetext, wpwKits.render(globalwpw.settings.obj.gdpr_text));
                            }else{
                                wpwMsg.double(NameGreeting, phonesharetext);
                            }
                        },globalwpw.settings.preLoadingTime)
                    }
                });

                $('.qcwp-chatbot-search-article input').val('');
            }else{
                
                $('.qcwp-chatbot-search-article input')[0].reportValidity();
            }
        })

        //Click on the wildcards to select a service
        $(document).on('click','.qcld-chatbot-wildcard',function(){
            var wildcardData=$(this).attr('data-wildcart');
            var shooperChoice=$(this).text();
            wpwMsg.shopper_choice(shooperChoice);
            //Wild cards handling for bot.
            if(wildcardData=='product'){
                
                globalwpw.wildCard=20;
                globalwpw.productStep='asking'
                wpwAction.bot('from wildcard product');
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("productStep", globalwpw.productStep);
            }
            if(wildcardData=='catalog'){
                wpwAction.bot(wpwKits.render(globalwpw.settings.obj.sys_key_catalog).toLowerCase());
            }
            if(wildcardData=='featured'){
                globalwpw.wildCard=20;
                globalwpw.productStep='featured'
                wpwAction.bot('from wildcard product');
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("productStep", globalwpw.productStep);
            }
            if(wildcardData=='sale'){
                globalwpw.wildCard=20;
                globalwpw.productStep='sale'
                wpwAction.bot('from wildcard product');
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("productStep", globalwpw.productStep);
            }
            if(wildcardData=='order'){
                globalwpw.wildCard=21;
                globalwpw.orderStep='welcome';
                wpwAction.bot('from wildcard order');
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("orderStep", globalwpw.orderStep);
            }
            if(wildcardData=='support'){
                globalwpw.wildCard=1;
                globalwpw.supportStep='welcome';
                wpwAction.bot('from wildcard support');
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("supportStep", globalwpw.supportStep);

            }
            if(wildcardData=='back'){
				
				if(globalwpw.wildCard == 9){
					wpwTree.bargain();
				}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Faq'){

					if(!localStorage.getItem('shopper')){
						$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
						localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}
				   
					globalwpw.wildCard=1;
					globalwpw.supportStep='welcome';
					wpwAction.bot('from wildcard support');
					//keeping value in localstorage
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					localStorage.setItem("supportStep", globalwpw.supportStep);
					globalwpw.initialize=1;
					globalwpw.ai_step=1;

				}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Email Subscription'){


					if(!localStorage.getItem('shopper')){
						$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
						localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}

					globalwpw.wildCard=3;
					globalwpw.subscriptionStep='welcome';
					wpwTree.subscription();
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					localStorage.setItem("supportStep", globalwpw.supportStep);
					globalwpw.initialize=1;
					globalwpw.ai_step=1;

				}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Product Search'){

					if(!localStorage.getItem('shopper')){
						$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
						localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}

					globalwpw.wildCard=20;
					globalwpw.productStep='asking'
					wpwAction.bot('from wildcard product');
					//keeping value in localstorage
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					localStorage.setItem("productStep", globalwpw.productStep);
					globalwpw.initialize=1;
					globalwpw.ai_step=1;

				}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Catalog'){

					if(!localStorage.getItem('shopper')){
						$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
						localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}
					wpwAction.bot(wpwKits.render(globalwpw.settings.obj.sys_key_catalog).toLowerCase());
					globalwpw.initialize=1;
					globalwpw.ai_step=1;

				}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Featured Products'){

					if(!localStorage.getItem('shopper')){
						$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
						localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}
					globalwpw.wildCard=20;
					globalwpw.productStep='featured'
					wpwAction.bot('from wildcard product');
					//keeping value in localstorage
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					localStorage.setItem("productStep", globalwpw.productStep);
					
					globalwpw.initialize=1;
					globalwpw.ai_step=1;

				}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Products on Sale'){

					if(!localStorage.getItem('shopper')){
						console.log(wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
						localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}
					globalwpw.wildCard=20;
					globalwpw.productStep='sale'
					wpwAction.bot('from wildcard product');
					//keeping value in localstorage
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					localStorage.setItem("productStep", globalwpw.productStep);
					
					globalwpw.initialize=1;
					globalwpw.ai_step=1;

				}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Order Status'){

					if(!localStorage.getItem('shopper')){
						console.log(wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
						localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}
					globalwpw.wildCard=21;
					globalwpw.orderStep='welcome';
					wpwAction.bot('from wildcard order');
					//keeping value in localstorage
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					localStorage.setItem("orderStep", globalwpw.orderStep);
					
					globalwpw.initialize=1;
					globalwpw.ai_step=1;

				}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)==wpwKits.render(globalwpw.settings.obj.site_search)){

					if(!localStorage.getItem('shopper')){
						$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
						localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}

					if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
						var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}else{
						var shopperName=globalwpw.hasNameCookie;
					}
					var askEmail= wpwKits.randomMsg(wp_chatbot_obj.asking_search_keyword)
					
					wpwMsg.single(askEmail.replace("#name", shopperName));
					//Now updating the support part as .
					globalwpw.supportStep='search';
					globalwpw.wildCard=1;
					globalwpw.ai_step=1;
					globalwpw.initialize=1;
					//keeping value in localstorage
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					localStorage.setItem("supportStep",  globalwpw.supportStep);

				}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Send Us Email'){

					if(!localStorage.getItem('shopper')){
						$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
						localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}

					if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
						var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}else{
						var shopperName=globalwpw.hasNameCookie;
					}
					var askEmail= wpwKits.randomMsg(wp_chatbot_obj.asking_email);
					wpwMsg.single(askEmail);
					//Now updating the support part as .
					globalwpw.supportStep='email';
					globalwpw.wildCard=1;
					globalwpw.ai_step=1;
					globalwpw.initialize=1;
					//keeping value in localstorage
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					localStorage.setItem("supportStep",  globalwpw.supportStep);

				}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Leave A Feedback'){

					if(!localStorage.getItem('shopper')){
						$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
						localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}

					if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
						var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}else{
						var shopperName=globalwpw.hasNameCookie;
					}

						var askEmail= wpwKits.randomMsg(wp_chatbot_obj.asking_email);
						wpwMsg.single(askEmail);
						//Now updating the support part as .
						globalwpw.supportStep='email';
						globalwpw.wildCard=1;
						globalwpw.ai_step=1;
						globalwpw.initialize=1;
	 
					//keeping value in localstorage
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					localStorage.setItem("supportStep",  globalwpw.supportStep);

				}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent)=='Request Callback'){

					if(!localStorage.getItem('shopper')){
						$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
						localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}

					if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
						var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}else{
						var shopperName=globalwpw.hasNameCookie;
					}
					var askEmail= wpwKits.randomMsg(wp_chatbot_obj.asking_phone);
					setTimeout(function(){
						wpwMsg.single(askEmail);
						//Now updating the support part as .
						globalwpw.supportStep='phone';
						globalwpw.wildCard=1;
						globalwpw.ai_step=1;
						globalwpw.initialize=1;
						//keeping value in localstorage
						localStorage.setItem("wildCard",  globalwpw.wildCard);
						localStorage.setItem("supportStep",  globalwpw.supportStep);
					},1000)

				}else if(typeof(globalwpw.settings.obj.clickintent) !=="undefined" && wpwKits.render(globalwpw.settings.obj.clickintent) !='' ){
                    
					if(!localStorage.getItem('shopper')){
						$.cookie("shopper", wpwKits.render(globalwpw.settings.obj.shopper_demo_name), { expires : 365 });
						localStorage.setItem('shopper',wpwKits.render(globalwpw.settings.obj.shopper_demo_name));
						globalwpw.hasNameCookie=wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
					}
					globalwpw.initialize=1;
					globalwpw.ai_step=1;
					globalwpw.wildCard=0;
					wpwAction.bot(wpwKits.render(globalwpw.settings.obj.clickintent));

				}else if( typeof(ldsuggestionObject) !=="undefined" ){
					globalwpw.wildCard = 30;
					wpwAction.bot('from wildcard ldsesson');
				}else{  // re targeting part .
					var number = Math.random() // 0.9394456857981651
					number.toString(36); // '0.xtis06h6'
					var id = number.toString(36).substr(2); // 'xtis06h6'

					localStorage.setItem('botsessionid', id);
					globalwpw.wildCard=0;
					wpwAction.bot(wpwKits.render(globalwpw.settings.obj.sys_key_help).toLowerCase());
					//keeping value in localstorage
					localStorage.setItem("wildCard",  globalwpw.wildCard);
					
				}
				
            }

            if(wildcardData=='messenger'){
                var url='https://www.messenger.com/t/'+globalwpw.settings.obj.fb_page_id;
                var win = window.open(url, '_blank');
                win.focus();
            }
            if(wildcardData=='whatsapp'){
                var url='https://api.whatsapp.com/send?phone='+globalwpw.settings.obj.whats_num;
                var win = window.open(url, '_blank');
                win.focus();
            }

        });

        $(document).on('click','.qcld-chatbot-form',function(e){
            e.preventDefault();
            var formid=$(this).attr('data-form');
            globalwpw.wildCard=7;
            globalwpw.formStep='welcome';
            if($('.chatbot_intent_reload').length>0){
                $('.chatbot_intent_reload').remove();
            }
            wpwTree.formbuilder(formid);
        })

        $(document).on('click','.qcld_simple_txt_response',function(e){
            e.preventDefault();
            var text=$(this).text();
            var data = {'action':'wpbo_search_response','name':globalwpw.hasNameCookie,'keyword':text, 'language':globalwpw.settings.obj.language};
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
			wpwKits.ajax(data).done(function (respond) {

				var json=$.parseJSON(respond);
				if(json.status=='success'){
					if(typeof(json.category)!=="undefined" && json.category){
						
						var question='';
						$.each(json.data, function (i, obj) {
							question += '<span class="qcld-chatbot-wildcard qcld_simple_txt_response">'+ obj.query +'</span>';
						});
						
						
						wpwMsg.single_nobg(question);
						
					}
					else if(json.multiple){
						var question='';
						$.each(json.data, function (i, obj) {
							question += '<span class="qcld-chatbot-wildcard qcld_simple_txt_response">'+ obj.query +'</span>';
						});
						
						
						wpwMsg.double_nobg(wpwKits.randomMsg(globalwpw.settings.obj.did_you_mean),question);
						   
					}else{
						
							wpwMsg.single(json.data[0].response);
							var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
							if( typeof(json.data[0].followup)!=="undefined" && json.data[0].followup!='' ){
                                setTimeout(function(){
                                    wpwMsg.single(json.data[0].followup);
                                }, globalwpw.settings.preLoadingTime*2);
                            }else{
                                if(globalwpw.settings.obj.disable_repeatative!=1){
                                    setTimeout(function(){
                                        wpwMsg.double_nobg(serviceOffer, globalwpw.wildcards);
                                    }, globalwpw.settings.preLoadingTime*2);
                                }else{
                                    setTimeout(function(){
                                        wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                                    }, globalwpw.settings.preLoadingTime*2);
                                }
                            }
						
					}
				}
			})
			
			
        })
		
		$(document).on('click','.wpbd_str_categories',function(e){
            e.preventDefault();
            var text=$(this).text();
            globalwpw.wildCard=0;            
            //wpwAction.bot(text);
			
            var data = {'action':'wpbo_search_response_catlist','name':globalwpw.hasNameCookie,'category':text, 'language':globalwpw.settings.obj.language};
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
			wpwKits.ajax(data).done(function (response) {

				var json=$.parseJSON(response);
				if(json.status=='success'){
					
					var question='';
					$.each(json.data, function (i, obj) {
						question += '<span class="qcld-chatbot-wildcard qcld_simple_txt_response">'+ obj.name +'</span>';
					});
					
					wpwMsg.single_nobg(question);
						
					
				}else{
					wpwMsg.single('No Category found!');
				}
			});
			
			
        });


        $(document).on('click', '.chatbot_intent_reload', function(e){
            e.preventDefault();
            var obj = $(this);
            if(obj.attr('data-intent-type')=='formbuilder'){

                if( obj.attr('data-step')=='complete' ){
				globalwpw.formStep='field';
				localStorage.setItem("formStep",  globalwpw.formStep);
				}
                globalwpw.wildCard=obj.attr('data-wildcard');
                globalwpw.formfieldid = obj.attr('data-intent');
                wpwTree.formbuilder();

            }else if(obj.attr('data-intent-type')=='subscription'){

                var shopperChoice=obj.attr('data-intent');
                wpwMsg.shopper_choice(shopperChoice);
                globalwpw.wildCard=obj.attr('data-wildcard');
                globalwpw.subscriptionStep=obj.attr('data-step');
                wpwTree.subscription(shopperChoice);

            }else if(obj.attr('data-intent-type')=='unsubscription'){
                var shopperChoice=obj.attr('data-intent');
                wpwMsg.shopper_choice(shopperChoice);
                globalwpw.wildCard=obj.attr('data-wildcard');
                globalwpw.subscriptionStep=obj.attr('data-step');
                wpwTree.subscription(shopperChoice);
            }
        })


        $(document).on('click','.qcld-chatbot-formanswer',function(e){
            e.preventDefault();
            var answer=$(this).attr('data-form-value');
            wpwAction.bot(answer);
        })

        $(document).on('click','.wpbot_clickable_menu',function(e){
            e.preventDefault();
            var obj = $(this);
            obj.parent().parent().parent().remove();
            var answer=obj.attr('menuitem');
            wpwMsg.shopper_choice(answer);
            wpwTree.formbuilder(answer);
        })


        //
        $(document).on('click','.qcld-chatbot-product-category',function(){
            var catType=$(this).attr('data-category-type');
            var shopperChoiceCatId=$(this).text()+'#'+$(this).attr('data-category-id');
            var shopperChoiceCategory=$(this).text();
            if(catType=='hasChilds'){
                //Now hide all categories but shopper choice.
                wpwMsg.shopper_choice(shopperChoiceCategory);
                //updating the product steps and bringing the product by category.
                wpwKits.subCats($(this).attr('data-category-id'));
                globalwpw.productStep='search';
                globalwpw.wildCard=20;
            }else{
                //Now hide all categories but shopper choice.
                wpwMsg.shopper_choice(shopperChoiceCategory);
                //updating the product steps and bringing the product by category.
                globalwpw.productStep='category';
                globalwpw.wildCard=20;
                //keeping value in localstorage
                localStorage.setItem("productStep",  globalwpw.productStep);
                wpwAction.bot(shopperChoiceCatId);
            }

        });
        //Product Load More features for product search or category products
        $(document).on('click','#wp-chatbot-loadmore',function (e) {
            $('#wp-chatbot-loadmore-loader').html('<img class="wp-chatbot-comment-loader" src="'+globalwpw.settings.obj.image_path+'loadmore.gif" alt="..." />');
						
            var loadMoreDom=$(this);
            
			var tagattr = loadMoreDom.attr('data-search-tag');
			var productOffest=loadMoreDom.attr('data-offset');
			if (typeof tagattr !== typeof undefined && tagattr !== false) {
				
                var data = {'action':'qcld_wb_chatbot_search_product_by_tag','name':globalwpw.hasNameCookie, 'tags': tagattr, 'paged': productOffest};
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
				wpwKits.ajax(data).done(function (presdata) {

					var productSucces= wpwKits.randomMsg(globalwpw.settings.obj.product_success)+" <strong>"+tagattr+"</strong>!";
					wpwMsg.double_nobg(productSucces,presdata.html);				
					
				})
				
			}else{
				
				var searchType=loadMoreDom.attr('data-search-type');
				var searchTerm=loadMoreDom.attr('data-search-term');
                var data = { 'action': 'qcld_wb_chatbot_load_more','offset': productOffest,'search_type': searchType,'search_term': searchTerm};
                if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                    $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
                }
				//Load more ajax handler.
				wpwKits.ajax(data).done(function (response) {
					//Change button text
					$('#wp-chatbot-loadmore-loader').html('');
					$('.wp-chatbot-products').append(response.html);
					loadMoreDom.attr('data-search-term',response.search_term);
					wpwKits.wpwHistorySave();
					loadMoreDom.attr('data-offset',response.offset);
					if(response.product_num <= response.per_page){
						loadMoreDom.hide();
						//Now show the user infinite.
						setTimeout(function () {
							var searchAgain = wpwKits.randomMsg(globalwpw.settings.obj.product_infinite);
							wpwMsg.single(searchAgain);
							globalwpw.productStep='search';
							//keeping value in localstorage
							localStorage.setItem("productStep",  globalwpw.productStep);
						},globalwpw.settings.wildcardsShowTime);

					}
					//scroll to the last message
					wpwKits.scrollTo();
				});
				
			}
			
			
			
			
        });

        $(document).on('click','.wp-chatbot-loadmore-saas',function (e) {
            $('.wp-chatbot-loadmore-loader').html('<img class="wp-chatbot-comment-loader" src="'+globalwpw.settings.obj.image_path+'loadmore.gif" alt="..." />');
            var loadMoreDom=$(this);
            var page=loadMoreDom.attr('data-page');
            var keyword=loadMoreDom.attr('data-keyword');
            var data = { 'action': 'qcld_wb_chatbot_load_more_saas','page': page,'keyword': keyword};
            //Load more ajax handler.
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
            wpwKits.ajax(data).done(function (response) {

                var response=$.parseJSON(response);
                //Change button text
                $('.wp-chatbot-loadmore-loader').html('');
                $('.wpb-search-result').append(response.html);
                loadMoreDom.attr('data-keyword',response.keyword);
                wpwKits.wpwHistorySave();
                loadMoreDom.attr('data-page',response.page);
                if(response.product_num <= response.per_page){
                    loadMoreDom.hide();
                    //Now show the user infinite.
                    setTimeout(function () {
                        var searchAgain = wpwKits.randomMsg(globalwpw.settings.obj.product_infinite);
                        wpwMsg.single(searchAgain);
                        globalwpw.productStep='search';
                        //keeping value in localstorage
                        localStorage.setItem("productStep",  globalwpw.productStep);
                    },globalwpw.settings.wildcardsShowTime);

                }
                //scroll to the last message
                wpwKits.scrollTo();
            });
        });


        /*Products details part **/
        if(globalwpw.settings.obj.open_product_detail!=1 && globalwpw.settings.obj.woocommerce){
        $(document).on('click','.wp-chatbot-product a',function (e) {
            if( jQuery('.wp-chatbot-start-container:visible').length > 0 ){

            }else{
                e.preventDefault();
            }
             
            $('.wp-chatbot-product-container').addClass('active-chatbot-product-details');
            $('.wp-chatbot-product-reload').addClass('wp-chatbot-product-loading').html('<img class="wp-chatbot-product-loader" src="'+globalwpw.settings.obj.image_path+'comment.gif" alt="Loading..." />');
            var productId=$(this).attr('wp-chatbot-pid');
            var data = { 'action':'qcld_wb_chatbot_product_details', 'wp_chatbot_pid':productId};
            //product details ajax handler.
            wpwKits.ajax(data).done(function (response) {
                $('.wp-chatbot-product-reload').removeClass('wp-chatbot-product-loading').html('');
                $('#wp-chatbot-product-title').html(response.title);
                $('#wp-chatbot-product-description').html(response.description);
                $('#wp-chatbot-product-image').html(response.image);
                $('#wp-chatbot-product-price').html(response.price);
                $('#wp-chatbot-product-quantity').html(response.quantity);
                $('#wp-chatbot-product-variable').html(response.variation);
                $('#wp-chatbot-product-cart-button').html(response.buttton);
                //Load gallery magnify
                setTimeout(function () {
                    $('#wp-chatbot-product-image-large-path').magnificPopup({type:'image'});
                },1000);

                //For shortcode handle recenlty view product by ajax as
                if($('#wp-chatbot-shortcode-template-container').length > 0){
                    var data = {'action':'qcld_wb_chatbot_recently_viewed_products'};
                    wpwKits.ajax(data).done(function (response) {
                        $('.wp-chatbot-product-shortcode-container').html(response);
                        $('.chatbot-sidebar .wp-chatbot-products').slimScroll({height: '435px', start: 'top'});
                    });
                }
            });

        });
        }
		
		$(document).on('click', '.wpb-quick-reply', function(e){
			e.preventDefault();
			$('#wp-chatbot-editor').val($(this).html());
			$('#wp-chatbot-send-message').trigger( "click" );
		})
		
        //Image gallery.
        $(document).on('click','.wp-chatbot-product-image-thumbs-path',function (e) {
            e.preventDefault();
            var imagePath=$(this).attr('href');
            $('#wp-chatbot-product-image-large-path').attr('href',imagePath);
            $('#wp-chatbot-product-image-large-src').attr('src',imagePath);
            //handle thumb active one
            $('.wp-chatbot-product-image-thumbs-path').parent().removeClass('wp-chatbot-product-active-image-thumbs');
            $(this).parent().addClass('wp-chatbot-product-active-image-thumbs');
        });
        //Product details close
        $(document).on('click', '.wp-chatbot-product-close', function (e) {
            $('.wp-chatbot-product-container').removeClass('active-chatbot-product-details');
        });
        /*add to cart part **/
        $(document).on("click","#wp-chatbot-add-cart-button",function (e) {
            var pId=$(this).attr('wp-chatbot-product-id');
            var qnty=$("#vPQuantity").val();
            var data = {'action': 'qcld_wb_chatbot_add_to_cart','product_id': pId,'quantity': qnty };
            //add to cart ajax handler.
            wpwKits.ajax(data).done(function (response) {
                //Change button text
                if(response=="simple"){
                    //Showing cart.
                    wpwKits.showCart();
                    //handle the active tab on chat board.
                    $('.wp-chatbot-operation-option').each(function(){
                        if($(this).attr('data-option')=='cart'){
                            $(this).parent().addClass('wp-chatbot-operation-active');
                        }else{
                            $(this).parent().removeClass('wp-chatbot-operation-active');
                        }
                    });
                }
                //Hide the shortcode and chat ui product details.
                $('.wp-chatbot-product-container').removeClass('active-chatbot-product-details');
            });
        });
        //Add to cart operation for variable product.
        $(document).on('click','#wp-chatbot-variation-add-to-cart',function(event) {
            event.preventDefault();

            var attrselected = true;
            $('.each_attribute').each(function(){
                if( $(this).val() != '' ){
                    attrselected = true;
                }else{
                    attrselected = false;
                }
            })
            if( attrselected ){
                var pId=$(this).attr('wp-chatbot-product-id');
                var quanity=$('#vPQuantity').val();
                var variation_id=$(this).attr('variation_id');
                var attributes=new Array();
                $.each($("#wp-chatbot-variation-data select"), function(){
                    var attribute = $(this).attr('name')+'#'+ $(this).find('option:selected').text();
                    attributes.push(attribute);
                });
                var data = {
                    'action': 'variable_add_to_cart',
                    'p_id': pId,
                    'quantity': quanity,
                    'variations_id':variation_id,
                    'attributes':attributes
                };
                //add to cart ajax handler.
                if(!$('.spinner').hasClass('is-active')){
                    $('.spinner').addClass('is-active');
                }
                wpwKits.ajax(data).done(function (response) {
                    //Change button text
                    if(response=="variable"){
                        //Showing cart.
                        wpwKits.showCart();
                        //handle the active tab on chat board.
                        //handle the active tab on chat board.
                        $('.wp-chatbot-operation-option').each(function(){
                            if($(this).attr('data-option')=='cart'){
                                $(this).parent().addClass('wp-chatbot-operation-active');
                            }else{
                                $(this).parent().removeClass('wp-chatbot-operation-active');
                            }
                        });
                    }
                    //Hide the shortcode and chat ui product details.
                    $('.wp-chatbot-product-container').removeClass('active-chatbot-product-details');
                    if($('.spinner').hasClass('is-active')){
                        $('.spinner').removeClass('is-active');
                    }
                });
            }

        });

        //search load more
        $(document).on('click', '.wp-chatbot-loadmore', function(e){
            e.preventDefault();
            var obj = $(this);

            var keyword = obj.attr('data-keyword');
            var post_type = obj.attr('data-post_type');
            var page = obj.attr('data-page');
            console.log(globalwpw.settings.obj.loading.en_US);
            obj.text('Loading...');
            var data = {'action':'wpbo_search_site_pagination','name':globalwpw.hasNameCookie,'keyword':keyword, 'type': post_type, 'page': page};
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
            wpwKits.ajax(data).done(function (res) {
                var json=$.parseJSON(res);
                console.log(json.status)
                if(json.status=='success'){
                    $('span[data-wildcart="back"]').remove();
                    wpwMsg.single_nobg(json.html);

                    setTimeout(function(){
                        wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                    },globalwpw.settings.preLoadingTime)

                    obj.remove();
                }else{
                    
                    if(globalwpw.counter == globalwpw.settings.obj.no_result_attempt_count || globalwpw.settings.obj.no_result_attempt_count == 0 ){
                        
                        wpwMsg.single(json.html);
                        if(globalwpw.settings.obj.disable_repeatative!=1){
                            setTimeout(function(){
                                var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                            },globalwpw.settings.preLoadingTime)
                        }
                        globalwpw.counter = 0;
                        
                    }else{
                        globalwpw.counter++;
                        wpwTree.df_reply(response);
                    }

                }
                globalwpw.wildCard=0;
            });


        })

        //search load more
        $(document).on('click', '.wp-chatbot-loadmore2', function(e){
            e.preventDefault();
            var obj = $(this);

            var keyword = obj.attr('data-keyword');
            
            var page = obj.attr('data-page');

            var search_type = obj.attr('data-search-type');
            console.log(globalwpw.settings.obj.loading.en_US);
            obj.text(globalwpw.settings.obj.loading.en_US);

            if( search_type == 'default-wp-search' ){
                var data = {'action':'wpbo_default_search_pagination2','name':globalwpw.hasNameCookie,'keyword':keyword, 'page': page, search_type:'default-wp-search'};
            }else{
                var data = {'action':'wpbo_search_site_pagination2','name':globalwpw.hasNameCookie,'keyword':keyword, 'page': page};
            }
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
            wpwKits.ajax(data).done(function (res) {
                var json=$.parseJSON(res);
                console.log(json.status)
                if(json.status=='success'){
                    $('span[data-wildcart="back"]').remove();
                    
                    wpwMsg.single_nobg(json.html);

                    setTimeout(function(){
                        wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                    },globalwpw.settings.preLoadingTime)

                    obj.remove();
                }else{
                    
                    if(globalwpw.counter == globalwpw.settings.obj.no_result_attempt_count || globalwpw.settings.obj.no_result_attempt_count == 0 ){
                        
                        wpwMsg.single(json.html);
                        if(globalwpw.settings.obj.disable_repeatative!=1){
                            setTimeout(function(){
                                var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                            },globalwpw.settings.preLoadingTime)
                        }
                        globalwpw.counter = 0;
                        
                    }else{
                        globalwpw.counter++;
                        wpwTree.df_reply(response);
                    }

                }
                globalwpw.wildCard=0;
            });


        });

        //fuzzy search load more
        $(document).on('click', '.wp-chatbot-fuse-loadmore', function(e){
            e.preventDefault();
            var obj = $(this);
            var keyword = obj.attr('data-keyword');
            var post_type = obj.attr('data-post_type');
            var page = obj.attr('data-page');
            obj.text('loading...');
            var data = {'action':'wpbo_fuse_search_site_pagination','name':globalwpw.hasNameCookie,'keyword':keyword, 'type': post_type, 'page': page};
            if($(globalwpw.settings.messageLastChild+' .wp-chatbot-comment-loader').length==0){
                $(globalwpw.settings.messageContainer).append(wpwKits.botPreloader());
            }
            wpwKits.ajax(data).done(function (res) {
                var json=$.parseJSON(res);
                if(json.status=='success'){
                    $('span[data-wildcart="back"]').remove();
                    
                    wpwMsg.single_nobg(json.html);

                    setTimeout(function(){
                        wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                    },globalwpw.settings.preLoadingTime)

                    obj.remove();
                }else{
                    
                    if(globalwpw.counter == globalwpw.settings.obj.no_result_attempt_count || globalwpw.settings.obj.no_result_attempt_count == 0 ){
                        
                        wpwMsg.single(json.html);
                        if(globalwpw.settings.obj.disable_repeatative!=1){
                            setTimeout(function(){
                                var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
                                wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
                            },globalwpw.settings.preLoadingTime)
                        }
                        globalwpw.counter = 0;
                        
                    }else{
                        globalwpw.counter++;
                        wpwTree.df_reply(response);
                    }
                }
                globalwpw.wildCard=0;
            });
        });


        //Update cart.
        $(document).on("change", ".qcld-wp-chatbot-cart-item-qnty", function () {
            //Update editor only for chat ui
            if($('#wp-chatbot-shortcode-template-container').length == 0) {
                wpwKits.disableEditor(wpwKits.randomMsg(globalwpw.settings.obj.cart_updating));
            }
            var currentItem=$(this);
            setTimeout(function () {
                var item_key=currentItem.attr('data-cart-item');
                var qnty=currentItem.val();
                var data = {'action': 'qcld_wb_chatbot_update_cart_item_number','cart_item_key':item_key,'qnty':qnty};
                wpwKits.ajax(data).done(function () {
                    //Showing cart.
                    wpwKits.showCart();
                });
            }, globalwpw.settings.preLoadingTime);
        });
        //remove the cart item from global cart.
        $(document).on("click", ".wp-chatbot-remove-cart-item", function () {
            //Update editor only for chat ui
            if($('#wp-chatbot-shortcode-template-container').length == 0) {
                wpwKits.disableEditor(wpwKits.randomMsg(globalwpw.settings.obj.cart_removing));
            }
            var item=$(this).attr('data-cart-item');
            var data = {'action': 'qcld_wb_chatbot_cart_item_remove', 'cart_item':item };
            wpwKits.ajax(data).done(function () {
                //Showing cart.
                wpwKits.showCart();
            })
        });

        /*Support query answering.. **/
        $(document).on('click','.qcld-chatbot-support-items',function (e) {
            var shopperChoose=$(this).text();
            var queryIndex=$(this).attr('data-query-index');
            wpwMsg.shopper_choice(shopperChoose);
            //Now answering the query.
            var queryAns=globalwpw.settings.obj.support_ans[globalwpw.settings.obj.language][queryIndex];
            wpwMsg.single(queryAns);
            //Asking email after showing answer.
            var orPhoneSuggest='';
            setTimeout(function(){
                if(globalwpw.settings.obj.call_sup!=1) {
                    orPhoneSuggest = '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
                }
                var orEmailSuggest='<span class="qcld-chatbot-suggest-email">'+wpwKits.randomMsg(globalwpw.settings.obj.support_email)+'</span>';
                if(globalwpw.settings.obj.disable_repeatative!=1){
                    wpwKits.suggestEmail(orPhoneSuggest+orEmailSuggest);
                }else{
                    wpwMsg.single_nobg('<span class="qcld-chatbot-wildcard qcld_back_to_start"  data-wildcart="back">' + wpwKits.randomMsg(globalwpw.settings.obj.back_to_start) + '</span>');
                }

            },globalwpw.settings.wildcardsShowTime);
        });
        /*Support Email **/
        $(document).on('click','.qcld-chatbot-suggest-email',function (e) {
            var shopperChoice=$(this).text();
            wpwMsg.shopper_choice(shopperChoice);
            //Then ask email address
            if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
                var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
            }else{
                var shopperName=globalwpw.hasNameCookie;
            }
            
            //keeping value in localstorage

            var askEmail= wpwKits.randomMsg(wp_chatbot_obj.asking_email);
            wpwMsg.single(askEmail);
            //Now updating the support part as .
            globalwpw.supportStep='email';
            globalwpw.wildCard=1;
            globalwpw.ai_step=1;
            globalwpw.initialize=1;

            localStorage.setItem("wildCard",  globalwpw.wildCard);
            localStorage.setItem("supportStep",  globalwpw.supportStep);

        });

        $(document).on('click','.qcld_wpbot_df_cx_agent',function (e) {
            e.preventDefault();
            var obj = $(this);
            var shopperChoice=$(this).text();
            wpwMsg.shopper_choice(shopperChoice);

            //Now updating the support part as .
            globalwpw.wildCard = 26;
            //keeping value in localstorage
            localStorage.setItem("wildCard",  globalwpw.wildCard);
            localStorage.setItem("cx-name", obj.attr('data-agent-name') );
            localStorage.setItem("cx-diaplayname", obj.attr('data-agent-diaplay-name') );
            localStorage.setItem("cx-languagecode", obj.attr('data-agent-defaultlanguagecode') );
            localStorage.setItem("cx-timezone", obj.attr('data-agent-timezone') );

            wpwTree.dfcx( shopperChoice );


        });
		
		
        /*Support Phone **/
        $(document).on('click','.qcld-chatbot-suggest-phone',function (e) {
            var shopperChoice=$(this).text();
            wpwMsg.shopper_choice(shopperChoice);
            //Then ask email address
            if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
                var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
            }else{
                var shopperName=globalwpw.hasNameCookie;
            }
            var askEmail = wpwKits.randomMsg(globalwpw.settings.obj.asking_phone);
            setTimeout(function(){
                wpwMsg.single(askEmail);
                //Now updating the support part as .
                globalwpw.supportStep='phone';
                globalwpw.wildCard=1;
                //keeping value in localstorage
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("supportStep",  globalwpw.supportStep);
            },1000)
            

        });
		
		$(document).on('click','.wpbd_subscription',function (e) {
			 var shopperChoice=$(this).text();
			 wpwMsg.shopper_choice(shopperChoice);
			globalwpw.wildCard=3;
			globalwpw.subscriptionStep='welcome';
			wpwTree.subscription(shopperChoice);

        });
		/* support Search */
		
		$(document).on('click','.qcld-chatbot-site-search',function (e) {
            var shopperChoice=$(this).text();
            wpwMsg.shopper_choice(shopperChoice);
            //Then ask email address
            if(typeof(globalwpw.hasNameCookie)=='undefined'|| globalwpw.hasNameCookie==''){
                var shopperName=  wpwKits.render(globalwpw.settings.obj.shopper_demo_name);
            }else{
                var shopperName=globalwpw.hasNameCookie;
            }
			var askEmail= wpwKits.randomMsg(globalwpw.settings.obj.asking_search_keyword)
			
            wpwMsg.single(askEmail.replace("#name", shopperName));
            //Now updating the support part as .
            globalwpw.supportStep='search';
            globalwpw.wildCard=1;
            //keeping value in localstorage
            localStorage.setItem("wildCard",  globalwpw.wildCard);
            localStorage.setItem("supportStep",  globalwpw.supportStep);

        });
		$(document).on('click','.wpbo_live_chat',function (e) {
			e.preventDefault();
			wpwKits.wpwOpenWindow(globalwpw.settings.obj.livechatlink,'Testing', 400, 600);
        });

		$(document).on('click','#wpbot_live_chat_floating_btn',function (e) {
			e.preventDefault();
            if(globalwpw.settings.obj.is_livechat_active){
                jQuery('.wp-chatbot-start-container').hide();
                $('#wp-chatbot-editor').val(wpwKits.render(globalwpw.settings.obj.sys_key_livechat));
			    $('#wp-chatbot-send-message').trigger( "click" );
            }else{
                wpwKits.wpwOpenWindow(globalwpw.settings.obj.livechatlink,'Testing', 400, 600);
            }

        });
        
        $(document).on('click','#start_wpbot_live_chat_floating_btn',function (e) {
			e.preventDefault();
            if(globalwpw.settings.obj.is_livechat_active){
                jQuery('.wp-chatbot-start-container').hide();
                $('#wp-chatbot-editor').val(wpwKits.render(globalwpw.settings.obj.sys_key_livechat));
			    $('#wp-chatbot-send-message').trigger( "click" );
            }else{
                wpwKits.wpwOpenWindow(globalwpw.settings.obj.livechatlink,'Testing', 400, 600);
            }

        });
        
        $(document).on('click', '.qcld-chatbot-checkbox', function(e){
            var value = [];
            var obj = $(this);
            obj.parent('.wp-chatbot-paragraph').find('.qcld-chatbot-checkbox').each(function(){

                if($(this).prop("checked") == true){
                    value.push($(this).val());
                }

            })

           $('#wp-chatbot-editor').val(value.join());

        })

		$(document).on('click','.qcld-chatbot-custom-intent',function (e) {
			var shopperChoice=$(this).attr('data-text');

            globalwpw.initialize=1;
            globalwpw.ai_step=1;
            globalwpw.wildCard=0;
            wpwAction.bot(shopperChoice);
        });

        $(document).on('click','.qcld-chatbot-buttonlink',function (e) {
            e.stopPropagation();
            e.preventDefault();
            var btnlink=$(this).attr('data-link');
            var target = $(this).attr('data-target')
            var type = $(this).attr('data-type')
            if(btnlink!=''){
                if(target==1){
					if(type=='phone'){
						window.open('tel:'+btnlink);
					}else if(type=='email'){
						window.open('mailto:'+btnlink);
					}else{
						window.open(btnlink);
					}
                    
                }else{
					if(type=='phone'){
						window.location.href = 'tel:'+btnlink;
					}else if(type=='email'){
						window.location.href = 'mailto:'+btnlink;
					}else{
						window.location.href = btnlink;
					}
                    
                }
    
            }
            
            return false;
        });

        $(document).on( 'click', '.qcld_continue_shopping', function(e) {
			e.preventDefault();
			console.log( localStorage.getItem("wpwHitory") )
			$(globalwpw.settings.messageWrapper).html(localStorage.getItem("wpwHitory"));
			wpwKits.scrollTo();
			wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
			
		} )
		
        //Show chat,cart and recently view products by click event.
        $(document).on('click','.wp-chatbot-operation-option',function (e) {
            e.preventDefault();
            var oppt=$(this).attr('data-option');
            if(oppt=='recent'  && globalwpw.wpwIsWorking==0){
                $(globalwpw.settings.messageWrapper).html(localStorage.getItem("wpwHitory"));
                wpwKits.disableEditor(wpwKits.render(globalwpw.settings.obj.sys_key_product));
                var data = {'action':'qcld_wb_chatbot_recently_viewed_products'};
                wpwKits.ajax(data).done(function (response) {
                    $(globalwpw.settings.messageWrapper).html(response);
                });
                //First remove wp-chatbot-operation-active class from all selector
                $('.wp-chatbot-operation-option').parent().removeClass('wp-chatbot-operation-active');
                //then add the active class to current element.
                $(this).parent().addClass('wp-chatbot-operation-active');
            }else if(oppt=='chat' && globalwpw.wpwIsWorking==0){
                $(globalwpw.settings.messageWrapper).html(localStorage.getItem("wpwHitory"));
                wpwKits.scrollTo();
                wpwKits.enableEditor(wpwKits.randomMsg(globalwpw.settings.obj.send_a_msg));
                //First remove wp-chatbot-operation-active class from all selector
                $('.wp-chatbot-operation-option').parent().removeClass('wp-chatbot-operation-active');
                //then add the active class to current element.
                $(this).parent().addClass('wp-chatbot-operation-active');
                if( globalwpw.wildCard==7 && globalwpw.settings.obj.template != 'template-05' && ( typeof(wpbotshortcodetemplate)==="undefined" || wpbotshortcodetemplate!='template-05' ) && (typeof(globalwpw.settings.obj.clickintent) ==="undefined" || wpwKits.render(globalwpw.settings.obj.clickintent)=='' ) ){
					$('#wp-chatbot-editor').removeAttr('type');
					$(globalwpw.settings.messageLastChild).fadeOut();
					globalwpw.wildCard=0;
					var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.wildcard_msg);
					wpwMsg.double_nobg(serviceOffer,globalwpw.wildcards);
				}

            } else if(oppt=='cart' && globalwpw.wpwIsWorking==0){
                wpwKits.showCart();
                //First remove wp-chatbot-operation-active class from all selector
                $('.wp-chatbot-operation-option').parent().removeClass('wp-chatbot-operation-active');
                //then add the active class to current element.
                $(this).parent().addClass('wp-chatbot-operation-active');
            } else if(oppt=='help' && globalwpw.wpwIsWorking==0){
                $(globalwpw.settings.messageWrapper).html(localStorage.getItem("wpwHitory"));
                if( $('.wp-chatbot-messages-container').length==0) {
                    //if from other nob then goo to the chat window
                    $(globalwpw.settings.messageWrapper).html(localStorage.getItem("wpwHitory"));
                    //Showing help message
                    setTimeout(function () {
                        wpwKits.scrollTo();
                        var helpWelcome = wpwKits.randomMsg(globalwpw.settings.obj.help_welcome);
                        var helpMsg = wpwKits.randomMsg(globalwpw.settings.obj.help_msg);
                        wpwMsg.double(helpWelcome,helpMsg);
                        //dialogflow
                        if(globalwpw.settings.obj.ai_df_enable==1 && globalwpw.df_status_lock==0){
                            globalwpw.wildCard=0;
                            globalwpw.ai_step=1;
                            localStorage.setItem("wildCard",  globalwpw.wildCard);
                            localStorage.setItem("aiStep", globalwpw.ai_step);
                        }
                    },globalwpw.settings.preLoadingTime);
                }else{
                    //Showing help message on chat self window.
                    var helpWelcome = wpwKits.randomMsg(globalwpw.settings.obj.help_welcome);
                    var helpMsg = wpwKits.randomMsg(globalwpw.settings.obj.help_msg);
                    wpwMsg.double(helpWelcome,helpMsg);
                    //dialogflow
                    if(globalwpw.settings.obj.ai_df_enable==1 && globalwpw.df_status_lock==0){
                        globalwpw.wildCard=0;
                        globalwpw.ai_step=1;
                        localStorage.setItem("wildCard",  globalwpw.wildCard);
                        localStorage.setItem("aiStep", globalwpw.ai_step);
                    }
                }
                //First remove wp-chatbot-operation-active class from all selector
                $('.wp-chatbot-operation-option').parent().removeClass('wp-chatbot-operation-active');
                //then add the active class to current element.
                $(this).parent().addClass('wp-chatbot-operation-active');

            } else if(oppt=='support' && globalwpw.wpwIsWorking==0){
				$(globalwpw.settings.messageWrapper).html(localStorage.getItem("wpwHitory"));
				var support_wildcards = '';
				
			
			
				if(globalwpw.settings.obj.livechat=='1' && !globalwpw.settings.obj.is_livechat_active) {
					support_wildcards += '<span class="qcld-chatbot-default wpbo_live_chat" >'+wpwKits.render(globalwpw.settings.obj.livechat_button_label)+'</span>';
				}

				if(globalwpw.settings.obj.disable_feedback=='') {
					support_wildcards += '<span class="qcld-chatbot-suggest-email">'+wpwKits.render(globalwpw.settings.obj.send_us_email)+'</span>';
				}
				if(globalwpw.settings.obj.disable_leave_feedback=='') {
					support_wildcards += '<span class="qcld-chatbot-suggest-email wpbd_feedback">'+wpwKits.render(globalwpw.settings.obj.leave_feedback)+'</span>';
				}
				
				if(globalwpw.settings.obj.call_gen=="") {
					support_wildcards += '<span class="qcld-chatbot-suggest-phone" >' + wpwKits.render(globalwpw.settings.obj.support_phone) + '</span>';
				}
				
				
				var serviceOffer=wpwKits.randomMsg(globalwpw.settings.obj.support_option_again);
				wpwMsg.double_nobg(serviceOffer,support_wildcards);
            }else if(oppt=='live-chat' && globalwpw.wpwIsWorking==0){
                $(globalwpw.settings.messageWrapper).html(localStorage.getItem("wpwHitory"));
				if($('#wbca_signup_fullname').length>0){
					if(localStorage.getItem('shopper')!==null){
						$('#wbca_signup_fullname').val(localStorage.getItem('shopper'));
					}
					if(localStorage.getItem('shopperemail')!==null){
						$('#wbca_signup_email').val(localStorage.getItem('shopperemail'));
					}
				}
				$("#wp-chatbot-board-container").removeClass('active-chat-board');
				$('.wp-chatbot-container').hide();
				$('.wpbot-saas-live-chat').show();
			}
            //show chat wrapper and hide cart-checkout wrapper
            $(globalwpw.settings.messageWrapper).show();
            $('#wp-chatbot-checkout-short-code').hide();
            $('#wp-chatbot-cart-short-code').hide();


        });
		
        $(document).on('click','#wp-chatbot-desktop-reload',function (e) {
            e.preventDefault();
            var actionType=$(this).attr('reset-data');
            if(actionType=='yes'){
                $('#wp-chatbot-messages-container').html('');
                localStorage.removeItem('shopper');
                globalwpw.wildCard=0;
                globalwpw.ai_step=0;
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("aiStep", globalwpw.ai_step);

                globalwpw.formfieldid = '';
                localStorage.setItem("formfieldid",  globalwpw.formfieldid);
                globalwpw.formStep='welcome';
                localStorage.setItem("formStep",  globalwpw.formStep);
                globalwpw.formid='';
                localStorage.setItem("formid",  globalwpw.formid);
                globalwpw.formentry = 0;
                localStorage.setItem("formentry",  globalwpw.formentry);

                localStorage.removeItem("cx-name" );
                localStorage.removeItem("cx-diaplayname" );
                localStorage.removeItem("cx-languagecode" );
                localStorage.removeItem("cx-timezone" );
				var number = Math.random() // 0.9394456857981651
                number.toString(36); // '0.xtis06h6'
                var id = number.toString(36).substr(2); // 'xtis06h6'

                localStorage.setItem('botsessionid', id);
                wpwWelcome.greeting();
            } else if(actionType=='no'){
                wpwAction.bot(wpwKits.render(globalwpw.settings.obj.sys_key_help).toLowerCase());
            }
        });

        $(document).on('click','.qcld-chatbot-reset-btn',function (e) {
            e.preventDefault();
            var actionType=$(this).attr('reset-data');
            if(actionType=='yes'){
                $('#wp-chatbot-messages-container').html('');
                localStorage.removeItem('shopper');
                globalwpw.wildCard=0;
                globalwpw.ai_step=0;
                localStorage.setItem("wildCard",  globalwpw.wildCard);
                localStorage.setItem("aiStep", globalwpw.ai_step);

                globalwpw.formfieldid = '';
                localStorage.setItem("formfieldid",  globalwpw.formfieldid);
                globalwpw.formStep='welcome';
                localStorage.setItem("formStep",  globalwpw.formStep);
                globalwpw.formid='';
                localStorage.setItem("formid",  globalwpw.formid);
                globalwpw.formentry = 0;
                localStorage.setItem("formentry",  globalwpw.formentry);

                localStorage.removeItem("cx-name" );
                localStorage.removeItem("cx-diaplayname" );
                localStorage.removeItem("cx-languagecode" );
                localStorage.removeItem("cx-timezone" );
				var number = Math.random() // 0.9394456857981651
                number.toString(36); // '0.xtis06h6'
                var id = number.toString(36).substr(2); // 'xtis06h6'

                localStorage.setItem('botsessionid', id);
                wpwWelcome.greeting();
            } else if(actionType=='no'){
                wpwAction.bot(wpwKits.render(globalwpw.settings.obj.sys_key_help).toLowerCase());
            }
        });
        if( $('#wpbot_language').length > 0 ){
            console.log( globalwpw.settings.obj.language );
            $('select[name^="wpbot_language"] option:selected').attr("selected", null);
            $("#wpbot_language option[value='"+globalwpw.settings.obj.language+"']").attr("selected", "selected");
        }

        $(document).on('change', '#wpbot_language', function(e){

            
            var language = $(this).val();
            globalwpw.settings.obj.language = language;
            $('#wp-chatbot-messages-container').html('');

            if( language == 'ar' ){
                if( !$('#wp-chatbot-chat-container').hasClass('wp-chatbot-rtl') ){
                    $('#wp-chatbot-chat-container').addClass('wp-chatbot-rtl');
                }
            }else{
                if( $('#wp-chatbot-chat-container').hasClass('wp-chatbot-rtl') ){
                    $('#wp-chatbot-chat-container').removeClass('wp-chatbot-rtl');
                }
            }

            localStorage.removeItem('shopper');
            localStorage.removeItem('shopperemail');
            localStorage.removeItem('shopperphone');


            localStorage.removeItem("cx-name" );
            localStorage.removeItem("cx-diaplayname" );
            localStorage.removeItem("cx-languagecode" );
            localStorage.removeItem("cx-timezone" );

            localStorage.removeItem('wpwHitory');
            localStorage.setItem("wildCard",  0);
            localStorage.setItem("aiStep", 0);

            globalwpw.wildCard=0;
            globalwpw.ai_step=0;
            localStorage.setItem("wildCard",  globalwpw.wildCard);
            localStorage.setItem("aiStep", globalwpw.ai_step);
            globalwpw.formfieldid = '';
            localStorage.setItem("formfieldid",  globalwpw.formfieldid);
            globalwpw.formStep='welcome';
            localStorage.setItem("formStep",  globalwpw.formStep);
            globalwpw.formid='';
            localStorage.setItem("formid",  globalwpw.formid);
            globalwpw.formentry = 0;
            localStorage.setItem("formentry",  globalwpw.formentry);
            wpwKits.updateGlobalMenu();
			var number = Math.random() // 0.9394456857981651
			number.toString(36); // '0.xtis06h6'
			var id = number.toString(36).substr(2); // 'xtis06h6'

			localStorage.setItem('botsessionid', id);
            wpwWelcome.greeting();
        })

        $(document).on('click','#wp-chatbot-desktop-reload',function (e) {
            e.preventDefault();
			
                $('#wp-chatbot-messages-container').html('');

            localStorage.removeItem('shopper');
            localStorage.removeItem('shopperemail');
            localStorage.removeItem('shopperphone');


            localStorage.removeItem("cx-name" );
            localStorage.removeItem("cx-diaplayname" );
            localStorage.removeItem("cx-languagecode" );
            localStorage.removeItem("cx-timezone" );

            localStorage.removeItem('wpwHitory');
            localStorage.setItem("wildCard",  0);
            localStorage.setItem("aiStep", 0);

            globalwpw.wildCard=0;
            globalwpw.ai_step=0;
            localStorage.setItem("wildCard",  globalwpw.wildCard);
            localStorage.setItem("aiStep", globalwpw.ai_step);
            globalwpw.formfieldid = '';
            localStorage.setItem("formfieldid",  globalwpw.formfieldid);
            globalwpw.formStep='welcome';
            localStorage.setItem("formStep",  globalwpw.formStep);
            globalwpw.formid='';
            localStorage.setItem("formid",  globalwpw.formid);
            globalwpw.formentry = 0;
            localStorage.setItem("formentry",  globalwpw.formentry);
            wpwKits.updateGlobalMenu();
			var number = Math.random() // 0.9394456857981651
                number.toString(36); // '0.xtis06h6'
                var id = number.toString(36).substr(2); // 'xtis06h6'

                localStorage.setItem('botsessionid', id);
            wpwWelcome.greeting();


        });

        $(document).on('click','.qcld_woo_prod_src',function (e) {
			
			e.preventDefault();
			
			if(globalwpw.settings.obj.woocommerce){
				
				var keyword = $(this).attr('keyword');

				if (typeof keyword !== typeof undefined && keyword !== false) {
					globalwpw.wildCard=20;
					globalwpw.productStep='search';
					wpwTree.product(keyword);
				}
				
			}
		})
		
		if(globalwpw.settings.obj.clear_cache==1){
			$('#wp-chatbot-messages-container').html('');
            localStorage.removeItem('shopper');
            localStorage.removeItem("cx-name" );
            localStorage.removeItem("cx-diaplayname" );
            localStorage.removeItem("cx-languagecode" );
            localStorage.removeItem("cx-timezone" );
			globalwpw.wildCard=0;
			globalwpw.ai_step=0;
			localStorage.setItem("wildCard",  globalwpw.wildCard);
			localStorage.setItem("aiStep", globalwpw.ai_step);
			var number = Math.random() // 0.9394456857981651
                number.toString(36); // '0.xtis06h6'
                var id = number.toString(36).substr(2); // 'xtis06h6'

                localStorage.setItem('botsessionid', id);
			//wpwWelcome.greeting();
		}
		
		$(document).on('click','.qcld_subscribe_confirm',function (e) {
            e.preventDefault();
            var actionType=$(this).attr('subscription');
            if(actionType=='yes'){
				globalwpw.wildCard=3;
				globalwpw.subscriptionStep = 'getname';
				wpwTree.subscription();
            } else if(actionType=='no'){
                wpwAction.bot(wpwKits.render(globalwpw.settings.obj.sys_key_help).toLowerCase());
                if($('.chatbot_intent_reload').length>0){
                    $('.chatbot_intent_reload').remove();
                }
            }
        });
		
		$(document).on('click','.qcld-name-confirm',function (e) {
            e.preventDefault();
            var actionType=$(this).attr('data-res');
			wpwMsg.shopper_choice(actionType);
			wpwAction.bot(actionType);
        });

        $(document).on('click','.qcld_unsubscribe_confirm',function (e) {
            e.preventDefault();
            var actionType=$(this).attr('unsubscription');
            if(actionType=='yes'){
				globalwpw.wildCard=6;
				globalwpw.unsubscriptionStep = 'getemail';
				wpwTree.unsubscription();
            } else if(actionType=='no'){
                wpwAction.bot(wpwKits.render(globalwpw.settings.obj.sys_key_help).toLowerCase());
                if($('.chatbot_intent_reload').length>0){
                    $('.chatbot_intent_reload').remove();
                }
            }
        });

        $(document).on('click','.qcld_unsubscribe_again',function (e) {
            e.preventDefault();
            
            globalwpw.wildCard=6;
            globalwpw.unsubscriptionStep = 'getemail';
            wpwTree.unsubscription();
            
        });
		
		
        return this;
    };
	
	var fileuploadblock = false;
	
	$(document).on("change", "#wp-chatbot-editor:file", function() {
		
		var obj = $(this);
		if(!fileuploadblock){
			
			fileuploadblock = true;
		
			if($('.wpbot_upload_bar').length>0){
				
				$('.wpbot_upload_bar').html('<progress id="qcld_cfb_progress" value="0" max="100"></progress><div class="qcld_upload_status">file uploading..</div>');
				wpwKits.scrollTo();
				
			}else{
				var msg = '<div class="wpbot_upload_bar"><progress id="qcld_cfb_progress" value="0" max="100"></progress><div class="qcld_upload_status">file uploading..</div></div>';
			
				$(globalwpw.settings.messageContainer).append(wpwKits.shopperMsgDom(msg));
				wpwKits.scrollTo();
			}
			
			var percent = $('#percent');
			var form_data = new FormData();                  // Creating object of FormData class
			
			for(var i=0;i<$(this).prop("files").length;i++){
				form_data.append("cfb_file[]", $(this).prop("files")[i]);
			}
			
			             

			form_data.append("formid", globalwpw.formid);                 // Adding extra parameters to form_data
			form_data.append("fieldid", globalwpw.formfieldid);                 // Adding extra parameters to form_data
			form_data.append("action", "qcld_wpcfb_file_upload");                 // Adding extra parameters to form_data
			$.ajax({
				url: globalwpw.settings.obj.ajax_url,
				cache: false,
				contentType: false,
				processData: false,
				data: form_data,                         // Setting the data attribute of ajax with file_data
				type: 'post',
				
				xhr: function () {
					var xhr = new window.XMLHttpRequest();
					xhr.upload.addEventListener("progress", function (evt) {
						if (evt.lengthComputable) {
							var percentComplete = evt.loaded / evt.total;
							percentComplete = parseInt(percentComplete * 100);
							console.log(percentComplete);
							$('#qcld_cfb_progress').attr('value', percentComplete);
						}
					}, false);
					return xhr;
				},
				
				success: function(response) {
					response = $.parseJSON(response);
					console.log(response);
					if(response.status=='success'){
						$('.qcld_upload_status').html(wpwKits.render(globalwpw.settings.obj.chatbot_file_upload_succ));
						jQuery('#wp-chatbot-editor').removeAttr("type");
						fileuploadblock = false;
						wpwTree.formbuilder(response.url.join(','));
						
					}else{
						console.log(response.errors.length);
						var errormsg = '';
						errormsg += '<p>'+wpwKits.render(globalwpw.settings.obj.chatbot_file_upload_fail)+'</p>';
						if(response.errors.length>0){
							jQuery.each( response.errors, function( key, message ) {
								errormsg +='<p>'+message+'</p>';
							})
						}
						$('.qcld_upload_status').html(errormsg);
						obj.val('');
						fileuploadblock = false;
					}
					
				},
				error: function() {
					alert("An error occured, please try again.");         
				}
						
			})
		
		}
	})
	
	$(document).on('keydown keyup', '.qcphonebasicus' , function(e){
		
		var value = $(this).val();
		if(value.length>9){
			$(this).val(wpwKits.formatPhoneNumberUS(value));
		}
	})
	$(document).on('keypress', '.qcnumberfield' , function(e){
		
		if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
			return false;
		}
		
	})
	
    //Deafault value for wpwbot.If nothing passes from the work station
    //Then defaults value will be used.
    $.wpwbot.defaults={
        obj:{},
        editor_handler:0,
        sendButton:'#wp-chatbot-send-message',
        messageEditor:'#wp-chatbot-editor',
        messageContainer:'#wp-chatbot-messages-container',
        messageWrapper:'.wp-chatbot-messages-wrapper',
        botContainer:'.wp-chatbot-ball-inner',
        messageLastChild:'#wp-chatbot-messages-container li:last',
        messageLastBot:'#wp-chatbot-messages-container .wp-chatbot-msg:last .wp-chatbot-paragraph',
        preLoadingTime:0,
        wildcardsShowTime:5000,
    }

})(jQuery);


