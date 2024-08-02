var tpSplineViewer = false;
var loadSplineView = function loadSplineView() {
  if (tpSplineViewer === true) {
    return;
  }
  tpSplineViewer = true;

    if(tpgbsplinesrc && tpgbsplinesrc.src){
    setTimeout(() => {
      var tpgbsplineviewerJs = document.createElement("script");
      tpgbsplineviewerJs.src = tpgbsplinesrc.src;
      tpgbsplineviewerJs.id = 'tpgb-spline3d-js';
      tpgbsplineviewerJs.type="module",
      document.body.appendChild(tpgbsplineviewerJs),
      tpgbsplineviewerJs.onload=()=>{
            let svLoad = document.querySelectorAll('.tpgb-sv-loading');
            if(svLoad){
                svLoad.forEach((sv)=>{
                    sv.style.display = 'none';
                })
            }
        }
    }, 150);
  }
};
document.body.addEventListener("mouseover", loadSplineView, {once: true});
document.body.addEventListener("touchmove", loadSplineView, {once: true});
window.addEventListener("scroll", loadSplineView, {once: true});
document.body.addEventListener("keydown", loadSplineView, {once: true});