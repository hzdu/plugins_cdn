$(document).ready(function(){
    function search(array, value) {
        value = value.toString().toLowerCase();
        return array.filter(function (o) {
            return Object.keys(o).some(function (k) {
                return o[k].toString().toLowerCase().indexOf(value) !== -1;
            });
        });
    }

    $('.bulk-events-delete').on('click', function(e){
        e.preventDefault();
        var _this_form = $(this).closest('form');
        var data_form = _this_form.serializeArray();
        if(_this_form.find('input[name="'+$(this).attr('name')+'"]').length == 0)
        {
            _this_form.append('<input type="hidden" name="'+$(this).attr('name')+'" value="'+$(this).val()+'">');
        }
        else
        {
            _this_form.find('input[name="'+$(this).attr('name')+'"]').val($(this).val());
        }
        if(search(data_form,'pys[selected_events][]').length > 0)
        {
            if($(this).val() == 'delete')
            {
                $.confirm({
                    title: 'Delete selected events?',
                    content: '<p>This dialog will automatically trigger \'No!\' in 10 seconds if you don\'t respond.</p>',
                    type: 'pys',
                    typeAnimated: true,
                    autoClose: 'cancelAction|10000',
                    buttons: {
                        deleteEvent: {
                            text: 'Yes, delete it',
                            btnClass: 'btn-pys btn-pys-red',
                            action: function () {
                                _this_form.submit()
                            }
                        },
                        cancelAction: {
                            text: 'No!'
                        }
                    }
                });
            }
            else
            {
                _this_form.submit()
            }
        }


    });

    $('.edit-event button#pys-save-settings').on('click', function(e){

        e.preventDefault();
        var _this_form = $(this).closest('#pys').find('form');
        var data_form = _this_form.serializeArray();
        var triggerTypeValue = '';
        var formTriggerTypes = ['CF7', 'fluentform', 'formidable', 'forminator', 'gravity', 'ninjaform', 'wpforms', 'wsform'];
        for (var i = 0; i < data_form.length; i++) {
            if (data_form[i].name === 'pys[event][trigger_type]' && formTriggerTypes.includes(data_form[i].value)) {
                triggerTypeValue = data_form[i].value;
                break;
            }
        }

        console.log(triggerTypeValue, data_form)

        if (triggerTypeValue) {
            var save_form = false;
            for (var j = 0; j < data_form.length; j++) {
                var name = data_form[j].name;
                if (name.indexOf('pys[event][' + triggerTypeValue + '][forms][]') !== -1) {
                    save_form = true;
                    break;
                }
            }
            if (!save_form) {
                $.confirm({
                    title: 'Forms for trigger type ' + triggerTypeValue +' is empty!',
                    content: '<p>You need to select at least one form for this trigger.</p>',
                    type: 'pys',
                    typeAnimated: true,
                    autoClose: 'cancelAction|10000',
                    buttons: {
                        cancelAction: {
                            text: 'Close',
                        }
                    }
                });
            } else {
                _this_form.submit();
            }
        }
    });
    $('.remove-custom-event').on('click', function(e){
        e.preventDefault();
        var _this = $(this);
        $.confirm({
            title: 'Delete event?',
            content: '<p>This dialog will automatically trigger \'No!\' in 10 seconds if you don\'t respond.</p>',
            type: 'pys',
            typeAnimated: true,
            autoClose: 'cancelAction|10000',
            buttons: {
                deleteEvent: {
                    text: 'Yes, delete it',
                    btnClass: 'btn-pys btn-pys-red',
                    action: function () {
                        location.href = _this.attr('href');
                    }
                },
                cancelAction: {
                    text: 'No!'
                }
            }
        });
    });


    $('.deleting_form button[type="submit"]').on('click', function(e){
        e.preventDefault();
        var _this_form = $(this).closest('form');
        var data_form = _this_form.serializeArray();

        $.confirm({
            boxWidth: '500px',
            useBootstrap: false,
            title: 'Warning: please confirm deletion of statistics records',
            content: '<p>Please verify the accuracy of the period for which you are deleting records. Be aware that once deleted, the data cannot be recovered. Proceed with caution.</p>',
            type: 'pys',
            typeAnimated: true,
            autoClose: 'cancelAction|10000',
            buttons: {
                deleteEvent: {
                    text: 'Yes, delete statistics records',
                    btnClass: 'btn-pys btn-pys-red',
                    action: function () {
                        _this_form.submit()
                    }
                },
                cancelAction: {
                    text: 'No!'
                }
            }
        });
    });


    $('button.restore-settings').on('click', function(e){

        console.log('restore-settings');

        e.preventDefault();
        var _this_form = $(this).closest('form');
        var data_form = _this_form.serializeArray();
        var _this = $(this);

        $.confirm({
            title: _this.data('title'),
            content: '<p>'+_this.data('content')+'</p>',
            type: 'pys',
            typeAnimated: true,
            autoClose: 'cancelAction|10000',
            buttons: {
                resetAction: {
                    text: _this.data('button-yes'),
                    btnClass: 'btn-pys btn-pys-red',
                    action: function () {
                        _this_form.submit()
                    }
                },
                cancelAction: {
                    text: _this.data('button-no'),
                }
            }
        });
    });
});