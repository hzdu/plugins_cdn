// jQuery(function () {
// jQuery("form div.qty").append('<div class="outer-button"><div class="inc btnqty"><i class="fa fa-plus"></i></div><div class="dec btnqty"><i class="fa fa-minus"></i></div></div>');
// calculate();
// jQuery(".btnqty").click('click', function () {
// var $button = jQuery(this);
// var oldQty = $button.parent().parent().find("input").val();
// if ($button.html() == '<i class="fa fa-plus"></i>') {
// var newQty = parseFloat(oldQty) + 1;
// } else {
// Don't allow decrementing less than zero
// if (oldQty > 0) {
// var newQty = parseFloat(oldQty) - 1;
// } else {
// newQty = 0;
// }
// }
//
// $button.parent().parent().find("input").val(newQty);
// calculate();
// });
//
//
// function calculate() {
//
// alert(1);
// jQuery(".basket-tbl .wpItem").each(function () {
// var priceVal = jQuery(this).find('input.price').val();
// var qtyVal = jQuery(this).find("input.qty").val();
// var costVal = (priceVal * qtyVal);
// jQuery(this).find('input.cost').val((costVal).toFixed(2));
// });
//
// var subtotalVal = 0;
// jQuery('.cost').each(function () {
// subtotalVal += parseFloat(jQuery(this).val());
// });
// jQuery('.subtotal').val((subtotalVal).toFixed(2));
//
// $(".vat").val(((subtotalVal / 100) * 20).toFixed(2));
//
// var vatVal = ((subtotalVal / 100) * 20).toFixed(2);
// var total = parseFloat(subtotalVal) + parseFloat(vatVal);
// var total = parseFloat(subtotalVal);
// jQuery(".total").val((total).toFixed(2));
// }
//
// jQuery(".fa-trash-o").click(function () {
// jQuery(this).parent().parent().remove();
// calculate();
// });

//
// jQuery("#subtotal-form").submit(function (e) {
// e.preventDefault();
// cart.recalculate();
// jQuery.ajax({
// type: $(e.currentTarget).attr('method'),
// url: $(e.currentTarget).attr('action'),
// dataType: 'json',
// data: JSON.stringify(cart.data),
// success: function () {
// alert(JSON.stringify(cart.data));
// console.log(cart.data);
// },
// error: function () {
// alert(JSON.stringify(cart.data));
// console.log(cart.data);
// }
// });
// });
//
// });
