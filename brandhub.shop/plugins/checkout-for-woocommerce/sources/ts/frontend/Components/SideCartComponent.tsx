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
import SuggestedProductsCarousel                         from './SuggestedProductsCarousel';
import PrimaryLinkButton                                 from './PrimaryLinkButton';

const SideCartComponent: React.FC = () => {
    const isEmpty = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartIsEmpty( null ), [] );
    const staticActions = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartStaticActions( null ), [] );
    const notices = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartNotices( null ), [] ) as string;
    const actions = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartActions( null ), [] );

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
                <button className="cfw-side-cart-close-btn" aria-label={__( 'Close Cart', 'checkout-wc' )}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 8L21 12M21 12L17 16M21 12L3 12" stroke="#111827" strokeLinecap="round"
                            strokeLinejoin="round"/>
                    </svg>
                </button>

                <SideCartIcon />

                {ReactHtmlParser( staticActions?.cfw_after_side_cart_header )}
            </div>

            <div className="cfw-side-cart-contents">
                {
                    !isEmpty ? (
                        <>
                            <CartTable />

                            {DataService.getSetting( 'enable_order_bumps' ) && DataService.getSetting( 'enable_order_bumps_on_side_cart' ) && (
                                <OrderBumpsList locations={[ 'below_cart_items', 'below_side_cart_items' ]}/>
                            ) }

                            {ReactHtmlParser( staticActions?.cfw_after_side_cart_items_table )}
                        </>
                    ) : (
                        <>
                            {ReactHtmlParser( staticActions?.woocommerce_cart_is_empty )}
                            {ReactHtmlParser( staticActions?.checkoutwc_empty_side_cart_content )}
                        </>
                    )
                }
            </div>
            <div className="cfw-side-cart-contents-footer">
                {!isEmpty && (
                    <>
                        <div className="cfw-side-cart-contents-footer-border-shim"></div>

                        {ReactHtmlParser( staticActions?.cfw_side_cart_footer_start )}

                        {DataService.getSetting( 'coupons_enabled_side_cart' ) && (
                            <PromoFieldControl/>
                        )}

                        <div dangerouslySetInnerHTML={{ __html: notices }}></div>

                        <div className="cfw-side-cart-totals">
                            {ReactHtmlParser( staticActions?.cfw_before_side_cart_totals )}

                            <SideCartTotals/>

                            {ReactHtmlParser( staticActions?.cfw_after_side_cart_totals )}
                        </div>

                        <div className="wc-proceed-to-checkout">
                            {ReactHtmlParser( DataService.getSetting( 'wc_get_pay_buttons' ) )}
                            {ReactHtmlParser( staticActions?.woocommerce_cart_actions )}

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

                            {ReactHtmlParser( staticActions?.cfw_after_side_cart_proceed_to_checkout_button )}

                            {DataService.getSetting( 'enable_side_cart_payment_buttons' )
                                && ReactHtmlParser( staticActions?.woocommerce_widget_shopping_cart_buttons )
                            }

                            {ReactHtmlParser( actions?.woocommerce_after_cart_totals )}

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
