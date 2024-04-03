import React                                                           from 'react';
import { render }                                                      from '@wordpress/element';
import { cfwDefineScrollToNotices, cfwDomReady }                       from './_functions';
import AddToCart                                                       from './frontend/Components/AddToCart';
import SideCartComponent                                               from './frontend/Components/SideCartComponent';
import cfwGetWPHooks                                                   from './functions/cfwGetWPHooks';
import cfwRenderComponentIfElementExists                               from './functions/cfwRenderComponentIfElementExists';
import DataStores                                                      from './frontend/DataStores';
import SideCart                                                        from './frontend/Components/SideCart';
import SideCartFloatingButton                                          from './frontend/Components/SideCartFloatingButton';
import SideCartIcon                                                    from './frontend/Components/SideCartIcon';

cfwDomReady( () => {
    ( window as any ).cfwGetWPHooks = cfwGetWPHooks;
    DataStores.init();

    new AddToCart();
    new SideCart();

    cfwDefineScrollToNotices();

    // Load React components
    const componentMappings = [
        { id: 'cfw-side-cart-container', component: <SideCartComponent />, condition: true },
        { id: 'cfw-side-cart-floating-button', component: <SideCartFloatingButton />, condition: true },
    ];

    componentMappings.forEach( ( { id, component, condition = true } ) => {
        cfwRenderComponentIfElementExists( id, component, condition );
    } );

    // Special case - shortcode
    const mountPoints = document.querySelectorAll( '.cfw-checkoutwc_cart-shortcode' );

    mountPoints.forEach( ( mountPoint: HTMLElement ) => {
        render(
            <SideCartIcon additionalClass={mountPoint.dataset.additionalClasses} />,
            mountPoint,
        );
    } );
} );
