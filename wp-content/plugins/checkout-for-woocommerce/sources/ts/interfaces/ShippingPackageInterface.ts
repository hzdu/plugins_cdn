import Actions from '../Types/Actions';

export interface ShippingMethodInterface {
    id: string;
    sanitizedId: string;
    label: string;
    checked: boolean;
    actions: Actions;
}

export interface ShippingPackageInterface {
    index: number;
    packageName: string;
    packageDetails: string;
    availableMethods: ShippingMethodInterface[];
    chosenMethod: string;
}
