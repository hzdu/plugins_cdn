import React from 'react';

export default function cfwDangerouslyOutputTableRowAction( actionOutput: string ) {
    const wrappedHtmlString = `<table>${actionOutput}</table>`;
    const parser = new DOMParser();
    const doc = parser.parseFromString( wrappedHtmlString, 'text/html' );
    const trElements = doc.querySelectorAll( 'tr' );

    if ( trElements.length === 0 ) {
        return <></>; // Return empty fragment if no tr elements are found
    }

    const rows = Array.from( trElements ).map( ( tr ) => {
        const attributes = Array.from( tr.attributes ).reduce( ( acc, attr ) => {
            if ( attr.name === 'style' ) {
                // Workaround for style strings: https://stackoverflow.com/a/67375810/334457
                acc.STYLE = attr.value;
            } else if ( attr.name === 'class' ) {
                acc.className = attr.value;
            } else if ( attr.name.includes( '-' ) && !attr.name.startsWith( 'data-' ) ) {
                acc[ attr.name.replace( /-([a-z])/g, ( g ) => g[ 1 ].toUpperCase() ) ] = attr.value;
            } else {
                acc[ attr.name ] = attr.value;
            }

            return acc;
        }, {} as { [key: string]: string } );

        const content = tr.innerHTML;

        // Return a tr element for each tr found
        return (
            <tr {...attributes} dangerouslySetInnerHTML={{ __html: content }} key={attributes.id || Math.random().toString()} />
        );
    } );

    return <>{rows}</>; // Return a fragment containing all the tr elements
}
