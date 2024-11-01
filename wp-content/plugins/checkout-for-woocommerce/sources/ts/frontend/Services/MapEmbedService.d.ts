declare class MapEmbedService {
    /**
     * Attach change events to postcode fields
     */
    setMapEmbedHandlers(): void;
    initMap(): Promise<void>;
}
export default MapEmbedService;
