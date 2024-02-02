function xProAlert(alert,config){

    if ( document.querySelector('body > .brx-body.iframe') ) {
        return
    }

      const alertSelector = ".brxe-xproalert[data-script-id='" + alert.getAttribute('data-script-id') + "']";

      let alertIdentifier;

      if ( alert.getAttribute('data-loop') ) {
        alertIdentifier = alert.classList + '-' + alert.getAttribute('data-loop');
      }

      if ( alert.id ) {
        alertIdentifier = alert.id
      }

      alert.querySelector(".x-alert_close").addEventListener('click', () => {
        xCloseAlert(alertSelector)
      });

      // Current and last time in milliseconds
      let currentTime = new Date().getTime();
      let lastShownTime = localStorage && localStorage['x-' + alertIdentifier + '-last-shown-time'] ? JSON.parse( localStorage['x-' + alertIdentifier + '-last-shown-time'] ) : false;
      let userDismissed = localStorage && localStorage['x-' + alertIdentifier + '-dismissed'] ? true : false;

      /* maybe show alert */
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

        xShowAlert(alertSelector)



         // save current time as last shown time
         if( localStorage ) localStorage['x-' + alertIdentifier + '-last-shown-time'] = JSON.stringify( currentTime );

}

function xCloseAlert(elementSelector) {

    document.querySelector(elementSelector).style.display = 'none'
    document.querySelector(elementSelector).dispatchEvent(new Event('x_alert:close'))
    
    let alertIdentifier;

    if ( document.querySelector(elementSelector).getAttribute('data-loop') ) {
        alertIdentifier = document.querySelector(elementSelector).classList + '-' + document.querySelector(elementSelector).getAttribute('data-loop');
    }

    if ( document.querySelector(elementSelector).id ) {
        alertIdentifier = document.querySelector(elementSelector).id
    }

    localStorage['x-' + alertIdentifier + '-dismissed'] = 'true';
}

function xShowAlert(elementSelector) {
    document.querySelector(elementSelector).style.display = 'flex'
    document.querySelector(elementSelector).dispatchEvent(new Event('x_alert:show'))
}


function xProAlertConfig(element, extraData = {}) {

    const configAttr = element.getAttribute('data-x-alert')
    const elementConfig = configAttr ? JSON.parse(configAttr) : {}
  
    return elementConfig
  
}

document.addEventListener("DOMContentLoaded",function(e){

    if (!bricksIsFrontend) {
        return;
    }

    if ( document.querySelector('body > .brx-body.iframe') ) {
        return
    }

    bricksQuerySelectorAll(document, '.brxe-xproalert').forEach( alert => {
        xProAlert(alert,xProAlertConfig(alert))
    })
    
    // Expose function
    window.xCloseAlert = xCloseAlert;
    window.xShowAlert = xShowAlert;

})