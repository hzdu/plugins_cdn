var brave_social_logging_in = false;

//Facebook Login-------------------------------------------
//=========================================================
   function bravepop_fb_statusChangeCallback(response) {
      console.clear();
      console.log('statusChangeCallback');
      if (response.status === 'connected') { 
         FB.api('/me', {fields: 'name, email'}, function(response) {
            //console.log('Welcome Back! , ' + response.name + '.', response);
         });
      } else {
         //console.log('Please log ' +'into this webpage.');
      }
   }

  function bravepop_fb_login(action='optin', elementID='', popupID=''){
     FB.login(function(response) {
        if (response.authResponse) {
         var accessToken = response.authResponse.accessToken;
         FB.api('/me', {fields: 'name, email'}, function(response) {
           document.dispatchEvent( new CustomEvent('brave_social_login_success', { detail: {service: 'facebook', uid: response.id, name: response.name, email: response.email, action: action, elementID: elementID, popupID: popupID, token: accessToken} }) );
         });
        } else {
            console.log('User cancelled login or did not fully authorize.');
            document.dispatchEvent( new CustomEvent('brave_social_login_failed', { detail: {service: 'facebook' } }) );
        }
     }, {scope: 'email,public_profile', return_scopes: true});
  }



//Google Login---------------------------------------------
//=========================================================
   var googleUser = {};

   function bravepop_google_attachSignin(element, action='optin') {
     if(!element){ return; }
    var elementID = element.dataset.id ? element.dataset.id : '';
    var popupID = element.dataset.popupid ? element.dataset.popupid : '';
    auth2.attachClickHandler(element, {},
        function(googleUser) {
           var googleAuthData = googleUser.getAuthResponse(true);
          document.dispatchEvent( new CustomEvent('brave_social_login_success', { detail: {service: 'google', action: action, elementID: elementID, popupID: popupID, uid: googleUser.getId(), name: googleUser.getBasicProfile().getName(), email: googleUser.getBasicProfile().getEmail(), token: googleAuthData && googleAuthData.id_token } }) );

        }, function(error) {
            document.dispatchEvent( new CustomEvent('brave_social_login_failed', { detail: {service: 'google' } }) );
            alert(JSON.stringify(error, undefined, 2));
        });
   }

   window.addEventListener( 'DOMContentLoaded', bravepop_init_social_login );
   function bravepop_init_social_login(){
      // Initiate google Login
      if(brave_social_global.google_client_id && window.gapi){
         gapi.load('auth2', function(){
            auth2 = gapi.auth2.init({
               client_id: brave_social_global.google_client_id,
               cookiepolicy: 'single_host_origin',
            });
            //Attach All Google Social Optin Buttons
            var allGoogleOptinButtons = document.querySelectorAll('.bravepopform_socialOptin_button--google');
            for (var i = 0; i < allGoogleOptinButtons.length; i++) {
               bravepop_google_attachSignin(allGoogleOptinButtons[i], 'optin');
            }

            //Attach All Google Login Buttons
            var allGoogleLoginButtons = document.querySelectorAll('.bravepop_login_social_button.bravepop_login_socialLogin_button--google');
            for (var i = 0; i < allGoogleLoginButtons.length; i++) {
               bravepop_google_attachSignin(allGoogleLoginButtons[i], 'login');
            }

            //Attach All Google Signup Buttons
            var allGoogleSignupButtons = document.querySelectorAll('.bravepop_signup_social_button.bravepop_login_socialLogin_button--google');
            for (var i = 0; i < allGoogleSignupButtons.length; i++) {
               bravepop_google_attachSignin(allGoogleSignupButtons[i], 'signup');
            }

         });
         
      }
   }


//LinkedIn Login-------------------------------------------
//=========================================================
   function bravepop_linkedin_login(action='optin', elementID='', popupID=''){
      var linkedin_auth_url = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id='+brave_social_global.linkedin_client_id+'&scope=r_liteprofile,r_emailaddress&state=braveRandomString&redirect_uri='+brave_social_global.linkedin_rediret_url
      var linkedin_auth_window =  window.open(linkedin_auth_url, '_blank', 'location=yes,height=650,width=520,scrollbars=yes,status=yes');
      var windowClosed = false;
      //window.addEventListener("storage", (e)=> { console.log(e) } );

      var clear_linkedIn_auth_timer = function(theTimer){
         clearInterval(theTimer);
      }
      var linkedIn_auth_check_timer = setInterval(function(){
         var modalValue = localStorage.getItem( 'brave_linkedin_auth' );
         //console.log('linkedIn Data: ', modalValue);
         
         if( modalValue ){
            var userData = JSON.parse(modalValue);
            document.dispatchEvent( new CustomEvent('brave_social_login_success', { detail: {service: 'linkedin', action: action, name: userData.name, email: userData.email, uid: userData.id, token: userData.token, elementID: elementID , popupID : popupID} }) );
            localStorage.removeItem( 'brave_linkedin_auth' );
            clear_linkedIn_auth_timer(linkedIn_auth_check_timer);
            setTimeout(() => {
               linkedin_auth_window.close();
               windowClosed = true;
            }, 2000);
         }else{
            //document.dispatchEvent( new CustomEvent('brave_social_login_failed', { detail: {service: 'linkedin' } }) );
         }
      }, 300 );

      setTimeout(() => {
         if(!windowClosed){
            clear_linkedIn_auth_timer(linkedIn_auth_check_timer);
         }
      }, 60000);

   }


