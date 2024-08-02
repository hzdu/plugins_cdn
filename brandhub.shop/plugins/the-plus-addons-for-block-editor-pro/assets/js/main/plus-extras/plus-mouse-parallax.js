/*MouseMove Parallax*/
document.addEventListener('DOMContentLoaded', () => {
    tpmoPrlx(document)
});

function tpmoPrlx(doc){
    let mParX = doc.querySelectorAll('.tpgb-mouse-parallax');
    if (mParX) {
        mParX.forEach(function (mp) {
            mp.addEventListener('mouseleave', function (event) {
                let parMove = event.currentTarget.querySelector('.tpgb-parallax-move');
                TweenLite.to(parMove, 0.9, { x: 0, y: 0 });
            });
            mp.addEventListener('mousemove', function (e) {
                let parMove = e.currentTarget.querySelector('.tpgb-parallax-move');
                var speedX = parMove.dataset.speedx;
                var speedY = parMove.dataset.speedy;
                TweenLite.to(parMove, 0.5, { x: -((e.clientX - (window.innerWidth / 2)) / speedX), y: -((e.clientY - (window.innerHeight / 2)) / speedY) });
            });
        });
    }
}