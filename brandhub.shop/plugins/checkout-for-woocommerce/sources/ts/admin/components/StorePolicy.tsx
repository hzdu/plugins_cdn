import React                from 'react';
import PageSearchCombobox   from './PageSearchCombobox';

function StorePolicy( { row, setRow, removeHandler, dragHandleProps } ) {
    const setTitle = ( value ) => {
        const rowCopy = { ...row };
        rowCopy.title = value;
        setRow( rowCopy );
    };

    const setPage = ( value ) => {
        const rowCopy = { ...row };
        rowCopy.page = value;

        if ( row.title.length === 0 && value?.title.rendered.length > 0 ) {
            rowCopy.title = value.title.rendered;
        }

        setRow( rowCopy );
    };

    return (
        <div className="flex space-x-4 items-center group">
            <div
                className="shrink align-baseline"
                {...dragHandleProps}
            >
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">&nbsp;</label>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="w-6 h-6 transition-all stroke-gray-300 group-hover:stroke-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </div>
            <div className="grow">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                            Policy Title
                    <div className="mt-2">
                        <input
                            type="text"
                            value={row.title}
                            onChange={( e ) => setTitle( e.target.value )}
                            placeholder={'New Store Policy title'}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </label>
            </div>
            <div className="grow">
                <PageSearchCombobox value={row.page} handleOnChange={setPage} />
            </div>
            <div className="shrink">
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">&nbsp;</label>
                <div>
                    <button onClick={removeHandler}
                        className="transition-all bg-gray-300 group-hover:bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-1 rounded-full inline-flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StorePolicy;
