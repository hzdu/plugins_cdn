function initSorting() {
    jQuery('.orderingCol').click(function (e) {
        e.preventDefault();
        var ordering = jQuery(this).data('ordering');
        var direction = jQuery(this).data('direction');
        ajaxSearch(ordering, direction);
    });

    jQuery(".list-results #limit").change(function (e) {
        e.preventDefault();
        jQuery('[name="limit"]').val(jQuery(this).val());
        ajaxSearch();
        return false;
    });
}

function initTags() {
    var $ = jQuery;
    if ($(".input_tags").length > 0) {
        var taglist = $(".input_tags").val();
        var tagArr = taglist.split(",");
        $('.chk_ftags').each(function () {
            var temp = $(this).val();
            if (tagArr.indexOf(temp) > -1) {
                $(this).prop('checked', true);
            }
        });
    }
    if ($("#filter_catid").length > 0) {
        catChange("filter_catid");
    }
}
function showDefautTags() {
    var $ = jQuery;
    if (typeof defaultAllTags !== 'undefined' && defaultAllTags.length > 0) {
        $('.chk-tags-filtering ul').empty();
        defaultAllTags.sort(function (a, b) {
            if (a > b) {
                return 1
            }
            if (a < b) {
                return -1
            }
            return 0;
        });
        var checklable1 = $('<label class="labletags">' + wpfdvars.msg_filter_by_tags + '</label>');
        $('.chk-tags-filtering ul').append(checklable1);
        $.each(defaultAllTags, function (index, tag) {
            var key = 'wpfd'+tag.replace(/-/g, '');
            var element = $('<li class="tags-item"><span> '+ tagsLabel[key] +' </span> <input title="" type="checkbox" name="chk_ftags[]" onclick="fillInputTags();" class="ju-input chk_ftags" id="ftags' + index + '" value="' + tag + '"></li>');
            $('.chk-tags-filtering ul').append(element);
        });
        $(".input_tags").val("");
        selectdChecktags();
    }
}
function catChange(filterCat) {
    var $ = jQuery;
    var catId = $("#" + filterCat).val();
    var catType = $("#" + filterCat).attr('data-cattype');
    var catSlug = $("#" + filterCat).attr('data-slug');
    if (!catType) {
        catType = 'default';
    }
    if (!catSlug) {
        catSlug = '';
    }

    if (parseInt(catId) === 0) {
        if (typeof availTags !== 'undefined' && availTags.length > 0) {
            $('.chk-tags-filtering ul').empty();
            $.each(availTags, function (index, value) {
                var tagKey = value['id'];
                var tagLabel = value['label'];
                var tagVal = value['value'];
                var element = $('<li class="tags-item"><span> '+ tagLabel +' </span> <input title="" type="checkbox" name="chk_ftags[]" class="ju-input chk_ftags" id="ftags' + tagKey + '" value="' + tagVal + '"></li>');
                $('.chk-tags-filtering ul').append(element);
            });
            $(".input_tags").val("");
            selectdChecktags();
        }
        showDefautTags();
        $('.chk_ftags').parent().show();
        return;
    }
    if ($('.chk-tags-filtering ul').length === 0) {
        return;
    }

    $.ajax({
        type: "GET",
        url: wpfdajaxurl + "task=search.getTagByCatId",
        data: {
            catId: catId,
            catType: catType,
            catSlug: catSlug
        }
    }).done(function (tags) {
        if(tags === '0') {
            $('.chk-tags-filtering ul').empty();
            var message = $('<li>' + wpfdvars.msg_no_tag_in_this_category_found + '</li>');
            $('.chk-tags-filtering ul').append(message);
            $(".input_tags").val("");
        } else {
            if (tags.success === true) {
                $('.chk-tags-filtering ul').empty();
                $.each(tags.tags, function (index, tag) {
                    var element = $('<li class="tags-item"><input title="" type="checkbox" name="chk_ftags[]" onclick="fillInputTags();" class="ju-input chk_ftags" id="ftags' + index + '" value="' + tag['name'] + '"> <span>' + tag['name'].replace(/-/g, ' ') + '</span></li>');
                    $('.chk-tags-filtering ul').append(element);
                });
                $(".input_tags").val("");
                selectdChecktags();
            } else {
                $('.chk-tags-filtering ul').empty();
                var message = $('<li>' + tags.message + '</li>');
                $('.chk-tags-filtering ul').append(message);
                $(".input_tags").val("");
            }
        }
    });
}

function fillInputTags() {
    var tagVal = [];
    jQuery('.chk_ftags').each(function () {
        if (this.checked && jQuery(this).is(":visible")) {
            tagVal.push(jQuery(this).val());
        }
    });
    if (tagVal.length > 0) {
        jQuery(".input_tags").val(tagVal.join(","));
    } else {
        jQuery(".input_tags").val("");
    }
}

function getSearchParams(k) {
    var p = {};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (s, k, v) {
        p[k] = v
    });
    return k ? p[k] : p;
}

