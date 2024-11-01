import React, { MouseEvent } from 'react';
import TrustBadgeInterface from '../../interfaces/TrustBadgeInterface';
interface TrustBadgeRowProps {
    badge: TrustBadgeInterface;
    setBadge: (badge: TrustBadgeInterface) => void;
    removeHandler: (event: MouseEvent<HTMLButtonElement>) => void;
    dragHandleProps: any;
}
declare function TrustBadgeRow({ badge, setBadge, removeHandler, dragHandleProps }: TrustBadgeRowProps): React.JSX.Element;
export default TrustBadgeRow;
