/**
 * External dependencies
 */
import {registerPlugin} from '@wordpress/plugins';
import {ExperimentalOrderMeta} from '@woocommerce/blocks-checkout';
import {useDispatch} from '@wordpress/data';

const QuoteButtonOnCheckout = () => {

  const showButton = ywraq_frontend.showButtonOnCheckout;
  const isCheckout = ywraq_frontend.isCheckout;

  if ( !showButton  || !isCheckout) {
    return '';
  }

  const buttonStyle = ywraq_frontend.buttonOnCheckoutStyle;
  const buttonLabel = ywraq_frontend.buttonOnCheckoutLabel;

  const {__internalSetActivePaymentMethod} =
      useDispatch('wc/store/payment');

  const handleOnClickButton = (e) => {
    e.preventDefault();
    __internalSetActivePaymentMethod('yith-request-a-quote');
    document.querySelector('.wc-block-components-checkout-place-order-button').click();
  };
  return (
      <div className="ywraq-ask-for-a-quote-on-block">
        {'button' === buttonStyle ? <button onClick={handleOnClickButton} id="ywraq_checkout_quote_button" className="button">{buttonLabel}</button> : <a id="ywraq_checkout_quote_button" onClick={handleOnClickButton} href="#" className="quote-button alt">{buttonLabel}</a>}
      </div>
  );
};


const render = () => {
  return (
      <>
        <ExperimentalOrderMeta context='woocommerce/checkout'>
          <QuoteButtonOnCheckout/>
        </ExperimentalOrderMeta>
      </>
  );
};

registerPlugin('ywraq-quote-button-on-checkout', {
  render,
  scope: 'woocommerce-checkout',
});

/**
 * Check if there is the Quote Payment Method to hide it.
 *
 * @type {MutationObserver}
 */
let observer = new MutationObserver(mutations => {
  for(let mutation of mutations) {
    for(let node of mutation.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.id === 'payment-method') {
        jQuery(document).find('#radio-control-wc-payment-method-options-yith-request-a-quote__label').closest('.wc-block-components-radio-control__option').hide();
      }
    }
  }
});

let demoElem = document.querySelector('.woocommerce-checkout.woocommerce-page');
observer.observe(demoElem, {childList: true, subtree: true});