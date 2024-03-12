import React, { useState }                                 from 'react';
import NoticesTabControl                                   from './NoticesTabControl';
import TabPaginationControl                                from './TabPaginationControl';

interface GatewayNoticesProps {
    notices: any;
}

const DeferredNotices: React.FunctionComponent<GatewayNoticesProps> = ( { notices } ) => {
    const [ selectedTabIndex, setSelectedTabIndex ] = useState( 0 );

    const setCurrentTab = ( newIndex: number ) => {
        setSelectedTabIndex( newIndex );
        jQuery( document.body ).trigger( 'wp-updates-notice-added' );
    };

    return (
        notices.length > 0
        && <>
            <div style={{ position: 'relative', marginBottom: '-20px' }}>
                <NoticesTabControl
                    notices={notices}
                    selectedIndex={selectedTabIndex}
                    setSelectedIndex={setCurrentTab}
                />
                <TabPaginationControl
                    totalPages={notices.length}
                    currentPage={selectedTabIndex}
                    onPageChange={setCurrentTab}
                />
            </div>
        </>
    );
};

export default DeferredNotices;
