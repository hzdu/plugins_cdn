document.addEventListener("DOMContentLoaded", function() {
    tplogin(document)
})

function tplogin(doc){
    var mainDiv = doc.querySelectorAll('.tpgb-login-register');

    mainDiv.forEach(function(item){
        
        var regisForm = item.querySelector('.tpgb-register-form'),
            rebutton =  (regisForm !== null) ? regisForm.querySelector('.tpgb-register-button') : '',
            msgJson = JSON.parse(item.getAttribute('data-registermsgHtml')),
            loginForm = item.querySelector('.tpgb-login-form'),
            forgetpassForm = item.querySelector('.tpgb-lostpass-form'),
            socialBtn = item.querySelectorAll('.tpgn-socialbtn-wrap'),
            lostpassForm = item.querySelector('.tpgb-rp-form'),
            magicForm = item.querySelector('.tpgb-magic-form');

        //Login & Register Tab Js
        if(item.querySelector('.tpgb-form-tabbtn') !== null){
            var ul = item.querySelector('.tpgb-form-tabbtn');
            var formTab = ul.querySelectorAll('.tpgb-ftab-btn');
            
            formTab.forEach(function(tab) {
                tab.addEventListener("click", function(e) {
                    var Tab = this.getAttribute('data-tab');
            
                    var allTabs = ul.querySelectorAll(".tpgb-ftab-btn");
                    allTabs.forEach(function(t) {
                        t.classList.remove('active');
                        t.classList.add('inactive');
                    });
            
                    this.classList.add('active');
                    this.classList.remove('inactive');
            
                    var loginTabContents = item.querySelectorAll('.tpgb-logintab-content');
                    loginTabContents.forEach(function(content) {
                        content.classList.remove('active');
                        content.classList.add('inactive');
                    });
            
                    var targetContent = item.querySelector('.tpgb-logintab-content[data-tab="' + Tab + '"]');
                    targetContent.classList.remove('inactive');
                    targetContent.classList.add('active');
                });
            });
        }

        // Js For Button Click
        var btn = item.querySelector('.tpgb-show-button'),
            uperDiv = item.querySelector(".tpgb-formbtn-hover"),
            hoverdiv = (uperDiv !== null) ? uperDiv.querySelector('.tpgb-form-wrap') : '';
        
        if (btn !== null) {
            if (btn.classList.contains('tpgb-form-click') || btn.classList.contains('tpgb-form-popup')) {
                btn.addEventListener("click", function(e) {
                    e.preventDefault();
                    
                    if (this.classList.contains('tpgb-form-click')) {
                        var windowWidth = window.innerWidth,
                            div = this.nextElementSibling,
                            divWidth = this.getBoundingClientRect(),
                            padd = this.closest('.tpgb-container-col') ? window.getComputedStyle(this.closest('.tpgb-container-col')).padding : this.closest('.wp-container-5') ? window.getComputedStyle(this.closest('.wp-container-5')).padding : '',
                            translateX = (divWidth.x - 10);
                        
                        if (windowWidth <= 767) {
                            div.querySelector('.tpgb-form-wrap').style.transform = 'translateX(-' + translateX + 'px)';
                            div.querySelector('.tpgb-form-wrap').style.left = (padd && padd !== undefined ? padd : '15px');
                        }
                        
                        slideToggleP(div.querySelector('.tpgb-form-wrap'), 300);
                    } else {
                        this.nextElementSibling.classList.add('model-open');
                    }
                });
            } else {
                if (uperDiv !== null) {
                    hoverdiv.style.display = 'none';
                    btn.addEventListener("mouseover", function(e) {
                        this.nextElementSibling.querySelector('.tpgb-form-wrap').style.display = 'block';
                    });
                    hoverdiv.addEventListener("mouseout", function(e) {
                        if (hoverdiv.matches(':hover')) {
                            uperDiv.querySelector('.tpgb-form-wrap').style.display = 'block';
                        } else {
                            uperDiv.querySelector('.tpgb-form-wrap').style.display = 'none';
                        }
                    });
                }
            }
        }

        //JS For Password toggle
        if(item.querySelector('.tpgb-password-show') !== null){
            var toggle = item.querySelector('.tpgb-password-show');

            toggle.addEventListener("click", function(e) {
                var clickDiv = e.currentTarget;
                    id = clickDiv.getAttribute ('data-id'),
                    sIcon = clickDiv.getAttribute ('data-sicon'),
                    hIcon = clickDiv.getAttribute('data-hicon'),
                    field = clickDiv.parentNode.querySelector('input#'+id);
                    
                if (field.getAttribute("type") == "password") {
                    field.setAttribute("type", "text");
                    clickDiv.innerHTML = '<i class="'+hIcon+'"></i>' ;
                } else {
                    field.setAttribute("type", "password");
                    clickDiv.innerHTML = '<i class="'+sIcon+'"></i>';
                }
            })
        }

        //JS For Password Hint toggle

        if(item.querySelector('.tpgb-passHint') !== null){
            var hint = item.querySelector('.tpgb-passHint');
            hint.addEventListener('click' , function(e) {
                var par = e.currentTarget.parentNode.parentNode,
                    iDiv = par.querySelector('.tpgb-pass-indicator')

                slideToggleP(iDiv, 300);
            })
        }

        

        if(item.querySelector('.tpgb-form-password') !== null){ 
            let passFoc = document.querySelectorAll('.tpgb-form-password');
            if(passFoc){
                passFoc.forEach(function(passwordInput) {
                    if(passwordInput.classList.contains('focus')){
                        ['focus', 'keyup'].forEach(function(eventType) {
                            passwordInput.addEventListener(eventType, function(e) {
                                var par = e.currentTarget.parentNode.parentNode;
                                var passIndicator = par.querySelector('.tpgb-pass-indicator');
                                passIndicator.style.display = passIndicator.classList.contains('inline') ? "flex" : "block";
                            });
                        });
                    }

                    passwordInput.addEventListener("focusout", function(e) {
                        var par = e.currentTarget.parentNode.parentNode;
                        var passIndicator = par.querySelector('.tpgb-pass-indicator');
                        passIndicator.style.display = "none";
                    });
                });
            }

            var passHint = item.querySelector('.tpgb-form-password');
            var cheSvg = '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="check-circle" class="svg-inline--fa fa-check-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path></svg>';

            var cloSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M175 175C184.4 165.7 199.6 165.7 208.1 175L255.1 222.1L303 175C312.4 165.7 327.6 165.7 336.1 175C346.3 184.4 346.3 199.6 336.1 208.1L289.9 255.1L336.1 303C346.3 312.4 346.3 327.6 336.1 336.1C327.6 346.3 312.4 346.3 303 336.1L255.1 289.9L208.1 336.1C199.6 346.3 184.4 346.3 175 336.1C165.7 327.6 165.7 312.4 175 303L222.1 255.1L175 208.1C165.7 199.6 165.7 184.4 175 175V175zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z"/></svg>';

            ['focus', 'keyup'].forEach(function(etype) {
                passHint.addEventListener( etype , function (e) {
                    var password = this.value;
                    var cfindi = this.closest(".tpgb-field-group").querySelector(".tpgb-pass-indicator");
                    var cfclicki = this.closest(".tpgb-field-group").querySelector(".tpgb-passHint");
                    var strength = 0;
    
                    if (cfindi.classList.contains('pattern-1') || cfindi.classList.contains('pattern-4') || cfindi.classList.contains('pattern-5')) {
                        let  chrDiv = cfindi.querySelector(".tp-min-eight-character");
    
                        if (password.length > 7 && chrDiv != null ) {
                            chrDiv.classList.add("tp-pass-success-ind");
                            chrDiv.innerHTML = cheSvg;
                            strength++;
                        } else {
                            if( chrDiv != null ){
                                chrDiv.classList.remove("tp-pass-success-ind");
                                chrDiv.innerHTML = cloSvg;
                            }
                        }
                    }
                    if (cfindi.classList.contains('pattern-1') || cfindi.classList.contains('pattern-2') || cfindi.classList.contains('pattern-3')) {
                        let onenoDiv = cfindi.querySelector(".tp-one-number");
    
                        if (password.match(/[0-9]/) && onenoDiv != null ) {
                            onenoDiv.classList.add("tp-pass-success-ind");
                            onenoDiv.innerHTML = cheSvg;
                            strength++;
                        } else  if( onenoDiv != null ){
                            onenoDiv.classList.remove("tp-pass-success-ind");
                            onenoDiv.innerHTML = cloSvg;
                        }
                    }
    
                    // Check for pattern-1 or pattern-3 classes
                    if (cfindi.classList.contains('pattern-1') || cfindi.classList.contains('pattern-3')) {
                        let lowDiv = cfindi.querySelector(".tp-low-lat-case");
    
                        if (password.match(/[a-zA-Z]/) && lowDiv != null  ) {
                            lowDiv.classList.add("tp-pass-success-ind");
                            lowDiv.innerHTML = cheSvg;
                            strength++;
                        } else if( lowDiv != null ) {
                            lowDiv.classList.remove("tp-pass-success-ind");
                            lowDiv.innerHTML = cloSvg;
                        }
                    }
    
                    // Check for pattern-1 class
                    if (cfindi.classList.contains('pattern-1')) {
                        let onspDiv = cfindi.querySelector(".tp-one-special-char");
    
                        if (password.match(/[!@#$%^&*?_,~()\-\[\]]/) && onspDiv != null ) {
                            onspDiv.classList.add("tp-pass-success-ind");
                            onspDiv.innerHTML = cheSvg;
                            strength++;
                        } else if( onspDiv != null  ){
                            onspDiv.classList.remove("tp-pass-success-ind");
                            onspDiv.innerHTML = cloSvg;
                        }
                    }
    
                    // Check for pattern-2 class
                    if (cfindi.classList.contains('pattern-2')) {
                        let foeiDiv = cfindi.querySelector(".tp-four-eight-character");
    
                        if (password.length > 3 && password.length < 9 && foeiDiv != null ) {
                            foeiDiv.classList.add("tp-pass-success-ind");
                            foeiDiv.innerHTML = cheSvg;
                            strength++;
                        } else if( foeiDiv != null ){
                            foeiDiv.classList.remove("tp-pass-success-ind");
                            foeiDiv.innerHTML = cloSvg;
                        }
                    }
    
                    // Check for pattern-3 class
                    if (cfindi.classList.contains('pattern-3')) {
                        let sixDiv = cfindi.querySelector(".tp-min-six-character");
    
                        if (password.length > 5 && sixDiv != null ) {
                            sixDiv.classList.add("tp-pass-success-ind");
                            sixDiv.innerHTML = cheSvg;
                            strength++;
                        } else if( sixDiv != null ){
                            sixDiv.classList.remove("tp-pass-success-ind");
                            sixDiv.innerHTML = cloSvg;
                        }
                    }
    
                    // Check for pattern-4 or pattern-5 classes
                    if (cfindi.classList.contains('pattern-4') || cfindi.classList.contains('pattern-5')) {
                        let loupDiv = cfindi.querySelector(".tp-low-upper-case");
    
                        if (password.match(/[a-z].*[A-Z]|[A-Z].*[a-z]/) && loupDiv != null ) {
                            loupDiv.classList.add("tp-pass-success-ind");
                            loupDiv.innerHTML = cheSvg;
                            strength++;
                        } else if( loupDiv != null ){
                            loupDiv.classList.remove("tp-pass-success-ind");
                            loupDiv.innerHTML = cloSvg;
                        }
                    }
    
                    // Check for pattern-4 class
                    if (cfindi.classList.contains('pattern-4')) {
                        let dialphs = cfindi.querySelector(".tp-digit-alpha");
    
                        if (password.match(/[a-zA-Z]/) || password.match(/[0-9]/) && dialphs != null ) {
                            dialphs.classList.add("tp-pass-success-ind");
                            dialphs.innerHTML = cheSvg;
                            strength++;
                        } else if( dialphs != null ){
                            dialphs.classList.remove("tp-pass-success-ind");
                            dialphs.innerHTML = cloSvg;
                        }
                    }
    
                    // Check for pattern-5 class
                    if (cfindi.classList.contains('pattern-5')) {
                        let nospaDiv = cfindi.querySelector(".tp-number-special");
    
                        if ( ( password.match(/[!@#$%^&*?_,~()\-\[\]]/) || password.match(/[0-9]/) ) && nospaDiv != null ) {
                            nospaDiv.classList.add("tp-pass-success-ind");
                            nospaDiv.innerHTML = cheSvg;
                            strength++;
                        } else if( nospaDiv != null ){
                            nospaDiv.classList.remove("tp-pass-success-ind");
                            nospaDiv.innerHTML = cloSvg;
                        }
                    }
    
                    var subBtn = document.querySelector(".tpgb-login-register button.tpgb-button");
                    if ((cfindi.classList.contains('pattern-1') && strength === 4) || (cfindi.classList.contains('pattern-2') && strength === 2) || (cfindi.classList.contains('pattern-3') && strength === 3) ||  (cfindi.classList.contains('pattern-4') && strength === 3) || (cfindi.classList.contains('pattern-5') && strength === 3)) {
                        if( cfclicki != null ) { cfclicki.classList.add('tp-done'); }
                        document.querySelector(".tpgb-login-register .tpgb-pass-indicator").classList.add('tp-done');
                        setTimeout(function() {   if( cfclicki != null ) { cfclicki.style.display = 'none'; } }, 1000);
                        if( subBtn != null ) { subBtn.removeAttribute("disabled"); }
                    } else {
                        if( cfclicki != null ) { cfclicki.classList.remove('tp-done'); }
                        document.querySelector(".tpgb-login-register .tpgb-pass-indicator").classList.remove('tp-done');
                        setTimeout(function() { if( cfclicki != null ) { cfclicki.style.display = 'block'; } }, 1000);
                        if( subBtn != null ) { subBtn.setAttribute("disabled", true); }
                    }
    
                    // Disable button if password is empty
                    if ( subBtn && (password === false || password === '')) {
                        subBtn.setAttribute("disabled", true);
                    }
                });
            })
           
        }

        // trigger the wdmChkPwdStrength
        document.body.addEventListener('keyup', function(event) {
            var target = event.target;
            var repasswordInput = document.querySelector('.tpgb-register-form #repassword');
            var confirmPasswordInput = document.querySelector('.tpgb-register-form #confirm-password');
            var passwordStrengthIndicator = document.querySelector('#password-strength');
            var submitButton = document.querySelector('.tpgb-register-button');
        
            if ( passwordStrengthIndicator != null && (target === repasswordInput || target === confirmPasswordInput)) {
                wdmChkPwdStrength(repasswordInput, confirmPasswordInput, passwordStrengthIndicator, submitButton, ['admin', 'happy', 'hello', '1234']);
            }
        });
        
        if(regisForm !== null){
            //validate Error Msg
            let validate = true;
            if(regisForm.querySelector('#first-name') !== null){
                var fNameField = regisForm.querySelector('#first-name');
                keyUpValidate(fNameField,'firstname',validate);
            }
            if(regisForm.querySelector('#last-name') !== null){
                var lNameField = regisForm.querySelector('#last-name');
                keyUpValidate(lNameField,'lastname',validate);
            }
            if(regisForm.querySelector('#email') !== null){
                var emailField = regisForm.querySelector('#email');
                keyUpValidate(emailField,'email',validate);
            }
            if(regisForm.querySelector('#username') !== null){
                var uNameField = regisForm.querySelector('#username');
                keyUpValidate(uNameField,'username',validate);
            }
            if(regisForm.querySelector('#repassword') !== null){
                var pNameField = regisForm.querySelector('#repassword');
                keyUpValidate(pNameField,'repassword',validate);
            }
            if(regisForm.querySelector('#mobileno') !== null){
                var pNameField = regisForm.querySelector('#mobileno');
                keyUpValidate(pNameField,'mobileno',validate);
            }

            let data = {
                'regiAction': (msgJson.regaction) ? msgJson.regaction : '',
                'emailData': (msgJson.emailData) ? msgJson.emailData : '',
                'mailChmpData': (msgJson.mailChimpData) ? msgJson.mailChimpData : '',
                'recaptchEn': msgJson.recaptchEn
            };
            // Register Login ajax
            if(rebutton !== null){
                regisForm.addEventListener('submit' , (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const formData = new FormData(regisForm);
                    
                    Object.entries(data).forEach(([key, value]) => {
                        
                        if (key == 'emailData' || key == 'mailChmpData') {
                            Object.entries(value).forEach(([type, val]) => {
                                formData.append(type, val);
                            });
                        } else {
                            formData.append(key, value);
                        }
                    });
                    
                    //var File = document.querySelectorAll( 'input[type="file"]' );
                    // if(File){
                    //     File.forEach(function(obj){
                    //         // console.log(obj.files[0])
                    //         formData.append( obj.name, obj.files[0]);
                    //     })
                    // }
                
                    var fName = ( document.getElementById('first-name') != null ) ? document.getElementById('first-name').value : '',
                        lName = ( document.getElementById('last-name') != null ) ? document.getElementById('last-name').value : '',
                        email = ( document.getElementById('email') != null ) ? document.getElementById('email').value : '',
                        uName = ( document.getElementById('username') != null ) ? document.getElementById('username').value : '',
                        password = ( document.getElementById('repassword') != null ) ? document.getElementById('repassword').value : '',
                        copassword = ( document.getElementById('confirm-password') != null ) ?  document.getElementById('confirm-password').value : '';
                
                    if (fName === '' && fName !== undefined) {
                        var firstNameField = document.getElementById('firstname');
                        if(firstNameField){
                            if ( firstNameField.classList.contains('tpgb-error-load')) {
                                firstNameField.classList.remove('tpgb-error-load');
                            }
                            firstNameField.insertAdjacentHTML('afterend', '<span class="tpgb-error-field">' + firstNameField.dataset.error + '</span>');
                        }
                    }
                    
                    if (lName === '' && lName !== undefined) {
                        var lastNameField = document.getElementById('lastname');
                        if(lastNameField){
                            if ( lastNameField.classList.contains('tpgb-error-load')) {
                                lastNameField.classList.remove('tpgb-error-load');
                            }
                            lastNameField.insertAdjacentHTML('afterend', '<span class="tpgb-error-field">' + lastNameField.dataset.error + '</span>');
                        }
                    }
                    
                    if (email === '' && email !== undefined) {
                        var emailField = document.getElementById('email');
                        if(emailField){
                            if (emailField && emailField.classList.contains('tpgb-error-load')) {
                                emailField.classList.remove('tpgb-error-load');
                            }
                            emailField.insertAdjacentHTML('afterend', '<span class="tpgb-error-field">' + emailField.dataset.error + '</span>');
                        }
                    }
                    
                    if (uName === '' && uName !== undefined) {
                        var usernameField = document.getElementById('username');

                        if(usernameField){
                            if ( usernameField.classList.contains('tpgb-error-load')) {
                                usernameField.classList.remove('tpgb-error-load');
                            }
                            usernameField.insertAdjacentHTML('afterend', '<span class="tpgb-error-field">' + usernameField.dataset.error + '</span>');
                        }
                       
                    }
                    
                    if (password === '' && password !== undefined) {
                        var repasswordField = document.getElementById('repassword');
                        if(repasswordField){
                            if ( repasswordField.classList.contains('tpgb-error-load')) {
                                repasswordField.classList.remove('tpgb-error-load');
                            }
                            repasswordField.insertAdjacentHTML('afterend', '<span class="tpgb-error-field">' + repasswordField.dataset.error + '</span>');
                        }
                           
                    }
                   
                    regisForm.querySelector('.tpgb-regis-noti').classList.add('active');
                    regisForm.querySelector('.tpgb-regis-noti .tpgb-re-response').innerHTML = msgJson.regloadText;

                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl);
                    xhr.responseType = 'json';

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                var data = xhr.response.data;
                                if (data) {
                                    var response = data;
                                    if (response.nonceCheck && response.nonceCheck.registered == false) {
                                        showResponseMessage(response.nonceCheck.message);
                                    }
                                    if (response.checkRegister && response.checkRegister.registered == false) {
                                        showResponseMessage(response.checkRegister.message);
                                    }
                                    if (response.recaptcha && response.recaptcha.registered == false) {
                                        showResponseMessage(response.recaptcha.message);
                                    }
                                    if (response.userRegi && response.userRegi.registered == false) {
                                        showResponseMessage(response.userRegi.message);
                                    } else if (response.fieldmissing && response.fieldmissing.registered == false) {
                                        showResponseMessage(response.fieldmissing.message);
                                    } else if (response.userRegi && response.userRegi.registered == true) {
                                        showResponseMessage(msgJson.succMsg);
                                    }
                                    if (response.regiAction) {
                                        response.regiAction.forEach(function (obj) {
                                            if (obj.action == 'sendemail' || obj.action == 'autologin') {
                                                if (obj.registered == true) {
                                                    showResponseMessage(obj.message);
                                                } else {
                                                    location.reload(true);
                                                }
                                            }
                                            if (obj.action == 'redirect') {
                                                if (obj.registered == true) {
                                                    if (msgJson.regaction && msgJson.regaction.includes('redirect') && msgJson.regredireUrl && msgJson.regredireUrl != undefined) {
                                                        document.location.href = msgJson.regredireUrl;
                                                    } else {
                                                        location.reload(true);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    if (response.mailscb) {
                                        showResponseMessage('Mail Subscribe Successfully');
                                    }
                                    if (response.register && response.register.registered == true) {
                                        showResponseMessage(response.redirect.message);
                                    }
                                }
                            } else {
                                console.error('Error:', xhr.status);
                            }
                            setTimeout(function () {
                                regisForm.querySelector('.tpgb-regis-noti').classList.remove('active');
                            }, 3000);
                        }
                    };

                    xhr.send(formData);

                    function showResponseMessage(message) {
                        // var regisForm = document.querySelector(regisForm);
                        regisForm.querySelector('.tpgb-regis-noti').classList.add('active');
                        regisForm.querySelector('.tpgb-regis-noti .tpgb-re-response').innerHTML = message;
                    }
                })
            }

            //recaptcha 
            if( msgJson.recaptchaKey && msgJson.recaptchaKey !== undefined ){
                recapDiv = regisForm.querySelector('.tpgb-recaptch-key');
                tpgb_reCaptcha(msgJson,recapDiv)
            }
        }

        function tpgb_reCaptcha(reData,recapDiv){
            window.tpgb_onLoadReCaptcha = function() {
                var clientId = grecaptcha.render('tpgb-inline-badge-'+reData.blockId+'', {
                    'sitekey': reData.recaptchaKey ,
                    'badge': reData.recaptchaPos,
                    'size': 'invisible'
                });
                grecaptcha.ready(function() {
                    grecaptcha.execute(clientId, {
                    action: 'register'
                    })
                    .then(function(token) {
                        recapDiv.innerHTML='<input type="hidden" name="g-recaptcha-response" class="g-recaptcha-response-'+reData.blockId+'" value="' + token + '">';
                    });
                });
            }
        }

        if(loginForm !== null){
            var loginBtn = loginForm.querySelector('.tpgb-login-button'),
                lostpasDiv = loginForm.querySelector('.tpgb-lostpass-relink'),
                magicDiv = loginForm.querySelector('.tpgb-magic-active'),
                lomsgData = JSON.parse(item.getAttribute('data-loginmsgHtml')),
                forgetPaa = item.querySelector('.tpgb-login-lost');
            
                
            
            if (lostpasDiv !== null) {
                var losBtn = lostpasDiv.querySelector('.tpgb-lost-password');
                var fobackbtn = forgetPaa !== null ? forgetPaa.querySelector('.tpgb-lpu-back') : null;
            
                losBtn.addEventListener('click', function (e) {
                    if (forgetPaa.style.display === 'none') {
                        forgetPaa.style.display = 'block';
                    } else {
                        forgetPaa.style.display = 'block';
                    }
                });
            
                if (fobackbtn !== null) {
                    fobackbtn.addEventListener('click', function (e) {
                        forgetPaa.style.display = 'none';
                    });
                }
            }
            if (magicDiv !== null) {
                var magicBtn = magicDiv.querySelector('.tpgb-magic-tag');
                var mbackbtn = magicForm !== null ? magicForm.querySelector('.tpgb-lpu-back') : null;
            
                magicBtn.addEventListener('click', function (e) {
                    if (magicForm.style.display === 'none') {
                        magicForm.style.display = 'block';
                    } else {
                        magicForm.style.display = 'block';
                    }
                });
            
                if (mbackbtn !== null) {
                    mbackbtn.addEventListener('click', function (e) {
                        magicForm.style.display = 'none';
                    });
                }
            }
            
            if(loginBtn !== null){
                loginForm.addEventListener('submit', function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                
                    var formData = new FormData(loginForm);
                    formData.append('action', 'tpgb_login_user');
                
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl);
                    xhr.setRequestHeader('Accept', 'application/json');
                    
                    var regisNoti = loginForm.querySelector('.tpgb-regis-noti'),
                        regisResponse = regisNoti.querySelector('.tpgb-re-response');
                    
                    
                    regisNoti.classList.add('active');
                    regisResponse.innerHTML = lomsgData.loglodTxt;
                   

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                var data = JSON.parse(xhr.responseText);
                                if (data.loggedin === true) {
                                    
                                    var regisNoti = loginForm.querySelector('.tpgb-regis-noti'),
                                    regisResponse = regisNoti.querySelector('.tpgb-re-response');

                                    regisNoti.classList.add('active');
                                    regisResponse.innerHTML = lomsgData.losuTxt;
                                    if (lomsgData.logdireUrl && lomsgData.logdireUrl !== undefined) {
                                        document.location.href = lomsgData.logdireUrl;
                                    } else {
                                        location.reload(true);
                                    }
                                } else if (data.loggedin === false) {
                                    var regisNoti = loginForm.querySelector('.tpgb-regis-noti'),
                                        regisResponse = regisNoti.querySelector('.tpgb-re-response');

                                    regisNoti.classList.add('active');
                                    regisResponse.innerHTML = data.message;
                                }
                            } else {
                                var regisNoti = loginForm.querySelector('.tpgb-regis-noti'),
                                    regisResponse = regisNoti.querySelector('.tpgb-re-response');

                                regisNoti.classList.add('active');
                                regisResponse.innerHTML = lomsgData.loeroTxt;
                            }
                
                            setTimeout(function() {
                                var regisNoti = loginForm.querySelector('.tpgb-regis-noti');
                                regisNoti.classList.remove('active');
                            }, 1500);
                        }
                    };
                
                    xhr.send(formData);
                });
            }
        }

        if (forgetpassForm !== null) {
            let fpassBtn = forgetpassForm.querySelector('.tpgb-forgetpassword-button');
            let losmgJson = JSON.parse(item.getAttribute('data-lostPass'));
        
            forgetpassForm.addEventListener('submit', function (e) {
                e.preventDefault();
        
                var formData = new FormData(forgetpassForm);
                formData.append('action', 'tpgb_ajax_forgot_password');
                formData.append('tpgbforgotdata', losmgJson.cumData);
        
                var xhr = new XMLHttpRequest();
                xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl);
                xhr.responseType = 'json';
                
                var regisNoti = forgetpassForm.querySelector('.tpgb-regis-noti'),
                    regisResponse = regisNoti.querySelector('.tpgb-re-response');

                regisNoti.classList.add('active');
                regisResponse.innerHTML = losmgJson.msgHtml.lostlodTxt

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            var data = xhr.response;
        
                            var regisNoti = forgetpassForm.querySelector('.tpgb-regis-noti'),
                                regisResponse = regisNoti.querySelector('.tpgb-re-response');
        
                            if (data.lost_pass === 'confirm') {
                                regisNoti.classList.add('active');
                                regisResponse.innerHTML = losmgJson.msgHtml.lostuTxt;
                            } else if (data.lost_pass === 'something_wrong') {
                                regisNoti.classList.add('active');
                                regisResponse.innerHTML = losmgJson.msgHtml.losteroTxt;
                            } else if (data.lost_pass === 'could_not_sent') {
                                regisNoti.classList.add('active');
                                regisResponse.innerHTML = data.message;
                            }
                        }

                        setTimeout(function() {
                            regisNoti.classList.remove('active');
                        }, 1500);
                    }
                };
        
                xhr.send(formData);
        
                // Handle recaptcha
                if (losmgJson.recaptchaKey && losmgJson.recaptchaKey !== undefined) {
                    recapDiv = forgetpassForm.querySelector('.tpgb-lorecaptch-key');
                    tpgb_reCaptcha(losmgJson, recapDiv);
                }
        
                // Reset the form
                forgetpassForm.reset();
            });
        }

        if (lostpassForm !== null) {
            let lostBtn = lostpassForm.querySelector('.tpgb-resetpassword-button');
            let lofData = JSON.parse(lostpassForm.getAttribute('data-lostpassdata'));
        
            if (lostBtn !== null) {
                lostpassForm.addEventListener('submit', function (e) {
                    e.preventDefault();
        
                    var formData = new FormData(lostpassForm);
                    formData.append('action', 'tpgb_ajax_reset_password');
                    formData.append('tpgbresetdata', lofData.resetpdata);
        
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl);
                    xhr.responseType = 'json';
                    
                    var regisNoti = lostpassForm.querySelector('.tpgb-regis-noti'),
                    regisResponse = regisNoti.querySelector('.tpgb-re-response');
                    
                    regisNoti.classList.add('active');
                    regisResponse.innerHTML = 'Please Wait...'

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                var data = xhr.response;
        
                                var regisNoti = lostpassForm.querySelector('.tpgb-regis-noti');
                                var regisResponse = regisNoti.querySelector('.tpgb-re-response');
        
                                regisNoti.classList.add('active');
                                regisResponse.innerHTML = 'Please Wait...';
        
                                regisNoti.classList.add('active');
                                regisResponse.innerHTML = lofData.resetHtml.loadingTxt + data.message;
        
                                if (data.reset_pass === 'success') {
                                    if (lofData.resetHtml.redirUrl) {
                                        window.location = lofData.resetHtml.redirUrl;
                                    }
                                }
        
                                if (data.reset_pass === 'empty') {
                                    lostpassForm.querySelector('#repassword').value = '';
                                    lostpassForm.querySelector('#reenpassword').value = '';
                                }
        
                                if (data.reset_pass === 'mismatch') {
                                    if (lostpassForm.querySelector('#reenpassword').value !== undefined) {
                                        lostpassForm.querySelector('#reenpassword').value = '';
                                    }
                                }
        
                                if (data.reset_pass === 'expire' || data.reset_pass === 'invalid') {
                                    if (lofData.resetHtml.redirUrl) {
                                        window.location = lofData.resetHtml.redirUrl;
                                    }
                                }
                            }

                            setTimeout(function() {
                                regisNoti.classList.remove('active');
                            }, 1500);
                        }
                    };
        
                    xhr.send(formData);
        
                    // Handle recaptcha
                    if (lofData.recaptchaKey && lofData.recaptchaKey !== undefined) {
                        recapDiv = lostpassForm.querySelector('.tpgb-resrecaptch-key');
                        tpgb_reCaptcha(lofData, recapDiv);
                    }
                });
            }
        }
        
        if(socialBtn !== null){
            socialBtn.forEach(function(sbtn){
                let fbBtn = sbtn.querySelector('.tpgb-btn-fb'),
                    socialData = JSON.parse(sbtn.getAttribute('data-socialIds')),
                    goBtn = sbtn.querySelector('.tpgb-btn-goo-'+socialData.uniId);
                    
                if(fbBtn !== null){
                    (function(d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (d.getElementById(id)) return;
                        js = d.createElement(s); js.id = id;
                        js.src = "https://connect.facebook.net/en_US/sdk.js";
                        fjs.parentNode.insertBefore(js, fjs);
                    }(document, 'script', 'facebook-jssdk')); 
                    
                    window.fbAsyncInit = function() {
                        FB.init({
                            appId      : socialData.faceAppid ,
                            cookie     : true,
                            xfbml      : true,
                            version    : 'v7.0'
                        });
                    }; 
                                            

                    fbBtn.addEventListener('click' , function(){
                        FB.login(function(e){
                            e.authResponse && statusChangeCallback(e,socialData.formType,socialData);
                        }, {
                            scope: "email"
                        });
                    });
                }
                if(goBtn !== null){
                    (function(d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (d.getElementById(id)) return;
                        js = d.createElement(s); js.id = id;
                        js.src = "https://accounts.google.com/gsi/client";
                        fjs.parentNode.insertBefore(js, fjs);
                    }(document, 'script', 'google-js'));
                    
                    let attrBtn = {}

                    if(socialData.gbtnType == 'standard'){
                        attrBtn = Object.assign( attrBtn, { type : socialData.gbtnType , theme: socialData.goolthem , size: ( socialData.gobtnSize == 'cutm' ? 'large' : socialData.gobtnSize ) , text : socialData.gobtnTxt , shape : socialData.gostandshape , width : socialData.gobctWidth } )
                    }else{
                        attrBtn = Object.assign( attrBtn, { type : socialData.gbtnType , theme: socialData.goolthem , size: socialData.goioSize , shape : socialData.goioshape } )
                    }
                    
                    window.onload = function () {
                        google.accounts.id.initialize({
                            client_id: socialData.googlId ,
                            callback: function(response){
                                tpgb_googleLoginEndpoint(response , socialData.googlId )
                            }
                        });
                        google.accounts.id.renderButton( goBtn, attrBtn );
                    }
                }

                if(socialData.googlepic == 'yes'){
                    
                    
                    (function(d, s, id) {
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (d.getElementById(id)) return;
                        js = d.createElement(s); js.id = id;
                        js.src = "https://accounts.google.com/gsi/client";
                        fjs.parentNode.insertBefore(js, fjs);
                    }(document, 'script', 'google-pic-js'));
                    
                sbtn.innerHTML = '<div id="g_id_onload" data-client_id="'+socialData.googlId+'" data-context="signin"  data-callback="tpgb_googleLoginEndpoint" data-nonce="'+socialData.nonce+'"> </div>';
                }
            })
        }

        if(magicForm !== null){
            var magicBtn = magicForm.querySelector('.forgetpassword')
            losmgJson = JSON.parse(item.getAttribute('data-lostPass')),
            magicData = JSON.parse(magicForm.getAttribute('data-magicdata'));

            magicForm.addEventListener('submit' , function(e){
                e.preventDefault();
                
                var xhr = new XMLHttpRequest();
                xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl);
                xhr.responseType = 'json';
                
                // Handle beforeSend and complete
                var regisNoti = magicForm.querySelector('.tpgb-regis-noti');
                var regisResponse = regisNoti.querySelector('.tpgb-re-response');

                regisNoti.classList.add('active');
                regisResponse.innerHTML = losmgJson.msgHtml.lostlodTxt;

                var formData = new FormData(magicForm);
                formData.append('action', 'tpgb_send_magic_link');
                formData.append('mailData', magicData);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            var data = xhr.response;
                            
                            var regisNoti = magicForm.querySelector('.tpgb-regis-noti');
                            var regisResponse = regisNoti.querySelector('.tpgb-re-response');

                            if (data.magicMsg) {
                                location.reload(true);
                            }

                            regisNoti.classList.add('active');
                            regisResponse.innerHTML = data.message;
                        }

                        setTimeout(function() {
                            regisNoti.classList.remove('active');
                        }, 1500);
                    }
                };

                xhr.send(formData);
            })
        }

    });
}


