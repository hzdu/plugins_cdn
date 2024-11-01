export type ValidationRule = {
    required: boolean | (() => boolean);
    number?: boolean;
    error?: string;
};
export type ValidationRules = {
    [key: string]: ValidationRule;
};
export type OrderBumpsMeta = {
    [key: string]: any;
};
