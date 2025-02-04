declare class LoggingService {
    static logError(message: string, extraData?: unknown): void;
    static logNotice(message: string, object?: unknown): void;
    static logEvent(message: string, object?: unknown): void;
    static log(message: string, force?: boolean, object?: unknown): void;
}
export default LoggingService;
