jQuery(document).ready(function($) {
    // 替换显示不正的图片链接
    jQuery('img').each(function() {
        var oldUrl = 'https://i890.net/brandhub.shop/uploads/2023/12/Zhoujo-1.webp';
        var newUrl = 'https://veeink.oss-accelerate.aliyuncs.com/brandhub.shop/uploads/2023/12/Zhoujo-1.webp';
        var currentUrl = jQuery(this).attr('src');
        if (currentUrl && currentUrl.indexOf(oldUrl) !== -1) {
            var newUrl = currentUrl.replace(oldUrl, newUrl);
            jQuery(this).attr('src', newUrl);
        }
    });
});
