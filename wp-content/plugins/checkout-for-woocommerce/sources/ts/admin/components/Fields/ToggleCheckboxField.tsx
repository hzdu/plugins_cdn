import { Switch }            from '@headlessui/react';
import { Field, useField }   from 'formik';
import React                 from 'react';
import withVisibilityControl from '../withVisibilityControl';

function classNames( ...classes ) {
    return classes.filter( Boolean ).join( ' ' );
}

const ToggleCheckboxField = ( { name, label, description, disabled = false } ) => {
    const [ , , helpers ] = useField( name );
    return (

        <Field name={name}>
            {( { field } ) => (
                <Switch.Group as="div" className="flex items-center space-x-4">
                    <Switch
                        checked={field.value}
                        onChange={( value ) => {
                            jQuery( document.body ).trigger( 'cfw_admin_field_changed' );
                            helpers.setValue( value );
                        }}
                        className={classNames(
                            !field.value || disabled ? 'bg-gray-400' : 'bg-lime-500',
                            'relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
                        )}
                        disabled={disabled}
                    >
                        <span className="sr-only">Use setting</span>
                        <span
                            aria-hidden="true"
                            className={classNames(
                                field.value ? 'translate-x-[1.75rem]' : 'translate-x-0',
                                'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                            )}
                        />
                    </Switch>
                    <span className="flex flex-grow flex-col">
                        <Switch.Label as="span" className="text-sm font-medium leading-6 text-gray-900" passive>
                            {label}
                        </Switch.Label>
                        <Switch.Description as="span" className="text-sm text-gray-500" dangerouslySetInnerHTML={ { __html: description } }></Switch.Description>
                    </span>
                </Switch.Group>
            )}
        </Field>
    );
};

export default withVisibilityControl( ToggleCheckboxField );
