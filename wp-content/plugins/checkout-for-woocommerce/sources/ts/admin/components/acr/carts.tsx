import DataTable, { ExpanderComponentProps } from 'react-data-table-component';
import React, { useState, useEffect }        from 'react';

interface DataRow {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    subtotal: string,
    status: string,
    emails_sent: string,
    created: string,
    cart: string,
}

declare const window: any;

export default function ACRCartsTable() {
    const [ data, setData ] = useState<DataRow[]>( [] );
    const [ loading, setLoading ] = useState( false );
    const [ totalRows, setTotalRows ] = useState( 0 );
    const [ perPage, setPerPage ] = useState( 10 );
    const [ expandedRowId, setExpandedRowId ] = useState( null );
    const [ sortColumn, setSortColumn ] = useState( 'created' );
    const [ sortOrder, setSortOrder ] = useState( 'DESC' );
    const [ currentPage, setCurrentPage ] = useState( 1 );
    const [ currentStatus, setCurrentStatus ] = useState( 'all' );

    const statuses = [
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'New',
            value: 'new',
        },
        {
            label: 'Abandoned',
            value: 'abandoned',
        },
        {
            label: 'Recovered',
            value: 'recovered',
        },
        {
            label: 'Lost',
            value: 'lost',
        },
        {
            label: 'Unsubscribed',
            value: 'unsubscribed',
        },
    ];

    const columns = [
        {
            name: 'Name',
            selector: ( row: DataRow ) => `${row.first_name} ${row.last_name}`,
        },
        {
            name: 'Email',
            selector: ( row: DataRow ) => row.email,
            sortable: true,
            sortField: 'email',
        },
        {
            name: 'Subtotal',
            selector: ( row: DataRow ) => row.subtotal,
            sortable: true,
            sortField: 'subtotal',
        },
        {
            name: 'Status',
            selector: ( row: DataRow ) => row.status,
            sortable: true,
            sortField: 'status',
        },
        {
            name: 'Emails Sent',
            selector: ( row: DataRow ) => row.emails_sent,
            sortable: true,
            sortField: 'emails_sent',
        },
        {
            name: 'Date',
            selector: ( row: DataRow ) => row.created,
            sortable: true,
            sortField: 'created',
        },
    ];

    const fetchCarts = async ( page, column, order, status, itemsPerPage ) => {
        setLoading( true );

        const apiRoot = window.wpApiSettings.root;

        const response = await fetch( `${apiRoot}checkoutwc/v1/acr/carts/${page}/${itemsPerPage}/${column}/${order}/${status}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-WP-Nonce': window.wpApiSettings.nonce,
            },
        } );

        const newData = await response.json();

        setData( newData.data );
        setTotalRows( newData.total );
        setLoading( false );
    };

    const handlePageChange = ( page ) => {
        setCurrentPage( page );
    };

    const handlePerRowsChange = async ( newPerPage, page ) => {
        setPerPage( newPerPage );
    };

    const handleRowExpandToggled = ( expanded, row ) => {
        // If the row is expanded, set the expandedRowId to the rowId, otherwise set it to null
        setExpandedRowId( expanded ? row.id : null );
    };

    const handleSort = ( column, order ) => {
        setSortColumn( column.sortField );
        setSortOrder( order );
    };

    const handleStatusChange = ( event ) => {
        setCurrentStatus( event.target.value );
    };

    useEffect( () => {
        fetchCarts( currentPage, sortColumn, sortOrder, currentStatus, perPage );
    }, [ currentPage, sortColumn, sortOrder, currentStatus, perPage ] );

    // data provides access to your row data
    const ExpandedComponent: React.FC<ExpanderComponentProps<DataRow>> = ( { data } ) => {
        if ( expandedRowId !== null && data.id !== expandedRowId ) {
            return null;
        }

        const [ products, setProducts ] = useState( [] );

        useEffect( () => {
            if ( !data || !data.cart ) {
                return;
            }

            const items = JSON.parse( data.cart );

            // For each item in items, fetch product info from Woo
            const apiRoot = window.wpApiSettings.root;

            Object.values( items ).forEach( ( value: any ) => {
                fetch( `${apiRoot}wc/v3/products/${value.product_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-WP-Nonce': window.wpApiSettings.nonce,
                    },
                } )
                    .then( ( response ) => response.json() )
                    .then( ( product ) => {
                        product.quantity = value.quantity;
                        setProducts( ( prevProducts ) => [ ...prevProducts, product ] );
                    } );
            } );
        }, [ data ] );

        if ( !products.length ) {
            return (
                <div className="grid grid-cols-6 p-4 gap-4">
                    <h3 className="col-span-6 text-lg font-medium text-gray-900">Cart Items</h3>
                    <p className="col-span-6 text-sm font-normal text-gray-900 animate-pulse">Loading...</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-6 p-4 gap-4">
                <h3 className="col-span-6 text-lg font-medium text-gray-900">Cart Items</h3>
                {products.map( ( product ) => (
                    <div
                        key={product.id}
                        className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
                    >
                        <div className="flex-shrink-0">
                            <img className="h-10 w-10 rounded-full" src={product?.images[ 0 ]?.src} alt="" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <a href={product.permalink} target="_blank" className="focus:outline-none">
                                <span className="absolute inset-0" aria-hidden="true" />
                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                <p className="truncate text-sm text-gray-500">Qty: {product.quantity}</p>
                            </a>
                        </div>
                    </div>
                ) )}
            </div>
        );
    };

    return (
        <div className="mt-4 p-4 bg-white">
            <div>
                <fieldset className="mt-4 p-2 float-right">
                    <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                        {statuses.map( ( status ) => (
                            <div key={status.value} className="flex items-center">
                                <input
                                    id={status.value}
                                    name="notification-method"
                                    type="radio"
                                    defaultChecked={status.value === 'all'}
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    onChange={handleStatusChange}
                                    value={status.value}
                                />
                                <label htmlFor={status.value} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                                    {status.label}
                                </label>
                            </div>
                        ) )}
                    </div>
                </fieldset>
            </div>
            <DataTable
                title="Tracked Carts"
                columns={columns}
                data={data}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                onRowExpandToggled={handleRowExpandToggled}
                onSort={handleSort}
                sortServer
            />
        </div>
    );
}