function ajaxSearch(ordering, direction, pushState = true) {
    var $ = jQuery;
    var sform = $("#adminForm");
    var filterType = ($(sform).find('select[name=extension]').length && $(sform).find('select[name=extension]').val() !== null) ? true : false;
    var isTypeFilter = (filterType && $(sform).find('select[name=extension]').val() !== '0') ? true : false;
    var isFromWeightFilter = ($(sform).find('input[name=from_weight]').length
        && $(sform).find('input[name=from_weight]').val() !== '' && $(sform).find('input[name=from_weight]').val() !== 'NaN') ? true : false;
    var isFromWeightUnitFilter = ($(sform).find('select[name=from_weight_unit]').length && $(sform).find('select[name=from_weight_unit]').val() !== 'kb') ? true : false;
    var isToWeightFilter = ($(sform).find('input[name=to_weight]').length
        && $(sform).find('input[name=to_weight]').val() !== '' && $(sform).find('input[name=to_weight]').val() !== 'NaN') ? true : false;
    var isToWeightUnitFilter = ($(sform).find('select[name=to_weight_unit]').length && $(sform).find('select[name=to_weight_unit]').val() !== 'kb') ? true : false;
    var $key = $(sform).find('input[name=q]').val();
    var $placeholder = $(sform).find('input[name=q]').attr('placeholder');

    // Avoid conflict key search
    if ($key.toString() === $placeholder.toString()) {
        $key = '';
    }

    // Get the form data
    var formData = {
        'q': $key,
        'catid': $(sform).find('[name=catid]').val(),
        'exclude': $(sform).find('[name=exclude]').val(),
        'theme': $(sform).find('[name=theme]').val(),
        'limit': $(sform).find('[name=limit]').val(),
        'ftags': $(sform).find('input[name=ftags]').val(),
        'cfrom': $(sform).find('input[name=cfrom]').val(),
        'cto': $(sform).find('input[name=cto]').val(),
        'ufrom': $(sform).find('input[name=ufrom]').val(),
        'uto': $(sform).find('input[name=uto]').val()
    };

    if (isTypeFilter) {
        formData.type = $(sform).find('select[name=extension]').val().join(',');
    }

    if (isFromWeightFilter) {
        formData.wfrom = $(sform).find('input[name=from_weight]').val();
    }

    if (isFromWeightUnitFilter) {
        formData.wfromunit = $(sform).find('select[name=from_weight_unit]').val();
    }

    if (isToWeightFilter) {
        formData.wto = $(sform).find('input[name=to_weight]').val();
    }

    if (isToWeightUnitFilter) {
        formData.wtounit = $(sform).find('select[name=to_weight_unit]').val();
    }

    formData = cleanObj(formData);

    if (jQuery.isEmptyObject(formData) ||
        (typeof (formData.q) === 'undefined' &&
            typeof (formData.ftags) === 'undefined' &&
            typeof (formData.cfrom) === 'undefined' &&
            typeof (formData.cto) === 'undefined' &&
            typeof (formData.ufrom) === 'undefined' &&
            typeof (formData.uto) === 'undefined' &&
            typeof (formData.type) === 'undefined' &&
            typeof (formData.wfrom) === 'undefined' &&
            typeof (formData.wto) === 'undefined' &&
            typeof (formData.catid) !== 'undefined' &&
            parseInt(formData.catid) === 0)) {
        $("#txtfilename").focus();
        return false;
    }

    if (isFromWeightFilter && formData.wfrom !== '') {
        if (parseInt(formData.wfrom) < 0) {
            alert('Weight from is positive integer.');
            return false;
        }

        switch (formData.wfromunit) {
            case 'mb':
                formData.wfrom = parseFloat(formData.wfrom) * 1024 * 1024;
                break;
            case 'gb':
                formData.wfrom = parseFloat(formData.wfrom) * 1024 * 1024 * 1024;
                break;
            default:
                formData.wfrom = parseFloat(formData.wfrom) * 1024;
                break;
        }
    }

    if (isToWeightFilter && formData.wto !== '') {
        if (parseInt(formData.wto) < 0) {
            alert('Weight to is positive integer.');
            return false;
        }

        switch (formData.wtounit) {
            case 'mb':
                formData.wto = parseFloat(formData.wto) * 1024 * 1024;
                break;
            case 'gb':
                formData.wto = parseFloat(formData.wto) * 1024 * 1024 * 1024;
                break;
            default:
                formData.wto = parseFloat(formData.wto) * 1024;
                break;
        }
    }

    if (isFromWeightFilter && formData.wfrom !== '' && isToWeightFilter && formData.wto !== ''
        && parseFloat(formData.wfrom) > parseFloat(formData.wto)) {
        alert('Weight from must be less than weight to.');
        return false;
    }

    if ((typeof ordering !== 'undefined') && ordering) formData.ordering = ordering;
    if ((typeof direction !== 'undefined') && direction) formData.dir = direction;

    // Pagination
    if (pushState) {
        var filter_url = jQuery.param(formData);
        var currentUrl = window.location.search;
        var pushUrl;
        if (typeof URLSearchParams !== 'undefined') {
            var currentFilters = new URLSearchParams(currentUrl.substring(1));
            Object.keys(formData).forEach(function (key) {
                if (currentFilters.has(key)) {
                    currentFilters.delete(key);
                }
            });
            if (currentUrl.substring(1) === '?' && currentFilters.toString() !== '') {
                pushUrl = currentFilters.toString() + '&' + filter_url;

            } else {
                pushUrl = '?' + filter_url;
            }

            window.history.pushState(formData, "", pushUrl);
        }
    }

    window.ajax_search_handler = $.ajax({
        method: "POST",
        url: wpfdajaxurl + "task=search.display",
        data: formData,
        beforeSend: function () {
            $("#wpfd-results").html('');
            $("#wpfd-results").prepend($("#loader").clone().show());
            $("#wpfd_search_file_suggestion").html('');
            $("#wpfd_search_file_suggestion").fadeOut(300);
            $('#Search_container .wpfd-icon-search').show();
            $('#Search_container .wpfd-icon-search-loading').hide();
        },
        success: function (result) {
            $("#wpfd_search_file_suggestion").html('');
            $("#wpfd_search_file_suggestion").fadeOut(300);

            if (parseInt(wpfdvars.downloadSelected) === 1) {
                var dls_contents = '<div class="wpfd-search-result-download-files-section">';
                dls_contents += '<a type="button" id="search_download_selected_btn" class="search-download-selected" style="display: none">';
                dls_contents += 'Download Selected <i class="zmdi zmdi-check-all wpfd-download-category"></i></a>';
                dls_contents += '<input type="hidden" id="search_result_download_selected_list" />';
                dls_contents += '<input type="hidden" id="search_result_download_selected_file_with_category_list" /></div>';
                result = dls_contents + result;
            }

            $("#wpfd-results").html(result);
            initSorting();
            if (typeof wpfdColorboxInit !== 'undefined') {
                wpfdColorboxInit();
            }
            preSearchDownloadSelectedFiles();
            searchDownloadSelectedFiles();

            if ($('#wpfd-results .cbox_file_download').length) {
                $('#wpfd-results .cbox_file_download').addClass('search-download-checkbox');
            }

            window.ajax_search_handler = null;

            $('#Search_container .wpfd-icon-search').show();
            $('#Search_container .wpfd-icon-search-loading').hide();

            // Safe actions
            if (typeof formData.theme !== "undefined" && formData.theme === 'ggd') {
                wpfdSearchGGDThemeActions();
            }
        }
    });
}

