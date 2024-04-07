class TheGemDelayJavaScript {
	constructor() {
		this.triggerEvents = ["keydown", "mousedown", "mousemove", "touchmove", "touchstart", "touchend", "wheel"];
		this.userEventHandler = this.triggerListener.bind(this);
		this.touchStartHandler = this.onTouchStart.bind(this);
		this.touchMoveHandler = this.onTouchMove.bind(this);
		this.touchEndHandler = this.onTouchEnd.bind(this);
		this.clickHandler = this.onClick.bind(this);
		this.interceptedClicks = [];
		this.delayedScripts = { normal: [], async: [], defer: [] };
		this.allJQueries = [];
	}
	addUserInteractionListener(script) {
		if(document.hidden) {
			script.triggerListener();
		} else {
			this.triggerEvents.forEach((t) => window.addEventListener(t, script.userEventHandler, { passive: !0 }));
			window.addEventListener("touchstart", script.touchStartHandler, { passive: !0 });
			window.addEventListener("mousedown", script.touchStartHandler);
			document.addEventListener("visibilitychange", script.userEventHandler);
		}
	}
	removeUserInteractionListener() {
		this.triggerEvents.forEach((e) => window.removeEventListener(e, this.userEventHandler, { passive: !0 }));
		document.removeEventListener("visibilitychange", this.userEventHandler);
	}
	onTouchStart(e) {
		if("HTML" !== e.target.tagName) {
			window.addEventListener("touchend", this.touchEndHandler);
			window.addEventListener("mouseup", this.touchEndHandler);
			window.addEventListener("touchmove", this.touchMoveHandler, { passive: !0 });
			window.addEventListener("mousemove", this.touchMoveHandler);
			e.target.addEventListener("click", this.clickHandler);
			this.renameDOMAttribute(e.target, "onclick", "thegem-onclick");
		}
	}
	onTouchMove(e) {
		window.removeEventListener("touchend", this.touchEndHandler);
		window.removeEventListener("mouseup", this.touchEndHandler);
		window.removeEventListener("touchmove", this.touchMoveHandler, { passive: !0 });
		window.removeEventListener("mousemove", this.touchMoveHandler);
		e.target.removeEventListener("click", this.clickHandler);
		this.renameDOMAttribute(e.target, "thegem-onclick", "onclick");
	}
	onTouchEnd(e) {
		window.removeEventListener("touchend", this.touchEndHandler);
		window.removeEventListener("mouseup", this.touchEndHandler);
		window.removeEventListener("touchmove", this.touchMoveHandler, { passive: !0 });
		window.removeEventListener("mousemove", this.touchMoveHandler);
	}
	onClick(e) {
		e.target.removeEventListener("click", this.clickHandler);
		this.renameDOMAttribute(e.target, "thegem-onclick", "onclick");
		 this.interceptedClicks.push(e), e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	}
	replayClicks() {
		window.removeEventListener("touchstart", this.touchStartHandler, { passive: !0 });
		window.removeEventListener("mousedown", this.touchStartHandler);
		this.interceptedClicks.forEach((e) => {
			e.target.dispatchEvent(new MouseEvent("click", { view: e.view, bubbles: !0, cancelable: !0 }));
		});
	}
	renameDOMAttribute(e, t, n) {
		if(e.hasAttribute && e.hasAttribute(t)) {
			event.target.setAttribute(n, event.target.getAttribute(t)), event.target.removeAttribute(t);
		}
	}
	triggerListener() {
		this.removeUserInteractionListener(this);
		if("loading" === document.readyState) {
			document.addEventListener("DOMContentLoaded", this.startLoadingScripts.bind(this))
		} else {
			this.startLoadingScripts()
		}
	}
	async startLoadingScripts() {
		this.delayEventListeners();
		this.delayJQueryReady(this);
		this.handleDocumentWrite();
		this.registerAllDelayedScripts();
		this.preloadAllScripts();
		await this.loadScriptsFromList(this.delayedScripts.normal);
		await this.loadScriptsFromList(this.delayedScripts.defer);
		await this.loadScriptsFromList(this.delayedScripts.async);
		try {
			await this.triggerDOMContentLoaded();
			await this.triggerWindowLoad();
		} catch (e) {}
		window.dispatchEvent(new Event("thegem-allScriptsLoaded"));
		this.replayClicks();
	}
	registerAllDelayedScripts() {
		document.querySelectorAll("script[type=thegemdelayscript]").forEach((e) => {
			if(e.hasAttribute("src")) {
				if(e.hasAttribute("async") && !1 !== e.async) {
					this.delayedScripts.async.push(e);
				} else {
					if((e.hasAttribute("defer") && !1 !== e.defer) || "module" === e.getAttribute("data-thegem-type")) {
						this.delayedScripts.defer.push(e);
					} else {
						this.delayedScripts.normal.push(e);
					}
				}
			} else {
				this.delayedScripts.normal.push(e);
			}
		});
	}
	async transformScript(e) {
		return (
			await this.requestAnimFrame(),
			new Promise((t) => {
				const n = document.createElement("script");
				[...e.attributes].forEach((e) => {
					let t = e.nodeName;
					"type" !== t && ("data-thegem-type" === t && (t = "type"), n.setAttribute(t, e.nodeValue));
				});
				if(e.hasAttribute("src")) {
					n.addEventListener("load", t);
					n.addEventListener("error", t)
				} else {
					n.text = e.text;
					t();
				}
				try {
					e.parentNode.replaceChild(n, e);
				} catch (e) {
					t();
				}
			})
		);
	}
	async loadScriptsFromList(e) {
		const t = e.shift();
		return t ? (await this.transformScript(t), this.loadScriptsFromList(e)) : Promise.resolve();
	}
	preloadAllScripts() {
		var e = document.createDocumentFragment();
		[...this.delayedScripts.normal, ...this.delayedScripts.defer, ...this.delayedScripts.async].forEach((t) => {
			const n = t.getAttribute("src");
			if (n) {
				const t = document.createElement("link");
				(t.href = n), (t.rel = "preload"), (t.as = "script"), e.appendChild(t);
			}
		}),
			document.head.appendChild(e);
	}
	delayEventListeners() {
		let e = {};
		function t(t, n) {
			!(function (t) {
				function n(n) {
					return e[t].eventsToRewrite.indexOf(n) >= 0 ? "thegem-" + n : n;
				}
				e[t] ||
					((e[t] = { originalFunctions: { add: t.addEventListener, remove: t.removeEventListener }, eventsToRewrite: [] }),
					(t.addEventListener = function () {
						(arguments[0] = n(arguments[0])), e[t].originalFunctions.add.apply(t, arguments);
					}),
					(t.removeEventListener = function () {
						(arguments[0] = n(arguments[0])), e[t].originalFunctions.remove.apply(t, arguments);
					}));
			})(t),
				e[t].eventsToRewrite.push(n);
		}
		function n(e, t) {
			let n = e[t];
			Object.defineProperty(e, t, {
				get: () => n || function () {},
				set(i) {
					e["thegem" + t] = n = i;
				},
			});
		}
		t(document, "DOMContentLoaded"), t(window, "DOMContentLoaded"), t(window, "load"), t(window, "pageshow"), t(document, "readystatechange"), n(document, "onreadystatechange"), n(window, "onload"), n(window, "onpageshow");
	}
	delayJQueryReady(e) {
		let t = window.jQuery;
		Object.defineProperty(window, "jQuery", {
			get: () => t,
			set(n) {
				if (n && n.fn && !e.allJQueries.includes(n)) {
					n.fn.ready = n.fn.init.prototype.ready = function (t) {
						e.domReadyFired ? t.bind(document)(n) : document.addEventListener("thegem-DOMContentLoaded", () => t.bind(document)(n));
					};
					const t = n.fn.on;
					(n.fn.on = n.fn.init.prototype.on = function () {
						if (this[0] === window) {
							function e(e) {
								return e
									.split(" ")
									.map((e) => ("load" === e || 0 === e.indexOf("load.") ? "thegem-jquery-load" : e))
									.join(" ");
							}
							"string" == typeof arguments[0] || arguments[0] instanceof String
								? (arguments[0] = e(arguments[0]))
								: "object" == typeof arguments[0] &&
								  Object.keys(arguments[0]).forEach((t) => {
									  delete Object.assign(arguments[0], { [e(t)]: arguments[0][t] })[t];
								  });
						}
						return t.apply(this, arguments), this;
					}),
						e.allJQueries.push(n);
				}
				t = n;
			},
		});
	}
	async triggerDOMContentLoaded() {
		this.domReadyFired = !0;
		await this.requestAnimFrame();
		document.dispatchEvent(new Event("thegem-DOMContentLoaded"));
		await this.requestAnimFrame();
		window.dispatchEvent(new Event("thegem-DOMContentLoaded"));
		await this.requestAnimFrame();
		document.dispatchEvent(new Event("thegem-readystatechange"));
		await this.requestAnimFrame();
		document.thegemonreadystatechange && document.thegemonreadystatechange();
	}
	async triggerWindowLoad() {
		await this.requestAnimFrame(),
			window.dispatchEvent(new Event("thegem-load")),
			await this.requestAnimFrame(),
			window.thegemonload && window.thegemonload(),
			await this.requestAnimFrame(),
			this.allJQueries.forEach((e) => e(window).trigger("thegem-jquery-load")),
			window.dispatchEvent(new Event("thegem-pageshow")),
			await this.requestAnimFrame(),
			window.thegemonpageshow && window.thegemonpageshow();
	}
	handleDocumentWrite() {
		const e = new Map();
		document.write = document.writeln = function (t) {
			const n = document.currentScript,
				i = document.createRange(),
				r = n.parentElement;
			let o = e.get(n);
			void 0 === o && ((o = n.nextSibling), e.set(n, o));
			const s = document.createDocumentFragment();
			i.setStart(s, 0), s.appendChild(i.createContextualFragment(t)), r.insertBefore(s, o);
		};
	}
	async requestAnimFrame() {
		return document.hidden ? new Promise((e) => setTimeout(e)) : new Promise((e) => requestAnimationFrame(e));
	}
	static init() {
		const delayScript = new TheGemDelayJavaScript();
		delayScript.addUserInteractionListener(delayScript);
	}
}
TheGemDelayJavaScript.init();
