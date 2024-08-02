document.addEventListener("DOMContentLoaded", function() {
    tpdataTable(document);
});

function tpdataTable(doc) {
    let tdiv = doc.querySelectorAll('.tpgb-table-wrapper');

    if (tdiv.length) {
        tdiv.forEach(function(ele) {
            let tableDiv = ele.querySelector('.tpgb-table'),
                tanleData = tableDiv.dataset;

            if( tableDiv ) {
                    new simpleDatatables.DataTable( tableDiv, {
                        sortable: tanleData.sortTable == 'yes' ? true : false,
                        searchable: false,
                        perPageSelect: false,
                        labels: {
                            info: '',
                        },
                    });

                window.addEventListener("load", function() {
                    s(tableDiv);
                });
                window.addEventListener("resize", function() {
                    s(tableDiv);
                });

                if(tableDiv.querySelector('thead tr') != null){
                    tableDiv.querySelector('thead tr').classList.add('tpgb-table-row')
                }
            }
        });
    }
}

function s(tDiv) {
    if (window.innerWidth > 767) {
        tDiv.classList.add("tpgb-column-rules");
        tDiv.classList.remove("tpgb-no-column-rules");
    } else {
        tDiv.classList.remove("tpgb-column-rules");
        tDiv.classList.add("tpgb-no-column-rules");
    }
}