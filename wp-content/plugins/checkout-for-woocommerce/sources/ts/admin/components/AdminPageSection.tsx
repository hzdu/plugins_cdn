import React       from 'react';

const AdminPageSection = ( { title, description, content, pre_content = '', post_content = '' } ) => (
    <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        {description}
                    </p>
                </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2" id={`${title.replace( /\s+/g, '-' ).toLowerCase()}_content`}>
                <div dangerouslySetInnerHTML={{ __html: pre_content }}></div>
                <div className="shadow sm:rounded-md">
                    <div className="cfw-admin-section-component-content px-4 py-5 bg-white space-y-6 sm:p-6">
                        {content}
                    </div>
                </div>
                <div className={'mt-6'} dangerouslySetInnerHTML={{ __html: post_content }}></div>
            </div>
        </div>
    </div>
);

export default AdminPageSection;
