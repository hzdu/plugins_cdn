import React from 'react';

interface GuaranteeBadgeProps {
    imageUrl?: string;
    title?: string;
    description?: string;
}

const GuaranteeBadge: React.FC<GuaranteeBadgeProps> = ( {
    imageUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect fill="%23CCCCCC" width="64" height="64" rx="32"/%3E%3C/svg%3E', // Gray placeholder as SVG
    title,
    description,
} ) => {
    if ( !title && !description ) {
        return <></>;
    }
    return (
        <div className="flex items-center grow mb-6 max-w-lg">
            <div className="mr-4 flex-shrink-0">
                {imageUrl && (
                    <img src={imageUrl} className="w-full max-w-28 h-auto" alt={title}/>
                )}
            </div>
            <div>
                <h3 className="text-base font-semibold mb-2 text-left text-[--cfw-tb-guarantee-title]">{title}</h3>
                <p className="text-sm text-left text-[--cfw-tb-guarantee-content]" dangerouslySetInnerHTML={{ __html: description }}></p>
            </div>
        </div>
    );
};

export default GuaranteeBadge;
