import React from 'react';
import { ShippingPackageInterface, ShippingMethodInterface } from '../../interfaces/ShippingPackageInterface';
type ShippingProps = {
    packageCount: number;
    package: ShippingPackageInterface;
    updateSelectedMethod: (method: ShippingMethodInterface) => void;
};
declare const ShippingMethodsList: React.FC<ShippingProps>;
export default ShippingMethodsList;
