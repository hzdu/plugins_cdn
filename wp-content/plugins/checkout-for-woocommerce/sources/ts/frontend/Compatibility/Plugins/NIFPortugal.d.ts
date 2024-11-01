import Compatibility from '../Compatibility';
declare class NIFPortugal extends Compatibility {
    private _currentNIF;
    constructor();
    load(): void;
    enforceFieldVisibility(): void;
}
export default NIFPortugal;
