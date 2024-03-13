import React, { useEffect }                              from 'react';
import { useSelect }                                     from '@wordpress/data';
import ReactHtmlParser                                   from 'react-html-parser';
import { __ }                                            from '@wordpress/i18n';
import DataStores                                        from '../DataStores';
import SideCartIcon                                      from './SideCartIcon';
import CartTable                                         from './CartTable';
import PromoFieldControl                                 from './PromoFieldControl';
import SideCartTotals                                    from './SideCartTotals';
import DataService                                       from '../Services/DataService';
import SecondaryButton                                   from './SecondaryButton';
import OrderBumpsList                                    from '../../components/OrderBumpsList';
import SideCartData                                      from '../../interfaces/SideCartData';
import Actions                                           from '../../Types/Actions';
import SuggestedProductsCarousel                         from './SuggestedProductsCarousel';
import PrimaryLinkButton                                 from './PrimaryLinkButton';

const SideCartComponent: React.FC = () => {
    const actions = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartActions( null ), [] ) as Actions;
    const notices = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartNotices( null ), [] ) as string;
    const sideCartData = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getSideCartData( null ), [] ) as SideCartData;

    // Scroll to notices if they exist
    useEffect( () => {
        if ( notices ) {
            const errorNotices = jQuery( '.cfw-alert-error' );

            errorNotices.get( 0 )?.scrollIntoView( { behavior: 'smooth' } );
        }
    }, [ notices ] );

    return (
        <div id={'cfw-side-cart-form'} className={'checkoutwc'}>
            <div className={'cfw-side-cart-contents-header'}>
                <span className="cfw-side-cart-close-btn" role="button" aria-label={__( 'Close Cart', 'checkout-wc' )}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 8L21 12M21 12L17 16M21 12L3 12" stroke="#111827" strokeLinecap="round"
                            strokeLinejoin="round"/>
                    </svg>
                </span>

                <SideCartIcon />

                {ReactHtmlParser( actions.cfw_after_side_cart_header )}
            </div>

            <div className="cfw-side-cart-contents">
                {
                    !sideCartData.is_empty ? (
                        <>
                            <CartTable/>
                            <OrderBumpsList locations={[ 'below_cart_items', 'below_side_cart_items' ]}/>
                            {ReactHtmlParser( actions.cfw_after_side_cart_items_table )}
                        </>
                    ) : (
                        <>
                            {ReactHtmlParser( actions.woocommerce_cart_is_empty )}
                            {ReactHtmlParser( actions.checkoutwc_empty_side_cart_content )}
                        </>
                    )
                }
            </div>
            <div className="cfw-side-cart-contents-footer">
                {!sideCartData.is_empty && (
                    <>
                        <div className="cfw-side-cart-contents-footer-border-shim"></div>

                        {ReactHtmlParser( actions.cfw_side_cart_footer_start )}

                        {DataService.getSetting( 'enable_promo_codes_on_side_cart' ) && (
                            <PromoFieldControl/>
                        )}

                        <div dangerouslySetInnerHTML={{ __html: notices }}></div>

                        <div className="cfw-side-cart-totals">
                            {ReactHtmlParser( actions.cfw_before_side_cart_totals )}

                            <SideCartTotals/>

                            {ReactHtmlParser( actions.cfw_after_side_cart_totals )}
                        </div>

                        <div className="wc-proceed-to-checkout">
                            {ReactHtmlParser( DataService.getSetting( 'wc_get_pay_buttons' ) )}
                            {ReactHtmlParser( actions.woocommerce_cart_actions )}

                            <PrimaryLinkButton
                                href={DataService.getSetting( 'checkout_page_url' ).toString()}
                                label={DataService.getMessage( 'proceed_to_checkout_label' )}
                            />
                            {DataService.getSetting( 'enable_continue_shopping_btn' ) && (
                                <SecondaryButton
                                    className={'cfw-side-cart-close-trigger'}
                                    label={DataService.getMessage( 'continue_shopping_label' )}
                                />
                            )}

                            {ReactHtmlParser( actions.cfw_after_side_cart_proceed_to_checkout_button )}

                            {DataService.getSetting( 'enable_side_cart_payment_buttons' )
                                && ReactHtmlParser( actions.woocommerce_widget_shopping_cart_buttons )
                            }

                            {DataService.getSetting( 'enable_side_cart_suggested_products' ) && (
                                <SuggestedProductsCarousel/>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SideCartComponent;
