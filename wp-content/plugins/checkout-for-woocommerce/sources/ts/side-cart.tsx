import React                                                         from 'react';
import { cfwDefineScrollToNotices, cfwDomReady }                     from './_functions';
import AddToCart                                                     from './frontend/Components/AddToCart';
import SideCartComponent                                             from './frontend/Components/SideCartComponent';
import cfwGetWPHooks                                                 from './functions/cfwGetWPHooks';
import cfwRenderComponentIfElementExists                             from './functions/cfwRenderComponentIfElementExists';
import DataStores                                                    from './frontend/DataStores';
import SideCart                                                      from './frontend/Components/SideCart';

cfwDomReady( () => {
    ( window as any ).cfwGetWPHooks = cfwGetWPHooks;
    DataStores.init();

    new AddToCart();
    new SideCart();

    cfwDefineScrollToNotices();

    // Load React components
    const componentMappings = [
        { id: 'cfw-side-cart-container', component: <SideCartComponent />, condition: true },
    ];

    componentMappings.forEach( ( { id, component, condition = true } ) => {
        cfwRenderComponentIfElementExists( id, component, condition );
    } );
} );
