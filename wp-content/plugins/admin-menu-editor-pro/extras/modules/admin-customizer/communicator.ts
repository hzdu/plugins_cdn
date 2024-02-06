'use strict';

/// <reference path="../../../js/jquery.d.ts" />

namespace AmeAcCommunicator {
	const $ = jQuery;
	const MessageFormatName = 'AmeAcCommunicator1';

	type RpcMethodCollection = { [methodName: string]: (...args: any[]) => any };

	export function connectToChild(
		frame: HTMLIFrameElement,
		rpcMethods: RpcMethodCollection = {},
		allowedOrigins: string[] = ['*'],
		enableConsoleLogging: boolean = false
	): ConnectionInterface {
		if (frame.contentWindow === null) {
			return new BadConnection();
		}

		//Note: We could try to get the frame's origin from the src attribute,
		//but that would not work consistently because the user could navigate
		//to a different domain in the frame and the attribute would stay the same.
		return new Connection(
			'Parent',
			frame.contentWindow,
			rpcMethods,
			allowedOrigins,
			enableConsoleLogging
		);
	}

	export function connectToParent(
		rpcMethods: RpcMethodCollection = {},
		allowedOrigins: string[] = ['*'],
		enableConsoleLogging: boolean = false
	): ConnectionInterface {
		if ((window.parent === null) || (window.parent === window)) {
			return new BadConnection();
		}

		return new Connection(
			'Child',
			window.parent,
			rpcMethods,
			allowedOrigins,
			enableConsoleLogging
		);
	}

	interface ConnectionInterface {
		promise: JQueryPromise<ConnectionInterface>;

		get isConnected(): boolean

		execute(method: string, ...args: any): JQueryPromise<any>;

		/**
		 * Break the connection, e.g. when the iframe is removed from the page.
		 */
		disconnect(): void;

		addRpcMethod(methodName: string, method: (...args: any[]) => any): void;
	}

	class Connection implements ConnectionInterface {
		protected readonly deferred: JQueryDeferred<Connection>;
		public readonly promise: JQueryPromise<Connection>;

		private handshakeDone: boolean = false;
		private connectedOrigin: string | null = null;
		private readonly messageListener: EventListener;

		private readonly rpcIdPrefix: string;
		private rpcRequestCount: number = 0;
		private pendingRpcRequests: Record<string, JQueryDeferred<any>> = {};
		private rpcTimeout: number = 30000;

		private isConnectionBroken: boolean = false;

		private lastSentHandshakeRequest: HandshakeRequest | null = null;

		constructor(
			protected readonly name: string,
			protected readonly target: Window,
			protected readonly rpcMethods: RpcMethodCollection = {},
			protected allowedTargetOrigins: string[] = ['*'],
			public consoleLoggingEnabled: boolean = false,
			connectionTimeout: number = 30000,
			protected readonly myWindow: Window = window
		) {
			this.log('Initializing...');
			this.rpcIdPrefix = 'aAcC_' + Connection.getRandomString(8) + '_';

			this.deferred = $.Deferred<Connection>();
			this.promise = this.deferred.promise();

			//Try to auto-detect the origin. This won't work if the target is
			//loaded from a different domain.
			if (this.connectedOrigin === null) {
				try {
					this.connectedOrigin = this.target.location.origin;
					this.log(`Detected target origin: ${this.connectedOrigin}`);
				} catch (e) {
					//Leave the origin as null.
				}
			}

			this.messageListener = (event: Event) => {
				if (!(event instanceof MessageEvent)) {
					this.log('Ignoring non-message event.');
					return;
				}

				if (event.source !== this.target) {
					this.log('Ignoring message from unknown source.');
					return;
				}

				if (!this.isAllowedOrigin(event.origin)) {
					this.log('Ignoring message from disallowed origin: ' + event.origin);
					return;
				}

				const message = parseMessage(event.data);
				if (message === null) {
					this.log('Ignoring invalid message.');
					return;
				}

				this.handleMessage(message, event.origin);
			};
			this.myWindow.addEventListener('message', this.messageListener);
			this.log('Event listener added.');

			//Send the handshake request to every allowed target origin.
			for (const origin of this.allowedTargetOrigins) {
				this.log(`Sending handshake request to ${origin}`);
				this.lastSentHandshakeRequest = this.createHandshakeRequest();
				this.target.postMessage(this.lastSentHandshakeRequest, origin);
			}

			//Give up if the other window doesn't respond in time.
			if (connectionTimeout > 0) {
				setTimeout(() => {
					if (this.deferred.state() === 'pending') {
						this.lastSentHandshakeRequest = null;
						this.deferred.reject();
					}
				}, connectionTimeout);
			}

			//Clean up event listener(s) if the connection fails for any reason.
			this.deferred.fail(() => {
				this.myWindow.removeEventListener('message', this.messageListener);
			});
		}

