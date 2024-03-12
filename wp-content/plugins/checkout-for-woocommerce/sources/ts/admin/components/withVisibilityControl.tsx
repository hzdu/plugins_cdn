import React from 'react';

interface WithVisibilityControlProps {
    label: string;
    name?: string;
    description?: string;
    searchTerm?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const withVisibilityControl = <P extends WithVisibilityControlProps>( WrappedComponent: React.ComponentType<P> ) => class extends React.Component<P & WithVisibilityControlProps> {
    render() {
        const { searchTerm, label, description, name } = this.props;

        // If searchTerm is undefined or if label includes searchTerm, render the WrappedComponent
        if ( !searchTerm
            || (
                label.toLowerCase().includes( searchTerm.toLowerCase() )
                || ( name
                    && name.toLowerCase().includes( searchTerm.toLowerCase() )
                )
                || ( description
                    && description.toLowerCase().includes( searchTerm.toLowerCase() )
                )
            )
        ) {
            return ( <WrappedComponent {...this.props as P} /> );
        }

        // If there's no match, return null
        return null;
    }
};

export default withVisibilityControl;
