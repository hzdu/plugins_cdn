/**
 * Folder tree for WP File Download
 */
var wpfdFoldersTreeListingModule;
(function ($) {
    wpfdFoldersTreeListingModule = {
        categories: [], // categories

        /**
         * Retrieve the Jquery tree view element
         * of the current frame
         * @return jQuery
         */
        getTreeElement: function () {
            return $('#wpfd_email_categories');
        },

        /**
         * Initialize module related things
         */
        initModule: function () {
            // Import categories from wpfd main module
            wpfdFoldersTreeListingModule.importCategories();

            // Render the tree view
            wpfdFoldersTreeListingModule.loadTreeView();
        },

        getchecked: function (folder_id, button) {
            $('#wpfd_email_categories .media_checkbox').not(button).prop('checked', false);
            if ($(button).is(':checked')) {
                wpfdFoldersTreeListingModule.renderCatID(folder_id);
            } else {
                wpfdFoldersTreeListingModule.renderCatID(0);
            }
        },

        /**
         * Import categories from wpfd main module
         */
        importCategories: function () {
            var folders_ordered = wpfd_var.wpfd_categories;

            if (folders_ordered) {
                folders_ordered.forEach(function (ele, i) {
                    // Convert cloud ids
                    if (ele.cloudType !== false && typeof (ele.wp_term_id) !== 'undefined' && typeof (ele.wp_parent) !== 'undefined') {
                        folders_ordered[i].term_id = ele.wp_term_id;
                        folders_ordered[i].parent = ele.wp_parent;
                    }

                    // Correct cloud parent id
                    if (ele.cloudType !== false && ele.parent === false) {
                        folders_ordered[i].parent = 0;
                    }
                });
            }

            // Reorder array based on children
            var folders_ordered_deep = [];
            var processed_ids = [];
            var loadChildren = function (id) {
                if (processed_ids.indexOf(id) < 0) {
                    processed_ids.push(id);
                    for (var ij = 0; ij < folders_ordered.length; ij++) {
                        if (folders_ordered[ij].parent === id) {
                            folders_ordered_deep.push(folders_ordered[ij]);
                            loadChildren(folders_ordered[ij].term_id);
                        }
                    }
                }
            };
            loadChildren(0);
            // Finally save it to the global var
            wpfdFoldersTreeListingModule.categories = folders_ordered_deep;
        },

        /**
         * Render tree view inside content
         */
        loadTreeView: function () {
            wpfdFoldersTreeListingModule.getTreeElement().html(wpfdFoldersTreeListingModule.getRendering());
        },

        /**
         * Get the html resulting tree view
         * @return {string}
         */
        getRendering: function () {
            var ij = 0;
            var content = '<p>'+wpfd_admin.label_sync_wpfd+'</p>'; // Final tree view content
            /**
             * Recursively print list of folders
             * @return {boolean}
             */
            var generateList = function generateList() {
                content += '<ul class="jaofiletree">';

                while (ij < wpfdFoldersTreeListingModule.categories.length) {
                    var className = 'closed';
                    if (wpfdFoldersTreeListingModule.categories[ij + 1] && wpfdFoldersTreeListingModule.categories[ij + 1].level > wpfdFoldersTreeListingModule.categories[ij].level) {
                        className += ' directory-parent';
                    } else {
                        className += ' directory-no-arrow';
                    }
                    // Open li tag
                    content += '<li class="' + className + ' directory" data-id="' + wpfdFoldersTreeListingModule.categories[ij].term_id + '" >';

                    var a_tag = '<a data-id="' + wpfdFoldersTreeListingModule.categories[ij].term_id + '">';

                    if (wpfdFoldersTreeListingModule.categories[ij + 1] && wpfdFoldersTreeListingModule.categories[ij + 1].level > wpfdFoldersTreeListingModule.categories[ij].level) { // The next element is a sub folder
                        content += '<a class="wpfd-folder-toggle" onclick="wpfdFoldersTreeListingModule.toggle(' + wpfdFoldersTreeListingModule.categories[ij].term_id + ')"><i class="material-icons wpfd-arrow">keyboard_arrow_down</i></a>';
                        content += a_tag;
                    } else {
                        content += a_tag;
                    }

                    content += '<input type="checkbox" class="media_checkbox" onclick="wpfdFoldersTreeListingModule.getchecked(' + wpfdFoldersTreeListingModule.categories[ij].term_id + ',  this)" data-id="' + wpfdFoldersTreeListingModule.categories[ij].term_id + '" />';

                    // Add current category name
                    content += '<span class="wpfd-folder-toggle" onclick="wpfdFoldersTreeListingModule.changeFolder(' + wpfdFoldersTreeListingModule.categories[ij].term_id + ');wpfdFoldersTreeListingModule.toggle(' + wpfdFoldersTreeListingModule.categories[ij].term_id + ')">' + wpfdFoldersTreeListingModule.categories[ij].name + '</span>';

                    content += '</a>';
                    // This is the end of the array
                    if (wpfdFoldersTreeListingModule.categories[ij + 1] === undefined) {
                        // var's close all opened tags
                        for (var ik = wpfdFoldersTreeListingModule.categories[ij].level; ik >= 0; ik--) {
                            content += '</li>';
                            content += '</ul>';
                        }

                        // We are at the end don't continue to process array
                        return false;
                    }

                    if (wpfdFoldersTreeListingModule.categories[ij + 1].level > wpfdFoldersTreeListingModule.categories[ij].level) { // The next element is a sub folder
                        // Recursively list it
                        ij++;
                        if (generateList() === false) {
                            // We have reached the end, var's recursively end
                            return false;
                        }
                    } else if (wpfdFoldersTreeListingModule.categories[ij + 1].level < wpfdFoldersTreeListingModule.categories[ij].level) { // The next element don't have the same parent
                        // var's close opened tags
                        for (var ik1 = wpfdFoldersTreeListingModule.categories[ij].level; ik1 > wpfdFoldersTreeListingModule.categories[ij + 1].level; ik1--) {
                            content += '</li>';
                            content += '</ul>';
                        }

                        // We're not at the end of the array var's continue processing it
                        return true;
                    }

                    // Close the current element
                    content += '</li>';
                    ij++;
                }
            };

            // Start generation
            generateList();
            return content;
        },

        /**
         * Change the selected folder in tree view
         * @param folder_id
         */
        changeFolder: function (folder_id) {
            // Remove previous selection
            wpfdFoldersTreeListingModule.getTreeElement().find('li').removeClass('selected');

            // Select the folder
            wpfdFoldersTreeListingModule.getTreeElement().find('li[data-id="' + folder_id + '"]').addClass('selected').// Open parent folders
            parents('.wpfd-folder-tree li.closed').removeClass('closed');
        },

        /**
         * Change the selected folder in tree view
         * @param folder_id
         */
        renderCatID: function (folder_id) {
            if (parseInt(folder_id) == 0) {
                $('.dir_name_category').val('');
                $('.dir_name_category').attr('data-id_category', 0);
            } else {
                var categories = wpfd_var.wpfd_email_categories_order;
                var category = categories[folder_id];
                var breadcrumb_content = '';

                // Ascend until there is no more parent
                while (parseInt(category.parent) !== 0) {
                    // Generate breadcrumb element
                    breadcrumb_content = '/' + categories[category.term_id].name + breadcrumb_content;

                    // Get the parent
                    category = categories[categories[category.term_id].parent];
                }

                if (parseInt(category.term_id) !== 0) {
                    breadcrumb_content = categories[category.term_id].name + breadcrumb_content;
                }

                breadcrumb_content = '/' + breadcrumb_content;
                $('.dir_name_category').val(breadcrumb_content);
                $('.dir_name_category').attr('data-id_category', folder_id);
            }
        },

        /**
         * Toggle the open / closed state of a folder
         * @param folder_id
         */
        toggle: function (folder_id) {
            // Check is folder has closed class
            if (wpfdFoldersTreeListingModule.getTreeElement().find('li[data-id="' + folder_id + '"]').hasClass('closed')) {
                // Open the folder
                wpfdFoldersTreeListingModule.openFolder(folder_id);
            } else {
                // Close the folder
                wpfdFoldersTreeListingModule.closeFolder(folder_id);
                // close all sub folder
                $('li[data-id="' + folder_id + '"]').find('li').addClass('closed');
            }
        },


        /**
         * Open a folder to show children
         */
        openFolder: function (folder_id) {
            wpfdFoldersTreeListingModule.getTreeElement().find('li[data-id="' + folder_id + '"]').removeClass('closed');
        },

        /**
         * Close a folder and hide children
         */
        closeFolder: function (folder_id) {
            wpfdFoldersTreeListingModule.getTreeElement().find('li[data-id="' + folder_id + '"]').addClass('closed');
        }
    };

    // var's initialize WPfd folder tree features
    $(document).ready(function () {
        wpfdFoldersTreeListingModule.initModule();
    });
})(jQuery);