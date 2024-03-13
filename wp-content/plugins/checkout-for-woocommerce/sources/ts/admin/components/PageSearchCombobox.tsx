import { Combobox }                                        from '@headlessui/react';
import CheckIcon                                           from '@heroicons/react/20/solid/CheckIcon';
import ChevronUpDownIcon                                   from '@heroicons/react/20/solid/ChevronUpDownIcon';
import apiFetch                                            from '@wordpress/api-fetch';
import React, { useState, useEffect }                      from 'react';
import type { WP_REST_API_Posts, WP_REST_API_Post }        from 'wp-types';

function classNames( ...classes ) {
    return classes.filter( Boolean ).join( ' ' );
}

export default function PageSearchCombobox( props ) {
    const { value, handleOnChange } = props;

    const [ query, setQuery ] = useState( '' );
    const [ pages, setPages ] = useState( [] );

    const fetchPages = async ( searchTerm ) => {
        try {
            // eslint-disable-next-line camelcase
            const response: WP_REST_API_Posts  = await apiFetch( {
                path: `/wp/v2/pages?search=${searchTerm}&_fields=id,title`,
            } );

            setPages( response );
        } catch ( error ) {
            console.error( 'Error fetching pages:', error );
        }
    };

    useEffect( () => {
        if ( query.length < 2 ) {
            setPages( [] );
            return;
        }

        fetchPages( query );
    }, [ query ] );

    const updateDisplayValue = ( page: WP_REST_API_Post|null ) => page?.title.rendered;

    return (
        <Combobox as="div" value={value} onChange={handleOnChange}>
            <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Page</Combobox.Label>
            <div className="relative mt-2">
                <Combobox.Input
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={( event ) => setQuery( event.target.value )}
                    placeholder={'Search for a WordPress page'}
                    displayValue={updateDisplayValue}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Combobox.Button>

                {pages.length > 0 && (
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {pages.map( ( page: WP_REST_API_Post ) => (
                            <Combobox.Option
                                key={page.id}
                                value={page}
                                className={( { active } ) => classNames(
                                    'relative cursor-default select-none py-2 pl-3 pr-9',
                                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                )
                                }
                            >
                                {( { active, selected } ) => (
                                    <>
                                        <span className={classNames( 'block truncate', selected && 'font-semibold' )}>{page.title.rendered}</span>

                                        {selected && (
                                            <span
                                                className={classNames(
                                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                                    active ? 'text-white' : 'text-indigo-600',
                                                )}
                                            >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        )}
                                    </>
                                )}
                            </Combobox.Option>
                        ) )}
                    </Combobox.Options>
                )}
            </div>
        </Combobox>
    );
}
