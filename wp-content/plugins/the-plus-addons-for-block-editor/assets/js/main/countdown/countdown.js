document.addEventListener('DOMContentLoaded', (event) => {
    tpcountDown(document)
  });
  
  function tpcountDown(doc){
    var allCount = doc.querySelectorAll('.tp-countdown');
    if(allCount){
      allCount.forEach( el => {
          var countData = JSON.parse(el.dataset.countdata);
  
          if (countData && countData.type && countData.type === 'normal') {
              if (countData.style && countData.style === 'style-1') {
                  WidgetCountDownHandler(countData.blockId);
              }
              if (countData.style && countData.style === 'style-2') {
                  styleFlipdown(countData.blockId);
              }
              if (countData.style && countData.style === 'style-3') {
                  styleProgressbar(countData.blockId);
              }
          }
      });
  }
  
  }
  
  /*Style 1*/
  function WidgetCountDownHandler(blockId) {
  
      var selector = document.querySelectorAll('.' + blockId + '.tp-countdown');
      if (selector) {
          theplus_countdown();
          selector.forEach( element => {
              element.addEventListener('change', function() {
                  theplus_countdown();
              });
          });           
          function theplus_countdown() {
              selector.forEach( element => {
                  var counterEl = element.querySelector('.tpgb-countdown-counter');
                  if(counterEl){
                      var attrthis = element,
                          timer1 = counterEl.dataset.time,
                          offset_timer = attrthis.dataset.offset,
                          text_days = attrthis.dataset.day,
                          text_hours = attrthis.dataset.hour,
                          text_minutes = attrthis.dataset.min,
                          text_seconds = attrthis.dataset.sec;
                          
                          if(timer1 && timer1 != '') {
                            downCount( attrthis, { date: timer1, offset: offset_timer, text_day:text_days, text_hour:text_hours, text_minute:text_minutes,text_second:text_seconds}, 
                            function () {
                                countdownExpiry(blockId)
                            });
                          }
                  }
              });
          }
      }
  };
  /*Style 1*/
  
  function styleFlipdown(blockId) {
    var future_unixtime_ms = ( document.querySelector('.' + blockId + ' .flipdown') ) ? document.querySelector('.' + blockId + ' .flipdown').dataset.time : '',
          blockData = document.querySelector('.' + blockId),
          offset = blockData.dataset.offset,
          day = blockData.dataset.day,
          hour = blockData.dataset.hour,
          minute = blockData.dataset.min,
          second = blockData.dataset.sec,
          theme = blockData.dataset.filptheme;
  
          day = (day != null) ? day : '';
          hour = (hour != null) ? hour : '';
          minute = (minute != null) ? minute : '';
          second = (second != null) ? second : '';
  
          if (future_unixtime_ms && future_unixtime_ms != null) {
              future_unixtime_ms = future_unixtime_ms - 3600 * offset;
              new FlipDown(future_unixtime_ms, blockId, {
                  theme: theme,
                  headings: [day, hour, minute, second]
              }).start().ifEnded(function() {
                  countdownExpiry(blockId);
              });
          }
  }
  
  /*Style 2*/
  /*Style 3*/
  function styleProgressbar(blockId) {
      var elements = document.getElementById('s' + blockId),
          elementm = document.getElementById('m' + blockId),
          elementh = document.getElementById('h' + blockId),
          elementd = document.getElementById('d' + blockId),
          param = { duration: 200, color: "#000000", trailColor: "#ddd", strokeWidth: 5, trailWidth: 3 };
  
          if (elements != null) {
              var seconds = new ProgressBar.Circle(elements, param),
                  minutes = new ProgressBar.Circle(elementm, param),
                  hours = new ProgressBar.Circle(elementh, param),
                  days = new ProgressBar.Circle(elementd, param);
  
      
              var blockData = document.querySelector('.' + blockId),
                  shortcode_date = blockData.querySelector('.tpgb-countdown-counter').dataset.time,
                  textDay = blockData.dataset.day,
                  textHour = blockData.dataset.hour,
                  textMin = blockData.dataset.min,
                  textSec = blockData.dataset.sec;
      
                  textDay = (textDay != null) ? textDay : '';
                  textHour = (textHour != null) ? textHour : '';
                  textMin = (textMin != null) ? textMin : '';
                  textSec = (textSec != null) ? textSec : '';
      
              var countInterval = setInterval(function() {
                  var now = new Date();
                  var countTo = new Date(shortcode_date);
                  var difference = countTo - now;
      
                  var day = Math.floor(difference / (60 * 60 * 1000 * 24) * 1);
                  days.animate(day / (day + 5), function() {
                      days.setText("<span class=\"number\">" + day + "</span>" + "<span class=\"label\">" + textDay + "</span>");
                  });
      
                  var hour = Math.floor((difference % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000) * 1);
                  hours.animate(hour / 24, function() {
                      hours.setText("<span class=\"number\">" + hour + "</span>" + "<span class=\"label\">" + textHour + "</span>");
                  });
      
                  var minute = Math.floor(((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1);
                  minutes.animate(minute / 60, function() {
                      minutes.setText("<span class=\"number\">" + minute + "</span>" + "<span class=\"label\">" + textMin + "</span>");
                  });
      
                  var second = Math.floor((((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1);
                  seconds.animate(second / 60, function() {
                      seconds.setText("<span class=\"number\">" + second + "</span>" + "<span class=\"label\">" + textSec + "</span>");
                  });
      
                  if (day + hour + minute + second == 0) {
                      countdownExpiry(blockId);
                      clearInterval(countInterval);
                  }
  
              }, 1000);
          }
  }
  /*Style 3*/
  
  /*counter Expired*/
  function countdownExpiry(blockId) {
      var blockData = document.querySelector('.' + blockId);
      if(blockData){
          var exData = JSON.parse(blockData.dataset.countdata)
  
          if (exData.expiry && exData.expiry === 'showmsg') {
              window.location.reload();
          }
      
          if (exData.expiry && exData.expiry === 'redirect') {
              var decodedUrl = decodeURIComponent(exData.redirect);
              window.location.href = decodedUrl;
          }
      }
  }
  /*counter Expired*/