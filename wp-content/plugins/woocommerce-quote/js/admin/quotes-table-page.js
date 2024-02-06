"use strict"; 
jQuery(document).ready(function()
{
	jQuery(document).on('change', '.wcqt-filter-status', wcqt_filter_by_status); 
   
});
function wcqt_filter_by_status(event)
{
 var catFilter = jQuery(this).val();
    
     document.location.href = 'admin.php?page=woocommerce-quote-quotes-table-page&status-filter='+catFilter;    
    
}