function makeFileSuggestion(ordering, direction, pushState = true) {
    var $ = jQuery;
    var sform = $("#adminForm");
    var $placeholder = '<div id="wpfd_file_suggestion_placeholder"></div>';
    var $keySearch = $(sform).find('input[name=q]').val();

    // Check key search valid for making file suggestion
    if ($keySearch.length < 3) {
        return;
    }

    // Get the form data
    var formData = {
        'q': $keySearch,
        'catid': $(sform).find('[name=catid]').val(),
        'exclude': $(sform).find('[name=exclude]').val(),
        'make_file_suggestion': '1'
    };

    formData = cleanObj(formData);

    if ((typeof ordering !== 'undefined') && ordering) {
        formData.ordering = ordering;
    }

    if ((typeof direction !== 'undefined') && direction) {
        formData.dir = direction;
    }

    // Do not make file suggestion when searching
    if (window.ajax_search_handler !== null) {
        return;
    }

    // Kill file suggestion ajax is running
    var prevFileSuggestionAjax = window.file_suggestion_ajax_on_search;

    if (prevFileSuggestionAjax !== null) {
        prevFileSuggestionAjax.abort();
    }

    window.file_suggestion_ajax_on_search = $.ajax({
        method: "POST",
        url: wpfdajaxurl + "task=search.display",
        data: formData,
        beforeSend: function () {
            var $placeholder = '<div class="ph-item"><div class="ph-col-12"><div class="ph-picture"></div><div class="ph-row"><div class="ph-col-6 big"></div><div class="ph-col-4 empty big"></div><div class="ph-col-2 big"></div><div class="ph-col-4"></div><div class="ph-col-8 empty"></div><div class="ph-col-6"></div><div class="ph-col-6 empty"></div><div class="ph-col-12"></div></div></div></div>';
            $("#wpfd_search_file_suggestion").html('');
            $("#wpfd_search_file_suggestion").append($placeholder).fadeIn('slow');
            $("#wpfd_search_file_suggestion").addClass('placeholder');
            $('#Search_container .wpfd-icon-search').hide();
            $('#Search_container .wpfd-icon-search-loading').show();
            $('#txtfilename').addClass('is-file-suggestion');
        },
        success: function (result) {
            $("#wpfd_search_file_suggestion").html(result);
            $("#wpfd_search_file_suggestion").removeClass('placeholder');
            $('#Search_container .wpfd-icon-search').show();
            $('#Search_container .wpfd-icon-search-loading').hide();

            if ($("#wpfd_search_file_suggestion .table").length) {
                $("#wpfd_search_file_suggestion .table thead").remove();
                $("#wpfd_search_file_suggestion .table .file_desc").remove();
                $("#wpfd_search_file_suggestion .table .wpfd_checkbox").remove();
                $("#wpfd_search_file_suggestion .table .file_version").remove();
                $("#wpfd_search_file_suggestion .table .file_size").remove();
                $("#wpfd_search_file_suggestion .table .file_hits").remove();
                $("#wpfd_search_file_suggestion .table .file_created").remove();
                $("#wpfd_search_file_suggestion .wpfd-num").remove();
                $("#wpfd_search_file_suggestion .table .wpfd-file-link").attr('href', '');
                $("#wpfd_search_file_suggestion").fadeIn('slow').slideDown('slow');

                $("#wpfd_search_file_suggestion .table td.file_title").on('click', function (e) {
                    e.preventDefault();
                    var selected_file_name = $(this).find('.wpfd-file-link').attr('title');
                    if (selected_file_name && selected_file_name !== '') {
                        $('#txtfilename').val(selected_file_name);
                        ajaxSearch();
                        $('#wpfd_search_file_suggestion').fadeOut(300);
                        $('#txtfilename').removeClass('is-file-suggestion');

                        return false;
                    }
                });

                $("#wpfd_search_file_suggestion .protected-title").on('click', function (e) {
                    e.preventDefault();
                    var selected_file_name = $(this).attr('title');
                    if (selected_file_name && selected_file_name !== '') {
                        $('#txtfilename').val(selected_file_name);
                        ajaxSearch();
                        $('#wpfd_search_file_suggestion').fadeOut(300);
                        $('#txtfilename').removeClass('is-file-suggestion');

                        return false;
                    }
                });
            } else {
                // Return default search
                $('#txtfilename').removeClass('is-file-suggestion');
                $("#wpfd_search_file_suggestion").fadeOut(300);
            }

            if (typeof wpfdColorboxInit !== 'undefined') {
                wpfdColorboxInit();
            }

            // Close suggestion list on click outside
            $(document).click(function(e) {
                var $target = $(e.target);
                if((!$target.closest('#wpfd_search_file_suggestion').length && $('#wpfd_search_file_suggestion').is(":visible"))
                    && (!$target.closest('#txtfilename').length && !$target.closest('.categories-filtering-selection').length && $('#wpfd_search_file_suggestion').is(":visible"))) {
                    $('#wpfd_search_file_suggestion').hide();
                    $('#txtfilename').removeClass('is-file-suggestion');
                }
            });
        }
    });
}