		protected handleMessage(message: MessageData<string>, origin: string): void {
			if (this.isConnectionBroken) {
				this.log('Ignoring message because the connection is broken.');
				return;
			}
			this.log(`Received message from ${origin}: ${JSON.stringify(message)}`);

			//We'll send a handshake request to the other window and wait
			//for a response. Alternatively, the other window can send
			//a handshake request to us.
			if (isHandshakeResponse(message)) {
				if (this.validateHandshakeResponse(message)) {
					this.completeHandshake(message, origin);
				} else {
					this.log('Received an invalid handshake response.');
					if (this.lastSentHandshakeRequest) {
						this.log('Aborting handshake attempt ' + this.lastSentHandshakeRequest.handshakeRequestId);
						this.lastSentHandshakeRequest = null;
						if (this.deferred.state() === 'pending') {
							this.deferred.reject();
						}
					}
				}
			} else if (isHandshakeRequest(message)) {
				/*
				 * Note: It's allowed to re-connect after the handshake is already done
				 * as long as the origin is the same. This is useful in situations where
				 * a child establishes a connection before the "load" event is fired and
				 * then the parent re-establishes it in a "load" event handler.
				 *
				 * We can't simply remove the "load" event handler because the parent does
				 * not necessarily know if the page that loaded is the same as the page
				 * that created the connection.
				 */
				if (this.validateHandshakeRequest(message)) {
					if (this.handshakeDone && (this.connectedOrigin !== origin)) {
						this.log(
							'Received a handshake request from a different origin while already connected.'
							+ ' Ignoring the request.'
						);
						return;
					}
					this.send(this.createHandshakeResponse(message));
					this.completeHandshake(message, origin);
				} else {
					this.log('Handshake request is invalid and will be ignored.');
				}
			} else {
				//Only process general RPC messages after the handshake is done.
				if (this.handshakeDone) {
					if (isRpcRequest(message)) {
						this.handleRpcRequest(message);
					} else if (isRpcResponse(message)) {
						this.handleRpcResponse(message);
					}
				} else {
					this.log('Ignoring message because the handshake is not completed yet.');
				}
			}
		}

		execute(method: string, ...args: any): JQueryPromise<any> {
			if (this.isConnectionBroken) {
				return $.Deferred().reject('Connection has already been closed.').promise();
			}

			this.rpcRequestCount++;
			const requestId = this.rpcIdPrefix + this.rpcRequestCount + '_' + Connection.getRandomString(6);

			const requestDef = $.Deferred<any>();
			//Remember the request so that we can resolve it when we get the response.
			this.pendingRpcRequests[requestId] = requestDef;
			//We'll set a timeout later.
			let timeoutTimerId: null | ReturnType<typeof setTimeout> = null;

			//Always clean up the request collection and the timer when the request
			//is resolved, whether it was successful or not.
			requestDef.always(() => {
				delete this.pendingRpcRequests[requestId];
				if (timeoutTimerId !== null) {
					clearTimeout(timeoutTimerId);
				}
			});

			const request: RpcRequest = this.createMessage('rpc-request', {
				'method': method,
				'args': args,
				'requestId': requestId
			});

			this.deferred
				.done(() => {
					//Time out the request eventually.
					if (this.rpcTimeout > 0) {
						timeoutTimerId = setTimeout(() => {
							timeoutTimerId = null;
							if (requestDef.state() === 'pending') {
								requestDef.reject('RPC request timed out.');
							}
						}, this.rpcTimeout);
					}

					this.send(request);
				})
				.fail(() => {
					requestDef.reject('Connection failed.');
				});

			return requestDef.promise();
		}

		protected send<T extends MessageData<string>>(message: T): void {
			if (this.isConnectionBroken) {
				return;
			}

			let origin = this.connectedOrigin;
			if (origin === null) {
				origin = '*';
			}

			this.target.postMessage(message, origin);
		}

