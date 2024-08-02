document.addEventListener("DOMContentLoaded", function () {
    tpproBar(document); 
  });
  
  function tpproBar(doc){
    let progressbar = doc.querySelectorAll(".tpgb-progress-bar");
  
    if (progressbar) {
        progressbar.forEach(function (pb) {
            if (!pb.classList.contains("tpgb-piechart")) {
                var pbskill = pb.querySelector(".progress-bar-skill-bar-filled"),
                    width = pbskill.dataset.width;
                var waypoint = new Waypoint({
                    element: pb,
                    handler: function (direction) {
                        if (direction === "down") {
                            if (!pb.classList.contains("done-progress")) {
                                pbskill.style.width = width;
                                let pbLarge = pb.querySelector(".progress-bar-media.large");
                                if(pbLarge) {
                                    pbLarge.style.width = width;
                                }
                                pb.classList.add("done-progress");
                            }
                        }
                    },
                    offset: "90%",
                });
            }
        });
    }
  }
  