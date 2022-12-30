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
      let userDismissed = localStorage && localStorage['x-' + notificationIdentifier + '-dismissed'] ? true : false;

      /* maybe show notification */
      switch( config.show_again.type ) {

          case 'never':
              // if it was shown at least once, don't show it again
              if( lastShownTime !== false ) return;
              break;
          case 'manual':
            return;  
          case 'dismiss':
            // if was dismissed, dont show again
            if( userDismissed !== false ) return;
            break;    
          case 'after':
              var settingDays = parseInt( config.show_again.options.days );
              var settingHours = parseInt( config.show_again.options.hours );
              var settingDelay = settingDays + ( settingHours / 24 );
              var actualDays = ( currentTime - lastShownTime ) / ( 60*60*24*1000 );
              if( actualDays < settingDelay ) return;
              break;
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

    localStorage['x-' + notificationIdentifier + '-dismissed'] = 'true';
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