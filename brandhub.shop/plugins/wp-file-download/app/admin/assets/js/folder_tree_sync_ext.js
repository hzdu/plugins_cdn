/**
 * Folder tree for WP Media Folder
 */
var wpfdFoldersTreeCategoriesModule;
(function ($) {
    wpfdFoldersTreeCategoriesModule = {
        categories: [], // categories

        /**
         * Retrieve the Jquery tree view element
         * of the current frame
         * @return jQuery
         */
        getTreeElement: function () {
            return $('#wpfd_localfoldertree_sync');
        },

        /**
         * Initialize module related things
         */
        initModule: function () {
            // Import categories from wpfd main module
            wpfdFoldersTreeCategoriesModule.importCategories();

            // Render the tree view
            wpfdFoldersTreeCategoriesModule.loadTreeView();
        },

        getchecked: function (folder_id, button) {
            $('#wpfd_localfoldertree_sync .media_checkbox').not(button).prop('checked', false);
            if ($(button).is(':checked')) {
                wpfdFoldersTreeCategoriesModule.renderCatID(folder_id);
            } else {
                wpfdFoldersTreeCategoriesModule.renderCatID(0);
            }
        },

        /**
         * Import categories from wpfd main module
         */
        importCategories: function () {
            var folders_ordered = wpfd_var.wpfd_categories;

            // Reorder array based on children
            var folders_ordered_deep = [];
            var processed_ids = [];
            var loadChildren = function (id) {
                if (processed_ids.indexOf(id) < 0) {
                    processed_ids.push(id);
                    for (var ij = 0; ij < folders_ordered.length; ij++) {
                        if (folders_ordered[ij].parent === id && folders_ordered[ij].cloudType === false) {
                            folders_ordered_deep.push(folders_ordered[ij]);
                            loadChildren(folders_ordered[ij].term_id);
                        }
                    }
                }
            };
            loadChildren(0);
            // Finally save it to the global var
            wpfdFoldersTreeCategoriesModule.categories = folders_ordered_deep;
        },

        /**
         * Render tree view inside content
         */
        loadTreeView: function () {
            wpfdFoldersTreeCategoriesModule.getTreeElement().html(wpfdFoldersTreeCategoriesModule.getRendering());
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
    
                while (ij < wpfdFoldersTreeCategoriesModule.categories.length) {
                    var className = 'closed';
                    if (wpfdFoldersTreeCategoriesModule.categories[ij + 1] && wpfdFoldersTreeCategoriesModule.categories[ij + 1].level > wpfdFoldersTreeCategoriesModule.categories[ij].level) {
                        className += ' directory-parent';
                    } else {
                        className += ' directory-no-arrow';
                    }
                    // Open li tag
                    content += '<li class="' + className + ' directory" data-id="' + wpfdFoldersTreeCategoriesModule.categories[ij].term_id + '" >';

                    var a_tag = '<a data-id="' + wpfdFoldersTreeCategoriesModule.categories[ij].term_id + '">';

                    if (wpfdFoldersTreeCategoriesModule.categories[ij + 1] && wpfdFoldersTreeCategoriesModule.categories[ij + 1].level > wpfdFoldersTreeCategoriesModule.categories[ij].level) { // The next element is a sub folder
                        content += '<a class="wpfd-folder-toggle" onclick="wpfdFoldersTreeCategoriesModule.toggle(' + wpfdFoldersTreeCategoriesModule.categories[ij].term_id + ')"><i class="material-icons wpfd-arrow">keyboard_arrow_down</i></a>';
                        content += a_tag;
                    } else {
                        content += a_tag;
                    }

                    content += '<input type="checkbox" class="media_checkbox" onclick="wpfdFoldersTreeCategoriesModule.getchecked(' + wpfdFoldersTreeCategoriesModule.categories[ij].term_id + ',  this)" data-id="' + wpfdFoldersTreeCategoriesModule.categories[ij].term_id + '" />';

                    // Add current category name
                    content += '<span class="wpfd-folder-toggle" onclick="wpfdFoldersTreeCategoriesModule.changeFolder(' + wpfdFoldersTreeCategoriesModule.categories[ij].term_id + ');wpfdFoldersTreeCategoriesModule.toggle(' + wpfdFoldersTreeCategoriesModule.categories[ij].term_id + ')">' + wpfdFoldersTreeCategoriesModule.categories[ij].name + '</span>';

                    content += '</a>';
                    // This is the end of the array
                    if (wpfdFoldersTreeCategoriesModule.categories[ij + 1] === undefined) {
                        // var's close all opened tags
                        for (var ik = wpfdFoldersTreeCategoriesModule.categories[ij].level; ik >= 0; ik--) {
                            content += '</li>';
                            content += '</ul>';
                        }

                        // We are at the end don't continue to process array
                        return false;
                    }

                    if (wpfdFoldersTreeCategoriesModule.categories[ij + 1].level > wpfdFoldersTreeCategoriesModule.categories[ij].level) { // The next element is a sub folder
                        // Recursively list it
                        ij++;
                        if (generateList() === false) {
                            // We have reached the end, var's recursively end
                            return false;
                        }
                    } else if (wpfdFoldersTreeCategoriesModule.categories[ij + 1].level < wpfdFoldersTreeCategoriesModule.categories[ij].level) { // The next element don't have the same parent
                        // var's close opened tags
                        for (var ik1 = wpfdFoldersTreeCategoriesModule.categories[ij].level; ik1 > wpfdFoldersTreeCategoriesModule.categories[ij + 1].level; ik1--) {
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
            wpfdFoldersTreeCategoriesModule.getTreeElement().find('li').removeClass('selected');

            // Select the folder
            wpfdFoldersTreeCategoriesModule.getTreeElement().find('li[data-id="' + folder_id + '"]').addClass('selected').// Open parent folders
            parents('.wpfd-folder-tree li.closed').removeClass('closed');
        },

        /**
         * Change the selected folder in tree view
         * @param folder_id
         */
        renderCatID: function (folder_id) {
            if (parseInt(folder_id) == 0) {
                $('.dir_name_category_id').val('');
                $('.dir_name_categories').val('');
            } else {
                var categories = wpfd_var.wpfd_categories_order;
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
                $('.dir_name_categories').val(breadcrumb_content);
                $('.dir_name_category_id').val(folder_id);
            }
        },

        /**
         * Toggle the open / closed state of a folder
         * @param folder_id
         */
        toggle: function (folder_id) {
            // Check is folder has closed class
            if (wpfdFoldersTreeCategoriesModule.getTreeElement().find('li[data-id="' + folder_id + '"]').hasClass('closed')) {
                // Open the folder
                wpfdFoldersTreeCategoriesModule.openFolder(folder_id);
            } else {
                // Close the folder
                wpfdFoldersTreeCategoriesModule.closeFolder(folder_id);
                // close all sub folder
                $('li[data-id="' + folder_id + '"]').find('li').addClass('closed');
            }
        },


        /**
         * Open a folder to show children
         */
        openFolder: function (folder_id) {
            wpfdFoldersTreeCategoriesModule.getTreeElement().find('li[data-id="' + folder_id + '"]').removeClass('closed');
        },

        /**
         * Close a folder and hide children
         */
        closeFolder: function (folder_id) {
            wpfdFoldersTreeCategoriesModule.getTreeElement().find('li[data-id="' + folder_id + '"]').addClass('closed');
        }
    };

    // var's initialize WPfd folder tree features
    $(document).ready(function () {
        wpfdFoldersTreeCategoriesModule.initModule();
    });
})(jQuery);