import { DragDropContext, Droppable, Draggable }                         from '@hello-pangea/dnd';
import { useField }                                                      from 'formik';
import React, { useEffect }                                              from 'react';
import StorePolicy                                                       from './StorePolicy';

const StorePolicyRepeater = ( { name, locked = false } ) => {
    const [ field, , helpers ] = useField( name );

    // If locked, use a sample row
    const rows = !locked ? field.value : [
        {
            title: 'Policy Title',
            page: null,
            id: 'policy-0',
        },
    ];

    const setRows = ( newRows: any[] ) => {
        helpers.setValue( newRows );
    };

    const addRow = () => {
        const newRows = [ ...rows ];

        newRows.push( {
            title: '',
            page: null,
            id: `policy-${rows.length}`,
        } );

        setRows( newRows );
    };

    const fetchPolicies = async () => {
        if ( rows.length === 0 ) {
            addRow();
        }
    };

    useEffect( () => {
        fetchPolicies();
    }, [] );

    const updateRow = ( index, value ) => {
        // Update the rows state based on the previous rows state
        // Create a shallow copy of the previous rows array
        const updatedRows = [ ...rows ];

        // Create a new row object by copying the current row at the given index
        // and updating the specified field with the new value
        const newRow = {
            ...rows[ index ],
            ...value,
        };

        // Replace the row at the given index with the updated row using splice()
        updatedRows.splice( index, 1, newRow );

        // Return the updated rows array
        setRows( updatedRows );
    };

    const removeRow = ( index ) => {
        // Filter out the row at the specified index
        const updatedRows = field.value.filter( ( _, i ) => i !== index );
        helpers.setValue( updatedRows ); // Update Formik's state
    };

    const onDragEnd = ( result ) => {
        const { destination, source } = result;

        if ( !destination ) {
            return;
        }

        if (
            destination.droppableId === source.droppableId
            && destination.index === source.index
        ) {
            return;
        }

        const updatedRows = [ ...rows ];
        const [ removed ] = updatedRows.splice( result.source.index, 1 );
        updatedRows.splice( result.destination.index, 0, removed );
        setRows( updatedRows );

        // Fire cfw_admin_field_changed event to trigger the save button to appear
        const event = new Event( 'cfw_admin_field_changed' );
        document.body.dispatchEvent( event );
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div>
                <div className="space-y-4">
                    <Droppable droppableId="store_policies">
                        { ( provided ) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="space-y-4"
                            >
                                {rows.map( ( row, index ) => (
                                    <Draggable
                                        key={row.id}
                                        draggableId={row.id}
                                        index={index}
                                    >
                                        {( providedToo ) => (
                                            <div
                                                {...providedToo.draggableProps}
                                                ref={providedToo.innerRef}
                                            >
                                                <StorePolicy
                                                    row={row}
                                                    setRow={( value ) => updateRow( index, value )}
                                                    removeHandler={() => removeRow( index )}
                                                    dragHandleProps={providedToo.dragHandleProps}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ) )}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <button
                        className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={addRow}
                        type="button"
                    >Add Row</button>
                </div>
            </div>
        </DragDropContext>
    );
};

export default StorePolicyRepeater;