		/**
		 * Break the connection, e.g. when the iframe is removed from the page.
		 */
		disconnect() {
			//Do nothing if already disconnected.
			if (this.isConnectionBroken) {
				this.log('Notice: Cannot disconnect because the connection is already broken.');
				return;
			}

			this.isConnectionBroken = true;

			try {
				this.myWindow.removeEventListener('message', this.messageListener);
			} catch (e) {
				//Do nothing if the window is not valid.
			}

			if (this.deferred.state() === 'pending') {
				this.deferred.reject();
			}

			//Reject all pending RPC requests.
			//The list could change during the loop, so we'll use a copy.
			const pendingRequests = Object.keys(this.pendingRpcRequests).map(key => this.pendingRpcRequests[key]);
			pendingRequests.forEach(request => {
				if (request.state() === 'pending') {
					request.reject('Connection explicitly closed.');
				}
			});
			this.log('Disconnected.');
		}

		addRpcMethod(methodName: string, method: (...args: any[]) => any): void {
			this.rpcMethods[methodName] = method;
		}

		protected createHandshakeRequest(): HandshakeRequest {
			return this.createMessage(
				'handshake-request',
				{
					'myOrigin': this.getMyOrigin(),
					'handshakeRequestId': Connection.getRandomString(20),
				}
			);
		}

		protected createHandshakeResponse(incomingRequest: HandshakeRequest): HandshakeResponse {
			return this.createMessage(
				'handshake-response',
				{
					'success': true,
					'myUrl': this.myWindow.location.href,
					'myOrigin': this.getMyOrigin(),
					'handshakeRequestId': incomingRequest.handshakeRequestId,
				}
			);
		}

		protected getMyOrigin(): string | null {
			let origin;
			try {
				origin = this.myWindow.location.origin;
			} catch (e) {
				//Do nothing.
			}
			return origin ?? null;
		}

		protected isAllowedOrigin(origin: string): boolean {
			if (this.handshakeDone && this.connectedOrigin) {
				//Use the connected origin.
				return Connection.originMatches(this.connectedOrigin, origin);
			}

			//Check all allowed origins.
			for (const allowedOrigin of this.allowedTargetOrigins) {
				if (Connection.originMatches(allowedOrigin, origin)) {
					return true;
				}
			}
			return false;
		}

		private static originMatches(required: string | null, input: string): boolean {
			//Null and '*' allow all origins.
			if ((required === '*') || (required === null)) {
				return true;
			}
			return required === input;
		}

		protected validateHandshakeRequest(request: HandshakeRequest): boolean {
			return request.format === 'AmeAcCommunicator1' && request.tag === 'handshake-request';
		}

		protected validateHandshakeResponse(response: HandshakeResponse): boolean {
			return (
				(response.format === 'AmeAcCommunicator1')
				&& (response.tag === 'handshake-response')
				&& (this.lastSentHandshakeRequest !== null)
				&& (response.handshakeRequestId === this.lastSentHandshakeRequest.handshakeRequestId)
			);
		}

		protected completeHandshake(message: HandshakeResponse | HandshakeRequest, origin: string): void {
			//Once the connection has been established, lock in the specific origin.
			if (this.connectedOrigin === null) {
				if (origin && (origin !== '*')) {
					this.connectedOrigin = origin;
				} else if (message.myOrigin && (message.myOrigin !== '*')) {
					this.connectedOrigin = message.myOrigin;
				}
			}
			this.handshakeDone = true;
			this.lastSentHandshakeRequest = null;
			if (this.deferred.state() === 'pending') {
				this.deferred.resolve(this);
			}

			this.log('Handshake complete. Connected origin: ' + this.connectedOrigin);
		}

		protected createMessage<T extends string, P extends Record<string, any>>(
			tag: T, props: P
		): MessageData<T> & P {
			return Connection.combineObjects(
				{
					'format': 'AmeAcCommunicator1',
					'tag': tag
				},
				props
			);
		}

		/**
		 * Combine the properties of two objects into a new object (shallow merge).
		 *
		 * This is implemented as a separate method only to work around some TypeScript
		 * annoyances. Gradually constructing an object that obeys an interface is tricky.
		 */
		private static combineObjects<A extends Record<string, any>, B extends Record<string, any>>(
			one: A, two: B
		): A & B {
			let result: Record<string, any> = {};
			for (let key in one) {
				result[key] = one[key];
			}
			for (let key in two) {
				result[key] = two[key];
			}
			return result as A & B;
		}

		private static getRandomString(length: number): string {
			if (typeof crypto !== 'undefined') {
				try {
					const bytes = crypto.getRandomValues(new Uint8Array(length));
					let pieces = [];
					for (let i = 0; i < bytes.length; i++) {
						pieces.push(bytes[i].toString(36));
					}
					return pieces.join('').substring(0, length);
				} catch (e) {
					//Fall through to the backup method.
				}
			}

			let result = '';
			while (result.length < length) {
				result += Math.random().toString(36).substring(2);
			}
			return result.substring(0, length);
		}

