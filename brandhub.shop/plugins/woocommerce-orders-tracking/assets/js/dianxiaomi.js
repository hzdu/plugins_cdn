jQuery(document).ready(function ($) {
    'use strict';
    let $couriers = $('#couriers'), $couriers_select = $('#couriers_select'),
        couriers_mapping = woo_orders_tracking_dianxiaomi.dianxiaomi_courier_mapping,
        courier_mapping_rows = '', dianxiaomi_couriers = woo_orders_tracking_dianxiaomi.dianxiaomi_couriers,
        carriers_selection = '<option value=""></option>', dianxiaomi_get_couriers = get_couriers();
    if (woo_orders_tracking_dianxiaomi.carriers.length > 0) {
        for (let i in woo_orders_tracking_dianxiaomi.carriers) {
            carriers_selection += `<option value="${woo_orders_tracking_dianxiaomi.carriers[i]['slug']}">${woo_orders_tracking_dianxiaomi.carriers[i]['name']}</option>`;
        }
    }
    if (dianxiaomi_couriers.length > 0) {
        for (let i in dianxiaomi_couriers) {
            courier_mapping_rows += `<tr><td>${dianxiaomi_find_carrier_name(dianxiaomi_couriers[i])}</td><td><select name="dianxiaomi_courier_mapping[${dianxiaomi_couriers[i]}]">${carriers_selection}</select></td></tr>`;
        }
    }
    console.log(dianxiaomi_couriers);
    console.log(woo_orders_tracking_dianxiaomi);
    let $table = $(`<table class="widefat fixed striped" style="margin: 10px 0">
<thead>
<tr>
<th>Dianxiaomi courier</th>
<th>Woo Orders Tracking carrier</th>
</tr>
</thead>
<tbody>${courier_mapping_rows}</tbody>
</table>`);
    $table.insertAfter($couriers);

    for (let i in couriers_mapping) {
        $(`select[name="dianxiaomi_courier_mapping[${i}]"]`).val(couriers_mapping[i]).trigger('change');
    }
    $couriers_select.on('change', function () {
        let couriers_select = $couriers_select.val();
        if (couriers_select.length > dianxiaomi_couriers.length) {

            for (let i in couriers_select) {
                if (dianxiaomi_couriers.indexOf(couriers_select[i]) === -1) {
                    console.log(couriers_select[i])
                    let $carriers_selection = $(`<select name="dianxiaomi_courier_mapping[${couriers_select[i]}]">${carriers_selection}</select>`);
                    $table.find('tbody').append(`<tr><td>${dianxiaomi_find_carrier_name(couriers_select[i])}</td><td>${$carriers_selection.get(0).outerHTML}</td></tr>`);
                    dianxiaomi_couriers.push(couriers_select[i])
                    break;
                }
            }
        } else {
            for (let i in dianxiaomi_couriers) {
                if (couriers_select.indexOf(dianxiaomi_couriers[i]) === -1) {
                    console.log(dianxiaomi_couriers[i])
                    $table.find(`select[name="dianxiaomi_courier_mapping[${dianxiaomi_couriers[i]}]"]`).closest('tr').remove();
                    dianxiaomi_couriers.splice(i, 1);
                    break;
                }
            }
        }
        console.log(dianxiaomi_couriers)
    });

    function dianxiaomi_find_carrier_name(slug) {
        let name = '';
        if (slug) {
            for (let i in dianxiaomi_get_couriers) {
                if (slug === dianxiaomi_get_couriers[i]['slug']) {
                    name = dianxiaomi_get_couriers[i]['name'];
                    break;
                }
            }

        }
        return name;
    }
});