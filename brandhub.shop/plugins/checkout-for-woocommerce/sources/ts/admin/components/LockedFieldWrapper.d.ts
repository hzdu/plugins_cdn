import React from 'react';
import SettingsFormPropsPlanInterface from '../../interfaces/SettingsFormPropsPlanInterface';
interface LockedFieldWrapperProps {
    slug: string;
    children: React.ReactNode;
    locked: boolean;
    requiredPlans: string;
    plan: SettingsFormPropsPlanInterface;
}
declare const LockedFieldWrapper: React.FC<LockedFieldWrapperProps>;
export default LockedFieldWrapper;
