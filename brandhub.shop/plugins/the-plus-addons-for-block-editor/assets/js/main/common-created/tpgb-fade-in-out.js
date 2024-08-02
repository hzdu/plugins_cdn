function fadeInP(element, duration = 300) {
  element.style.display = "block";
  var opacity = 0;
  var intervalId = setInterval(function () {
      if (opacity < 1) {
          opacity += 0.1;
          element.style.opacity = Math.min(opacity, 1);
      } else {
          clearInterval(intervalId);
      }
  }, duration / 10);
}

function fadeOutP(element, duration = 300) {
  var opacity = 1;
  var intervalId = setInterval(function () {
      if (opacity > 0) {
          opacity -= 0.1;
          element.style.opacity = Math.max(opacity, 0);
      } else {
          clearInterval(intervalId);
          element.style.display = "none";
      }
  }, duration / 10);
}