function brave_social_optin_goBack(formID){
   if(formID && document.querySelector('#bravepopupform_socialOptin-'+formID)){
      document.querySelector('#bravepopupform_socialOptin-'+formID).classList.remove('bravepopupform_socialOptin--hide');
      document.querySelector('#brave_element-'+formID+' .brave_element__form_inner').classList.add('brave_element__form_inner--hide');
   }
}

function brave_social_login_goBack(formID){
   if(formID){
      if(document.querySelector('#brave_wpLogin__login_'+formID)){
         document.querySelector('#brave_wpLogin__login_'+formID).classList.add ('brave_wpLogin__formWrap--hideForm');
         document.querySelector('#brave_wpLogin__login_'+formID).classList.remove('brave_wpLogin__formWrap--showForm');
      }
      if(document.querySelector('#brave_wpLogin__regsiter_'+formID)){
         document.querySelector('#brave_wpLogin__regsiter_'+formID).classList.add ('brave_wpLogin__formWrap--hideForm');
         document.querySelector('#brave_wpLogin__regsiter_'+formID).classList.remove('brave_wpLogin__formWrap--showForm');
      }
   }
}


function bravepop_social_send_signup_request(userData, popupID, elementID){
   var ajaxurl = document.getElementById('brave_signup_ajaxURL_'+elementID).value;
   var security = document.getElementById('brave_signup_security'+elementID).value;
   var redirectURL = document.getElementById('brave_signup_redirect_'+elementID).value ? document.getElementById('brave_signup_redirect_'+elementID).value :  window.location.href ;
   var newUserData = { password: 'null', signupsecurity: security, email: userData.email, social: true, social_login_data: JSON.stringify(userData), redirect: redirectURL, action: 'bravepop_ajax_signup' };
   var isSignupGoal = brave_popup_data[popupID] && brave_popup_data[popupID].settings.goalAction && brave_popup_data[popupID].settings.goalAction.elementIDs && brave_popup_data[popupID].settings.goalAction.elementIDs[brave_currentDevice] && brave_popup_data[popupID].settings.goalAction.elementIDs[brave_currentDevice].includes(elementID);
   //Goal Data
   if(isSignupGoal){
      newUserData.goalData = JSON.stringify({ 
         popupID: popupID, 
         pageURL: window.location, 
         goalSecurity: bravepop_global.goalSecurity, 
         goalType: 'form', 
         viewTime: brave_popup_data[popupID].opened, 
         goalTime: new Date().getTime(), 
         goalUTCTime: new Date().toUTCString(), 
         device: brave_currentDevice, 
         action: 'bravepop_ajax_popup_complete_goal' 
      });
   }
   var brave_login_wrap = document.getElementById('bravepop_signup_socialLogin-'+elementID);
   if(brave_login_wrap){  brave_login_wrap.classList.add('bravepop_login_socialLogin--loading'); }

   brave_ajax_send(ajaxurl, newUserData, function(status, sentData){
      if(brave_login_wrap){  brave_login_wrap.classList.remove('bravepop_login_socialLogin--loading'); }
      var sentData = JSON.parse(sentData);
      if(sentData.created === false){
         return brave_show_loginError(elementID, sentData.message); 
      }else{
         //Complete Goal
         if(isSignupGoal){
            if(window.location.href.includes('brave_popup') === false ){ 
               localStorage.setItem('brave_popup_'+popupID+'_goal_complete', true);
               if(brave_popup_data[popupID].settings && brave_popup_data[popupID].settings.notification && brave_popup_data[popupID].settings.notification.analyticsGoal){
                  setTimeout(() => {
                     console.log('##### Send Goal Event to GA!');
                     brave_send_ga_event('popup', 'goal', brave_popup_data[popupID].title+' ('+popupID+')' || popupID);
                  }, 2000);
               }
            }
         }
         //REDIRECT USER
         window.location.href = sentData.redirect ? sentData.redirect : window.location.href;
      }
   });
}

