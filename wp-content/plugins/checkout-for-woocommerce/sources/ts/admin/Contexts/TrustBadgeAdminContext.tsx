import { createContext }         from 'react';
import AdminPageContextInterface from '../../interfaces/AdminPageContextInterface';

interface TrustBadgeAdminContextInterface extends AdminPageContextInterface {
    badges: any;
    isEnabled: boolean;
    outputLocation: string;
    introductionText: string;
    setBadges: ( badges: any ) => void;
    setIsEnabled: ( enabled: boolean ) => void;
    setOutputLocation: ( outputLocation: string ) => void;
    setIntroductionText: ( introductionText: string ) => void;
}

// Define the shape of your context
const TrustBadgeAdminContext = createContext<TrustBadgeAdminContextInterface>( {
    isLoading: false,
    badges: [],
    isEnabled: false,
    outputLocation: '',
    introductionText: '',
    setIsLoading: ( loading: boolean ) => {},
    setBadges: ( badges: any ) => {},
    setIsEnabled: ( enabled: boolean ) => {},
    setOutputLocation: ( outputLocation: string ) => {},
    setIntroductionText: ( introductionText: string ) => {},
    saveSettings: async () => {},
} );

export default TrustBadgeAdminContext;
