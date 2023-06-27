function xCountdown() {

    function epochToTimestamp(epochTime) {
        const date = new Date(parseInt(epochTime));
        const timestamp = date.toISOString();
        return timestamp;
    }

   var addTime = function ($time = 0, [ $days = 0, $hours = 0, $minutes = 0, $seconds = 0 ] ) {

        const output = new Date(epochToTimestamp($time));
        output.setTime(output.getTime() + ($days * 24 * 60 * 60 * 1000));
        output.setTime(output.getTime() + ($hours * 60 * 60 * 1000));
        output.setTime(output.getTime() + ($minutes * 60 * 1000));
        output.setTime(output.getTime() + ($seconds * 1000));
        return output;
    }

    var doCountdown = function (el, config, r, firstShownTime) {

        let endTime;

        if ( config.hasOwnProperty("date") ) {
            endTime = config.date.replace(" ", "T");
        } else {

            let values = { "days": 0, "hours": 0, "minutes": 0, "seconds": 0 };
            config.fields.forEach(function (field, index) {
                if (field.value) {
                    values[field.type] = parseFloat(field.value);
                }
            })

            endTime = addTime(firstShownTime,Object.values(values));

        }

        var timeLeft = new Date(endTime).getTime() - new Date().getTime();

        if (timeLeft <= 0) {

            if ( !document.querySelector('body > .brx-body.iframe') ) {

                if ( (clearInterval(el.dataset.bricksCountdownId), "hide" === config.action) ) {
                    return void (el.innerHTML = "");
                }
                if ("text" === config.action) {
                    return void (el.innerHTML = config.actionText);
                }

                if ("sync" === config.action) {
                    if ( el.closest('.x-modal') ) {
                        if (typeof xCloseModal == 'function') {
                            xCloseModal( el.closest('.x-modal').id );
                        }
                    }
                    if ( el.closest('.brxe-xnotificationbar') ) {
                        if (typeof xCloseNotification == 'function') {
                            xCloseNotification( '#' + el.closest('.brxe-xnotificationbar').id )
                        }
                    }
                }

                if ( "redirect" === config.action ) {
                   if ( 'disable' === config.preventRedirect ) {
                    window.location.href = config.redirectURL;
                   } else {
                    if ( !document.querySelector('body.admin-bar') ) {
                        window.location.href = config.redirectURL;
                    }
                   }
                }

            }
           
        } else {

            r &&
                ((el.innerHTML = ""),
                config.fields.forEach(function (t) {
                    if (t.format) {
                        var r = document.createElement("div");
                        if ((r.classList.add("x-countdown_item"), t.prefix)) {
                            var n = document.createElement("span");
                            n.classList.add("x-countdown_prefix"), (n.innerHTML = t.prefix), r.appendChild(n);
                        }

                        var o = document.createElement("span");
                        if ((o.classList.add("x-countdown_format"), r.appendChild(o), t.suffix)) {
                            var i = document.createElement("span");
                            i.classList.add("x-countdown_suffix"), (i.innerHTML = t.suffix), r.appendChild(i);  
                        }

                        el.appendChild(r);

                        if (null != config.seperator ) {

                            var seperator = document.createElement("div");
                            seperator.classList.add("x-countdown_seperator")
                            seperator.innerHTML = config.seperator;
                            r.before(seperator)

                            if ( el.querySelector(".x-countdown_seperator:first-child") ) {
                                el.querySelector(".x-countdown_seperator:first-child").remove()
                            }
                        }
                        
                    }
                }));
                
            var items = bricksQuerySelectorAll(el, ".x-countdown_item"),
                days = Math.floor(timeLeft / 864e5),
                hours = Math.floor((timeLeft % 864e5) / 36e5),
                minutes = Math.floor((timeLeft % 36e5) / 6e4),
                seconds = Math.floor((timeLeft % 6e4) / 1e3);

                config.fields.forEach(function (field, index) {
                    if (field.format) {
                        var fieldFormat = field.format.toLowerCase();
                        fieldFormat.includes("%d") 
                            ? (field.format.includes("%D") && days <= 9 && (days = "0".concat(days)), (items[index].querySelector(".x-countdown_format").innerHTML = fieldFormat.replace("%d", timeLeft <= 0 ? 0 : "<span class=x-countdown_number>" + days + "</span>")))
                            : fieldFormat.includes("%h")
                            ? (field.format.includes("%H") && hours <= 9 && (hours = "0".concat(hours)), (items[index].querySelector(".x-countdown_format").innerHTML = fieldFormat.replace("%h", timeLeft <= 0 ? 0 : "<span class=x-countdown_number>" + hours + "</span>")))
                            : fieldFormat.includes("%m")
                            ? (field.format.includes("%M") && minutes <= 9 && (minutes = "0".concat(minutes)), (items[index].querySelector(".x-countdown_format").innerHTML = fieldFormat.replace("%m", timeLeft <= 0 ? 0 : "<span class=x-countdown_number>" + minutes + "</span>")))
                            : fieldFormat.includes("%s") && (field.format.includes("%S") && seconds <= 9 && (seconds = "0".concat(seconds)), (items[index].querySelector(".x-countdown_format").innerHTML = fieldFormat.replace("%s", timeLeft <= 0 ? 0 : "<span class=x-countdown_number>" + seconds + "</span>")));
                    }
                });

        }
    };

    const extrasCountdown = function ( container ) {

        let currentTime = new Date().getTime();

        bricksQuerySelectorAll(container, ".brxe-xcountdown").forEach( (countdown) => {

            let identifier = countdown.getAttribute('data-x-id');
            let firstShownTime;
            
            if ( localStorage && localStorage['x-countdown-' + identifier + '-first-shown-time'] ) {
                firstShownTime = JSON.parse( localStorage['x-countdown-' + identifier + '-first-shown-time'] )
            } else {
                if( localStorage ) localStorage['x-countdown-' + identifier + '-first-shown-time'] = JSON.stringify( currentTime );
                firstShownTime = JSON.stringify( currentTime );
            }

             /* for the builder */
             if ( document.querySelector('.brx-body.iframe') ) {
                if( localStorage ) localStorage['x-countdown-' + identifier + '-first-shown-time'] = JSON.stringify( currentTime );
                firstShownTime = JSON.stringify( new Date().getTime() );
            }

            var config = countdown.getAttribute('data-x-countdown');
            try {
                config = JSON.parse(config);
            } catch (e) {
                return false;
            }

            if( localStorage ) {
                let endTime;
                let values = {  "days": 0, "hours": 0, "minutes": 0, "seconds": 0};

                config.fields.forEach(function (field, index) {
                    if (field.value) {
                            values[field.type] = parseFloat(field.value);
                    }
                })

                endTime = addTime(firstShownTime,Object.values(values));
                if( localStorage ) localStorage['x-countdown-' + identifier + '-end-times'] = new Date(endTime).getTime();
            }
            
            if ( config.hasOwnProperty("fields") ) {
                var countdownID = countdown.dataset.XCountdownId;
                countdownID && clearInterval(countdownID), 
                doCountdown(countdown, config, true, firstShownTime), 
                (countdownID = setInterval(doCountdown, 1000, countdown, config, false, firstShownTime)), 
                (countdown.dataset.XCountdownId = countdownID);
            }

        });

    }

    extrasCountdown(document);

    // Expose function
    window.doExtrasCountdown = extrasCountdown;
}

document.addEventListener("DOMContentLoaded",function(e){
     bricksIsFrontend&&xCountdown()
});