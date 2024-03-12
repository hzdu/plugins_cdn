import React, { useContext }     from 'react';
import AdminPageContextInterface from '../../interfaces/AdminPageContextInterface';

const MagicAdminSaveButton = ( { context } ) => {
    const {
        setIsLoading,
        saveSettings,
    } = useContext<AdminPageContextInterface>( context );

    return (
        <div className="hidden">
            <button
                className='cfw_admin_page_submit'
                type="button"
                onClick={( e ) => {
                    e.preventDefault();
                    setIsLoading( true );
                    saveSettings().then( () => {
                        setIsLoading( false );
                    } );
                    return false;
                }}
            >
                Save Settings
            </button>
        </div>
    );
};

export default MagicAdminSaveButton;
