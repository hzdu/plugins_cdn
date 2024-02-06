import Datepicker                        from 'react-tailwindcss-datepicker';
import React, { useState, useEffect }    from 'react';
import cfwFormatDate                     from '../../../functions/cfwFormatDate';

declare const window: any;

export default function ACRReport() {
    // Get a week ago today
    const defaultStartingDate = new Date();
    defaultStartingDate.setDate( defaultStartingDate.getDate() - 7 );

    const [ value, setValue ] = useState( {
        startDate: cfwFormatDate( 'Y-m-d', defaultStartingDate ),
        endDate: cfwFormatDate( 'Y-m-d', new Date() ),
    } );

    const [ data, setData ] = useState( [] );

    useEffect( () => {
        const apiRoot = window.wpApiSettings.root;
        const getData = async ( date ) => {
            const response = await fetch( `${apiRoot}checkoutwc/v1/acr/${date.startDate}/${date.endDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-WP-Nonce': window.wpApiSettings.nonce,
                },
            } );
            const newData = await response.json();
            setData( newData );
        };

        getData( value );
    }, [ value ] ); // <-- This is the dependency array

    const handleOnValueChange = ( date ) => {
        setValue( date );
    };

    if ( !data ) {
        return null;
    }

    return (
        <div>
            <div className="mb-4">
                <Datepicker
                    value={value}
                    onChange={handleOnValueChange}
                    primaryColor={'blue'}
                    showShortcuts={true}
                />
            </div>

            <h3 className="text-lg font-medium leading-6 text-gray-900">{`From ${value.startDate} to ${value.endDate}`}</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {data.map( ( item ) => (
                    <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
                    </div>
                ) )}
            </dl>
        </div>
    );
}
