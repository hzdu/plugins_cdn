// Define interfaces
export interface Field {
    key: string;
    label: string | (() => string);
    help?: string;
    group: string;
    fields: SubField[];
    hasSimplifiedLayout?: boolean;
    hasMultipleSubFields?: boolean;
}

export interface SubField {
    type: 'subField' | 'operatorField' | 'valueField';
    name?: string;
    valueType?: string;
    options?: Array<{ label: string; value: string }>;
    placeholder?: string;
    displayConditions?: Array<DisplayCondition>;
    conditionalValueTypes?: Array<ConditionalValueType>;
    valueTypeVariant?: string;
    triggerReset?: boolean;
    help?: string;
}

export interface DisplayCondition {
    dependencyType: 'subField' | 'operatorField' | 'valueField';
    dependencyName?: string;
    dependencyValues: string[];
}

export interface ConditionalValueType {
    dependencyType: 'subField' | 'operatorField' | 'valueField';
    dependencyName?: string;
    dependencyValues: string[];
    valueTypes: Array<{
        value: string;
        valueType: string;
        placeholder?: string;
        valueTypeVariant?: string;
    }>;
}

// Abstracted operator options
const VALUE_OPERATORS = [
    { value: 'equal', label: 'Is equal to' },
    { value: 'notEqual', label: 'Is not equal to' },
    { value: 'greaterThan', label: 'Is greater than' },
    { value: 'lessThan', label: 'Is less than' },
    { value: 'greaterThanEqual', label: 'Is greater or equal to' },
    { value: 'lessThanEqual', label: 'Is less than or equal to' },
];

const DATE_VALUE_OPERATORS = [
    { value: 'equal', label: 'Was placed on' },
    { value: 'notEqual', label: 'Was not placed on' },
    { value: 'greaterThan', label: 'Was placed after' },
    { value: 'lessThan', label: 'Was placed before' },
];

const DATE_VALUE_SIMPLIFIED_OPERATORS = [
    { value: 'equal', label: 'On' },
    { value: 'notEqual', label: 'Not on' },
    { value: 'greaterThan', label: 'After' },
    { value: 'lessThan', label: 'Before' },
];

const CONTAINS_OPERATORS = [
    { value: 'atLeastOne', label: 'At least one of the selected' },
    { value: 'all', label: 'All of the selected' },
    { value: 'none', label: 'None of the selected' },
];

// Placeholders
const OPERATOR_PLACEHOLDER = 'Select Condition…';
const ORDER_TYPE_PLACEHOLDER = 'Select Order Type…';
const SELECT_CATEGORY_PLACEHOLDER = 'Select Product Category…';
const SELECT_TAG_PLACEHOLDER = 'Select Product Tag…';
const SELECT_PRODUCT_PLACEHOLDER = 'Select Product…';
const SELECT_INVENTORY_STATUS_PLACEHOLDER = 'Select Inventory Status…';
const SELECT_USER_ROLE_PLACEHOLDER = 'Select User Role…';

