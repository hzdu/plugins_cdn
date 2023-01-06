//Schemas tabs
jQuery(document).ready(function ($) {

    if ($("#seopress-schemas-tabs").length) {
        $("#seopress-schemas-tabs .hidden").removeClass("hidden");
        $("#seopress-schemas-tabs").tabs();
    }

    // Init fields already exist
    bindDatePicker();

    $(".box-schema-item").each(function (key) {
        bindSnippetArticleCounter(key);
        bindSnippetCourseDescription(key);
        bindAddFaq(key);
        bindAddStep(key);
        bindPositiveNotesAccordion(key);
        bindAddPositiveNote(key)
        bindNegativeNotesAccordion(key);
        bindAddNegativeNote(key)
        seopress_call_faq_accordion(key);
        seopress_call_how_to_accordion(key);
    });

    $(".wrap-rich-snippets-item").toggle();
    $(".js-handle-snippet-type").toggleClass("closed");

    $(document).on("click", ".js-handle-snippet-type", function (event) {
        event.preventDefault();
        $(this).parent().parent().find(".wrap-rich-snippets-item").toggle();
        $(this).toggleClass("closed");
    });

    $(".js-expand-all").on("click", function (e) {
        e.preventDefault();
        $(".wrap-rich-snippets-item").show();
        $(".js-handle-snippet-type").addClass("closed");
    });

    $(".js-close-all").on("click", function (e) {
        e.preventDefault();
        $(".wrap-rich-snippets-item").hide();
        $(".js-handle-snippet-type").removeClass("closed");
    });

    function makeid(length) {
        var result = "";
        var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    }

    /**
     * Button for add schema
     */
    $("#js-add-schema-manual").on("click", function (e) {
        e.preventDefault();

        const template = document.querySelector("#js-select-template-schema");
        if (template.length === 0) {
            return;
        }

        const key = makeid(10);
        let str = $(template).clone().html();
        str = str
            .replace("[X]", key)
            .replace(
                "seopress_pro_rich_snippets_data[X]",
                "seopress_pro_rich_snippets_data[" + key + "]"
            )
            .replace("[X]", key);

        $("#js-box-list-schemas").prepend(str);
    });

    /**
     * Button remove schema
     */
    $(document).on("click", ".js-delete-schema-manual", function (e) {
        e.preventDefault();

        const dataKey = $(this).data("key");
        $(".box-schema-item[data-key='" + dataKey + "']").remove();

        if ($(".box-schema-item").length === 0) {
            const template = document.querySelector("#schema-template-empty");
            if (template.length === 0) {
                return;
            }

            const number = $(".box-schema-item").length;
            let str = $(template).clone().html();

            str = str
                .replace("[X]", number)
                .replace(
                    "seopress_pro_rich_snippets_data[X]",
                    "seopress_pro_rich_snippets_data[" + number + "]"
                )
                .replace("[X]", number);

            $("#js-box-list-schemas").prepend(str);
        }
    });

    /**
     * On change select choice schema
     */
    $(document).on(
        "change",
        ".js-select_seopress_pro_rich_snippets_type",
        function (e) {
            e.preventDefault();

            const _self = $(this);
            const value = $(this).val();

            const template = document.querySelector(
                "#schema-template-" + value
            );
            if (template.length === 0) {
                return;
            }
            const getContainerItem = function () {
                return _self.parent().parent().parent();
            };

            getContainerItem().find(".wrap-rich-snippets-item:eq(0)").hide();
            getContainerItem().find(".wrap-rich-snippets-item:eq(1)").remove();

            let value_select_classes = value;
            let snippet_selected = value;

            switch (value_select_classes) {
                case "localbusiness":
                    value_select_classes = "local-business";
                    snippet_selected = "local-business";
                    break;
                case "articles":
                    value_select_classes = "article";
                    break;
                case "courses":
                    value_select_classes = "course";
                    break;
                case "recipes":
                    value_select_classes = "recipe";
                    break;
                case "videos":
                    value_select_classes = "video";
                    break;
                case "events":
                    value_select_classes = "event";
                    break;
                case "products":
                    value_select_classes = "product";
                    break;
                case "softwareapp":
                    value_select_classes = "software";
                    snippet_selected = "software-app";
                    break;
                case "services":
                    value_select_classes = "service";
                    break;
                case "event":
                    value_select_classes = "events";
                    snippet_selected = "events";
                    break;
            }

            let number = null;
            const alreadyExistItem = getContainerItem()
                .find(".wrap-rich-snippets-item:eq(0)")
                .hasClass("wrap-rich-snippets-" + snippet_selected);

            if (alreadyExistItem) {
                getContainerItem()
                    .find(".wrap-rich-snippets-item:eq(0)")
                    .show();
            } else {
                const find = "seopress_pro_rich_snippets_data[X]";

                let str = $(template).clone().html();
                number = getContainerItem().data("key");

                str = str
                    .split(find)
                    .join("seopress_pro_rich_snippets_data[" + number + "]");
                getContainerItem().append(str);
            }

            if (number === null) {
                return;
            }
            switch (value_select_classes) {
                case "article":
                    bindSnippetArticleCounter(number);
                    break;
                case "course":
                    bindSnippetCourseDescription(number);
                    break;
                case "faq":
                    bindAddFaq(number);
                    seopress_call_faq_accordion(number);
                    break;
                case "howto":
                    bindAddStep(number);
                    seopress_call_how_to_accordion(number);
                    break;
                case "product":
                    bindAddPositiveNote(number);
                    bindPositiveNotesAccordion(number);

                    bindAddNegativeNote(number);
                    bindNegativeNotesAccordion(number);
                    break;
            }

            bindDatePicker();
            bindUploadMedia(number);
        }
    );

    //Rich Snippets Counters - Articles - Headline
    function bindSnippetArticleCounter(number) {
        const selector =
            ".box-schema-item[data-key='" +
            number +
            "'] .seopress_rich_snippets_articles_counters";

        $(selector).after(
            '<div class="seopress_rich_snippets_articles_counters_val">/ 110</div>'
        );

        if ($(selector).length != 0) {
            $(selector).text(
                $(
                    ".box-schema-item[data-key='" +
                        number +
                        "'] .seopress_pro_rich_snippets_article_title_meta"
                ).val().length
            );
            if (
                $(
                    ".box-schema-item[data-key='" +
                        number +
                        "'] .seopress_pro_rich_snippets_article_title_meta"
                ).val().length > 110
            ) {
                $(selector).css("color", "red");
            }
            $(
                ".box-schema-item[data-key='" +
                    number +
                    "'] .seopress_pro_rich_snippets_article_title_meta"
            ).keyup(function (event) {
                $(selector).css("color", "inherit");
                if ($(this).val().length > 110) {
                    $(selector).css("color", "red");
                }
                $(selector).text(
                    $(
                        ".box-schema-item[data-key='" +
                            number +
                            "'] .seopress_pro_rich_snippets_article_title_meta"
                    ).val().length
                );
                if ($(this).val().length > 0) {
                    $(".snippet-title-custom").text(event.target.value);
                    $(".snippet-title").css("display", "none");
                    $(".snippet-title-custom").css("display", "block");
                    $(".snippet-title-default").css("display", "none");
                } else if ($(this).val().length == 0) {
                    $(".snippet-title-default").css("display", "block");
                    $(".snippet-title-custom").css("display", "none");
                    $(".snippet-title").css("display", "none");
                }
            });
        }
    }

    //Rich Snippets Counters - Courses - Description
    function bindSnippetCourseDescription(number) {
        const selector =
            ".box-schema-item[data-key='" +
            number +
            "'] .seopress_rich_snippets_courses_counters";

        $(selector).after(
            '<div id="seopress_rich_snippets_courses_counters_val">/ 60</div>'
        );

        if ($(selector).length != 0) {
            $(selector).text(
                $(
                    ".box-schema-item[data-key='" +
                        number +
                        "'] .seopress_pro_rich_snippets_courses_desc"
                ).val().length
            );
            if (
                $(
                    ".box-schema-item[data-key='" +
                        number +
                        "'] .seopress_pro_rich_snippets_courses_desc"
                ).val().length > 60
            ) {
                $(selector).css("color", "red");
            }
            $(
                ".box-schema-item[data-key='" +
                    number +
                    "'] .seopress_pro_rich_snippets_courses_desc"
            ).keyup(function (event) {
                $(selector).css("color", "inherit");
                if ($(this).val().length > 60) {
                    $(selector).css("color", "red");
                }
                $(selector).text(
                    $(
                        ".box-schema-item[data-key='" +
                            number +
                            "'] .seopress_pro_rich_snippets_courses_desc"
                    ).val().length
                );
                if ($(this).val().length > 0) {
                    $(".snippet-title-custom").text(event.target.value);
                    $(".snippet-title").css("display", "none");
                    $(".snippet-title-custom").css("display", "block");
                    $(".snippet-title-default").css("display", "none");
                } else if ($(this).val().length == 0) {
                    $(".snippet-title-default").css("display", "block");
                    $(".snippet-title-custom").css("display", "none");
                    $(".snippet-title").css("display", "none");
                }
            });
        }
    }

    function bindDatePicker() {
        //Date picker
        $(".seopress-date-picker").datepicker({
            dateFormat: "yy-mm-dd",
            beforeShow: function (input, inst) {
                $("#ui-datepicker-div")
                    .removeClass("ui-date-picker")
                    .addClass("seopress-ui-datepicker");
            },
        });
    }

    function bindOneUploadMedia(number, itemSelector) {
        const item_id =
            ".box-schema-item[data-key='" +
            number +
            "'] #" +
            $(itemSelector).attr("id");

        var mediaUploader;
        $(itemSelector).click(function (e) {
            e.preventDefault();
            // If the uploader object has already been created, reopen the dialog
            if (mediaUploader) {
                mediaUploader.open();
                return;
            }
            // Extend the wp.media object
            mediaUploader = wp.media.frames.file_frame = wp.media({
                multiple: false,
            });

            // When a file is selected, grab the URL and set it as the text field's value
            mediaUploader.on("select", function () {
                attachment = mediaUploader
                    .state()
                    .get("selection")
                    .first()
                    .toJSON();

                if ($(item_id).attr("data-id")) {
                    item_id = $(item_id).attr("data-id");
                }

                $(item_id + "_meta").val(attachment.url);
                if ($(item_id + "_attachment_id").length > 0) {
                    $(item_id + "_attachment_id").val(attachment.id);
                }
                $(item_id + "_width").val(attachment.width);
                $(item_id + "_height").val(attachment.height);
            });
            // Open the uploader dialog
            mediaUploader.open();
        });
    }

    function bindUploadMedia(number) {
        const selector =
            ".box-schema-item[data-key='" +
            number +
            "'] .seopress_media_upload";

        if ($(selector).length === 0) {
            return;
        }

        $(selector).each(function (key, itemSelector) {
            bindOneUploadMedia(number, itemSelector);
        });
    }

    //Employment Type
    $(document).on(
        "click",
        "#seopress-tag-employment-1, #seopress-tag-employment-2, #seopress-tag-employment-3, #seopress-tag-employment-4, #seopress-tag-employment-5, #seopress-tag-employment-6, #seopress-tag-employment-7, #seopress-tag-employment-8",
        function () {
            var e = $(this)
                .closest(".seopress_pro_rich_snippets_jobs_employment_type_p")
                .find(".seopress_pro_rich_snippets_jobs_employment_type");
            if (e.val().length == 0) {
                e.val($(this).attr("data-tag"));
            } else {
                str = e.val();
                str = str.replace(/,\s*$/, "");
                e.val(str + "," + $(this).attr("data-tag"));
            }
        }
    );

    function seopress_call_faq_accordion(number) {
        if (
            $(".box-schema-item[data-key='" + number + "'] #wrap-faq .faq")
                .length === 0
        ) {
            return;
        }
        $(
            ".box-schema-item[data-key='" + number + "'] #wrap-faq .faq"
        ).accordion({
            animate: false,
            collapsible: true,
            active: false,
            heightStyle: "panel",
            header: "h3",
        });
        // $( ".box-schema-item[data-key='" + number + "'] #wrap-faq" ).sortable({
        // 	items: '.faq',
        // 	containment: ".wrap-rich-snippets-faq"
        // });
    }

    function bindPositiveNotesAccordion(number) {
        if (
            $(".box-schema-item[data-key='" + number + "'] #wrap-positive-notes .positive_notes")
                .length === 0
        ) {
            return;
        }
        $(
            ".box-schema-item[data-key='" + number + "'] #wrap-positive-notes .positive_notes"
        ).accordion({
            animate: false,
            collapsible: true,
            active: false,
            heightStyle: "panel",
            header: "h3",
        });
    }
    function bindNegativeNotesAccordion(number) {
        if (
            $(".box-schema-item[data-key='" + number + "'] #wrap-negative-notes .negative_notes")
                .length === 0
        ) {
            return;
        }
        $(
            ".box-schema-item[data-key='" + number + "'] #wrap-negative-notes .negative_notes"
        ).accordion({
            animate: false,
            collapsible: true,
            active: false,
            heightStyle: "panel",
            header: "h3",
        });
    }

    function bindAddFaq(number) {
        const selector =
            ".box-schema-item[data-key='" + number + "'] #wrap-faq";
        if ($(selector).length === 0) {
            return;
        }

        //FAQ
        var template = $(
            ".box-schema-item[data-key='" + number + "'] #wrap-faq .faq:last"
        ).clone();

        //accordion
        var stop = false;
        $(
            ".box-schema-item[data-key='" + number + "'] #wrap-faq .faq h3"
        ).click(function (event) {
            if (stop) {
                event.stopImmediatePropagation();
                event.preventDefault();
                stop = false;
            }
        });

        //define counter
        var sectionsCount = $("#wrap-faq").attr("data-count");

        //add new section
        $(".box-schema-item[data-key='" + number + "'] #add-faq").click(
            function (e) {
                e.preventDefault();
                //increment
                sectionsCount++;

                //loop through each input
                var section = template
                    .clone()
                    .find(":input")
                    .each(function () {
                        //Stock input id
                        var input_id = this.id;

                        //Stock input name,
                        var input_name = this.name;

                        //set id to store the updated section number
                        var newId = this.id.replace(
                            /(\[seopress_pro_rich_snippets_faq\])\[.*?\]/,
                            "$1[" + sectionsCount + "]"
                        );

                        //Update input name
                        $(this).attr(
                            "name",
                            input_name.replace(
                                /(\[seopress_pro_rich_snippets_faq\])\[.*?\]/,
                                "$1[" + sectionsCount + "]"
                            )
                        );

                        //update for label
                        $(this)
                            .prev()
                            .attr(
                                "for",
                                input_id.replace(
                                    /(\[seopress_pro_rich_snippets_faq\])\[.*?\]/,
                                    "$1[" + sectionsCount + "]"
                                )
                            );
                        $(this)
                            .prev()
                            .attr(
                                "id",
                                input_name.replace(
                                    /(\[seopress_pro_rich_snippets_faq\])\[.*?\]/,
                                    "$1[" + sectionsCount + "]"
                                )
                            );

                        //update id
                        this.id = newId;
                    })
                    .end();

                //inject new section
                section.appendTo(
                    ".box-schema-item[data-key='" + number + "'] #wrap-faq"
                );

                // $( ".box-schema-item[data-key='" + number + "'] #wrap-faq .faq" ).accordion('destroy');
                seopress_call_faq_accordion(number);

                return false;
            }
        );

        //remove section
        $(".box-schema-item[data-key='" + number + "'] #wrap-faq").on(
            "click",
            ".remove-faq",
            function () {
                //fade out section
                $(this).fadeOut(300, function () {
                    $(this).parent().parent().parent().parent().remove();
                    return false;
                });
                return false;
            }
        );
    }

    function bindAddPositiveNote(number) {
        const selector =
            ".box-schema-item[data-key='" + number + "'] #wrap-positive-notes";

        if ($(selector).length === 0) {
            return;
        }

        //accordion
        var stop = false;
        $(
            ".box-schema-item[data-key='" + number + "'] #wrap-positive-notes .positive_notes h3"
        ).click(function (event) {
            if (stop) {
                event.stopImmediatePropagation();
                event.preventDefault();
                stop = false;
            }
        });

        //add new section
        $(".box-schema-item[data-key='" + number + "'] #add-positive-note").click(
            function (e) {
                e.preventDefault();

                const template = document.querySelector("#schema-template-positive-note");
                if (template.length === 0) {
                    return;
                }

                const totalNotes = $("#wrap-positive-notes .positive_notes").length;

                let str = $(template).clone().html();

                str = str
                    .replaceAll("[X]", "[" + totalNotes + "]")

                $("#wrap-positive-notes").append(str);
                bindPositiveNotesAccordion(number);
                return false;
            }
        );

        //remove section
        $(".box-schema-item[data-key='" + number + "'] #wrap-positive-notes").on(
            "click",
            ".remove-positive-note",
            function () {
                //fade out section
                $(this).fadeOut(300, function () {
                    $(this).closest('.positive_notes').remove();
                    return false;
                });
                return false;
            }
        );
    }

    function bindAddNegativeNote(number) {
        const selector =
            ".box-schema-item[data-key='" + number + "'] #wrap-negative-notes";

        if ($(selector).length === 0) {
            return;
        }

        //accordion
        var stop = false;
        $(
            ".box-schema-item[data-key='" + number + "'] #wrap-negative-notes .negative_notes h3"
        ).click(function (event) {
            if (stop) {
                event.stopImmediatePropagation();
                event.preventDefault();
                stop = false;
            }
        });

        //add new section
        $(".box-schema-item[data-key='" + number + "'] #add-negative-note").click(
            function (e) {
                e.preventDefault();

                const template = document.querySelector("#schema-template-negative-note");
                if (template.length === 0) {
                    return;
                }

                const totalNotes = $("#wrap-negative-notes .negative_notes").length;

                let str = $(template).clone().html();

                str = str.replaceAll("[X]", "[" + totalNotes + "]")

                $("#wrap-negative-notes").append(str);
                bindNegativeNotesAccordion(number);
                return false;
            }
        );

        //remove section
        $(".box-schema-item[data-key='" + number + "'] #wrap-negative-notes").on(
            "click",
            ".remove-negative-note",
            function () {
                //fade out section
                $(this).fadeOut(300, function () {
                    $(this).closest('.negative_notes').remove();
                    return false;
                });
                return false;
            }
        );
    }

    function seopress_call_how_to_accordion(number) {
        if (
            $(".box-schema-item[data-key='" + number + "'] #wrap-how-to .step")
                .length === 0
        ) {
            return;
        }

        $(
            ".box-schema-item[data-key='" + number + "'] #wrap-how-to .step"
        ).accordion({
            animate: false,
            collapsible: true,
            active: false,
            heightStyle: "panel",
            header: "h3",
        });
    }

    function bindAddStep(number) {
        const selector =
            ".box-schema-item[data-key='" + number + "'] #wrap-how-to";
        if ($(selector).length === 0) {
            return;
        }

        //How-to
        var template = $(
            ".box-schema-item[data-key='" +
                number +
                "'] #wrap-how-to .step:last"
        ).clone();

        //accordion
        var stop = false;
        $(
            ".box-schema-item[data-key='" + number + "'] #wrap-how-to .step h3"
        ).click(function (event) {
            if (stop) {
                event.stopImmediatePropagation();
                event.preventDefault();
                stop = false;
            }
        });

        //define counter
        var sectionsCount = $("#wrap-how-to").attr("data-count");

        //add new section
        $(".box-schema-item[data-key='" + number + "'] #add-step").click(
            function (e) {
                e.preventDefault();
                //increment
                sectionsCount++;

                //loop through each input
                var section = template
                    .clone()
                    .find(":input")
                    .each(function () {
                        if (
                            $(this)
                                .parent()
                                .hasClass("js-media-upload-how-to-repeater")
                        ) {
                            return;
                        }
                        //Stock input id
                        var input_id = this.id;

                        //Stock input name,
                        var input_name = this.name;

                        //set id to store the updated section number
                        var newId = this.id.replace(
                            /(\[seopress_pro_rich_snippets_how_to\])\[.*?\]/,
                            "$1[" + sectionsCount + "]"
                        );

                        //Update input name
                        $(this).attr(
                            "name",
                            input_name.replace(
                                /(\[seopress_pro_rich_snippets_how_to\])\[.*?\]/,
                                "$1[" + sectionsCount + "]"
                            )
                        );

                        //update for label
                        $(this)
                            .prev()
                            .attr(
                                "for",
                                input_id.replace(
                                    /(\[seopress_pro_rich_snippets_how_to\])\[.*?\]/,
                                    "$1[" + sectionsCount + "]"
                                )
                            );
                        $(this)
                            .prev()
                            .attr(
                                "id",
                                input_name.replace(
                                    /(\[seopress_pro_rich_snippets_how_to\])\[.*?\]/,
                                    "$1[" + sectionsCount + "]"
                                )
                            );

                        //update id
                        this.id = newId;
                    })
                    .end();

                //inject new section
                section.appendTo(
                    ".box-schema-item[data-key='" + number + "'] #wrap-how-to"
                );

                const baseIdValue =
                    "seopress_pro_rich_snippets_data_" +
                    number +
                    "_" +
                    sectionsCount;

                // Label
                section.find(".js-media-upload-how-to-repeater label").attr(
                    "for",

                    baseIdValue + "_image_meta"
                );

                // Btn upload
                section
                    .find(
                        ".js-media-upload-how-to-repeater .seopress_media_upload"
                    )
                    .attr(
                        "id",

                        baseIdValue + "_image"
                    );

                // Input height
                section
                    .find(
                        ".js-media-upload-how-to-repeater .seopress_pro_rich_snippets_data_image_height"
                    )
                    .attr("id", baseIdValue + "_image_height");

                // Input width
                section
                    .find(
                        ".js-media-upload-how-to-repeater .seopress_pro_rich_snippets_data_image_width"
                    )
                    .attr("id", baseIdValue + "_image_width");

                // Input meta
                section
                    .find(
                        ".js-media-upload-how-to-repeater .seopress_pro_rich_snippets_data_image_meta"
                    )
                    .attr(
                        "id",

                        baseIdValue + "_image_meta"
                    );

                section
                    .find(".js-media-upload-how-to-repeater :input")
                    .each(function () {
                        //Stock input id
                        var input_id = this.id;

                        //Stock input name,
                        var input_name = this.name;

                        //set id to store the updated section number
                        var newId = this.id.replace(
                            /(\[seopress_pro_rich_snippets_how_to\])\[.*?\]/,
                            "$1[" + sectionsCount + "]"
                        );

                        //Update input name
                        $(this).attr(
                            "name",
                            input_name.replace(
                                /(\[seopress_pro_rich_snippets_how_to\])\[.*?\]/,
                                "$1[" + sectionsCount + "]"
                            )
                        );

                        //update id
                        this.id = newId;
                    })
                    .end();

                seopress_call_how_to_accordion(number);

                bindOneUploadMedia(
                    number,
                    section.find(
                        ".js-media-upload-how-to-repeater .seopress_media_upload"
                    )
                );
                return false;
            }
        );

        //remove section
        $(".box-schema-item[data-key='" + number + "'] #wrap-how-to").on(
            "click",
            ".remove-step",
            function () {
                //fade out section
                $(this).fadeOut(300, function () {
                    $(this).parent().parent().parent().parent().remove();
                    return false;
                });
                return false;
            }
        );
    }

    // Schemas
    var the_index = $("p[data-group]").length;
    var the_group = $("div[data-group]").length;

    function select_and_change() {
        $('select[id$="[filter]"]').on("change", function (opt) {
            const val = $(this).val();
            if ("taxonomy" === val) {
                $(this).parent().find('select[id$="[taxo]"]').show();
                $(this).parent().find('input[id$="[postId]"]').hide();
                $(this).parent().find('select[id$="[cpt]"]').hide();
            } else if ("post_type" === val) {
                $(this).parent().find('select[id$="[taxo]"]').hide();
                $(this).parent().find('input[id$="[postId]"]').hide();
                $(this).parent().find('select[id$="[cpt]"]').show();
            } else if ("postId" === val) {
                $(this).parent().find('select[id$="[taxo]"]').hide();
                $(this).parent().find('input[id$="[postId]"]').show();
                $(this).parent().find('select[id$="[cpt]"]').hide();
            }
        });
    }
    select_and_change();

    $("p[data-group]").each(function (a, b) {
        var $g = $(b).data("group");
        check_and_del_buttons(b);
    });

    $(".seopress_pro_rich_snippets_rules_del").css("cursor", "pointer");

    function check_and_del_buttons() {
        var $gl = $("p[data-group]").length;
        $(".seopress_pro_rich_snippets_rules_del").show();
        if (1 == $gl) {
            $(".seopress_pro_rich_snippets_rules_del:first").hide();
        }
    }

    $(".wrap-rich-snippets-rules").on(
        "click",
        ".seopress_pro_rich_snippets_rules_and",
        function (e) {
            // Clone a row.
            var $html = $(this).parent().clone().prop("outerHTML");
            // Replace the index by a new index.
            $html = $html.replace(/\[\i[0-9]\]/g, "[i" + the_index + "]");
            the_index++;
            $(this).parent().after($html);
            select_and_change();
            check_and_del_buttons();
        }
    );

    $(".wrap-rich-snippets-rules").on(
        "click",
        ".seopress_pro_rich_snippets_rules_del",
        function (e) {
            var $g = $(this).data("group");
            if (1 == $('p[data-group="' + $g + '"]').length) {
                if ($(this).parent().parent().prev(".separat_or").length) {
                    $(this).parent().parent().prev(".separat_or").remove();
                } else {
                    $(this).parent().parent().next(".separat_or").remove();
                }
            }
            $(this).parent().remove();
            if ($('div[data-group="' + $g + '"]').html() == "") {
                $('div[data-group="' + $g + '"]').remove();
            }
            check_and_del_buttons();
        }
    );

    $(document).on(
        "click",
        ".wrap-rich-snippets-rules #seopress_pro_rich_snippets_rules_add",
        function (e) {
            // Clone a row.
            var $html = $(".wrap-rich-snippets-rules div[data-group]:first");
            $html = $html.clone();
            $($html).find("p[data-group]:not(:first)").remove();
            $($html).find(".seopress_pro_rich_snippets_rules_del").show();
            $html = $html.prop("outerHTML");
            $html = $html.replace(/\[\g[0-9]\]/g, "[g" + the_group + "]");
            $html = $html.replace(
                /data-group="[0-9]"/g,
                'data-group="' + the_group + '"'
            );
            var $sep = $(".separat_or:first").clone().prop("outerHTML");
            $html += $sep;
            the_group++;

            $(this).parent().prev().after($html);
            select_and_change();
            check_and_del_buttons();
        }
    );

    $(':checkbox[name$="[closed]"]').on("click", function (e) {
        $(this).parent().parent().find("li:not(:first)").toggle();
    });

    $(':checked[name$="[closed]"]').each(function (e) {
        $(this).parent().parent().find("li:not(:first)").toggle();
    });

    //automatic schema counter
    var count = $("#seopress-schemas-tabs .sp-schema-count").attr("data-count");
    $("#sp-automatic-tab span").html(count);

    //Schemas post type
    $("#seopress-your-schema select.dyn")
        .change(function (e) {
            e.preventDefault();

            var select = $(this).val();

            if (select == "manual_global") {
                $(this).next("input.manual_global").show();
                $(this).closest("p").find("input.manual_global").show();
                $(this).closest("p").find("select.lb").hide();
                $(this).closest("p").find("select.cf").hide();
                $(this).closest("p").find("select.tax").hide();
            } else if (select == "manual_img_global") {
                $(this).next("input.manual_img_global").show();
                $(this)
                    .closest("p")
                    .find("input.manual_img_library_global")
                    .hide();
                $(this).closest("p").find("select.lb").hide();
                $(this).closest("p").find("select.cf").hide();
                $(this).closest("p").find("select.tax").hide();
            } else if (select == "manual_img_library_global") {
                $(this).next("input.manual_img_global").hide();
                $(this)
                    .closest("p")
                    .find("input.manual_img_library_global")
                    .show();
                $(this).closest("p").find("select.lb").hide();
                $(this).closest("p").find("select.cf").hide();
                $(this).closest("p").find("select.tax").hide();
            } else if (select == "manual_date_global") {
                $(this).next("input.manual_date_global").show();
                $(this).closest("p").find("select.lb").hide();
                $(this).closest("p").find("select.cf").hide();
                $(this).closest("p").find("select.tax").hide();
            } else if (select == "manual_time_global") {
                $(this).next("input.manual_time_global").show();
                $(this).closest("p").find("select.lb").hide();
                $(this).closest("p").find("select.cf").hide();
                $(this).closest("p").find("select.tax").hide();
            } else if (select == "manual_rating_global") {
                $(this).next("input.manual_rating_global").show();
                $(this).closest("p").find("select.lb").hide();
                $(this).closest("p").find("select.cf").hide();
                $(this).closest("p").find("select.tax").hide();
            } else if (select == "custom_fields") {
                $(this).closest("p").find("input").hide();
                $(this).closest("p").find("input.manual_img_global").hide();
                $(this)
                    .closest("p")
                    .find("input.manual_img_library_global")
                    .hide();
                $(this).closest("p").find("input.manual_date_global").hide();
                $(this).closest("p").find("input.manual_time_global").hide();
                $(this).closest("p").find("input.manual_rating_global").hide();
                $(this).closest("p").find("select.lb").hide();
                $(this).closest("p").find("select.tax").hide();
                $(this).closest("p").find("select.cf").show();
            } else if (select == "custom_taxonomy") {
                $(this).closest("p").find("input").hide();
                $(this).closest("p").find("input.manual_img_global").hide();
                $(this)
                    .closest("p")
                    .find("input.manual_img_library_global")
                    .hide();
                $(this).closest("p").find("input.manual_date_global").hide();
                $(this).closest("p").find("input.manual_time_global").hide();
                $(this).closest("p").find("input.manual_rating_global").hide();
                $(this).closest("p").find("select.lb").hide();
                $(this).closest("p").find("select.cf").hide();
                $(this).closest("p").find("select.tax").show();
            } else if (select == "manual_custom_global") {
                $(this)
                    .closest("p")
                    .find("textarea.manual_custom_global")
                    .show();
                $(this).closest("p").find("select.lb").hide();
                $(this).closest("p").find("select.cf").hide();
            } else if (select == "manual_lb_global") {
                $(this).closest("p").find("select.lb").show();
                $(this).closest("p").find("select.cf").hide();
                $(this).closest("p").find("select.tax").hide();
                $(this).closest("p").find("input").hide();
                $(this).closest("p").find("textarea").hide();
            } else {
                $(this).closest("p").find("select.lb").hide();
                $(this).closest("p").find("select.cf").hide();
                $(this).closest("p").find("select.tax").hide();
                $(this).closest("p").find("input").hide();
                $(this).closest("p").find("textarea").hide();
            }
        })
        .trigger("change");

    // Only Post type Schema

    var sc_a = ".wrap-rich-snippets-articles";
    var sc_b = ".wrap-rich-snippets-local-business";
    var sc_f = ".wrap-rich-snippets-faq";
    var sc_c = ".wrap-rich-snippets-courses";
    var sc_r = ".wrap-rich-snippets-recipes";
    var sc_j = ".wrap-rich-snippets-jobs";
    var sc_v = ".wrap-rich-snippets-videos";
    var sc_e = ".wrap-rich-snippets-events";
    var sc_p = ".wrap-rich-snippets-products";
    var sc_s = ".wrap-rich-snippets-services";
    var sc_app = ".wrap-rich-snippets-software-app";
    var sc_re = ".wrap-rich-snippets-review";
    var sc_cu = ".wrap-rich-snippets-custom";
    var sc_ad = ".wrap-rich-snippets-type .advice";

    $("#seopress-your-schema .box-left > p ~ div").hide();

    //Rich Snippets Select
    if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "none"
    ) {
        $(sc_ad).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "articles"
    ) {
        $(sc_ad).hide();
        $(sc_a).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "localbusiness"
    ) {
        $(sc_ad).hide();
        $(sc_b).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "faq"
    ) {
        $(sc_ad).hide();
        $(sc_f).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "courses"
    ) {
        $(sc_ad).hide();
        $(sc_c).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "recipes"
    ) {
        $(sc_ad).hide();
        $(sc_r).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "jobs"
    ) {
        $(sc_ad).hide();
        $(sc_j).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "videos"
    ) {
        $(sc_ad).hide();
        $(sc_v).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "events"
    ) {
        $(sc_ad).hide();
        $(sc_e).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "products"
    ) {
        $(sc_ad).hide();
        $(sc_p).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "services"
    ) {
        $(sc_ad).hide();
        $(sc_s).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "softwareapp"
    ) {
        $(sc_ad).hide();
        $(sc_app).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "review"
    ) {
        $(sc_ad).hide();
        $(sc_re).show();
    } else if (
        $(
            "#seopress-your-schema #seopress_pro_rich_snippets_type option:selected"
        ).val() == "custom"
    ) {
        $(sc_ad).hide();
        $(sc_cu).show();
    }

    $("#seopress-your-schema #seopress_pro_rich_snippets_type").change(
        function () {
            var seopress_rs_type = $(
                "#seopress-your-schema #seopress_pro_rich_snippets_type"
            ).val();
            if (seopress_rs_type == "none") {
                $(sc_ad).show();
                $(
                    sc_a +
                        "," +
                        sc_b +
                        "," +
                        sc_f +
                        "," +
                        sc_c +
                        "," +
                        sc_r +
                        "," +
                        sc_j +
                        "," +
                        sc_v +
                        "," +
                        sc_e +
                        "," +
                        sc_p +
                        "," +
                        sc_s +
                        "," +
                        sc_app +
                        "," +
                        sc_re +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "articles") {
                $(sc_a).show();
                $(
                    sc_ad +
                        "," +
                        sc_b +
                        "," +
                        sc_f +
                        "," +
                        sc_c +
                        "," +
                        sc_r +
                        "," +
                        sc_j +
                        "," +
                        sc_v +
                        "," +
                        sc_e +
                        "," +
                        sc_p +
                        "," +
                        sc_s +
                        "," +
                        sc_app +
                        "," +
                        sc_re +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "localbusiness") {
                $(sc_b).show();
                $(
                    sc_ad +
                        "," +
                        sc_a +
                        "," +
                        sc_f +
                        "," +
                        sc_c +
                        "," +
                        sc_r +
                        "," +
                        sc_j +
                        "," +
                        sc_v +
                        "," +
                        sc_e +
                        "," +
                        sc_p +
                        "," +
                        sc_s +
                        "," +
                        sc_app +
                        "," +
                        sc_re +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "faq") {
                $(sc_f).show();
                $(
                    sc_ad +
                        "," +
                        sc_a +
                        "," +
                        sc_b +
                        "," +
                        sc_c +
                        "," +
                        sc_r +
                        "," +
                        sc_j +
                        "," +
                        sc_v +
                        "," +
                        sc_e +
                        "," +
                        sc_p +
                        "," +
                        sc_s +
                        "," +
                        sc_app +
                        "," +
                        sc_re +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "courses") {
                $(sc_c).show();
                $(
                    sc_ad +
                        "," +
                        sc_a +
                        "," +
                        sc_b +
                        "," +
                        sc_f +
                        "," +
                        sc_r +
                        "," +
                        sc_j +
                        "," +
                        sc_v +
                        "," +
                        sc_e +
                        "," +
                        sc_p +
                        "," +
                        sc_s +
                        "," +
                        sc_app +
                        "," +
                        sc_re +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "recipes") {
                $(sc_r).show();
                $(
                    sc_ad +
                        "," +
                        sc_a +
                        "," +
                        sc_b +
                        "," +
                        sc_f +
                        "," +
                        sc_c +
                        "," +
                        sc_j +
                        "," +
                        sc_v +
                        "," +
                        sc_e +
                        "," +
                        sc_p +
                        "," +
                        sc_s +
                        "," +
                        sc_app +
                        "," +
                        sc_re +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "jobs") {
                $(sc_j).show();
                $(
                    sc_ad +
                        "," +
                        sc_a +
                        "," +
                        sc_b +
                        "," +
                        sc_f +
                        "," +
                        sc_c +
                        "," +
                        sc_r +
                        "," +
                        sc_v +
                        "," +
                        sc_e +
                        "," +
                        sc_p +
                        "," +
                        sc_s +
                        "," +
                        sc_app +
                        "," +
                        sc_re +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "videos") {
                $(sc_v).show();
                $(
                    sc_ad +
                        "," +
                        sc_a +
                        "," +
                        sc_b +
                        "," +
                        sc_f +
                        "," +
                        sc_c +
                        "," +
                        sc_r +
                        "," +
                        sc_j +
                        "," +
                        sc_e +
                        "," +
                        sc_p +
                        "," +
                        sc_s +
                        "," +
                        sc_app +
                        "," +
                        sc_re +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "events") {
                $(sc_e).show();
                $(
                    sc_ad +
                        "," +
                        sc_a +
                        "," +
                        sc_b +
                        "," +
                        sc_f +
                        "," +
                        sc_c +
                        "," +
                        sc_r +
                        "," +
                        sc_j +
                        "," +
                        sc_v +
                        "," +
                        sc_p +
                        "," +
                        sc_s +
                        "," +
                        sc_app +
                        "," +
                        sc_re +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "products") {
                $(sc_p).show();
                $(
                    sc_ad +
                        "," +
                        sc_a +
                        "," +
                        sc_b +
                        "," +
                        sc_f +
                        "," +
                        sc_c +
                        "," +
                        sc_r +
                        "," +
                        sc_j +
                        "," +
                        sc_v +
                        "," +
                        sc_e +
                        "," +
                        sc_s +
                        "," +
                        sc_app +
                        "," +
                        sc_re +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "services") {
                $(sc_s).show();
                $(
                    sc_ad +
                        "," +
                        sc_a +
                        "," +
                        sc_b +
                        "," +
                        sc_f +
                        "," +
                        sc_c +
                        "," +
                        sc_r +
                        "," +
                        sc_j +
                        "," +
                        sc_v +
                        "," +
                        sc_e +
                        "," +
                        sc_p +
                        "," +
                        sc_app +
                        "," +
                        sc_re +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "softwareapp") {
                $(sc_app).show();
                $(
                    sc_ad +
                        "," +
                        sc_a +
                        "," +
                        sc_b +
                        "," +
                        sc_f +
                        "," +
                        sc_c +
                        "," +
                        sc_r +
                        "," +
                        sc_j +
                        "," +
                        sc_v +
                        "," +
                        sc_e +
                        "," +
                        sc_p +
                        ", " +
                        sc_s +
                        ", " +
                        sc_re +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "review") {
                $(sc_re).show();
                $(
                    sc_ad +
                        "," +
                        sc_a +
                        "," +
                        sc_b +
                        "," +
                        sc_f +
                        "," +
                        sc_c +
                        "," +
                        sc_r +
                        "," +
                        sc_j +
                        "," +
                        sc_v +
                        "," +
                        sc_e +
                        "," +
                        sc_p +
                        "," +
                        sc_app +
                        "," +
                        sc_s +
                        "," +
                        sc_cu
                ).hide();
            }
            if (seopress_rs_type == "custom") {
                $(sc_cu).show();
                $(
                    sc_ad +
                        "," +
                        sc_a +
                        "," +
                        sc_b +
                        "," +
                        sc_f +
                        "," +
                        sc_c +
                        "," +
                        sc_r +
                        "," +
                        sc_j +
                        "," +
                        sc_v +
                        "," +
                        sc_e +
                        "," +
                        sc_p +
                        "," +
                        sc_app +
                        "," +
                        sc_s +
                        "," +
                        sc_re
                ).hide();
            }
        }
    );
});
