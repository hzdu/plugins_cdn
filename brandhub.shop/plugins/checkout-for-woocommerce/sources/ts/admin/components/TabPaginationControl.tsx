import React                                 from 'react';
import ChevronLeftIcon                       from '@heroicons/react/24/outline/ChevronLeftIcon';
import ChevronRightIcon                      from '@heroicons/react/24/outline/ChevronRightIcon';

export default function TabPaginationControl( { totalPages, currentPage, onPageChange } ) {
    return (
        <div className={'cfw-tw'} style={{ position: 'absolute', bottom: '20px', right: '60px' }}>
            <div className={`flex items-center justify-center space-x-2 ${totalPages === 1 ? 'hidden' : ''}`}>
                <button
                    className="p-2 border rounded-md disabled:text-gray-200"
                    onClick={() => onPageChange( currentPage - 1 )}
                    disabled={currentPage === 0}
                >
                    <ChevronLeftIcon className={'w-6 h-6'}/>
                </button>
                <span>
                    <span>
                        {currentPage + 1} of {totalPages}
                    </span>
                </span>
                <button
                    className="p-2 border rounded-md disabled:text-gray-200"
                    onClick={() => onPageChange( currentPage + 1 )}
                    disabled={currentPage === totalPages - 1}
                >
                    <ChevronRightIcon className={'w-6 h-6'}/>
                </button>
            </div>
        </div>
    );
}