export const fields: Field[] = [
    // Cart fields
    {
        key: 'cartContents',
        label: 'Cart Contents',
        group: 'cart',
        fields: [
            {
                type: 'subField',
                name: 'cartContents',
                valueType: 'select',
                options: [
                    { value: 'empty', label: 'Is empty' },
                    { value: 'notEmpty', label: 'Is not empty' },
                    { value: 'containsProducts', label: 'Contains (Products)' },
                    { value: 'containsCategories', label: 'Contains (Categories)' },
                    { value: 'containsTags', label: 'Contains (Tags)' },
                ],
                placeholder: OPERATOR_PLACEHOLDER,
                triggerReset: true,
            },
            {
                type: 'operatorField',
                valueType: 'select',
                options: CONTAINS_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
                displayConditions: [
                    {
                        dependencyType: 'subField',
                        dependencyName: 'cartContents',
                        dependencyValues: [ 'containsProducts', 'containsCategories', 'containsTags' ],
                    },
                ],
            },
            {
                type: 'valueField',
                conditionalValueTypes: [
                    {
                        dependencyType: 'subField',
                        dependencyName: 'cartContents',
                        dependencyValues: [ 'containsProducts', 'containsCategories', 'containsTags' ],
                        valueTypes: [
                            {
                                value: 'containsProducts',
                                valueType: 'productsSelect',
                                placeholder: SELECT_PRODUCT_PLACEHOLDER,
                            },
                            {
                                value: 'containsCategories',
                                valueType: 'termsSelect',
                                valueTypeVariant: 'product_cat',
                                placeholder: SELECT_CATEGORY_PLACEHOLDER,
                            },
                            {
                                value: 'containsTags',
                                valueType: 'termsSelect',
                                valueTypeVariant: 'product_tag',
                                placeholder: SELECT_TAG_PLACEHOLDER,
                            },
                        ],
                    },
                ],
                displayConditions: [
                    {
                        dependencyType: 'subField',
                        dependencyName: 'cartContents',
                        dependencyValues: [ 'containsProducts', 'containsCategories', 'containsTags' ],
                    },
                ],
            },
        ],
    },
    {
        key: 'cartTotalQuantity',
        label: 'Cart Total Quantity',
        group: 'cart',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    {
        key: 'cartTotalValue',
        label: 'Cart Subtotal',
        group: 'cart',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    {
        key: 'cartProductQuantity',
        label: 'Quantity of Product in Cart',
        help: 'Quantity applies to each selected product.',
        group: 'cart',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'subField',
                name: 'products',
                valueType: 'productsSelect',
                placeholder: SELECT_PRODUCT_PLACEHOLDER,
            },
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    {
        key: 'cartCategoryQuantity',
        label: 'Quantity of Category in Cart',
        help: 'Quantity of products in cart which belong to the selected category. Quantity applies to each category.',
        group: 'cart',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'subField',
                name: 'categories',
                valueType: 'termsSelect',
                valueTypeVariant: 'product_cat',
                placeholder: SELECT_CATEGORY_PLACEHOLDER,
            },
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    {
        key: 'cartCoupons',
        label: 'Cart Coupons',
        group: 'cart',
        fields: [
            {
                type: 'subField',
                name: 'hasCoupon',
                valueType: 'select',
                options: [
                    { value: 'noCoupon', label: 'Has no coupon' },
                    { value: 'hasCoupon', label: 'Has coupon' },
                ],
                placeholder: OPERATOR_PLACEHOLDER,
                triggerReset: true,
            },
            {
                type: 'valueField',
                name: 'coupons',
                valueType: 'text',
                help: 'A comma separated list of coupon codes.',
                placeholder: 'Enter coupon codes...',
                displayConditions: [
                    {
                        dependencyType: 'subField',
                        dependencyName: 'hasCoupon',
                        dependencyValues: [ 'hasCoupon' ],
                    },
                ],
            },
        ],
    },
    // Customer fields - Value
    {
        key: 'customerTotalSpent',
        label: 'Customer History: Total Spent',
        group: 'customer-value',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    {
        key: 'customerAverageOrderValue',
        label: 'Customer History: Average Order Value',
        group: 'customer-value',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    // Customer fields - Quantity
    {
        key: 'customerTotalOrders',
        label: 'Customer History: Total Orders',
        group: 'customer-quantity',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    {
        key: 'customerQuantityProductOrdered',
        label: 'Customer History: Quantity of Product Ordered',
        help: 'Quantity applies to each selected product.',
        group: 'customer-quantity',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'subField',
                name: 'products',
                valueType: 'productsSelect',
                placeholder: SELECT_PRODUCT_PLACEHOLDER,
            },
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    {
        key: 'customerQuantityCategoryOrdered',
        label: 'Customer History: Quantity of Category Ordered',
        help: 'Quantity of products ordered which belong to the category. Applies to each selected category.',
        group: 'customer-quantity',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'subField',
                name: 'categories',
                valueType: 'termsSelect',
                valueTypeVariant: 'product_cat',
                placeholder: SELECT_CATEGORY_PLACEHOLDER,
            },
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    // Customer fields - Time
    {
        key: 'customerTimeSinceOrder',
        label: 'Customer History: Time Since Order',
        help: "The number of days since the customer's order was placed.",
        group: 'customer-time',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'subField',
                name: 'orderType',
                valueType: 'select',
                options: [
                    { value: 'first', label: 'First order' },
                    { value: 'last', label: 'Last order' },
                ],
                placeholder: ORDER_TYPE_PLACEHOLDER,
            },
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    {
        key: 'customerTimeSinceProductOrdered',
        label: 'Customer History: Time Since Product Ordered',
        help: 'The number of days since the product was ordered. Applies to each selected product.',
        group: 'customer-time',
        hasSimplifiedLayout: true,
        hasMultipleSubFields: true,
        fields: [
            {
                type: 'subField',
                name: 'orderType',
                valueType: 'select',
                options: [
                    { value: 'first', label: 'First order' },
                    { value: 'last', label: 'Last order' },
                ],
                placeholder: ORDER_TYPE_PLACEHOLDER,
            },
            {
                type: 'subField',
                name: 'products',
                valueType: 'productsSelect',
                placeholder: SELECT_PRODUCT_PLACEHOLDER,
            },
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    {
        key: 'customerTimeSinceCategoryOrdered',
        label: 'Customer History: Time Since Category Ordered',
        help: 'The number of days since the category was ordered. Applies to each selected category.',
        group: 'customer-time',
        hasSimplifiedLayout: true,
        hasMultipleSubFields: true,
        fields: [
            {
                type: 'subField',
                name: 'orderType',
                valueType: 'select',
                options: [
                    { value: 'first', label: 'First order' },
                    { value: 'last', label: 'Last order' },
                ],
                placeholder: ORDER_TYPE_PLACEHOLDER,
            },
            {
                type: 'subField',
                name: 'categories',
                valueType: 'termsSelect',
                valueTypeVariant: 'product_cat',
                placeholder: SELECT_CATEGORY_PLACEHOLDER,
            },
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    {
        key: 'customerDateOfOrder',
        label: 'Customer History: Date of Order',
        group: 'customer-time',
        fields: [
            {
                type: 'subField',
                valueType: 'select',
                options: [
                    { value: 'first', label: 'First order' },
                    { value: 'last', label: 'Last order' },
                ],
                placeholder: ORDER_TYPE_PLACEHOLDER,
            },
            {
                type: 'operatorField',
                valueType: 'select',
                options: DATE_VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'date',
            },
        ],
    },
    {
        key: 'customerDateOfProductOrdered',
        label: 'Customer History: Date of Product Ordered',
        group: 'customer-time',
        hasMultipleSubFields: true,
        fields: [
            {
                type: 'subField',
                name: 'orderType',
                valueType: 'select',
                options: [
                    { value: 'first', label: 'First ordered' },
                    { value: 'last', label: 'Last ordered' },
                ],
                placeholder: ORDER_TYPE_PLACEHOLDER,
            },
            {
                type: 'subField',
                name: 'products',
                valueType: 'productsSelect',
                placeholder: SELECT_PRODUCT_PLACEHOLDER,
            },
            {
                type: 'operatorField',
                valueType: 'select',
                options: DATE_VALUE_SIMPLIFIED_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'date',
            },
        ],
    },
    {
        key: 'customerDateOfCategoryOrdered',
        label: 'Customer History: Date of Category Ordered',
        group: 'customer-time',
        hasMultipleSubFields: true,
        fields: [
            {
                type: 'subField',
                name: 'orderType',
                valueType: 'select',
                options: [
                    { value: 'first', label: 'First ordered' },
                    { value: 'last', label: 'Last ordered' },
                ],
                placeholder: ORDER_TYPE_PLACEHOLDER,
            },
            {
                type: 'subField',
                name: 'categories',
                valueType: 'termsSelect',
                valueTypeVariant: 'product_cat',
                placeholder: SELECT_CATEGORY_PLACEHOLDER,
            },
            {
                type: 'operatorField',
                valueType: 'select',
                options: DATE_VALUE_SIMPLIFIED_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'date',
            },
        ],
    },
    // Product fields
    {
        key: 'productInventory',
        label: 'Product Inventory',
        group: 'product',
        fields: [
            {
                type: 'subField',
                name: 'products',
                valueType: 'productsSelect',
                placeholder: SELECT_PRODUCT_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'select',
                options: [
                    { value: 'inStock', label: 'Is in stock' },
                    { value: 'outOfStock', label: 'Is out of stock' },
                    { value: 'onBackorder', label: 'Is on backorder' },
                ],
                placeholder: SELECT_INVENTORY_STATUS_PLACEHOLDER,
            },
        ],
    },
    {
        key: 'productQuantityInStock',
        label: 'Quantity of Product in Stock',
        group: 'product',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'subField',
                name: 'products',
                valueType: 'productsSelect',
                placeholder: SELECT_PRODUCT_PLACEHOLDER,
            },
            {
                type: 'operatorField',
                valueType: 'select',
                options: VALUE_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'number',
            },
        ],
    },
    {
        key: 'shippingCountry',
        label: 'Shipping Country',
        group: 'customer',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'operatorField',
                valueType: 'select',
                options: CONTAINS_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'countries',
            },
        ],
    },
    {
        key: 'billingCountry',
        label: 'Billing Country',
        group: 'customer',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'operatorField',
                valueType: 'select',
                options: CONTAINS_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'countries',
            },
        ],
    },
    {
        key: 'userRole',
        // Get the plan level and determine if we should show the Pro+ label
        get label() {
            const planLevel = (window as any).cfwOrderBumpsData?.plan_level || 0;
            return planLevel >= 3 ? 'User Role' : 'User Role (Pro+)';
        },
        help: 'Check if the current user has a specific role',
        group: 'customer',
        hasSimplifiedLayout: true,
        fields: [
            {
                type: 'operatorField',
                valueType: 'select',
                options: CONTAINS_OPERATORS,
                placeholder: OPERATOR_PLACEHOLDER,
            },
            {
                type: 'valueField',
                valueType: 'userRoles',
                placeholder: SELECT_USER_ROLE_PLACEHOLDER,
            },
        ],
    },
];
