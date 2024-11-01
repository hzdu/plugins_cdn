import { ReactElement }                         from 'react';
import { createRoot, render }                   from '@wordpress/element';
import ReactDOM                                 from 'react-dom';

const reactVersion = ReactDOM.version || '';

export default function cfwRenderComponentIfElementExists( elementId: string, component: ReactElement, condition = true ): void {
    const element = document.getElementById( elementId );
    if ( !element || !condition ) {
        return;
    }

    if ( reactVersion.startsWith( '18' ) ) {
        const root = createRoot( element );
        root.render( component );
    } else {
        render( component, element );
    }
}