// Password Strength Meter
function wdmChkPwdStrength(pwdElement, confirmPwdElement, strengthStatusElement, submitBtnElement, blacklistedWords) {
    var pwd = ( pwdElement != null ) ? pwdElement.value : '',
        confirmPwd = ( confirmPwdElement != null ) ? confirmPwdElement.value : '';

    blacklistedWords = blacklistedWords.concat(wp.passwordStrength.userInputDisallowedList());
    submitBtnElement.setAttribute('disabled', 'disabled');
    strengthStatusElement.classList.remove('short', 'bad', 'good', 'strong');

    var pwdStrength = wp.passwordStrength.meter(pwd, blacklistedWords, confirmPwd);

    switch (pwdStrength) {
        case 2:
            strengthStatusElement.classList.add('bad');
            strengthStatusElement.innerHTML = pwsL10n.bad;
            document.querySelector('.tpgb-login-register .tpgb-password-strength-wrapper').classList.add('show');
            break;

        case 3:
            strengthStatusElement.classList.add('good');
            strengthStatusElement.innerHTML = pwsL10n.good;
            document.querySelector('.tpgb-login-register .tpgb-password-strength-wrapper').classList.add('show');
            break;

        case 4:
            strengthStatusElement.classList.add('strong');
            strengthStatusElement.innerHTML = pwsL10n.strong;
            document.querySelector('.tpgb-login-register .tpgb-password-strength-wrapper').classList.add('show');
            break;

        case 5:
            strengthStatusElement.classList.add('short');
            strengthStatusElement.innerHTML = pwsL10n.mismatch;
            document.querySelector('.tpgb-login-register .tpgb-password-strength-wrapper').classList.add('show');
            break;

        default:
            strengthStatusElement.classList.add('short');
            strengthStatusElement.innerHTML = pwsL10n.short;
            document.querySelector('.tpgb-login-register .tpgb-password-strength-wrapper').classList.add('show');
            break;
    }
   
    if (pwdStrength === 4 && confirmPwd && confirmPwd.trim() !== '') {
        submitBtnElement.removeAttribute('disabled');
    }

    return pwdStrength;
}

