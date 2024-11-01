import React from 'react';
interface WithVisibilityControlProps {
    label: string;
    name?: string;
    description?: string;
    searchTerm?: string;
}
declare const withVisibilityControl: <P extends WithVisibilityControlProps>(WrappedComponent: React.ComponentType<P>) => {
    new (props: P & WithVisibilityControlProps): {
        render(): React.JSX.Element;
        context: unknown;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<P & WithVisibilityControlProps>) => {} | Pick<{}, K>) | Pick<{}, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<P & WithVisibilityControlProps>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<P & WithVisibilityControlProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<P & WithVisibilityControlProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<P & WithVisibilityControlProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<P & WithVisibilityControlProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P & WithVisibilityControlProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<P & WithVisibilityControlProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<P & WithVisibilityControlProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: P & WithVisibilityControlProps, context: any): {
        render(): React.JSX.Element;
        context: unknown;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<P & WithVisibilityControlProps>) => {} | Pick<{}, K>) | Pick<{}, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<P & WithVisibilityControlProps>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<P & WithVisibilityControlProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<P & WithVisibilityControlProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<P & WithVisibilityControlProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<P & WithVisibilityControlProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P & WithVisibilityControlProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<P & WithVisibilityControlProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<P & WithVisibilityControlProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
};
export default withVisibilityControl;
