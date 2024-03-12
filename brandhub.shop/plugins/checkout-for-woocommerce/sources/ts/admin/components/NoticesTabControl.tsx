import { Tab }                               from '@headlessui/react';
import React, { useEffect, useRef }          from 'react';

export default function NoticesTabControl( { notices, selectedIndex, setSelectedIndex } ) {
    const prevTabIndex = useRef<number>( selectedIndex );

    useEffect( () => {
        if ( prevTabIndex.current !== selectedIndex ) {
            // Only way to make this run after the component has fully updated and repainted
            requestAnimationFrame( () => {
                jQuery( document.body ).trigger( 'wp-updates-notice-added' );
            } );
        }
        prevTabIndex.current = selectedIndex;
    } );

    return (
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List style={{ display: 'none' }}>
                {notices.map( ( notice, index ) => (
                    <Tab key={index}>Tab {index}</Tab>
                ) )}
            </Tab.List>
            <Tab.Panels>
                {notices.map( ( notice, index ) => (
                    <Tab.Panel key={index} dangerouslySetInnerHTML={{ __html: notice }}></Tab.Panel>
                ) )}
            </Tab.Panels>
        </Tab.Group>
    );
}