		private handleRpcRequest(request: RpcRequest): void {
			if (!this.rpcMethods.hasOwnProperty(request.method)) {
				this.send<RpcResponse>(this.createMessage('rpc-response', {
					'requestId': request.requestId,
					'result': null,
					'error': 'Unknown RPC method: ' + request.method
				}));
				return;
			}

			const method = this.rpcMethods[request.method];
			const args = request.args ?? [];
			try {
				const result = method.apply(this, args);
				this.send<RpcResponse>(this.createMessage('rpc-response', {
					'requestId': request.requestId,
					'result': (typeof result === 'undefined') ? null : result,
					'error': null
				}));
			} catch (e) {
				let errorMessage: string;
				if (e && (typeof e === 'object') && (e as any).message) {
					errorMessage = (e as any).message;
				} else {
					errorMessage = e ? e.toString() : '';
				}

				this.send<RpcResponse>(this.createMessage('rpc-response', {
					'requestId': request.requestId,
					'result': null,
					'error': errorMessage
				}));
			}
		}

		private handleRpcResponse(response: RpcResponse): void {
			//Is this a response to a request we actually sent?
			const requestId = response.requestId;
			if (!this.pendingRpcRequests.hasOwnProperty(requestId)) {
				return;
			}

			const requestDef = this.pendingRpcRequests[requestId];
			if (requestDef.state() !== 'pending') {
				//This normally shouldn't happen.
				if (console && console.warn) {
					console.warn(
						'Received RPC response for request ID "' + requestId +
						'", but the request has already been resolved.'
					);
				}
				delete this.pendingRpcRequests[requestId];
				return;
			}

			if ((typeof response.error !== 'undefined') && (response.error !== null)) {
				requestDef.reject(response.error);
			} else {
				requestDef.resolve(response.result);
			}

			//The request should remove itself from the pending list,
			//but we'll do it here just in case.
			delete this.pendingRpcRequests[requestId];
		}

		get isConnected(): boolean {
			return this.handshakeDone && !this.isConnectionBroken;
		}

		private log(message: string) {
			if (this.consoleLoggingEnabled && console && console.log) {
				console.log('AmeAcCommunicator (' + this.name + '): ' + message);
			}
		}
	}

	class BadConnection implements ConnectionInterface {
		promise: JQueryPromise<ConnectionInterface> =
			$.Deferred<ConnectionInterface>().reject('Not connected to a valid frame or window').promise();

		get isConnected(): boolean {
			return false;
		}

		addRpcMethod(methodName: string, method: (...args: any[]) => any): void {
		}

		disconnect(): void {
		}

		execute(method: string, ...args: any): JQueryPromise<any> {
			return $.Deferred().reject('Not connected to a valid frame or window').promise();
		}
	}

	interface MessageData<TAG extends string> {
		format: string;
		tag: TAG;

		[key: string]: any;
	}

	interface HandshakeRequest extends MessageData<'handshake-request'> {
		myOrigin: string | null;
		handshakeRequestId: string;
	}

	interface HandshakeResponse extends MessageData<'handshake-response'> {
		success: boolean;
		myUrl: string;
		myOrigin: string | null;
		handshakeRequestId: string;
	}

	interface RpcRequest extends MessageData<'rpc-request'> {
		method: string;
		args: any[];
		requestId: string;
	}

	interface RpcResponse extends MessageData<'rpc-response'> {
		result: any;
		error: any;
		requestId: string;
	}

	function parseMessage(data: any): MessageData<string> | null {
		if (
			(typeof data !== 'object')
			|| (typeof data.format !== 'string')
			|| (typeof data.tag !== 'string')
			|| (data.format !== MessageFormatName)
		) {
			return null;
		}
		return data;
	}

	function isHandshakeRequest(data: MessageData<string>): data is HandshakeRequest {
		return data.tag === 'handshake-request';
	}

	function isHandshakeResponse(data: MessageData<string>): data is HandshakeResponse {
		return (data.tag === 'handshake-response') && (typeof data.success === 'boolean');
	}

	function isRpcRequest(data: MessageData<string>): data is RpcRequest {
		return (
			(data.tag === 'rpc-request')
			&& (typeof data.method === 'string')
			&& (typeof data.args !== 'undefined')
			&& (typeof data.requestId === 'string')
			&& (Array.isArray(data.args))
		);
	}

	function isRpcResponse(data: MessageData<string>): data is RpcResponse {
		return (
			(data.tag === 'rpc-response')
			&& (typeof data.result !== 'undefined')
			&& (typeof data.requestId === 'string')
		);
	}
}