function openSearchfilter(evt, searchName) {
    evt.preventDefault();

    var $ = jQuery;
    var $this = $(evt.target);

    $this.parent().find('.tablinks').removeClass('active');
    $this.addClass('active');

    $this.parent().parent().find('.wpfd_tabcontainer .wpfd_tabcontent').removeClass('active');
    $this.parent().parent().find('.wpfd_tabcontainer #' + searchName).addClass('active');

    return false;
}

function clearFilterTypes () {
    var $ = jQuery;

    if ($('#wpfd-search-file-type').length <= 0) {
        return;
    }

    var $extension = $('#wpfd-search-file-type').val();
    var $echo      = $('#wpfd-search-file-type + .chzn-container .chzn-single > span');
    if ($extension === '0') {
        $echo.addClass('normal');
    } else {
        $echo.removeClass('normal');
    }
}

function selectdChecktags() {
    var $ = jQuery;
    var captured = /ftags=([^&]+)/.exec(window.location.search);
    var tags = typeof captured !== "null" ? decodeURIComponent(captured).split(',') : false;
    jQuery('li.tags-item').on('click', function () {
        $(this).toggleClass("active");
        if ($(this).hasClass("active")) {
            $(this).children("input[type='checkbox']").prop('checked', true);
        } else {
            $(this).children("input[type='checkbox']").prop('checked', false);
        }
        var tagVal = [];
        jQuery(".chk_ftags").each(function () {
            if ($(this).prop("checked") == true) {
                tagVal.push($(this).val());
            }
        });
        if (tagVal.length > 0) {
            jQuery(".input_tags").val(tagVal.join(","));
        } else {
            jQuery(".input_tags").val("");
        }
    });

    // Check load/reload url has tag(s) selected
    $('li.tags-item').each(function () {
        var currentname = $(this).find('input').val();
        if(tags.indexOf(currentname) > -1) {
            $(this).click();
        }
    });
}

function wpfdcancelSelectedCate() {
    var $, wpfdlCurrentselectedCate;
    $ = jQuery;
    wpfdlCurrentselectedCate = $(".categories-filtering .cate-lab");
    $(".cate-lab .cancel").unbind('click').on('click', function () {
        if (wpfdlCurrentselectedCate.hasClass('display-cate')) {
            wpfdlCurrentselectedCate.removeClass('display-cate');
        }
        wpfdlCurrentselectedCate.empty();
        wpfdlCurrentselectedCate.append("<label id='root-cate'>" + wpfdvars.msg_file_category + "</label>");
        $(".categories-filtering .wpfd-listCate #filter_catid").val('');
        if($(".categories-filtering .cate-item").hasClass("checked")) {
            $(".categories-filtering .cate-item").removeClass("checked");
        } else {
            if($(".categories-filtering .cate-item").hasClass("choosed")) {
                $(".categories-filtering .cate-item").removeClass("choosed");
            }
        }
        catChange("filter_catid");
    });
}

function wpfdshowCateReload() {
    var $, SelectedCateReloadCase, wpfddisplayCateReloadCase;
    $ = jQuery;
    SelectedCateReloadCase = $(".categories-filtering .cate-item.choosed label").text();
    wpfddisplayCateReloadCase = $(".categories-filtering .cate-lab");
    var selectedCatecontentReloadCase = "<label>" + SelectedCateReloadCase + "</label>";
    if($(".cate-item.choosed").length > 0) {
        wpfddisplayCateReloadCase.addClass('display-cate');
        wpfddisplayCateReloadCase.empty();
        wpfddisplayCateReloadCase.append(selectedCatecontentReloadCase);
        if(wpfddisplayCateReloadCase.text() !== null ) {
            wpfddisplayCateReloadCase.append('<a class="cancel"></a>');
        }
    }
    wpfdcancelSelectedCate();
}

function showCategory() {
    var $ = jQuery;
    $(".categories-filtering .categories-filtering-overlay").unbind('click').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        var $container = $this.parent();
        $('.wpfd-listCate', $container).toggle();

        selectCategoriesActions($container);
    });
}

