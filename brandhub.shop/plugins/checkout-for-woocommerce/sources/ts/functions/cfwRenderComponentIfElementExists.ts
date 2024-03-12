import { ReactElement }                     from 'react';
import { render }                           from '@wordpress/element';

export default function cfwRenderComponentIfElementExists( elementId: string, component: ReactElement, condition = true ): void {
    const element = document.getElementById( elementId );
    if ( element && condition ) {
        render( component, element );
    }
}
