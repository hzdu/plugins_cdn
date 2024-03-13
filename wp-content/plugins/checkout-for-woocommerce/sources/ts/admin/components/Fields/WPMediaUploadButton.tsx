import { useField }                     from 'formik';
import React, { useState, useEffect }   from 'react';
import withVisibilityControl            from '../withVisibilityControl';

declare let wp: any;

const WPMediaUploadButton = ( { name, label, description, defaultUrl = null, nested = false, buttonLabel = 'Upload Image', modalTitle = 'Select or Upload a Logo', modalButtonLabel = 'Use this image', ...props } ) => {
    const [ frame, setFrame ] = useState( null );
    const [ currentAttachment, setAttachment ] = useState( null );
    const [ showPreview, setShowPreview ] = useState( false );

    const [ field, , helpers ] = useField( name );

    useEffect( () => {
        setAttachment( field.value );

        if ( field.value || defaultUrl ) {
            setShowPreview( true );
        }
    }, [] );

    const clearButtonClicked = () => {
        // eslint-disable-next-line no-param-reassign
        setShowPreview( false );
        setAttachment( null );
        helpers.setValue( '' );
    };

    const openMediaLibrary = () => {
        let currentFrame = frame;

        if ( !currentFrame ) {
            currentFrame = wp.media( {
                title: modalTitle,
                button: {
                    text: modalButtonLabel,
                },
                multiple: false,
            } );

            currentFrame.on( 'select', () => {
                const attachment = currentFrame.state().get( 'selection' ).first().toJSON();

                setAttachment( attachment );
                setShowPreview( true );
                helpers.setValue( attachment.id );
            } );

            setFrame( currentFrame );
        }

        currentFrame.open();
    };

    return (
        <div className={`cfw-admin-field-container cfw-admin-upload-control-parent ${nested ? 'ml-7 p-4 bg-gray-100' : ''}`}>
            <legend className="text-base font-medium text-gray-900">
                {label}
            </legend>
            <p className="text-sm leading-5 text-gray-500" dangerouslySetInnerHTML={ { __html: description } }></p>
            <div className="cfw-admin-image-preview-wrapper mb-4 mt-4">
                {
                    showPreview
                    && (
                        <>
                            { ( currentAttachment?.url || defaultUrl ) && ( <img className="cfw-admin-image-preview max-h-28 w-28" src={currentAttachment?.url ? currentAttachment.url : defaultUrl} alt={`${label} preview`} /> )}
                        </>
                    )
                }
            </div>
            <div className="block">
                <button type="button" onClick={openMediaLibrary} className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {buttonLabel}
                </button>
                <button type="button" onClick={clearButtonClicked} className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Clear
                </button>
            </div>
        </div>
    );
};

export default withVisibilityControl( WPMediaUploadButton );
