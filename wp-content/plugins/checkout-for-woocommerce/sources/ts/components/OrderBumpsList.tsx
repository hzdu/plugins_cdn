import React                                from 'react';
import { dispatch, useSelect }              from '@wordpress/data';
import OrderBump                            from './OrderBump';
import { Bump, BumpLocation }               from '../Types/BumpTypes';
import DataStores                           from '../frontend/DataStores';
import LoggingService                       from '../frontend/Services/LoggingService';
import DataService                          from '../frontend/Services/DataService';

interface OrderBumpsListProps {
    locations: BumpLocation[];
    containerClass?: string; // Optional property
}

const OrderBumpsList: React.FC<OrderBumpsListProps> = ( { locations, containerClass = '' } ) => {
    const allBumps: Bump[] = useSelect( ( select: any ) => select( DataStores.cart_store_key ).getOrderBumps( null ), [] );

    const updateBump = ( bump: Bump ) => {
        // Find the index of the item to update
        const index = allBumps.findIndex( ( i: Bump ) => i.id === bump.id );

        if ( index !== -1 ) {
            // Create a new array with the updated item
            const updatedBumps = [ ...allBumps ];
            updatedBumps[ index ] = bump;

            // Trigger update checkout event
            DataService.setRuntimeParameter( 'needsAjaxUpdate', true );

            // Use dispatch to update the items in the store
            ( dispatch( DataStores.cart_store_key ) as any ).setOrderBumps( updatedBumps );
        } else {
            LoggingService.logError( 'Cannot update bump selection. Bump not found in bumps array.' );
        }
    };

    const hasBumpsClass = allBumps.length > 0 ? 'cfw-has-bumps' : '';
    const className = `cfw-order-bumps ${containerClass} ${hasBumpsClass}`;

    return (
        <div className={className}>
            {allBumps
                .filter( ( bump ) => locations.includes( bump.location ) )
                .slice( 0, DataService.getSetting( 'max_bumps' ) )
                .map( ( bump: Bump ) => (
                    <OrderBump
                        key={bump.id}
                        bump={bump}
                        updateBump={updateBump}
                    />
                ) )}
        </div>
    );
};

export default OrderBumpsList;
