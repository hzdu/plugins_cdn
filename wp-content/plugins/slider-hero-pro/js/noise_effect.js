jQuery(document).ready(function($){
	"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 three orbit controls
 */
 
 if (typeof noise_effect_mainId === 'undefined' || noise_effect_mainId === null) {
    noise_effect_mainId = mainId;
}
function ThreeOrbitControls(e) {
    function t(t, n) {
        function o() {
            return 2 * Math.PI / 60 / 60 * k.autoRotateSpeed;
        }function a() {
            return Math.pow(.95, k.zoomSpeed);
        }function i(e) {
            F.theta -= e;
        }function r(e) {
            F.phi -= e;
        }function s(t) {
            k.object instanceof e.PerspectiveCamera ? I /= t : k.object instanceof e.OrthographicCamera ? (k.object.zoom = Math.max(k.minZoom, Math.min(k.maxZoom, k.object.zoom * t)), k.object.updateProjectionMatrix(), K = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), k.enableZoom = !1);
        }function c(t) {
            k.object instanceof e.PerspectiveCamera ? I *= t : k.object instanceof e.OrthographicCamera ? (k.object.zoom = Math.max(k.minZoom, Math.min(k.maxZoom, k.object.zoom / t)), k.object.updateProjectionMatrix(), K = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), k.enableZoom = !1);
        }function u(e) {
            _.set(e.clientX, e.clientY);
        }function m(e) {
            J.set(e.clientX, e.clientY);
        }function d(e) {
            W.set(e.clientX, e.clientY);
        }function l(e) {
            B.set(e.clientX, e.clientY), G.subVectors(B, _);var t = k.domElement === document ? k.domElement.body : k.domElement;i(2 * Math.PI * G.x / t.clientWidth * k.rotateSpeed), r(2 * Math.PI * G.y / t.clientHeight * k.rotateSpeed), _.copy(B), k.update();
        }function h(e) {
            $.set(e.clientX, e.clientY), ee.subVectors($, J), ee.y > 0 ? s(a()) : ee.y < 0 && c(a()), J.copy($), k.update();
        }function p(e) {
            q.set(e.clientX, e.clientY), Q.subVectors(q, W), oe(Q.x, Q.y), W.copy(q), k.update();
        }function b(e) {}function E(e) {
            e.deltaY < 0 ? c(a()) : e.deltaY > 0 && s(a()), k.update();
        }function f(e) {
            switch (e.keyCode) {case k.keys.UP:
                    oe(0, k.keyPanSpeed), k.update();break;case k.keys.BOTTOM:
                    oe(0, -k.keyPanSpeed), k.update();break;case k.keys.LEFT:
                    oe(k.keyPanSpeed, 0), k.update();break;case k.keys.RIGHT:
                    oe(-k.keyPanSpeed, 0), k.update();}
        }function g(e) {
            _.set(e.touches[0].pageX, e.touches[0].pageY);
        }function v(e) {
            var t = e.touches[0].pageX - e.touches[1].pageX,
                n = e.touches[0].pageY - e.touches[1].pageY,
                o = Math.sqrt(t * t + n * n);J.set(0, o);
        }function O(e) {
            W.set(e.touches[0].pageX, e.touches[0].pageY);
        }function y(e) {
            B.set(e.touches[0].pageX, e.touches[0].pageY), G.subVectors(B, _);var t = k.domElement === document ? k.domElement.body : k.domElement;i(2 * Math.PI * G.x / t.clientWidth * k.rotateSpeed), r(2 * Math.PI * G.y / t.clientHeight * k.rotateSpeed), _.copy(B), k.update();
        }function w(e) {
            var t = e.touches[0].pageX - e.touches[1].pageX,
                n = e.touches[0].pageY - e.touches[1].pageY,
                o = Math.sqrt(t * t + n * n);$.set(0, o), ee.subVectors($, J), ee.y > 0 ? c(a()) : ee.y < 0 && s(a()), J.copy($), k.update();
        }function P(e) {
            q.set(e.touches[0].pageX, e.touches[0].pageY), Q.subVectors(q, W), oe(Q.x, Q.y), W.copy(q), k.update();
        }function T(e) {}function j(e) {
            if (!1 !== k.enabled) {
                if (e.preventDefault(), e.button === k.mouseButtons.ORBIT) {
                    if (!1 === k.enableRotate) return;u(e), Z = S.ROTATE;
                } else if (e.button === k.mouseButtons.ZOOM) {
                    if (!1 === k.enableZoom) return;m(e), Z = S.DOLLY;
                } else if (e.button === k.mouseButtons.PAN) {
                    if (!1 === k.enablePan) return;d(e), Z = S.PAN;
                }Z !== S.NONE && (document.addEventListener("mousemove", R, !1), document.addEventListener("mouseup", M, !1), k.dispatchEvent(U));
            }
        }function R(e) {
            if (!1 !== k.enabled) if (e.preventDefault(), Z === S.ROTATE) {
                if (!1 === k.enableRotate) return;l(e);
            } else if (Z === S.DOLLY) {
                if (!1 === k.enableZoom) return;h(e);
            } else if (Z === S.PAN) {
                if (!1 === k.enablePan) return;p(e);
            }
        }function M(e) {
            !1 !== k.enabled && (b(e), document.removeEventListener("mousemove", R, !1), document.removeEventListener("mouseup", M, !1), k.dispatchEvent(V), Z = S.NONE);
        }function L(e) {
            !1 === k.enabled || !1 === k.enableZoom || Z !== S.NONE && Z !== S.ROTATE || (e.preventDefault(), e.stopPropagation(), E(e), k.dispatchEvent(U), k.dispatchEvent(V));
        }function N(e) {
            !1 !== k.enabled && !1 !== k.enableKeys && !1 !== k.enablePan && f(e);
        }function A(e) {
            if (!1 !== k.enabled) {
                switch (e.touches.length) {case 1:
                        if (!1 === k.enableRotate) return;g(e), Z = S.TOUCH_ROTATE;break;case 2:
                        if (!1 === k.enableZoom) return;v(e), Z = S.TOUCH_DOLLY;break;case 3:
                        if (!1 === k.enablePan) return;O(e), Z = S.TOUCH_PAN;break;default:
                        Z = S.NONE;}Z !== S.NONE && k.dispatchEvent(U);
            }
        }function C(e) {
            if (!1 !== k.enabled) switch (e.preventDefault(), e.stopPropagation(), e.touches.length) {case 1:
                    if (!1 === k.enableRotate) return;if (Z !== S.TOUCH_ROTATE) return;y(e);break;case 2:
                    if (!1 === k.enableZoom) return;if (Z !== S.TOUCH_DOLLY) return;w(e);break;case 3:
                    if (!1 === k.enablePan) return;if (Z !== S.TOUCH_PAN) return;P(e);break;default:
                    Z = S.NONE;}
        }function x(e) {
            !1 !== k.enabled && (T(e), k.dispatchEvent(V), Z = S.NONE);
        }function H(e) {
            e.preventDefault();
        }this.object = t, this.domElement = void 0 !== n ? n : document, this.enabled = !0, this.target = new e.Vector3(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = .25, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, this.enableKeys = !0, this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 }, this.mouseButtons = { ORBIT: e.MOUSE.LEFT, ZOOM: e.MOUSE.MIDDLE, PAN: e.MOUSE.RIGHT }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this.getPolarAngle = function () {
            return z.phi;
        }, this.getAzimuthalAngle = function () {
            return z.theta;
        }, this.reset = function () {
            k.target.copy(k.target0), k.object.position.copy(k.position0), k.object.zoom = k.zoom0, k.object.updateProjectionMatrix(), k.dispatchEvent(D), k.update(), Z = S.NONE;
        }, this.update = function () {
            var n = new e.Vector3(),
                a = new e.Quaternion().setFromUnitVectors(t.up, new e.Vector3(0, 1, 0)),
                r = a.clone().inverse(),
                s = new e.Vector3(),
                c = new e.Quaternion();return function () {
                var e = k.object.position;return n.copy(e).sub(k.target), n.applyQuaternion(a), z.setFromVector3(n), k.autoRotate && Z === S.NONE && i(o()), z.theta += F.theta, z.phi += F.phi, z.theta = Math.max(k.minAzimuthAngle, Math.min(k.maxAzimuthAngle, z.theta)), z.phi = Math.max(k.minPolarAngle, Math.min(k.maxPolarAngle, z.phi)), z.makeSafe(), z.radius *= I, z.radius = Math.max(k.minDistance, Math.min(k.maxDistance, z.radius)), k.target.add(X), n.setFromSpherical(z), n.applyQuaternion(r), e.copy(k.target).add(n), k.object.lookAt(k.target), !0 === k.enableDamping ? (F.theta *= 1 - k.dampingFactor, F.phi *= 1 - k.dampingFactor) : F.set(0, 0, 0), I = 1, X.set(0, 0, 0), !!(K || s.distanceToSquared(k.object.position) > Y || 8 * (1 - c.dot(k.object.quaternion)) > Y) && (k.dispatchEvent(D), s.copy(k.object.position), c.copy(k.object.quaternion), K = !1, !0);
            };
        }(), this.dispose = function () {
            k.domElement.removeEventListener("contextmenu", H, !1), k.domElement.removeEventListener("mousedown", j, !1), k.domElement.removeEventListener("wheel", L, !1), k.domElement.removeEventListener("touchstart", A, !1), k.domElement.removeEventListener("touchend", x, !1), k.domElement.removeEventListener("touchmove", C, !1), document.removeEventListener("mousemove", R, !1), document.removeEventListener("mouseup", M, !1), window.removeEventListener("keydown", N, !1);
        };var k = this,
            D = { type: "change" },
            U = { type: "start" },
            V = { type: "end" },
            S = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5 },
            Z = S.NONE,
            Y = 1e-6,
            z = new e.Spherical(),
            F = new e.Spherical(),
            I = 1,
            X = new e.Vector3(),
            K = !1,
            _ = new e.Vector2(),
            B = new e.Vector2(),
            G = new e.Vector2(),
            W = new e.Vector2(),
            q = new e.Vector2(),
            Q = new e.Vector2(),
            J = new e.Vector2(),
            $ = new e.Vector2(),
            ee = new e.Vector2(),
            te = function () {
            var t = new e.Vector3();return function (e, n) {
                t.setFromMatrixColumn(n, 0), t.multiplyScalar(-e), X.add(t);
            };
        }(),
            ne = function () {
            var t = new e.Vector3();return function (e, n) {
                t.setFromMatrixColumn(n, 1), t.multiplyScalar(e), X.add(t);
            };
        }(),
            oe = function () {
            var t = new e.Vector3();return function (n, o) {
                var a = k.domElement === document ? k.domElement.body : k.domElement;if (k.object instanceof e.PerspectiveCamera) {
                    var i = k.object.position;t.copy(i).sub(k.target);var r = t.length();r *= Math.tan(k.object.fov / 2 * Math.PI / 180), te(2 * n * r / a.clientHeight, k.object.matrix), ne(2 * o * r / a.clientHeight, k.object.matrix);
                } else k.object instanceof e.OrthographicCamera ? (te(n * (k.object.right - k.object.left) / k.object.zoom / a.clientWidth, k.object.matrix), ne(o * (k.object.top - k.object.bottom) / k.object.zoom / a.clientHeight, k.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), k.enablePan = !1);
            };
        }();k.domElement.addEventListener("contextmenu", H, !1), k.domElement.addEventListener("mousedown", j, !1), k.domElement.addEventListener("wheel", L, !1), k.domElement.addEventListener("touchstart", A, !1), k.domElement.addEventListener("touchend", x, !1), k.domElement.addEventListener("touchmove", C, !1), window.addEventListener("keydown", N, !1), this.update();
    }return t.prototype = Object.create(e.EventDispatcher.prototype), t.prototype.constructor = t, Object.defineProperties(t.prototype, { center: { get: function get() {
                return console.warn("THREE.OrbitControls: .center has been renamed to .target"), this.target;
            } }, noZoom: { get: function get() {
                return console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."), !this.enableZoom;
            }, set: function set(e) {
                console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."), this.enableZoom = !e;
            } }, noRotate: { get: function get() {
                return console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."), !this.enableRotate;
            }, set: function set(e) {
                console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."), this.enableRotate = !e;
            } }, noPan: { get: function get() {
                return console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."), !this.enablePan;
            }, set: function set(e) {
                console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."), this.enablePan = !e;
            } }, noKeys: { get: function get() {
                return console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."), !this.enableKeys;
            }, set: function set(e) {
                console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."), this.enableKeys = !e;
            } }, staticMoving: { get: function get() {
                return console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."), !this.enableDamping;
            }, set: function set(e) {
                console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."), this.enableDamping = !e;
            } }, dynamicDampingFactor: { get: function get() {
                return console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."), this.dampingFactor;
            }, set: function set(e) {
                console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."), this.dampingFactor = e;
            } } }), t;
};