function selectCategoriesActions($container) {
    var $ = jQuery;
    if (typeof $container === 'undefined') {
        $container = $('.categories-filtering');
    }
    $('li.cate-item', $container).unbind('click').on('click', function () {
        $('li.cate-item.checked', $container).removeClass("checked");
        $('li.cate-item', $container).removeClass("choosed");

        $(this).addClass("checked");
        $("#filter_catid", $container).val($(this).data('catid')).trigger("change");
        $("#filter_catid", $container).attr('data-cattype', $(this).data('cattype')).trigger("change");
        $("#filter_catid", $container).attr('data-slug', $(this).data('slug')).trigger("change");
        $('.wpfd-listCate', $container).hide();

        // Show selected category
        var wpfdSelectedCatename = $(".cate-item.checked label", $container).text();
        var wpfddisplayCate = $('.cate-lab', $container);
        if($('.showitems', $container).length > 0) {
            $('.show-selected-cate', $container).css("display", "");
        } else {
            var selectedCatecontent = "<label title='"+ wpfdSelectedCatename +"' class='ju-setting-label'>" + wpfdSelectedCatename + "</label>";
            $('.show-selected-cate', $container).css("display", "block");
            if($('.cate-item.checked', $container).length === 1) {
                wpfddisplayCate.addClass('display-cate');
                wpfddisplayCate.empty();
                wpfddisplayCate.append(selectedCatecontent);
                if(wpfddisplayCate.text() !== null ) {
                    wpfddisplayCate.append('<a class="cancel"></a>');
                }
            }
        }

        wpfdcancelSelectedCate();
        catChange("filter_catid");
    });

    $(document).mouseup(function(e) {
        if (!$(".categories-filtering > .ui-widget").is(e.target) // If the target of the click isn't the container...
            && !$(".categories-filtering .categories-filtering-overlay").is(e.target)
            && $(".categories-filtering > .ui-widget").has(e.target).length === 0) // ... nor a descendant of the container
        {
            $(".categories-filtering > .ui-widget").hide();
        }
    });
}

function addPlaceholder() {
    var $ = jQuery;
    $(".tags-filtering .tagit-new input").attr("placeholder", wpfdvars.msg_search_box_placeholder);
}

// Add class to search button
function addtoSearchbuttonbelow() {
    var $ = jQuery;
    var searchbox = $("#Tags").children();
    if (searchbox.hasClass("tags-filtering")) {
        $(".box-btngroup-below").addClass("searchboxClass");
    }
}

function parentFolderIcon() {
    var $ = jQuery;
    $("li.cate-item").each(function () {
        var count = $(this).find('span.child-cate').length;
        var prelevel = $(this).prev().attr("data-catlevel");
        var catelevel = $(this).attr("data-catlevel");
        if((count == 1 && catelevel > prelevel) || (count == 1 && prelevel == 9)) {
            $(this).prev().addClass("parent-cate");
        }
    });
}

function  noTagscase() {
    var $ =jQuery;
    if($("#Tags .no-tags").length > 0) {
        $("#Tags .no-tags").each(function () {
            $(this).parents('.box-search-filter').find('.box-btngroup-below').addClass("notags-case");
        });
    } else {
        $(".feature .box-btngroup-below").removeClass("notags-case");
    }
}

function wpfdSingleDateTimePicker(datetime) {
    var $     = jQuery;
    var timer = $('[id="' + datetime + '"]');

    if (!timer.length) {
        return;
    }

    var $options = {
        locale: wpfdLocaleSettings,
        "alwaysShowCalendars": true,
        autoApply: true,
        autoUpdateInput: false,
        singleDatePicker: true
    };

    if (timer.val() !== '') {
        $options.startDate = timer.val();
    }

    var is_filter_create_date_from = $('#cfrom').length ? true : false;
    var is_filter_create_date_to   = $('#cto').length ? true : false;
    var is_filter_update_date_from = $('#ufrom').length ? true : false;
    var is_filter_update_date_to   = $('#uto').length ? true : false;

    timer.daterangepicker($options, function(start, end, label) {
        // Let update the fields manually this event fires on selection of range
        var time = start.format(wpfdvars.dateFormat);
        var char = time.charAt(2);// Return '/' or '-'
        var timeNumber = Date.parse(time.split(char).reverse().join(char));

        switch (datetime) {
            case 'cfrom':
                var ctoTimeNumber = Date.parse($('#cto').val().split(char).reverse().join(char));
                var timeValid = timeNumber < ctoTimeNumber ? true : false;
                if (is_filter_create_date_to && $('#cto').val().toString() !== '' && $('#cto').val().toString() !== time.toString() && !timeValid) {
                    wpfdFilterMessages();

                    return;
                }
                break;
            case 'cto':
                var cfromTimeNumber = Date.parse($('#cfrom').val().split(char).reverse().join(char));
                var timeValid = timeNumber > cfromTimeNumber ? true : false;
                if (is_filter_create_date_from && $('#cfrom').val().toString() !== '' && $('#cfrom').val().toString() !== time.toString() && !timeValid) {
                    wpfdFilterMessages();

                    return;
                }
                break;
            case 'ufrom':
                var utoTimeNumber = Date.parse($('#uto').val().split(char).reverse().join(char));
                var timeValid = timeNumber < utoTimeNumber ? true : false;
                if (is_filter_update_date_to && $('#uto').val().toString() !== '' && $('#uto').val().toString() !== time.toString() && !timeValid) {
                    wpfdFilterMessages();

                    return;
                }
                break;
            case 'uto':
                var ufromTimeNumber = Date.parse($('#ufrom').val().split(char).reverse().join(char));
                var timeValid = timeNumber > ufromTimeNumber ? true : false;
                if (is_filter_update_date_from && $('#ufrom').val().toString() !== '' && $('#ufrom').val().toString() !== time.toString() && !timeValid) {
                    wpfdFilterMessages();

                    return;
                }
                break;
            default:
                break;
        }

        timer.val(time);

        // Setting the selection of dates on calender on check field
        var checkInPicker = timer.data('daterangepicker');
        checkInPicker.setStartDate(time);
    });
    timer.next().on('click', function(e) {$(this).prev().trigger('click')});
}

