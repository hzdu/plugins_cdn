import { DragDropContext, Droppable, Draggable }                            from '@hello-pangea/dnd';
import { useField }                                                         from 'formik';
import React                                                                from 'react';
import TrustBadgeInterface                                                  from '../../interfaces/TrustBadgeInterface';
import TrustBadgeRow                                                        from './TrustBadgeRow';

function TrustBadgeRepeater( { name } ): React.JSX.Element  {
    const [ field, , helpers ] = useField( name );

    const badges = field.value;

    const setBadges = ( newBadges ) => {
        helpers.setValue( newBadges );
    };

    const addBadge = () => {
        const newBadges = [ ...badges ];

        newBadges.push( {
            id: `tb-${badges.length}`,
            image: null,
            title: '',
            subtitle: '',
            description: '',
            template: 'guarantee',
            mode: 'WYSIWYG',
        } );

        setBadges( newBadges );
    };

    const removeBadge = ( index: number ): void => {
        // Update the rows state based on the previous rows state
        // Create a shallow copy of the previous rows array
        const updatedBadges = [ ...badges ];

        // Remove the row at the given index using splice()
        updatedBadges.splice( index, 1 );

        // Return the updated rows array
        setBadges( updatedBadges );
    };

    const updateBadge = ( index: number, updatedBadge: TrustBadgeInterface ): void => {
        // Update the rows state based on the previous rows state
        // Create a shallow copy of the previous rows array
        const updatedBadges = [ ...badges ];

        // Create a new row object by copying the current row at the given index
        // and updating the specified field with the new value
        const newBadge = {
            ...badges[ index ],
            ...updatedBadge,
        };

        // Replace the row at the given index with the updated row using splice()
        updatedBadges.splice( index, 1, newBadge );

        // Return the updated rows array
        setBadges( updatedBadges );
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

        const updatedBadges = [ ...badges ];
        const [ removed ] = updatedBadges.splice( result.source.index, 1 );
        updatedBadges.splice( result.destination.index, 0, removed );
        setBadges( updatedBadges );

        // Fire cfw_admin_field_changed event to trigger the save button to appear
        const event = new Event( 'cfw_admin_field_changed' );
        document.body.dispatchEvent( event );
    };

    return (
        <div>
            <div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <div>
                        <div>
                            <Droppable droppableId="droppable">
                                {( provided ) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {badges.map( ( badge: TrustBadgeInterface, index: number ) => (
                                            <Draggable key={badge.id} draggableId={`badge-${badge.id}`} index={index}>
                                                {( providedToo ) => (
                                                    <div
                                                        ref={providedToo.innerRef}
                                                        {...providedToo.draggableProps}
                                                        {...providedToo.dragHandleProps}
                                                    >
                                                        <TrustBadgeRow
                                                            badge={badge}
                                                            setBadge={( value ) => updateBadge( index, value )}
                                                            removeHandler={() => removeBadge( index ) }
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
                        </div>
                    </div>
                </DragDropContext>
                <div className="flex justify-center items-center">
                    <button
                        type="button"
                        onClick={addBadge}
                        className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add Trust Badge
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TrustBadgeRepeater;
