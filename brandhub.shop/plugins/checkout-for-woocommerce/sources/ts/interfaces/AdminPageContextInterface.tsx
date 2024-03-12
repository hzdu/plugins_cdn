interface AdminPageContextInterface {
    isLoading: boolean,
    setIsLoading: ( loading: boolean ) => void;
    saveSettings: () => Promise<void>;
}

export default AdminPageContextInterface;
