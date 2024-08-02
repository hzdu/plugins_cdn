document.addEventListener("DOMContentLoaded", function() {
    tpdataTable(document);
});

function tpdataTable(doc) {
    let tdiv = doc.querySelectorAll('.tpgb-table-wrapper');

    if (tdiv.length) {
        tdiv.forEach(function(ele) {
            let tableDiv = ele.querySelector('.tpgb-table'),
                tanleData = tableDiv.dataset;
            new simpleDatatables.DataTable( tableDiv, {
                sortable: tanleData.sortTable == 'yes' ? true : false,
                searchable: tanleData.searchable == 'yes' ? true : false,
                perPageSelect: tanleData.showEntry == 'yes' ?  [5, 10, 15, ['All' , -1]]: false,
                labels: {
                    searchtxt: tanleData.searchableLabel,
                    info: '',
                    perPage: "entries",
                },
				perPage: tanleData.showEntry == 'yes' ?  5 : 500,
            });
           
            window.addEventListener("load", function() {
                s(tableDiv);
            });
            window.addEventListener("resize", function() {
                s(tableDiv);
            });
            
            // Add Class in table header row
           if(tableDiv.querySelector('thead tr') != null){
                tableDiv.querySelector('thead tr').classList.add('tpgb-table-row')
           }

            if (ele.querySelector('.datatable-search') !== null) {
                var searchElement = ele.querySelector('.datatable-search');
                searchElement.classList.add('tpgb-tbl-search-wrapper', 'tpgb-table-info');
            }
            if (ele.querySelector('.datatable-dropdown') !== null) {
                var searchElement = ele.querySelector('.datatable-dropdown');
                searchElement.classList.add('tpgb-tbl-entry-wrapper', 'tpgb-table-info');
            }

            if ( ele.querySelectorAll('.tpgb-table-info').length ) {
                var elements =  ele.querySelectorAll('.tpgb-table-info')
                var wrapper = document.createElement('div');
                wrapper.classList.add('tpgb-advance-heading');
                for (var i = 0; i < elements.length; i++) {
                    var currentElement = elements[i];
                    if (currentElement.parentNode !== wrapper) {
                        currentElement.parentNode.insertBefore(wrapper, currentElement);
                        wrapper.appendChild(currentElement);
                    }
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