import React, { useState, useEffect }                from 'react';
import { useDispatch, useSelect }                    from '@wordpress/data';
import { store as noticesStore }                     from '@wordpress/notices';
import { useEntityProp }                             from '@wordpress/core-data';
import { ValidationRule }                            from '../../Types/ValidationRules';

const withMetaboxValidation = ( WrappedComponent, getValidationRules ) => ( props ) => {
    const [ isFormValid, setIsFormValid ] = useState( true );
    const [ formErrors, setFormErrors ] = useState( {} );
    const postType = useSelect(
        ( select: any ) => select( 'core/editor' ).getCurrentPostType(),
        [],
    );
    const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );
    const isNumber = ( n: string | number ): boolean => !Number.isNaN( parseFloat( String( n ) ) ) && Number.isFinite( Number( n ) );
    const { createNotice, removeNotice } = useDispatch( noticesStore );
    const { lockPostSaving, unlockPostSaving } = useDispatch( 'core/editor' );

    const handleFieldChange = ( key, value ) => {
        setMeta( {
            ...meta,
            [ key ]: value,
        } );
    };

    const validateFields = () => {
        const errors = {};
        let isValid = true;

        if ( meta.cfw_new_bump_modal_open ) {
            setFormErrors( {} );
            setIsFormValid( true );
            return;
        }

        const validationRules = getValidationRules( meta );

        Object.keys( validationRules ).forEach( ( field ) => {
            const rule: ValidationRule = validationRules[ field ];

            if ( rule ) {
                if ( ( typeof rule.required === 'function' && rule.required() ) || rule.required === true ) {
                    if (
                        // If field is empty or unset
                        (
                            !meta[ field ]
                            || !meta[ field ].length
                        )
                        // OR if value should be numeric but isn't
                        || (
                            rule.number
                            && !isNumber( meta[ field ] )
                        )
                    ) {
                        isValid = false;
                        errors[ field ] = rule.error;
                    } else {
                        removeNotice( `error-${field}` );
                    }
                }
            }
        } );

        setFormErrors( errors );
        setIsFormValid( isValid );
    };

    useEffect( () => {
        validateFields();
    }, [ meta ] );

    useEffect( () => {
        if ( !isFormValid ) {
            lockPostSaving( 'cfw_ob_cd' );
        } else {
            unlockPostSaving( 'cfw_ob_cd' );
        }
    }, [ isFormValid ] );

    useEffect( () => {
        Object.keys( formErrors ).forEach( ( field ) => {
            createNotice(
                'error',
                formErrors[ field ],
                { id: `error-${field}`, isDismissible: false },
            );
        } );
    }, [ formErrors ] );

    return (
        <WrappedComponent
            {...props}
            meta={meta}
            handleFieldChange={handleFieldChange}
        />
    );
};

export default withMetaboxValidation;