// validate Error Msg
function keyUpValidate(field, type, validate) {
    field.addEventListener('keyup', function() {
        var value = this.value;
        var errorField = this.nextElementSibling;

        // Remove existing error messages
        if (errorField && errorField.classList.contains('tpgb-error-field')) {
            errorField.remove();
        }

        // Remove error class if present
        if (this.classList.contains('tpgb-error-load')) {
            this.classList.remove('tpgb-error-load');
        }

        // Validation checks
        if (type !== 'email' && (value === '' || value === undefined)) {
            this.insertAdjacentHTML('afterend', '<span class="tpgb-error-field">' + this.getAttribute('data-error') + '</span>');
            validate = false;
        }

        if (type === 'email') {
            validate = false;
            var mailformat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;
            if (value === '' || value === undefined) {
                this.insertAdjacentHTML('afterend', '<span class="tpgb-error-field">' + this.getAttribute('data-error') + '</span>');
            } else if (!value.match(mailformat)) {
                this.insertAdjacentHTML('afterend', '<span class="tpgb-error-field">' + this.getAttribute('data-error') + '</span>');
            }
        }
    });
}

// Facebook login 

function statusChangeCallback(response,type='',sData) {  			
    if (response.status === 'connected') { 
      facebook_fetch_info(response, type,sData);			  
    } else {}
}

