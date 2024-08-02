function CircleProgress(options) {
    this.init(options);
}

CircleProgress.prototype = {
    value: 0,
    size: 100,
    startAngle: -Math.PI,
    thickness: "auto",
    fill: {
        gradient: ["#3aeabb", "#fdd250"]
    },
    emptyFill: "rgba(0, 0, 0, .1)",
    animation: {
        duration: 1200,
        easing: function(a, b, c, d) {
            return c * (b /= d) * b + a;
        }
    },
    animationStartValue: 0,
    reverse: false,
    lineCap: "butt",
    constructor: CircleProgress,
    el: null,
    canvas: null,
    ctx: null,
    radius: 0,
    arcFill: null,
    lastFrameValue: 0,
    init: function(options) {
        Object.assign(this, options);
        this.radius = this.size / 2;
        this.initWidget();
        this.initFill();
        this.draw();
    },
    initWidget: function() {
        var canvas = this.canvas = this.canvas || document.createElement("canvas");
        canvas.width = this.size;
        canvas.height = this.size;
        this.ctx = canvas.getContext("2d");
        let getCanvas = this.el.querySelectorAll('canvas');
        if(getCanvas){
            getCanvas.forEach((can)=>{
                can.remove();
            })
        }
        if (this.el) {
            this.el.appendChild(canvas);
        }
    },  
    
    initFill: function() {
        var self = this;
        var ctx = this.ctx;
        var size = this.size;
        var fill = this.fill;
        var thickness = this.thickness;
        var radius = this.radius;
        var image;
        
        function drawImage() {
            var patternCanvas = document.createElement("canvas");
            patternCanvas.width = size;
            patternCanvas.height = size;
            var patternCtx = patternCanvas.getContext("2d");
            patternCtx.drawImage(image, 0, 0, size, size);
            self.arcFill = ctx.createPattern(patternCanvas, "no-repeat");
            self.drawFrame(self.lastFrameValue);
        }

        if (!fill) {
            throw new Error("The fill is not specified!");
        }

        if (fill.color) {
            this.arcFill = fill.color;
        }

        if (fill.gradient) {
            var gradient = fill.gradient;
            if (gradient.length === 1) {
                this.arcFill = gradient[0];
            } else if (gradient.length > 1) {
                var gradientAngle = fill.gradientAngle || 0;
                var gradientDirection = fill.gradientDirection || [
                    size / 2 * (1 - Math.cos(gradientAngle)),
                    size / 2 * (1 + Math.sin(gradientAngle)),
                    size / 2 * (1 + Math.cos(gradientAngle)),
                    size / 2 * (1 - Math.sin(gradientAngle))
                ];
                var linearGradient = ctx.createLinearGradient.apply(ctx, gradientDirection);
                for (var i = 0; i < gradient.length; i++) {
                    var colorStop = gradient[i];
                    var stopPosition = i / (gradient.length - 1);
                    if (Array.isArray(colorStop)) {
                        stopPosition = colorStop[1];
                        colorStop = colorStop[0];
                    }
                    linearGradient.addColorStop(stopPosition, colorStop);
                }
                this.arcFill = linearGradient;
            }
        }

        if (fill.image) {
            image = fill.image instanceof Image ? fill.image : new Image();
            image.onload = drawImage;
            image.src = fill.image;
            if (image.complete) {
                drawImage();
            }
        }
    },
    draw: function() {
        if (this.animation) {
            var ctx = this.ctx;
            var size = this.size;
            ctx.clearRect(0, 0, size, size);
            this.drawEmptyArc();
            this.drawAnimated(this.value);
        } else {
            this.drawFrame(this.value);
        }
    },
    drawFrame: function(value) {
        this.lastFrameValue = value;
        var reverse = this.reverse;
        if (reverse) {
            this.drawArcReverse(value);
        } else {
            this.drawArc(value);
        }
    },
    drawArcReverse: function(value) {
        var ctx = this.ctx;
        var radius = this.radius;
        var startAngle = this.startAngle;
        var thickness = this.getThickness();
        var arcFill = this.arcFill;
        ctx.save();
        ctx.beginPath();
        ctx.arc(radius, radius, radius - thickness / 2, startAngle, startAngle - Math.PI * 2 * value, true); // Drawing arc in reverse direction
        ctx.lineWidth = thickness;
        ctx.lineCap = this.lineCap;
        ctx.strokeStyle = arcFill;
        ctx.stroke();
        ctx.restore();
    },
    drawArc: function(value) {
        var ctx = this.ctx;
        var radius = this.radius;
        var startAngle = this.startAngle;
        var thickness = this.getThickness();
        var arcFill = this.arcFill;
        ctx.save();
        ctx.beginPath();
        ctx.arc(radius, radius, radius - thickness / 2, startAngle, startAngle + Math.PI * 2 * value);
        ctx.lineWidth = thickness;
        ctx.lineCap = this.lineCap;
        ctx.strokeStyle = arcFill;
        ctx.stroke();
        ctx.restore();
    },
    drawEmptyArc: function() {
        var ctx = this.ctx;
        var radius = this.radius;
        var startAngle = this.startAngle;
        var thickness = this.getThickness();
        var emptyFill = this.emptyFill;
        ctx.save();
        ctx.beginPath();
        ctx.arc(radius, radius, radius - thickness / 2, startAngle, startAngle + Math.PI * 2 * 1);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = emptyFill;
        ctx.stroke();
        ctx.restore();
    },
    drawAnimated: function(value) {
        var self = this;
        var el = this.el;
        var startValue = this.animationStartValue || 0;
        var animation = this.animation;
        var easing = animation.easing;
        var duration = animation.duration;
        var startTime = new Date().getTime();
        var endTime = startTime + duration;
        var requestAnimationFrame = window.requestAnimationFrame || function(callback) {
            setTimeout(callback, 1000 / 60);
        };

        function animateFrame() {
            var now = new Date().getTime();
            var progress = Math.min((duration ? (now - startTime) / duration : 1), 1);
            var currentValue = easing(startValue, value, progress, 1);
            self.drawFrame(currentValue);
            if (progress === 1) {
                el.dispatchEvent(new Event("circle-animation-end"));
            } else {
                requestAnimationFrame(animateFrame);
            }
        }

        el.dispatchEvent(new Event("circle-animation-start"));
        animateFrame();
    },
    getThickness: function() {
        return typeof this.thickness === "number" ? this.thickness : this.size / 14;
    },
    getValue: function() {
        return this.value;
    },
    setValue: function(value) {
        if (this.animation) {
            this.animationStartValue = this.lastFrameValue;
        }
        this.value = value;
        this.draw();
    }
};

(function() {
    var defaults = CircleProgress.defaults = CircleProgress.prototype;
    var easing = CircleProgress.easing = {};

    easing.circleProgressEasing = function(startValue, endValue, progress) {
        return startValue + (endValue - startValue) * progress;
    };

    function circleProgress(options) {
        var elements = document.querySelectorAll(options.selector);
        elements.forEach(function(element) {
            var circleProgress = element.circleProgress;
            var settings = typeof options === "string" ? {} : options;

            if (circleProgress) {
                circleProgress.init(settings);
            } else {
                var data = Object.assign({}, element.dataset);
                if (typeof data.fill === "string") {
                    data.fill = JSON.parse(data.fill);
                }
                if (typeof data.animation === "string") {
                    data.animation = JSON.parse(data.animation);
                }
                settings = Object.assign(data, settings);
                settings.el = element;
                circleProgress = new CircleProgress(settings);
                element.circleProgress = circleProgress;
            }
        });
    }

    window.circleProgress = circleProgress;
})();