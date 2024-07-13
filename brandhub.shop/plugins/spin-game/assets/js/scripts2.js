(function () {
    var btn = $("#pointer"),
        options = {};

    options.gifts = {
        1: {
            id: "1",
            name: "$100",
            angleStart: -30,
            angleEnd: 30,
            tips: "You just hit the jackpot!",
            probability: 0.99,
        },
        2: {
            id: "2",
            name: "$50",
            angleStart: 31,
            angleEnd: 90,
            tips: "Congratulations! You have been awarded a $50 coupon!",
            probability: 0.0,
        },
        3: {
            id: "3",
            name: "$30",
            angleStart: 91,
            angleEnd: 150,
            tips: "Congratulations! You have been awarded a $30 coupon!",
            probability: 0.0,
        },
        4: {
            id: "4",
            name: "$10",
            angleStart: 151,
            angleEnd: 210,
            tips: "Congratulations! You have been awarded a $10 coupon!",
            probability: 0.0,
        },
        5: {
            id: "5",
            name: "$20",
            angleStart: 211,
            angleEnd: 270,
            tips: "Congratulations! You have been awarded a $20 coupon!",
            probability: 0.0,
        },
        6: {
            id: "6",
            name: "Thanks for participating.",
            angleStart: 271,
            angleEnd: 330,
            tips: "I'm sorry you didn't win. Don't be discouraged.",
            probability: 0.01,
        },
    };

    var spinSound = document.getElementById("spinSound");
    var endSound = document.getElementById("endSound");

    function selectGiftByProbability() {
        var rand = Math.random();
        var sum = 0;
        for (var key in options.gifts) {
            sum += options.gifts[key].probability;
            if (rand < sum) {
                return key;
            }
        }
        return "6";
    }

    function getRandom(n, m) {
        return Math.floor(Math.random() * (m - n + 1) + n);
    }

    function showOverlay(text) {
        document.getElementById("result-text").innerText = text;
        document.getElementById("overlay").style.display = "block";
    }

    var isSpinning = false;

    function _begin() {
        if (isSpinning) return;

        isSpinning = true;
        var base = 2160;
        var selectedGift = selectGiftByProbability();
        var result = getRandom(
            options.gifts[selectedGift].angleStart,
            options.gifts[selectedGift].angleEnd
        );

        var deg = base + result;

        spinSound.currentTime = 0;
        spinSound.play();

        $(".part2").css({
            transform: "rotate(" + deg + "deg)",
        });
        $(".part2").one("transitionend", function () {
            // console.log("Selected gift: " + options.gifts[selectedGift].name);
            // console.log("Angle: " + result);

            spinSound.pause();
            endSound.currentTime = 0;
            endSound.play();

            showOverlay(options.gifts[selectedGift].tips);
            isSpinning = false;
        });
    }

    // 将 _begin 函数的定义提升至全局作用域
    window._begin = _begin;

    btn.on("click", _begin);
})();

function closeOverlay() {
    spinSound.pause();
    spinSound.currentTime = 0;
    endSound.pause();
    endSound.currentTime = 0;

    document.getElementById("overlay").style.display = "none";
    document.getElementById("spingamecanvans").style.display = "none"; // 隐藏按钮
    $(".part2").css({
        transition: "none",
        transform: "rotate(0deg)",
    });
    $(".part2")[0].offsetHeight;
    $(".part2").css({
        transition: "transform 10.5s",
    });
}

document.querySelector(".getitnow").addEventListener("click", function (event) {
    event.preventDefault(); // 阻止默认行为
    closeOverlay(); // 调用关闭弹窗的函数
    setTimeout(function () {
        window.location.href = "/my-account"; // 在弹窗关闭后跳转
    }, 500); // 延迟时间，可以根据过渡动画的持续时间调整
});

$(document).ready(function () {
    // 给 .show-f-spingame 添加点击事件
    $(".show-f-spingame").on("click", function () {
        // 获取屏幕尺寸
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        // 获取 spingamecanvans 的尺寸
        var spingamecanvansWidth = $("#spingamecanvans").outerWidth();
        var spingamecanvansHeight = $("#spingamecanvans").outerHeight();

        // 计算 spingamecanvans 应该出现的位置
        var leftPosition = (windowWidth - spingamecanvansWidth) / 2;
        var topPosition = (windowHeight - spingamecanvansHeight) / 2;

        // 将 spingamecanvans 移动到屏幕中央并显示它
        $("#spingamecanvans").css({
            position: "fixed",
            top: topPosition,
            left: leftPosition,
            "z-index": 999999,
            display: "block",
        });

        // 添加背景遮罩层以突出显示 spingamecanvans
        $("body").append('<div id="spingame-overlay"></div>');
        $("#spingame-overlay").css({
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            "background-color": "rgba(0, 0, 0, 0.8)",
            "z-index": 999998,
            "pointer-events": "none", // 禁止遮罩层下的元素接收鼠标事件
        });

        // 为遮罩层添加点击事件，以便关闭 spingamecanvans 和遮罩层
        $("#spingame-overlay").on("click", function () {
            $("#spingamecanvans").hide();
            $("#spingame-overlay").remove();
        });

        // setTimeout(window._begin, 1000);
    });
});

document.querySelector(".close-button").addEventListener("click", function () {
    document.getElementById("spinButton").style.display = "none";
});
