import React                             from 'react';
import { cfwDomReady }                   from './_functions';
import DataService                       from './frontend/Services/DataService';
import MapEmbedService                   from './frontend/Services/MapEmbedService';
import cfwGetWPHooks                     from './functions/cfwGetWPHooks';
import StorePoliciesList                 from './frontend/Components/StorePoliciesList';
import ComponentMappingInterface         from './interfaces/ComponentMappingInterface';
import cfwRenderComponentIfElementExists from './functions/cfwRenderComponentIfElementExists';
import TrustBadges                       from './frontend/Components/TrustBadges';

class ThankYou {
    constructor() {
        const map_embed_service = new MapEmbedService();

        cfwDomReady( () => {
            map_embed_service.setMapEmbedHandlers();

            jQuery( '.status-step-selected' ).prevAll().addClass( 'status-step-selected' );

            // Init runtime params
            DataService.initRunTimeParams();

            jQuery( '#cfw-mobile-cart-header' ).on( 'click', ( e ) => {
                e.preventDefault();
                jQuery( '#cfw-cart-summary-content' ).slideToggle( 300 );
                jQuery( '#cfw-expand-cart' ).toggleClass( 'active' );
            } );

            jQuery( window ).on( 'load', () => {
                jQuery( '#wpadminbar' ).appendTo( 'html' );

                // Remove the animation blocker
                jQuery( document.body ).removeClass( 'cfw-preload' );
            } );

            ( window as any ).cfwGetWPHooks = cfwGetWPHooks;

            // Load React components
            const componentMappings: ComponentMappingInterface[] = [
                { id: 'cfw-store-policies-container', component: <StorePoliciesList policies={DataService.getSetting( 'store_policies' )} /> },
                { id: 'cfw-trust-badges', component: <TrustBadges /> },
            ];
            componentMappings.forEach( ( { id, component, condition = true } ) => {
                cfwRenderComponentIfElementExists( id, component, condition );
            } );
        } );
    }
}

new ThankYou();
