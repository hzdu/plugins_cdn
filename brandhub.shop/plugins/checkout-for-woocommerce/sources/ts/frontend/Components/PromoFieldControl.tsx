import React, { useState }       from 'react';
import { SlideToggle }           from 'react-smooth-slide-toggle';
import { useSelect }             from '@wordpress/data';
import ReactHtmlParser           from 'react-html-parser';
import DataService               from '../Services/DataService';
import SecondaryButton           from './SecondaryButton';
import PromoFieldInput           from './PromoFieldInput';
import DataStores                from '../DataStores';
import Actions                   from '../../Types/Actions';
import PrimaryButton             from './PrimaryButton';

const PromoFieldControl = ( { location = '' } ) => {
    const staticActions = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getCartStaticActions( null ), [] );
    const [ isPromoVisible, setIsPromoVisible ] = useState(
        (
            !DataService.getSetting( 'enable_coupon_code_link' ) as boolean
            && DataService.getCheckoutParam( 'is_checkout' ) as boolean
        )
        || (
            !DataService.getSetting( 'enable_side_cart_coupon_code_link' ) as boolean
            && !DataService.getCheckoutParam( 'is_checkout' ) as boolean
        ),
    );
    const [ promoCode, setPromoCode ] = useState( '' );

    const promoCodeLabel = DataService.getMessage( 'promo_code_label' );
    const promoCodePlaceholder = DataService.getMessage( 'promo_code_placeholder' );
    const promoCodeButtonLabel = DataService.getMessage( 'promo_code_button_label' );

    const onClick = ( newPromoCode: string ) => {
        DataService.setRuntimeParameter( 'promoCodeToApply', newPromoCode );
        jQuery( document.body ).trigger( 'cfw_update_cart' );
    };

    if ( !DataService.getSetting( 'coupons_enabled' ) ) {
        return <></>;
    }

    return (
        <div className="cfw-coupon-wrap">
            <SlideToggle
                trigger={
                    <div className="row">
                        <div className="col-lg-12 no-gutters">
                            {!isPromoVisible && (
                                <a
                                    className="cfw-show-coupons-module"
                                    href="#"
                                    onClick={( e ) => {
                                        e.preventDefault();
                                        setIsPromoVisible( true );
                                    }}
                                >
                                    {DataService.getMessage( 'promo_code_toggle_link_text' )}
                                </a>
                            )}
                        </div>
                    </div>
                }
                duration={300}
                expanded={isPromoVisible}
            >
                <div className="row cfw-promo-row cfw-input-wrap-row">
                    <div className="col-8">
                        <PromoFieldInput
                            disabled={!isPromoVisible}
                            label={promoCodeLabel}
                            placeholder={promoCodePlaceholder}
                            value={promoCode}
                            setValue={setPromoCode}
                        />
                    </div>
                    <div className="col-4">
                        <div className="cfw-input-wrap cfw-button-input">
                            <SecondaryButton
                                disabled={!isPromoVisible}
                                label={promoCodeButtonLabel}
                                onClick={() => onClick( promoCode )}
                                className={ promoCode.length ? 'cfw-secondary-btn-active' : 'cfw-secondary-btn-inactive'}
                            />
                        </div>
                    </div>
                </div>
            </SlideToggle>
            { location === 'checkout_cart_summary' && (
                <div dangerouslySetInnerHTML={{ __html: staticActions?.cfw_coupon_module_end }}></div>
            )}
        </div>
    );
};

export default PromoFieldControl;
