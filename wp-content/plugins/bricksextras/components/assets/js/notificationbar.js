function xNotificationBar(notification,config){

    if ( document.querySelector('body > .brx-body.iframe') ) {
        return
    }

      const notificationIdentifier = notification.id;
      const notificationSelector = "#" + notification.id;

      notification.querySelector(".x-notification_close").addEventListener('click', () => {
        xCloseNotification(notificationSelector)
      });

      // Current and last time in milliseconds
      let currentTime = new Date().getTime();
      let lastShownTime = localStorage && localStorage['x-' + notificationIdentifier + '-last-shown-time'] ? JSON.parse( localStorage['x-' + notificationIdentifier + '-last-shown-time'] ) : false;
      let userDismissed = localStorage && localStorage['x-' + notificationIdentifier + '-dismissed'] ? JSON.parse( localStorage['x-' + notificationIdentifier + '-dismissed'] ) : false;
      var settingDays = parseFloat( config.show_again.options.days );
      var settingHours = parseFloat( config.show_again.options.hours );
      var settingDelay = settingDays + ( settingHours / 24 );

      /* maybe show notification */
      switch( config.show_again.type ) {

          case 'never':
              // if it was shown at least once, don't show it again
              if( lastShownTime !== false ) return;
              break;
          case 'manual':
            return;  
          case 'dismiss':
            // if was dismissed, maybe show
            if( userDismissed !== false ) {
                var actualDays = ( currentTime - userDismissed ) / ( 60*60*24*1000 );
                if( actualDays < settingDelay || (0 === settingDelay) ) {
                    return;
                }
              break;
            } else {
                break;
            }
              
          case 'after':
              var actualDays = ( currentTime - lastShownTime ) / ( 60*60*24*1000 );
              if( actualDays < settingDelay ) return;
              break;
          case 'evergreen':
            if ( notification.querySelector(".brxe-xcountdown") ) {
                if ( localStorage && localStorage['x-countdown-' + notification.querySelector(".brxe-xcountdown").getAttribute('data-x-id') + '-end-times'] ) {
                    let countdownEndTime = JSON.parse( localStorage['x-countdown-' + notification.querySelector(".brxe-xcountdown").getAttribute('data-x-id') + '-end-times'] );
                    if (countdownEndTime - new Date().getTime() <= 0) {
                        return;
                    }
                }
                break;
            }
            
          default:
              //always show
              break;
        }

        xShowNotification(notificationSelector)

         // save current time as last shown time
         if( localStorage ) localStorage['x-' + notificationIdentifier + '-last-shown-time'] = JSON.stringify( currentTime );

}

function xCloseNotification(elementSelector) {

    document.querySelector(elementSelector).xslideUp(xNotificationBarConfig(document.querySelector(elementSelector)).slideDuration)
    document.querySelector(elementSelector).dispatchEvent(new Event('x_notification:close'))
    
    let notificationIdentifier;

    if ( document.querySelector(elementSelector).getAttribute('data-loop') ) {
        notificationIdentifier = document.querySelector(elementSelector).classList + '-' + document.querySelector(elementSelector).getAttribute('data-loop');
    }

    if ( document.querySelector(elementSelector).id ) {
        notificationIdentifier = document.querySelector(elementSelector).id
    }

    localStorage['x-' + notificationIdentifier + '-dismissed'] = JSON.stringify( new Date().getTime() )
}

function xShowNotification(elementSelector) {
    document.querySelector(elementSelector).style.display = 'flex'
    document.querySelector(elementSelector).dispatchEvent(new Event('x_notification:show'))
}


function xNotificationBarConfig(element, extraData = {}) {

    const configAttr = element.getAttribute('data-x-notification')
    const elementConfig = configAttr ? JSON.parse(configAttr) : {}
  
    return elementConfig
  
}

document.addEventListener("DOMContentLoaded",function(e){

    if (!bricksIsFrontend) {
        return;
    }

    bricksQuerySelectorAll(document, '.brxe-xnotificationbar').forEach(notification => {

        if ( '' === notification.id ) {
            notification.setAttribute('id','x-notification-bar_' + notification.getAttribute('data-x-id'))
        }

        xNotificationBar(notification,xNotificationBarConfig(notification))
    })

    
    
    // Expose function
    window.xCloseNotification = xCloseNotification;
    window.xShowNotification = xShowNotification;

})