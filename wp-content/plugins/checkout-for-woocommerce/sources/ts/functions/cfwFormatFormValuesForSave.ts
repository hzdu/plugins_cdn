type SettingSaveItem = {
    name: string;
    value: string;
};

export default function cfwFormatFormValuesForSave( rawValues ): Array<SettingSaveItem> {
    return Object.keys( rawValues ).map( ( key ) => {
        let value;

        if ( typeof rawValues[ key ] === 'boolean' ) {
            value = rawValues[ key ] ? 'yes' : 'no';
        } else {
            value = rawValues[ key ];
        }

        if ( key === 'allow_tracking' && rawValues[ key ].length ) {
            // Grab the LAST array value - checkbox values are arrays when a value is defined
            value = rawValues[ key ][ rawValues[ key ].length - 1 ] ?? 'no';
        }

        return {
            name: key,
            value,
        };
    } );
}
