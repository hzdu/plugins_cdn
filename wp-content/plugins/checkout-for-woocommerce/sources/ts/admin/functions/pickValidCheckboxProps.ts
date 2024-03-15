const validCheckboxProps = [
    'type', 'id', 'name', 'className', 'disabled', 'checked', 'onChange', 'onBlur', 'value',
];

export function pickValidCheckboxProps( props: any ): Record<string, any> {
    return Object.keys( props )
        .filter( ( key ) => validCheckboxProps.includes( key ) )
        .reduce( ( obj, key ) => {
            obj[ key ] = props[ key ];
            return obj;
        }, {} );
}
