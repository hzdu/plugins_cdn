(function($) {

  'use strict';

  let hotInstance;

  $(document).ready(function() {

    'use strict';

    initHot();

    bindEventListeners();

  });

  function initHot() {

    'use strict';

    let hotData,
        daimContainer;

    //initialize an empty table
    hotData = [
      ['Keyword', 'Target', 'Title'],
    ];

    for (let i = 0; i < parseInt(window.objectL10n.wizardRows, 10); i++) {
      hotData.push(['', '', '']);
    }

    //Instantiate the handsontable table
    daimContainer = document.getElementById('daim-table');
    hotInstance = new window.Handsontable(daimContainer,
        {

          //set the table data
          data: hotData,

          //set the new maximum number of rows and columns
          maxRows: parseInt(window.objectL10n.wizardRows, 10) + 1,
          maxCols: 3,

        });

    hotInstance.updateSettings({
      cells: function(row, col) {

        let cellProperties = {};

        if (row === 0 && (col === 0 || col === 1 || col === 2)) {
          cellProperties.readOnly = true;
          cellProperties.disableVisualSelection = true;
        }

        return cellProperties;

      },
    });

  }

  function bindEventListeners() {

    'use strict';

    $(document.body).on('click', '#generate-autolinks' , function(event){

      'use strict';

      event.preventDefault();

      generateAutolinks();

    });

  }

  function generateAutolinks() {

    'use strict';

    let name,
        category_id,
        rawTableData,
        tableData = [];

    name = $('#name').val();
    category_id = parseInt($('#category-id').val(), 10);

    //Remove first row from the array (because it includes the labels of the hot table)
    rawTableData = hotInstance.getData().slice(1);

    //Keep only the rows where the keyword and the target are present
    for(let key1 in rawTableData){
      if(rawTableData[key1][0] !== '' && rawTableData[key1][0] !== ''){
        tableData.push(rawTableData[key1]);
      }
    }

    //Convert the resulting JSON value to a JSON string
    tableData = JSON.stringify(tableData);

    //prepare ajax request
    let data = {
      'action': 'daim_wizard_generate_ail',
      'security': window.daim_nonce,
      'name': name,
      'category_id': category_id,
      'table_data': tableData,
    };

    //set ajax in synchronous mode
    $.ajaxSetup({async: false});

    //send ajax request
    $.post(window.daim_ajax_url, data, function(result) {

      'use strict';

      if (result === 'invalid name') {

        //reload the dashboard menu
        window.location.replace(window.daim_admin_url + 'admin.php?page=daim-wizard&invalid_name=1');

      } else {

        //reload the dashboard menu
        window.location.replace(window.daim_admin_url + 'admin.php?page=daim-wizard&result=' + result);

      }

    });

    //set ajax in asynchronous mode
    $.ajaxSetup({async: true});

  }

}(window.jQuery));