var simplexNoise = new SimplexNoise();

var Blob = function () {
    function Blob() {
        _classCallCheck(this, Blob);

        var geometry = new THREE.IcosahedronGeometry(30, 5);
        var material = new THREE.MeshStandardMaterial({
            color: '#ff0844',
            transparent: true,
            side: THREE.DoubleSide,
            alphaTest: 0.5,
            opacity: 1,
            roughness: 0.2
        });
        var image = document.createElement('img');
        var alphaMap = new THREE.Texture(image);

        image.onload = function () {
            return alphaMap.needsUpdate = true;
        };
        image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGUlEQVQoU2NkYGD4z4AHMP7//x+/gmFhAgCXphP14bko/wAAAABJRU5ErkJggg==';

        material.alphaMap = alphaMap;
        material.alphaMap.magFilter = THREE.NearestFilter;
        material.alphaMap.wrapT = THREE.RepeatWrapping;
        material.alphaMap.repeat.y = 1;

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.z = -Math.PI / 4;
    }

    Blob.prototype.update = function update(timeStamp) {
        var _this = this;

        // offset the texture
        this.mesh.material.alphaMap.offset.y = timeStamp * 0.00015;

        // apply simplex noise
        this.mesh.geometry.vertices.forEach(function (vertex) {
            var offset = _this.mesh.geometry.parameters.radius;
            var amp = 10;
            var time = Date.now();

            vertex.normalize();

            var noise = simplexNoise.noise3D(vertex.x + time * 0.0000007, vertex.y + time * 0.0000008, vertex.z + time * 0.0000009);

            var distance = offset + noise * amp;

            vertex.multiplyScalar(distance);
        });

        this.mesh.geometry.verticesNeedUpdate = true;
        this.mesh.geometry.normalsNeedUpdate = true;
        this.mesh.geometry.computeVertexNormals();
        this.mesh.geometry.computeFaceNormals();
    };

    return Blob;
}();

