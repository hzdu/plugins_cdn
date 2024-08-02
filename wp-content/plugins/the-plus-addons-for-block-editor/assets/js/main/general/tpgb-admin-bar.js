(function () {
	"use strict";
	document.addEventListener('DOMContentLoaded', function () {
		var tpgb_adminBar = {
			init: function () {
				this.createMenu(TpgbAdminbar);
				var tpgbEditAdmin = document.getElementById('wp-admin-bar-tpgb_edit_template');
				
				if (tpgbEditAdmin) {
					tpgbEditAdmin.classList.add('menupop');
					tpgbEditAdmin.addEventListener('mouseenter', function() {
						this.classList.add('hover');
					});
					tpgbEditAdmin.addEventListener('mouseleave', function() {
						this.classList.remove('hover');
					});
				}
			},
			createMenu : function(admnBar){
				var tempList = '',
					otherList = '';
				if(admnBar!=''){
					var data = admnBar.tpgb_edit_template
					if(data){
						data.forEach(function(item) {
                            var type = (item.post_type == 'nxt_builder') ? item.nexter_type : item.post_type_name;
                            if (item.post_type == 'nxt_builder') {
                                tempList += '<li id="wp-admin-bar-' + item.id + '" class="tpgb-admin-submenu tpgb-admin-' + item.id + '">';
                                tempList += '<a class="ab-item tpgb-admin-sub-item" href="' + item.edit_url + '" >';
                                tempList += '<span class="tpgb-admin-item-title">' + item.title + '</span><span class="tpgb-admin-item-type">' + type + '</span>';
                                tempList += '</a>';
                                tempList += '</li>';
                            } else {
                                otherList += '<li id="wp-admin-bar-' + item.id + '" class="tpgb-admin-submenu tpgb-admin-' + item.id + '">';
                                otherList += '<a class="ab-item tpgb-admin-sub-item" href="' + item.edit_url + '" >';
                                otherList += '<span class="tpgb-admin-item-title">' + item.title + '</span><span class="tpgb-admin-item-type">' + type + '</span>';
                                otherList += '</a>';
                                otherList += '</li>';
                            }
                        });
					}
				}
				var nxtList = '',
					loopList = '';
				if(otherList){
					loopList = '<ul id="wp-admin-bar-tpgb_edit_template" class="ab-submenu">'+otherList+'</ul>';
				}
				if(tempList){
					nxtList = '<ul id="wp-admin-bar-tpgb_edit_template" class="ab-submenu tpgb-edit-nexter">'+tempList+'</ul>';
				}
				if (tempList || otherList) {
                    var itemList = '<div class="ab-sub-wrapper">' + tempList + otherList + '</div>';
                    var tpgbEditTemplate = document.querySelector('.tpgb_edit_template');
                    if (tpgbEditTemplate) {
                        tpgbEditTemplate.insertAdjacentHTML('beforeend', itemList);
                    }
                } else {
                    var wpAdminBarTpgbEditTemplate = document.getElementById('wp-admin-bar-tpgb_edit_template');
                    if (wpAdminBarTpgbEditTemplate) {
                        wpAdminBarTpgbEditTemplate.style.display = 'none';
                    }
                }
			},
		}
		tpgb_adminBar.init();
	});
})();
