/**Post Listing*/
document.addEventListener('DOMContentLoaded', (event) => {
    tppostList(document);
});
function tppostList(doc){

    let dyHcntAll = doc.querySelectorAll(".tpgb-post-listing.dynamic-style-1");
    if (dyHcntAll) {
        dyHcntAll.forEach(function(dyAll) {
            let dyListcnt = dyAll.querySelectorAll(".dynamic-list-content");
            if(dyListcnt){
                dyListcnt.forEach(function(el) {
                    el.addEventListener("mouseenter", function(e) {
                        let postHcnt = e.currentTarget.querySelector(".tpgb-post-hover-content")
                        slideDownP(postHcnt, 300)
                    });
                    el.addEventListener("mouseleave", function(e) {
                        let postHcnt = e.currentTarget.querySelector(".tpgb-post-hover-content")
                        slideUpP(postHcnt, 300)
                    });
                });
            }
        });
    }
}