function wpfdFilterMessages() {
    var $ = jQuery;

    if (!$('.wpfd-search-date-filter-message-container').length) {
        return;
    }

    $('.wpfd-search-date-filter-message-container').empty();
    $('.wpfd-search-date-filter-message-container').append(wpfdvars.msg_to_date_greater_than_from_date).removeClass('hidden');

    setTimeout(function () {
        $('.wpfd-search-date-filter-message-container').addClass('hidden');
    }, 3000);
}

function fullWidthSearch() {
    var $ = jQuery;
    var $inputSearchContainer = $('.wpfd_search_input');

    if($inputSearchContainer.parent().prev().hasClass('categories-filtering')) {
        $inputSearchContainer.addClass("fullwidth");
    } else {
        $inputSearchContainer.removeClass("fullwidth");
    }
}

function preSearchDownloadSelectedFiles() {
    var $ = jQuery;
    if ($('#wpfd-results input.cbox_file_download').length) {
        $('#wpfd-results input.cbox_file_download').each(function () {
            var fileId = $(this).data('id');
            if (! $.isNumeric(fileId)) {
                $(this).parent().hide();
            }
        });
    }

    $('#wpfd-results input.cbox_file_download').on('change', function () {
        var filesId = [];
        var filesWithCategoryId = {};
        var selectedFiles = $("#wpfd-results input.cbox_file_download:checked");
        var selectedCategory = $('#cate-list .cate-item.checked').data('catid');
        if (selectedFiles.length) {
            selectedFiles.each(function (index, file) {
                filesId.push($(file).data('id'));
                if (typeof (selectedCategory) === 'undefined' || selectedCategory === '') {
                    filesWithCategoryId[$(file).data('id')] = $(file).data('catid');
                }
            });
        }

        if (filesId.length > 0) {
            $('.search-download-selected').show();
            $('#search_result_download_selected_list').val('');
            $('#search_result_download_selected_list').val(filesId.join(','));

            if (!$.isEmptyObject(filesWithCategoryId)) {
                var values = JSON.stringify(filesWithCategoryId);
                $('#search_result_download_selected_file_with_category_list').val(values);
            }
        } else {
            $('.search-download-selected').hide();
        }
    });
}

function searchDownloadSelectedFiles() {
    var $ = jQuery;
    $('#search_download_selected_btn').on('click', function () {
        var current_category = $('.cate-list .cate-item.checked').data('catid');
        var category_name = 'wp-file-download-search';
        var selectedFilesId = $('#search_result_download_selected_list').val();

        if (typeof (current_category) !== 'undefined' && current_category !== '') {
            $.ajax({
                url: wpfdajaxurl + "task=files.zipSeletedFiles&filesId=" + selectedFilesId + "&wpfd_category_id=" + current_category,
                dataType: "json",
            }).done(function (results) {
                if (results.success) {
                    var hash = results.data.hash;
                    window.location.href = wpfdajaxurl + "task=files.downloadZipedFile&hash=" + hash + "&wpfd_category_id=" + current_category + "&wpfd_category_name=" + category_name;
                } else {
                    alert(results.data.message);
                }
            })
        } else {
            var selectedFileWithCategoryIds = $('#search_result_download_selected_file_with_category_list').val();
            if (selectedFilesId !== '' && selectedFileWithCategoryIds !== '') {
                selectedFileWithCategoryIds = $.parseJSON(selectedFileWithCategoryIds);
                $.ajax({
                    url: wpfdajaxurl + "task=files.zipSeletedFilesMultipleCategories",
                    type: "POST",
                    data: {
                        filesId : selectedFilesId,
                        selectedFileWithCategoryIds : selectedFileWithCategoryIds
                    },
                    success: function (results) {
                        if (results.success) {
                            var hash = results.data.hash;
                            window.location.href = wpfdajaxurl + "task=files.downloadZipedFileMultipleCategories&hash=" + hash + "&wpfd_search_name=" + category_name;
                        } else {
                            alert(results.data.message);
                        }
                    }
                });
            } else {
                return;
            }
        }
    });
}

