import { Hooks }         from '@wordpress/hooks/build-types/createHooks';
import { createHooks }   from '@wordpress/hooks';

export default function cfwGetWPHooks(): Hooks {
    // If we already did this, return it
    if ( typeof ( <any>window ).cfwHooks !== 'undefined' ) {
        return ( <any>window ).cfwHooks;
    }

    // Otherwise, prefer the global version
    if ( typeof ( <any>window ).wp.hooks !== 'undefined' ) {
        return ( <any>window ).wp.hooks;
    }

    // Ok, the global version doesn't exist, so create an instance just for us
    ( <any>window ).cfwHooks = createHooks();

    return ( <any>window ).cfwHooks;
}
