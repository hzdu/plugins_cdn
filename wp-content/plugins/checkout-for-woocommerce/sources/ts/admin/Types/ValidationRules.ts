export type ValidationRule = {
    required: boolean | ( () => boolean );
    number?: boolean;
    error?: string;
};

// Define the type for the validation rules object
export type ValidationRules = {
    [key: string]: ValidationRule;
};

// Define the type for the meta parameter
export type OrderBumpsMeta = {
    [key: string]: any;
};
