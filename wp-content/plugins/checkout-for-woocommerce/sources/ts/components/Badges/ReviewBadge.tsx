import React from 'react';

interface ReviewBadgeProps {
    imageUrl?: string;
    title?: string;
    subtitle?: string;
    description?: string;
}

const ReviewBadge: React.FC<ReviewBadgeProps> = ( {
    imageUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect fill="%23CCCCCC" width="64" height="64" rx="32"/%3E%3C/svg%3E', // Gray placeholder as SVG
    title,
    subtitle,
    description,
} ) => {
    if ( !title && !description ) {
        return <></>;
    }

    return (
        <div className="max-w-lg grow mb-6">
            <div>
                <div className="flex mb-6 items-center">
                    {imageUrl && (
                        <img className="block w-16 h-16 object-cover rounded-full" src={imageUrl} alt={title}/>
                    )}
                    <div className="ml-5">
                        <span className="block text-base text-left font-semibold leading-none text-[--cfw-tb-review-title]">{title}</span>
                        <span className="block text-sm text-left text-[--cfw-tb-review-subtitle]">{subtitle}</span>
                    </div>
                </div>
                <p className="text-sm mb-6 text-[--cfw-tb-review-content]" dangerouslySetInnerHTML={{ __html: description }}></p>
                <div className="flex items-center">
                    {Array( 5 ).fill( null ).map( ( _, index ) => (
                        <div className="block mr-1.5" key={index}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* eslint-disable-next-line max-len */}
                                <path d="M8.54127 1.05787C8.71535 0.656427 9.28465 0.656426 9.45873 1.05787L11.5981 5.99152C11.6706 6.15859 11.8281 6.27307 12.0094 6.29034L17.3627 6.80045C17.7983 6.84196 17.9742 7.38339 17.6462 7.673L13.6152 11.2323C13.4786 11.3528 13.4185 11.538 13.4581 11.7158L14.6272 16.9647C14.7223 17.3918 14.2617 17.7264 13.8849 17.504L9.2542 14.7701C9.09738 14.6775 8.90262 14.6775 8.7458 14.7701L4.11506 17.504C3.73827 17.7264 3.2777 17.3918 3.37283 16.9647L4.54194 11.7158C4.58153 11.538 4.52135 11.3528 4.38484 11.2323L0.353771 7.673C0.0257726 7.38339 0.201695 6.84196 0.63728 6.80045L5.99057 6.29034C6.17186 6.27307 6.32942 6.15859 6.40187 5.99152L8.54127 1.05787Z" fill="#FFC428"/>
                            </svg>
                        </div>
                    ) )}
                </div>
            </div>
        </div>
    );
};

export default ReviewBadge;