function facebook_fetch_info(response,type,sData) {
    FB.api('/me',{ fields: 'id, name, first_name, last_name, email, link, gender, locale, picture' }, function(res) {			 
        if (response.authResponse.accessToken && res.id && res.email) {
            var fbData = new FormData();
            fbData.append('action', 'tpgb_facebook_login');
            fbData.append('accessToken', response.authResponse.accessToken);
            fbData.append('id', res.id);
            fbData.append('name', res.name);
            fbData.append('first_name', res.first_name);
            fbData.append('last_name', res.last_name);
            fbData.append('email', res.email);
            fbData.append('link', res.link);
            fbData.append('nonce', sData.nonce);
            fbData.append('appId', sData.faceAppid);
            fbData.append('secrId', sData.faceSecid);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl);
            xhr.responseType = 'json';
        
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        var data = xhr.response;
                        if (data.loggedin === true || data.registered === true) {
                            if (sData.redirUrl) {
                                window.location = sData.redirUrl;
                            } else {
                                location.reload();
                            }
                        }
                    }
                }
            };
        
            xhr.send(fbData);
        }
    });
    
}

//google Picker Function
function tpgb_googleLoginEndpoint( googleUser , clientId ) {
	
	let gclientId = '';
	
	if(clientId){
		gclientId = clientId;
	}else{
        if(googleUser.clientId){
            gclientId = googleUser.clientId
        }
	}
    var xhr = new XMLHttpRequest();
    xhr.open('POST', (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl);

    var goData = new FormData();
    goData.append('action', 'tpgb_google_pic');
    goData.append('googleCre', googleUser.credential);
    goData.append('clientId', gclientId);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                if (data.loggedin === true) {
                    location.reload();
                }
            }
        }
    };
    
    xhr.send(goData);
}