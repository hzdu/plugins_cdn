import React from 'react';
import { BumpLocation } from '../Types/BumpTypes';
interface OrderBumpsListProps {
    locations: BumpLocation[];
    containerClass?: string;
}
declare const OrderBumpsList: React.FC<OrderBumpsListProps>;
export default OrderBumpsList;
