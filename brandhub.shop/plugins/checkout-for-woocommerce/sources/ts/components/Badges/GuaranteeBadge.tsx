import React from 'react';

const GuaranteeBadge = ( { image_url, title, description } ) => (
    <div className="flex items-center grow mb-6 max-w-lg">
        <div className="mr-4 flex-shrink-0">
            <img src={image_url} className="max-w-28 h-auto"/>
        </div>
        <div>
            <h3 className="text-base font-semibold mb-2 text-[--cfw-tb-guarantee-title]">{title || 'Guarantee Title'}</h3>
            <p className="text-sm text-[--cfw-tb-guarantee-content]" dangerouslySetInnerHTML={{ __html: description || 'The details of your guarantee.' }}></p>
        </div>
    </div>
);

GuaranteeBadge.defaultProps = {
    image_url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect fill="%23CCCCCC" width="64" height="64" rx="32"/%3E%3C/svg%3E', // Gray placeholder as SVG
};

export default GuaranteeBadge;