function wpfdSearchGGDThemeActions() {
    var $ = jQuery;
    var sourcefile = $("#wpfd-template-ggd-box").html();
    $('.wpfd-content .wpfd-file-link').unbind('click').click(function (e) {
        e.preventDefault();
        var fileid = $(this).data('id');
        var categoryid = $(this).data('category_id');
        var ggd_root_cat = $(this).data('category_id');
        $.ajax({
            url: wpfdajaxurl + "task=file.display&view=file&id=" + fileid + "&categoryid=" + categoryid + "&rootcat=" + ggd_root_cat,
            dataType: "json",
            beforeSend: function() {
                // setting a timeout
                if($('body').has('wpfd-ggd-box-loader') !== true) {
                    $('body').append('<div class="wpfd-ggd-box-loader"></div>');
                }
            }
        }).done(function (file) {
            var template = Handlebars.compile(sourcefile);
            var html = template(file);
            var box = $("#wpfd-ggd-box");
            $('.wpfd-ggd-box-loader').each(function () {
                $(this).remove();
            });
            if (box.length === 0) {
                $('body').append('<div id="wpfd-ggd-box" style="display: none;"></div>');
                box = $("#wpfd-ggd-box");
            }
            box.empty();
            box.prepend(html);
            box.click(function (e) {
                if ($(e.target).is('#wpfd-ggd-box')) {
                    box.hide();
                }
                $('#wpfd-ggd-box').unbind('click.box').bind('click.box', function (e) {
                    if ($(e.target).is('#wpfd-ggd-box')) {
                        box.hide();
                    }
                });
            });
            $('#wpfd-ggd-box .wpfd-close').click(function (e) {
                e.preventDefault();
                box.hide();
            });

            box.show();

            var dropblock = box.find('.dropblock');
            if ($(window).width() < 400) {
                dropblock.css('margin-top', '0');
                dropblock.css('margin-left', '0');
                dropblock.css('top', '0');
                dropblock.css('left', '0');
                dropblock.height($(window).height() - parseInt(dropblock.css('padding-top'), 10) - parseInt(dropblock.css('padding-bottom'), 10));
                dropblock.width($(window).width() - parseInt(dropblock.css('padding-left'), 10) - parseInt(dropblock.css('padding-right'), 10));
            } else {
                dropblock.css('margin-top', (-(dropblock.height() / 2) - 20) + 'px');
                dropblock.css('margin-left', (-(dropblock.width() / 2) - 20) + 'px');
                dropblock.css('height', '');
                dropblock.css('width', '');
                dropblock.css('top', '');
                dropblock.css('left', '');
            }

            if (typeof wpfdColorboxInit !== 'undefined') {
                wpfdColorboxInit();
            }
            // wpfdTrackDownload();

            $('body.elementor-default #wpfd-ggd-box a.wpfd_downloadlink').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var link = $(this).attr('href');
                window.location.href = link;
            });
        });
    });
}

