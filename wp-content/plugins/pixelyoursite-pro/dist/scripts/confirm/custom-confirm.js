$(document).ready(function(){
    function search(array, value) {
        value = value.toString().toLowerCase();
        return array.filter(function (o) {
            return Object.keys(o).some(function (k) {
                return o[k].toString().toLowerCase().indexOf(value) !== -1;
            });
        });
    }

    $('button[type="submit"]').on('click', function(e){
        console.log($(this).val())
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
                    content: 'This dialog will automatically trigger \'No!\' in 10 seconds if you don\'t respond.',
                    type: 'red',
                    typeAnimated: true,
                    autoClose: 'cancelAction|10000',
                    buttons: {
                        deleteEvent: {
                            text: 'Yes, delete selected event',
                            btnClass: 'btn-red',
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
    $('.remove-custom-event').on('click', function(e){
        e.preventDefault();
        var _this = $(this);
        $.confirm({
            title: 'Delete event?',
            content: 'This dialog will automatically trigger \'No!\' in 10 seconds if you don\'t respond.',
            type: 'red',
            typeAnimated: true,
            autoClose: 'cancelAction|10000',
            buttons: {
                deleteEvent: {
                    text: 'Yes, delete it',
                    btnClass: 'btn-red',
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

});