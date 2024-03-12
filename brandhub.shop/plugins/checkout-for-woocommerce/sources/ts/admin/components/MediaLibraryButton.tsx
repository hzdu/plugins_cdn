import React, { useState } from 'react';

declare let wp: any;

const MediaLibraryButton = ( { value, setAttachment } ) => {
    const [ frame, setFrame ] = useState( null );

    const openMediaLibrary = () => {
        let currentFrame = frame;

        if ( !currentFrame ) {
            currentFrame = wp.media( {
                title: 'Select or Upload a Logo',
                button: {
                    text: 'Use this image',
                },
                multiple: false,
            } );

            currentFrame.on( 'select', () => {
                const attachment = currentFrame.state().get( 'selection' ).first().toJSON();

                // Filter attachment object properties
                const filteredAttachment = {
                    id: attachment.id,
                    url: attachment.url,
                    alt: attachment.alt,
                };

                setAttachment( filteredAttachment );
            } );

            setFrame( currentFrame );
        }

        currentFrame.open();
    };

    return (
        <div className="block">
            <button type="button" onClick={openMediaLibrary} className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Choose Image
            </button>
        </div>
    );
};

export default MediaLibraryButton;
