import { LitElement } from 'lit';
export declare type LoadingType = 'auto' | 'lazy' | 'eager';
export declare type EventsTargetType = 'local' | 'global';
export declare type HintType = 'drag';
/**
 * Spline scene viewer
 */
export declare class SplineViewer extends LitElement {
    static styles: import("lit").CSSResult;
    /**
     * The url of the .splinecode file as exported from Spline Editor.
     */
    url: string | null;
    /**
     * The width of the canvas
     */
    width: number | undefined;
    /**
     * The height of the canvas
     */
    height: number | undefined;
    /**
     * Background color
     */
    background: string | undefined;
    /**
     * Preloading strategy ('auto', 'lazy' or 'eager')
     */
    loading: LoadingType;
    /**
     * Enables auto unloading of the canvas / spline when it leaves the viewport
     */
    unloadable: boolean;
    /**
     * Target of the mouse events, can either be 'local' (ie the canvas) or global (window)
     */
    eventsTarget: EventsTargetType | undefined;
    /**
     * Target of the mouse events, can either be 'local' (ie the canvas) or global (window)
     */
    hint?: boolean;
    /**
     * When true it displays the spinner preloader
     */
    loadingAnim: boolean;
    private _spline;
    protected _intersectionObserver: IntersectionObserver | null;
    protected _isElementInViewport: boolean;
    protected _loaded: boolean;
    protected _container: HTMLElement;
    protected _canvas: HTMLCanvasElement;
    protected _logo: HTMLElement;
    protected _hintDrag: HTMLElement;
    protected _preloader: HTMLElement;
    private _loadedUrl;
    private _wasContextLost;
    constructor();
    protected unload(): void;
    protected _handleContextLost: () => void;
    protected _handleContextRestored: () => void;
    protected recreateCanvas(): void;
    protected load(): void;
    protected onLoaded: () => void;
    protected onInteract: () => void;
    updated(changedProperties: Map<string | number | symbol, any>): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
declare global {
    interface HTMLElementTagNameMap {
        'spline-viewer': SplineViewer;
    }
}
