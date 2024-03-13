import XCircleIcon                                from '@heroicons/react/20/solid/XCircleIcon';
import React                                      from 'react';
import { Markup }                                 from 'interweave';

export default function SevereAlert( { description } ) {
    return (
        <div className="border-l-4 border-red-600 bg-red-50 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <p className="text-sm text-red-800">
                        <Markup content={description} noWrap={true} />
                    </p>
                </div>
            </div>
        </div>
    );
}
