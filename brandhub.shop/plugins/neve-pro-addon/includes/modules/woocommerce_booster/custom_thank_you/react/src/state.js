import { useSelect, useDispatch } from '@wordpress/data';
import { without } from 'lodash';

export const State = ( metaKey ) => {
	const meta = useSelect( selectMeta );
	const value = meta[ metaKey ];

	const dispatch = useDispatch( 'core/editor' );

	return [
		value,
		( _value ) => dispatchEdit( metaKey, dispatch, value, _value ),
	];
};

const selectMeta = ( select ) => {
	return select( 'core/editor' ).getEditedPostAttribute( 'meta' );
};

const dispatchEdit = ( metaKey, dispatch, currentVal, selectedValue ) => {
	const newVal = currentVal.includes( selectedValue )
		? without( currentVal, selectedValue )
		: [ selectedValue, ...currentVal ];

	dispatch.editPost( { meta: { [ metaKey ]: newVal } } );
};
