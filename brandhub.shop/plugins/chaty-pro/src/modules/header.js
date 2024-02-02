import compose from "../compose";
import saveButton from '../components/save-button';

import withLayoutChange from "../hoc/with-layout-change";
const $ = window.jQuery;

function header( props ) {

    const $header = $('.chaty-header');
    const $widgetBody = $('#chaty-widget-body-tab');

    if( $header.length === 0 ) return;

    /**
     * on wordpress sidebar change, change the header position 
     * @props style = { left: value, top: value, width: value }
     */ 
    props.onLayoutChange( style => {
        $header.css(style);
        $widgetBody.css('margin-top', `${style.content}px`)
    })

    // bring content into view
    $header.find('.chaty-tab').on('click', function(){
        if( $header.css('position') === 'fixed' ) {
            window.scrollTo({
                top: $header.outerHeight() + 32 + 'px',
                left: 0,
                behavior: 'smooth'
            });
        }
    })

    // save button handler
    saveButton();

};

export default compose(
    withLayoutChange()
)( header )