var OrbitControls = ThreeOrbitControls(THREE);

var scene = new THREE.Scene();
var aspectRatio = $('#'+noise_effect_mainId).width() / $('#'+noise_effect_mainId).height();
var camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.z = 80;

// Renderer
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize($('#'+noise_effect_mainId).width(), $('#'+noise_effect_mainId).height());
document.getElementById(noise_effect_mainId).appendChild(renderer.domElement);

// Controls
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableKeys = false;
controls.maxDistance = 5000.0;
controls.enableDamping = true;
controls.dampingFactor = 0.16;
controls.target.set(0, 0, 0);

// Lights
var ambientLight = new THREE.AmbientLight(0xffffff);
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-100, 20, 30);

camera.add(directionalLight);
scene.add(ambientLight, camera);

// Blob
var blob = new Blob(scene);
scene.add(blob.mesh);

function animate(timeStamp) {
    window.requestAnimationFrame(animate);

    blob.mesh.rotation.x += 0.001;
    blob.mesh.rotation.y += 0.001;

    blob.update(timeStamp);
    controls.update();
    renderer.render(scene, camera);
}

function onResize() {
    var _window = window;
    var innerWidth = $('#'+noise_effect_mainId).width();
    var innerHeight = $('#'+noise_effect_mainId).height();

    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', onResize); // eslint-disable-line no-use-before-define
animate();
})