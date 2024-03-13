import React                            from 'react';
import { __ }                           from '@wordpress/i18n';
import { Markup }                       from 'interweave';

const ReviewPaneItem = ( { label, content, showChangeLink = true, tabLink = null, wrapperClass = null } ) => (
    <li className={wrapperClass}>
        <div className="inner col-10">
            <div role="rowheader" className={`cfw-review-pane-label ${label.length > 9 ? 'label-long' : ''}`}>
                <Markup content={label} noWrap={true}/>
            </div>
            <div role="cell" className="cfw-review-pane-content">
                <Markup content={content} noWrap={true}/>
            </div>
        </div>

        {showChangeLink && (
            <div role="cell" className="col-2 cfw-review-pane-link">
                <a data-tab={tabLink} className="cfw-tab-link cfw-small" style={{ cursor: 'pointer' }}>
                    {__( 'Change', 'checkout-wc' )}
                </a>
            </div>
        )}
    </li>
);

export default ReviewPaneItem;
