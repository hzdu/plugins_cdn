import Alert from '../Components/Alert';
declare class AlertService {
    private static alertContainer;
    private static queues;
    private static debouncedScrollToNotices;
    private static debouncedShowAlerts;
    static preserveAlerts: boolean;
    constructor();
    static scrollToNotices(): void;
    static queueAlert(alert: Alert, queue?: string): void;
    static showAlerts(queue?: string, container?: string): void;
    private static buildAlert;
    static getOrBuildAlert(type: string, message: string, cssClass: string): JQuery<HTMLElement>;
    private static getAlertId;
    static hideAlerts(container?: string): void;
    static removeTemporaryAlerts(container?: string): void;
    static createAlertsFromMessages(messages: string, extraClasses?: string): boolean;
}
export default AlertService;
