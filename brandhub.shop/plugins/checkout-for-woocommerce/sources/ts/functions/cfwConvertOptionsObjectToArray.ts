type OptionItem = {
    value: string;
    label: string;
};

export default function cfwConvertOptionsObjectToArray( obj ): Array<OptionItem> {
    return Object.keys( obj ).map( ( key ) => ( { value: key, label: obj[ key ] } ) );
}
