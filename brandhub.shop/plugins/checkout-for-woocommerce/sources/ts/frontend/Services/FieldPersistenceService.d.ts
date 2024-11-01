declare class FieldPersistenceService {
    static load(): void;
    static setListeners(): void;
    static onRetrieve(element: JQuery, retrievedValue: any): void;
}
export default FieldPersistenceService;
