import React from 'react';

export default interface ComponentMappingInterface {
    id: string;
    component: React.ReactElement;
    condition?: boolean;
};
