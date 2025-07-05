import React, { useState, useEffect } from 'react';
import Datepicker, {
    DateRangeType,
    DateValueType,
} from 'react-tailwindcss-datepicker';
import cfwFormatDate from '../../../functions/cfwFormatDate';

declare const window: any;

export default function ACRReport() {
    // Get a week ago today
    const defaultStartingDate = new Date();
    defaultStartingDate.setDate( defaultStartingDate.getDate() - 7 );

    // State is now typed with the library’s DateRangeType
    const [ value, setValue ] = useState<DateRangeType>( {
        startDate: defaultStartingDate,
        endDate: new Date(),
    } );

    const [ data, setData ] = useState<any[]>( [] );

    // Fetch whenever our DateRangeType changes
    useEffect( () => {
        const apiRoot = window.wpApiSettings.root;
        const from = cfwFormatDate( 'Y-m-d', value.startDate );
        const to   = cfwFormatDate( 'Y-m-d', value.endDate );

        async function getData() {
            const res = await fetch(
                `${apiRoot}checkoutwc/v1/acr/${from}/${to}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-WP-Nonce': window.wpApiSettings.nonce,
                    },
                },
            );
            const json = await res.json();
            setData( json );
        }

        getData();
    }, [ value ] );

    // When the picker gives us new Dates, just set them straight
    const handleOnValueChange = ( newValue: DateValueType ) => {
        if ( newValue ) {
            setValue( newValue );
        }
    };

    if ( !data ) return null;

    return (
        <div>
            <div className="mb-4">
                <Datepicker
                    value={value}
                    onChange={handleOnValueChange}
                    primaryColor="blue"
                    showShortcuts
                />
            </div>

            <h3 className="text-lg font-medium leading-6 text-gray-900">
                {`From ${cfwFormatDate( 'Y-m-d', value.startDate! )} to ${cfwFormatDate(
                    'Y-m-d',
                    value.endDate!,
                )}`}
            </h3>

            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {data.map( ( item ) => (
                    <div
                        key={item.name}
                        className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
                    >
                        <dt className="truncate text-sm font-medium text-gray-500">
                            {item.name}
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {item.stat}
                        </dd>
                    </div>
                ) )}
            </dl>
        </div>
    );
}