function bravepop_social_send_login_request(userData, elementID){
   var ajaxurl = document.getElementById('brave_login_ajaxURL_'+elementID).value;
   var security = document.getElementById('brave_login_security'+elementID).value;
   var redirectURL = document.getElementById('brave_login_redirect_'+elementID).value ? document.getElementById('brave_login_redirect_'+elementID).value :  window.location.href ;
   var logindata = { email: userData.email, password: 'null', social: true, social_login_data: JSON.stringify(userData), security: security, redirect: redirectURL, action: 'bravepop_ajax_login' };

   var brave_login_wrap = document.getElementById('bravepop_login_socialLogin-'+elementID);
   if(brave_login_wrap){  brave_login_wrap.classList.add('bravepop_login_socialLogin--loading'); }

   brave_ajax_send(ajaxurl, logindata, function(status, sentData){
      var sentData = JSON.parse(sentData);
      if(brave_login_wrap){  brave_login_wrap.classList.remove('bravepop_login_socialLogin--loading'); }
      if(sentData.loggedin === false){
         return brave_show_loginError(elementID, sentData.message); 
      }else{
         //REDIRECT USER
         window.location.href = sentData.redirect;
      }
   });

}


function bavepop_social_optin(service, formID){
   if(service === 'facebook'){
      bravepop_fb_login('optin', formID)
   }

   if(service === 'linkedin'){
      bravepop_linkedin_login('optin', formID)
   }

   if(service === 'email'){
      document.querySelector('#bravepopupform_socialOptin-'+formID).classList.add('bravepopupform_socialOptin--hide');
      document.querySelector('#brave_element-'+formID+' .brave_element__form_inner').classList.remove('brave_element__form_inner--hide');
   }
}

function bravepop_social_optin_consent(formID, checkboxID){
   var consentField = document.querySelector('#brave_form_field'+checkboxID+'_consent .formfield__inner__checkbox input');
   if(consentField){
      var formConsentField = document.querySelector('#brave_form_'+formID+' #brave_form_field'+checkboxID+' .formfield__inner__checkbox input');
      if(formConsentField){
         formConsentField.checked = consentField.checked ? true : false;
      }
   }
}

function bavepop_social_login(service, formID, popupID, type='login'){

   if(service === 'facebook'){
      bravepop_fb_login(type, formID, popupID)
   }

   if(service === 'linkedin'){
      bravepop_linkedin_login(type, formID, popupID)
   }

   if(service === 'email'){
      if(document.querySelector('#brave_wpLogin__login_'+formID)){
         document.querySelector('#brave_wpLogin__login_'+formID).classList.remove('brave_wpLogin__formWrap--hideForm');
         document.querySelector('#brave_wpLogin__login_'+formID).classList.add('brave_wpLogin__formWrap--showForm');
      }
      if(document.querySelector('#brave_wpLogin__regsiter_'+formID)){
         document.querySelector('#brave_wpLogin__regsiter_'+formID).classList.remove('brave_wpLogin__formWrap--hideForm');
         document.querySelector('#brave_wpLogin__regsiter_'+formID).classList.add('brave_wpLogin__formWrap--showForm');
      }
   }
   
}

//On Successful Social Login, sign user up / log user in / social optin
document.addEventListener('brave_social_login_success', function (e) { 
   //console.log('login', 'brave_social_login_success',e.detail);

   //Login USER
   if(e.detail && e.detail.action === 'login' && e.detail.elementID  && e.detail.email && e.detail.token){
      console.log('#### Login the User!!');
      bravepop_social_send_login_request(e.detail, e.detail.elementID);
   }
   //SignUp USER
   if(e.detail && e.detail.action === 'signup' && e.detail.elementID && e.detail.popupID && e.detail.email && e.detail.token){
      console.log('#### Signup the User!!');
      bravepop_social_send_signup_request(e.detail, e.detail.popupID, e.detail.elementID);
   }
   //Social Optin
   if(e.detail && e.detail.action === 'optin' && e.detail.email && e.detail.elementID && brave_popup_formData[e.detail.elementID]){
      var optinFormID = e.detail.elementID;
      console.log('#### Optin the User!!');
      if(document.querySelector('#brave_element-'+optinFormID+' .brave_newsletter_emailField')){
         document.querySelector('#brave_element-'+optinFormID+' .brave_newsletter_emailField').value = e.detail.email;
      }
      if(document.querySelector('#brave_element-'+optinFormID+' .brave_newsletter_nameField')){
         document.querySelector('#brave_element-'+optinFormID+' .brave_newsletter_nameField').value = e.detail.name;
      }
      document.querySelector('#bravepopupform_socialOptin-'+optinFormID).classList.add('bravepopupform_socialOptin--loading');

      var fillOnly = document.querySelector('#bravepopupform_socialOptin-'+optinFormID).dataset.fillonly
      if(fillOnly !== 'true'){
         brave_submit_form(false, brave_popup_formData[optinFormID], true);
      }
   }

}, false);

//On Failed Social Login, Notify User. 
document.addEventListener('brave_social_login_failed', function (e) { 
   //console.log('login','brave_social_login_failed',e.detail);
   if(brave_social_global.errors && e.detail.service && brave_social_global.errors[e.detail.service]){
      alert(brave_social_global.errors[e.detail.service]);
   }
   //brave_show_loginError(elementID, loginError, success=false);

}, false);