jQuery(document).ready(function ($) {
    window.file_suggestion_ajax_on_search = null;
    window.ajax_search_handler = null;
    var suggestionEventId;
    initSorting();

    // Init tags
    $(".chk_ftags").click(function () {
        fillInputTags();
    });

    // Call filter type chosen
    if ($('select[name="extension"]').length) {
        $('select[name="extension"]').chosen({width: '100%', search_contains: true});
    }

    $("#filter_catid").on('change', function () {
        // Clear search
        var $ = jQuery;
        var categoryId = $(this).val();
        var cateType = $('#cate-list .cate-item[data-catid="' + categoryId + '"]').data('cattype');

        catChange("filter_catid");
    });

    $("#search_catid").change(function () {
        catChange("search_catid");
    });

    $('.qCatesearch').on('keydown keyup', function(e) {
        if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter')
        {
            e.preventDefault();
            return;
        }
        var scateList, filter, labl, txtValue;
        var $this = $(this);
        scateList = $("li.cate-item", $this.parent().parent());

        filter =  $this.val().toUpperCase();
        scateList.each(function () {
            labl = $(this).find("label");
            txtValue = labl.text().toUpperCase();
            if (txtValue.indexOf(filter) > -1) {
                $(this).css("display","");
            } else {
                $(this).css("display", "none");
            }
        });
    });
    $("#adminForm").submit(function (e) {
        e.preventDefault();
        return false;
    });
    $('#txtfilename').on('keyup', function(e) {
        var $this = $(this);
        if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter')
        {
            e.preventDefault();

            if ($this.val() === '') {
                return;
            }

            var prevFileSuggestionAjax = window.file_suggestion_ajax_on_search;
            if (prevFileSuggestionAjax !== null) {
                prevFileSuggestionAjax.abort();
            }

            $('#Search_container .wpfd-icon-search').show();
            $('#Search_container .wpfd-icon-search-loading').hide();

            ajaxSearch();

            return;
        }
    });

    // Make file suggestion handler
    $('#txtfilename').on('input', function(e) {
        // Only make file suggestion on search engine when enabling option
        if (!parseInt(wpfdvars.search_file_suggestion)) {
            return;
        }

        var keySearch = $(this).val();
        var searchLength = keySearch.replace(/ /g, '').length;
        var doFilterSuggestion = searchLength >= 3 ? true : false;
        $("#wpfd_search_file_suggestion").hide();

        if (doFilterSuggestion) {
            clearTimeout(suggestionEventId);
            suggestionEventId = setTimeout(function(){
                makeFileSuggestion();
            }, 800 );
        } else {
            var prevFileSuggestionAjax = window.file_suggestion_ajax_on_search;

            if (prevFileSuggestionAjax !== null) {
                prevFileSuggestionAjax.abort();
            }

            $('#Search_container .wpfd-icon-search').show();
            $('#Search_container .wpfd-icon-search-loading').hide();
        }
    });

    jQuery('.icon-date').click(function () {
        var txt = jQuery(this).attr('data-id');
        if (txt !== 'cfrom' && txt !== 'cto' && txt !== 'ufrom' && txt !== 'uto') {
            jQuery('#' + txt).datetimepicker('show');
        }
    });

    // Choose date time
    wpfdSingleDateTimePicker('cfrom');
    wpfdSingleDateTimePicker('cto');
    wpfdSingleDateTimePicker('ufrom');
    wpfdSingleDateTimePicker('uto');


    jQuery('.feature-toggle').click(function () {
        var container = jQuery(this).parents('.by-feature');
        jQuery(container).find('.feature').slideToggle('slow', function () {
            jQuery(".feature-toggle").toggleClass(function () {
                if (jQuery(this).is(".toggle-arrow-up-alt")) {
                    return "toggle-arrow-down-alt";
                } else {
                    return "toggle-arrow-up-alt";
                }
            });
        });
    });

    // Ajax filters
    $("#btnsearchbelow, #btnsearch").on('click', function (e) {
        e.preventDefault();
        var prevFileSuggestionAjax = window.file_suggestion_ajax_on_search;
        if (prevFileSuggestionAjax !== null) {
            prevFileSuggestionAjax.abort();
        }

        $('#Search_container .wpfd-icon-search').show();
        $('#Search_container .wpfd-icon-search-loading').hide();
        ajaxSearch();
        return false;
    });

    $("#btnReset").on('click', function (e) {
        e.preventDefault();
        resetFilters();
        $("#wpfd-results").html("");
        return false;
    });
    $("#widget_btnReset").on('click', function (e) {
        e.preventDefault();
        resetFilters('#widget_search');
    });

    // Get checkbox tags
    selectdChecktags();

    // Show category
    showCategory();

    // Select categories actions
    selectCategoriesActions();

    // Display selected category when reload.
    wpfdshowCateReload();

    // Set folder icon for parent-folder
    parentFolderIcon();

    // Add placeholder when tag search box is selected
    addPlaceholder();

    // Get search full width
    fullWidthSearch();

    // Get searchbox
    addtoSearchbuttonbelow();

    noTagscase();

    jQuery('.list-results table tr td a.file-item').click(function (e) {
        return true;
    });

    resetFilters = function (formSelect) {
        var sform = $("#adminForm");
        if (formSelect !== null && formSelect !== undefined) {
            sform = $(formSelect);
        }
        var inputs = $(sform).find('input:not([name="catid"]):not([name="theme"]), select:not([name="from_weight_unit"]):not([name="to_weight_unit"])');

        $.each(inputs, function (i, el) {
            var eType = $(el).attr('type');
            if (eType === 'checkbox') {
                $(el).prop('checked', false);
            } else {
                $(el).val('');
                if ($(el).hasClass("tagit")) {
                    $(el).tagit("removeAll");
                }
            }
        });

        if ($('select[name="from_weight_unit"]').length) {
            $('select[name="from_weight_unit"]').val('b');
        }

        if ($('select[name="to_weight_unit"]').length) {
            $('select[name="to_weight_unit"]').val('b');
        }

        if ($('select[name="extension"]').length) {
            $('select[name="extension"]').val('');
            $('select[name="extension"] + .chzn-container .chzn-single > span').html('-- Select type --');
        }

        if (!$('.wpfd-listCate').is(':hidden')) {
            $('#filter_catid').val('');
        }

        $('.tags-item').removeClass('active');
        if($(".cate-lab .cancel").length == 1) {
            $('.cate-item').removeClass('checked');
            var wpfdlCurrentselectedCate = $(".categories-filtering .cate-lab");
            if (wpfdlCurrentselectedCate.hasClass('display-cate')) {
                wpfdlCurrentselectedCate.removeClass('display-cate');
            }
            wpfdlCurrentselectedCate.empty();
            wpfdlCurrentselectedCate.append("<label id='root-cate'>" + wpfdvars.msg_file_category + "</label>");
        }
    };

    populateFilters = function (filters) {
        var sform = $("#adminForm");
        $.each(filters, function (f, v) {
            var els = $('[name=' + f + ']', sform);
            if (els.length > 0) {
                if ($(els).hasClass("tagit")) {
                    $(els).tagit("removeAll");
                    if (v !== "") {
                        var tgs = v.split(",");
                        for (var i = 0; i < tgs.length; i++) {
                            $(els).tagit("createTag", tgs[i]);
                        }
                    }
                } else {
                    $(els).val(v);
                }
                $(els).trigger('change').trigger("liszt:updated").trigger("chosen:updated");
            }
        });
    };

    // Remove property with empty value
    cleanObj = function (obj) {
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                if (!obj[k]) delete obj[k];
            }
        }
        return obj;
    };

    // Back on browser
    jQuery(window).on('popstate', function (event) {
        var state = event.originalEvent.state;
        console.log(state);
        resetFilters();
        if (state !== null) {
            var formData = state;
            populateFilters(formData);
            ajaxSearch(false, false, false);
        } else {
            $("#wpfd-results").html("");
        }
    });
    var params = getSearchParams();
    if (params.q !== undefined ||
        params.catid !== undefined ||
        params.ftags !== undefined ||
        params.cfrom !== undefined ||
        params.cto !== undefined ||
        params.ufrom !== undefined ||
        params.uto !== undefined
    ) {
        ajaxSearch();
    }

    preSearchDownloadSelectedFiles();
    searchDownloadSelectedFiles();
    wpfdSearchGGDThemeActions();
});