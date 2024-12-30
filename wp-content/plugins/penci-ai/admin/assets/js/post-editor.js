(function ($) {
    'use strict';

    var totalGenerated = 0;
    $(document).on("click", ".generate-ai-content", function (e) {
        e.preventDefault();

        totalGenerated = 0;

        var prompt = $('#prompt-input').val();

        if (!$('#penciai-generate-ai-content .penciai_spinner').hasClass('hide_spin')) {
            return;
        }

        if (prompt === "") {
            $('.empty-prompt.badge').fadeIn(300);
            setTimeout(function () {
                $('.empty-prompt.badge').fadeOut(300);
            }, 4000);

            return;
        }

        var session_key = generateKey();
        $('#generation_session_key').val(session_key);

        var first_prompt = prompt;

        var inputs = $('#penciai-ai-inputs').serialize();
        let params = Object.fromEntries(new URLSearchParams(inputs));
        Object.assign(params, {'session_key': session_key});

        if ("penciai_auto_content_settings" in params) {
            setInitInputValues();
            $('#penciai-generate-ai-content span.title').text("Generating titles"); //todo
            generatePostTitles(params, prompt);
            setTimeout(function () {
                $('#ai-response').slideDown(500);
            }, 1000);

            return;
        }

        if ("image_generation_mode" in params) {
            setInitInputValues();
            generate_image_from_image_generation_page(params)

            return;
        }

        if ("select-title-before-generate" in params && 'penciai_is_title_selected' in params && params['penciai_is_title_selected'] === "0") {

            setInitInputValues();
            $('#penciai-generate-ai-content span.title').text("Generating titles"); //todo
            generatePostTitlesBeforeGenerate(params, prompt);
            setTimeout(function () {
                $('#ai-response').slideDown(500);
            }, 1000);

            return;
        }

        generate_init(params);

        if ('auto-generate-image' in params && params['auto-generate-image'] === 'on') {
            if ($('.penciai-single-generation-page').length) {
                generate_image(prompt, 'true');
            } else {
                generate_image(prompt);
            }
        }

        generate_contents(params, first_prompt, prompt);

    });


    function generate_contents(params, first_prompt, prompt) {
        if ("generate-title" in params && ("select-title-before-generate" in params) !== true) {
            /*Getting the title*/
            Object.assign(params, {"type": "title", "first_prompt": first_prompt});

            penciai_ajax(prompt, params, function (content) {
                $('.blog-title h1').html(penciai_getTitle(content));
            }, 'title')

                .then(function (res) {
                    $('.blog-title h1').html(penciai_getTitle(res));

                    if ($('#penciai_title').val().length > 0) {
                        prompt = $('#penciai_title').val();
                    }

                    /*If call-to-action set to the start of the content*/


                    /*Is introduction has selected*/
                    if ("add-introduction" in params) {

                        if ("add-introduction-text" in params) {
                            add_introduction_text();
                        }
                        Object.assign(params, {"type": "introduction"});
                        penciai_ajax(prompt, params, add_introduction, 'introduction').then(function (response) {
                            totalGenerated += 1;
                            $('.introduction p').html(remove_first_br(unescapeHTML(response)));
                            scrollToBottom();

                            content_structure_request_and_rest(prompt, params);
                        })
                    } else {
                        content_structure_request_and_rest(prompt, params);
                    }


                })
        } else {

            /*Is introduction has selected*/
            if ("add-introduction" in params) {

                if ("add-introduction-text" in params) {
                    add_introduction_text();
                }
                Object.assign(params, {"type": "introduction"});
                penciai_ajax(prompt, params, add_introduction, 'introduction').then(function () {
                    content_structure_request_and_rest(prompt, params);
                })
            } else {
                content_structure_request_and_rest(prompt, params);
            }
        }

    }

    function generate_image_from_image_generation_page(params) {

        var prompt = $('#prompt-input').val();
        Object.assign(params, {"prompt": prompt});

        $('#ai-response').slideDown(300);

        var html = '';
        var number_of_image = parseInt(params['number_of_image']);
        for (let i = 0; i < number_of_image; i++) {
            html += '<div class="variation-image-item penciai-image-not-set"><span class="peciai-img-loading"></span><span class="penciai-image-download">Save</span><img src=""></div>';
        }
        var el = $('.penciai-images .penciai-image-variation-items');
        if ($('#penciai-new-images-with-existing').is(":checked")) {
            el.html(el.html() + html);
        } else {
            el.html(html);
        }

        penciai_ajax_("penciai_generate_variation_images", params).then(function (response) {
                generation_finished();

                if (typeof response.data != "undefined") {
                    var images = response.data;
                    //var html = '<div class="penciai-image-variation-items">';

                    //console.log(images)
                    $('.penciai-image-not-set').each(function (i, v) {
                        $(this).find('img').attr('src', images[i].url);
                        $(this).find('.peciai-img-loading').remove();
                    });
                    //html += '</div>';

                    $('.variation-image-item').removeClass("penciai-image-not-set");
                    //$('.penciai-images').html(html);
                } else {
                    generate_canceled();
                    alert("Something went wrong! please try again later."); //todo
                }


            }, function (e) {
                generate_canceled();
            }
        )
    }

    function generatePostTitles(params, prompt) {
        /*Getting the title*/
        Object.assign(params, {"type": "generate_titles"});

        penciai_ajax(prompt, params, function (content) {
            $('.penciai-titles').html(penciai_getTitle(content));
        }, 'generate_titles').then(function (response) {
            create_list(response)
            generation_finished();
        });
    }

    function generatePostTitlesBeforeGenerate(params, prompt) {
        /*Getting the title*/

        var titles_count = $('#penciai-how-many-titles-show-first').val();
        Object.assign(params, {"type": "generate_titles", "titles-count": titles_count});

        penciai_ajax(prompt, params, function (content) {
            $('.penciai-titles').html(penciai_getTitle(content));
        }, 'generate_titles').then(function (response) {
            console.log(response);
            create_list_before_generate(response)
            generation_finished();
        })
    }

    function create_list_before_generate(response) {
        if (response === "") {
            alert("Something went wrong, empty respopnse, please try again!");
            return;
        }

        var titles = remove_first_br(unescapeHTML(response)).split("<br>");

        var html = '<h2>Select a title to generate a post</h2><ul class="penciai-before_content_generate-list-items">'; //todo

        var exceeded = false;
        titles.forEach(function (value, i) {
            var title = penciai_replace_double_quo(penciai_removeNumbers(value.trim()));

            if (i > 2) {
                exceeded = true;
            }
            if (title !== "" && i < 3) {
                var li = '<li class="penciai-list-item" style="cursor: pointer;" data-cursor="pointer">\n' +
                    '     <div class="list-sub-item penciai-list-title">\n' +
                    '           ' + title + '\n' +
                    '     </div>\n' +
                    '</li>';
                html += li;
            }

        })
        html += '</ul>';

        $('.titles_before_content_generate').html(html);
        $('.titles_before_content_generate').slideDown(300);
    }

    function generate_image(prompt, return_both = 'false', numberOfImages = 1) {
        var datas = {
            'action': 'penciai_generate_image',
            'rc_nonce': pcacg.nonce,
            'prompt': prompt,
            'image-size': $('[name="ai-image-size"]').val(),
            'return_both': return_both,
            'numberOfImages': numberOfImages,
            'engine': $('[name="ai-image-engine"]').val(),
        };


        var inputs = $('#penciai-ai-inputs').serialize();
        let params = Object.fromEntries(new URLSearchParams(inputs));

        Object.assign(datas, params);

        $.ajax({
            url: pcacg.ajax_url,
            data: datas,
            type: 'post',
            dataType: 'json',

            beforeSend: function () {

            },
            success: function (r) {
                if (r.success) {
                    $('.featured-image-generation-complete').fadeIn(300);
                    setTimeout(function () {
                        $('.featured-image-generation-complete').fadeOut(300);
                    }, 5000);
                    if ($('.penciai-single-generation-page').length) {
                        if (r.data.id !== undefined) {
                            $('.penciai-featured-image-section').removeClass('penciai-hidden');
                            $('.penciai-featured-image').attr('src', r.data.url);
                            $('.featured_image_id').val(r.data.id);
                        }
                    } else if (wp.media.featuredImage !== undefined) {
                        wp.media.featuredImage.set(r.data.id);
                        setTimeout(function () {
                            if ($('.components-button.is-destructive:not(.editor-post-trash)').length) {
                                $('.components-button.is-destructive:not(.editor-post-trash)').click();
                                setTimeout(function () {
                                    $('.components-button.editor-post-featured-image__toggle').click();
                                    $('.media-frame').addClass('penciai-hidden');
                                    $('.button.media-button').click();
                                    $('.media-frame').removeClass('penciai-hidden');
                                }, 200);
                            } else {
                                $('.components-button.editor-post-featured-image__toggle').click();
                                $('.media-frame').addClass('penciai-hidden');
                                $('.button.media-button').click();
                                $('.media-frame').removeClass('penciai-hidden');
                            }

                        }, 500);
                    }


                } else {
                    console.log('Something went wrong, please try again!');
                }

            }, error: function () {

            }
        });
    }


    $(document).on("click", ".penciai-blog-post", function (e) {
        e.preventDefault();
        $('#penciai_is_content_scrollable').val("0");
    });

    $(document).on("click", "#penciai-cancel-btn", function (e) {
        e.preventDefault();
        $('#penciai_is_generation_cancelled').val("1");
        $('#penciai-generate-ai-content .penciai_spinner').addClass('hide_spin');
    });

    function scrollToBottom() {
        if ($('#penciai_is_content_scrollable').val() === "1") {
            $('.penciai-blog-post').scrollTop($('.penciai-blog-post')[0].scrollHeight - $('.penciai-blog-post').height());
        }
    }

    function add_introduction_text() {
        $('.introduction h2').removeClass('penciai-hidden');
        scrollToBottom();
        content_streaming($('.introduction_text').val(), $('.introduction h2'));
    }

    function content_streaming(str = "", element, speedInMiliSeconds = 50) {
        var i = 0;
        var AutoRefresh = setInterval(function () {
            var ii = i + 1;
            element.text(str.substring(0, ii));

            if (str.length <= ii) {
                clearInterval(AutoRefresh);
            }
            i++;
        }, speedInMiliSeconds);
    }

    function add_introduction(response) {
        totalGenerated += 1;
        if (response.length > 0) {
            $('.introduction .rc_loader').remove();
        }
        $('.introduction p').html(remove_first_br(unescapeHTML(response)));
        scrollToBottom();
    }

    function add_conclusion(response) {
        totalGenerated += 1;

        if (response.length > 0) {
            $('.conclusion .rc_loader').remove();
        }
        $('.conclusion p').html(remove_first_br(unescapeHTML(response)));
        scrollToBottom()
    }

    function add_conclusion_text() {
        $('.conclusion h2').removeClass('penciai-hidden');
        scrollToBottom()
        content_streaming($('.conclusion_text').val(), $('.conclusion h2'));
    }

    function generate_init(params) {
        setInitInputValues();

        $('.titles_before_content_generate').slideUp(200);
        $('[name="penciai_is_title_selected"]').val("0");

        var html = '<button class="extend-blog-post-preview" style="visibility: hidden;"><svg class="extend" fill="#000000" height="32px" width="32px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M469.5,0H44.755C20.697,0,0,18.838,0,42.891v424.745C0,491.689,20.697,512,44.755,512H469.5 c24.059,0,42.5-20.311,42.5-44.364V42.891C512,18.838,493.558,0,469.5,0z M490.213,468.372c0,12.061-9.778,21.84-21.84,21.84 H43.628c-12.063,0-21.84-9.779-21.84-21.84V43.628c0-12.061,9.778-21.84,21.84-21.84h424.745c12.063,0,21.84,9.779,21.84,21.84 V468.372z"></path> </g> </g> <g> <g> <path d="M436.872,65.362H327.936c-6.016,0-10.894,4.872-10.894,10.894s4.878,10.894,10.894,10.894h82.638L298.447,198.91 c-4.255,4.255-4.255,10.963,0,15.218c2.128,2.128,4.915,3.101,7.702,3.101c2.787,0,5.01-1.109,7.138-3.237l111.564-112.176v82.638 c0,6.021,4.878,10.894,10.894,10.894s10.894-4.872,10.894-10.894V75.519C446.638,69.497,442.888,65.362,436.872,65.362z"></path> </g> </g> <g> <g> <path d="M226.42,285.872c-4.255-4.255-11.431-4.439-15.686-0.184L98.043,397.816v-82.638c0-6.021-4.878-10.894-10.894-10.894 s-10.894,4.872-10.894,10.894v108.936c0,0.715,0.638,1.428,0.779,2.133c0.066,0.338,0.474,0.652,0.572,0.979 c0.105,0.351,0.326,0.71,0.467,1.05c0.168,0.404,0.463,0.771,0.675,1.149c0.134,0.239,0.274,0.492,0.427,0.723 c0.8,1.199,1.85,2.231,3.05,3.032c0.234,0.154,0.496,0.261,0.739,0.396c0.375,0.21,0.745,0.434,1.146,0.601 c0.342,0.141,0.701,0.221,1.053,0.327c0.327,0.096,0.641,0.59,0.979,0.657c0.703,0.141,1.419,0.583,2.133,0.583h108.936 c6.016,0,10.894-4.872,10.894-10.894s-4.878-10.894-10.894-10.894h-82.638l112.128-112.495 C230.958,297.208,230.676,290.128,226.42,285.872z"></path> </g> </g> </g></svg><svg class="compress penciai-hidden" fill="#000000" height="32px" width="32px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512.201 512.201" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M509.081,3.193c-4.16-4.16-10.88-4.16-15.04,0l-195.2,195.2V75.086c0-5.333-3.84-10.133-9.067-10.88 c-6.613-0.96-12.267,4.16-12.267,10.56V224.1c0,5.867,4.8,10.667,10.667,10.667h149.013c5.333,0,10.133-3.84,10.88-9.067 c0.96-6.613-4.16-12.267-10.56-12.267H313.881l195.2-195.093C513.241,14.18,513.241,7.353,509.081,3.193z"></path> <path d="M224.174,277.433H75.161c-5.333,0-10.133,3.84-10.88,9.067c-0.96,6.613,4.16,12.267,10.56,12.267h123.627L3.268,493.86 c-4.267,4.053-4.373,10.88-0.213,15.04c4.16,4.16,10.88,4.373,15.04,0.213c0.107-0.107,0.213-0.213,0.213-0.213l195.2-195.093 v123.2c0,5.333,3.84,10.133,9.067,10.88c6.613,0.96,12.267-4.16,12.267-10.56V288.1 C234.841,282.233,230.041,277.433,224.174,277.433z"></path> </g> </g> </g> </g></svg></button>';

        var contentLoaderHtml = '<div class="rc_loader"><div class="rc_loader-bar"></div><div class="rc_loader-bar"></div><div class="rc_loader-bar"></div></div>';

        var title_text = "";
        if ($('.penciai_selected_title').val() !== "") {
            title_text = $('.penciai_selected_title').val();
        }

        if ('generate-title' in params || 'select-title-before-generate' in params) {
            html += '<div class="blog-title"><h1>' + title_text + '</h1></div>';
        }
        if ('add-introduction' in params) {
            html += '<div class="introduction"><h2 class="penciai-hidden"></h2><p></p>' + contentLoaderHtml + '</div>';
        }
        if ('ai-content-structure' in params && params['ai-content-structure'] === 'topic_wise') {
            html += '<div class="topics"></div>';
        } else {
            html += '<div class="ai-generated-contents">' + contentLoaderHtml + '</div>';
        }
        if ('add-conclusion' in params) {
            html += '<div class="conclusion penciai-hidden"><h2 class="penciai-hidden"></h2><p></p>' + contentLoaderHtml + '</div>';
        }
        if ('add-excerpt' in params) {
            html += '<div class="excerpt penciai-hidden"><h2>Excerpt</h2><p></p>' + contentLoaderHtml + '</div>';
        }
        $('.penciai-blog-post').html(html);

        if (("penciai-language" in params && params['penciai-language'] !== "en") && ('add-introduction' in params && "add-introduction-text" in params) || ('add-conclusion' in params && "add-conclusion-text" in params)) {
            getIntroAndConcText(params['penciai-language'], params['penciai-language-text']).then(
                function (e) {
                    var array;
                    if (typeof e.data == "string") {
                        array = JSON.parse(remove_first_br(unescapeHTML(e.data)));
                    } else {
                        array = e;
                    }

                    $('.introduction_text').val(array[0]);
                    $('.conclusion_text').val(array[1]);
                },
                function (error) {
                    console.log("Introduction or conclusion text could not set for unknown reason.")
                }
            )
        }

        empty_html_implements_in_preview_body(params);

        setTimeout(function () {
            $('#ai-response').slideDown(500);
        }, 1000);

        if ($('body').outerWidth() > 782) {
            if ($('.components-button[aria-label="Settings"]').length) {
                if ($('.edit-post-sidebar').length == 0) {
                    $('.components-button[aria-label="Settings"]').click();

                    setTimeout(function () {
                        $('.components-button[data-label="Post"]').click();
                    }, 500);
                } else {
                    $('.components-button[data-label="Post"]').click();
                }

            }
        }


    }

    function setInitInputValues() {
        $('#penciai_is_content_scrollable').val("1");
        $('#ai-response').removeClass('penciai-hidden-important');
        $('.penciai-cancel-btn').removeClass('penciai-hidden');
        $('.penciai-blog-post').removeClass('expandable').html("");
        $('#penciai_content_structure_completed').val("0")
        //$('[name="penciai_is_title_selected"]').val("0")

        $('#penciai-generate-ai-content .title').text('Generating'); //Todo

        $('#penciai-generate-ai-content .penciai_spinner').removeClass('hide_spin');
        $('#penciai_is_generation_cancelled').val("0")
    }

    function generation_finished() {
        $('.penciai-cancel-btn').addClass('penciai-hidden');
        $('#penciai-generate-ai-content .penciai_spinner').addClass('hide_spin');
        $('#penciai-generate-ai-content .title').text('Generate'); //Todo
        $('.generation-complete.badge').fadeIn(300);
        $('[name="penciai_is_title_selected"]').val("0");

        setTimeout(function () {
            $('.generation-complete.badge').fadeOut(300);
        }, 5000);

        $('.penciai_rating_section').fadeIn(400);
    }

    function content_structure_request_and_rest(prompt, params) {

        if ("ai-content-structure" in params) {
            if (params['ai-content-structure'] === 'topic_wise') {
                Object.assign(params, {"type": "topic_wise"});
                penciai_ajax(prompt, params, null, 'topic_wise').then(function (response) {
                    var topics = getTheListToArray(penciai_replace_double_quo(remove_first_br(unescapeHTML(response))));

                    Object.assign(params, {"type": "topic_detailes"});
                    request_topic_detailes_recursively(topics, params, 1);

                    checkForTopicsComplete().then(function () {
                        if ("add-conclusion" in params) {
                            if ("add-conclusion-text" in params) {
                                add_conclusion_text();
                            }
                            $('.conclusion').removeClass('penciai-hidden');
                            scrollToBottom();

                            Object.assign(params, {"type": "conclusion"});
                            penciai_ajax(prompt, params, add_conclusion, 'conclusion').then(function (response) {
                                totalGenerated += 1;
                                $('.conclusion .rc_loader').remove();
                                $('.conclusion p').html(remove_first_br(unescapeHTML(response)));
                                scrollToBottom()

                                if ("add-excerpt" in params) {
                                    generate_eaxcerpt(prompt, params);
                                } else {
                                    generation_finished();
                                }
                            })
                        } else if ("add-excerpt" in params) {
                            generate_eaxcerpt(prompt, params);
                        } else {
                            generation_finished();
                        }
                    })

                })
            } else {
                Object.assign(params, {"type": params['ai-content-structure']});
                penciai_ajax(prompt, params, function (response) {
                    if (params['ai-content-structure'] == "table" || params['ai-content-structure'] == "tutorial" || params['ai-content-structure'] == "how-to" || params['ai-content-structure'] == "analysis") {
                        response = unescapeHTML(response).replace(/<br>/g, "");
                    } else if (params['ai-content-structure'] == "interviews" || params['ai-content-structure'] == "opinion" || params['ai-content-structure'] == "review" || params['ai-content-structure'] == "case-study" || params['ai-content-structure'] == "guide" || params['ai-content-structure'] == "email" || params['ai-content-structure'] == "youtube_script" || params['ai-content-structure'] == "social_media_post") {
                        response = unescapeHTML(response).replace(/<br><br>/g, "");
                    } else if (params['ai-content-structure'] == "article") {
                        response = unescapeHTML(response).replace(/<br><br>/g, "<br>");
                    } else {
                        response = remove_first_br(unescapeHTML(response));
                    }

                    totalGenerated += 1;
                    $('.ai-generated-contents').html(response);
                }, 'not_topic_wise').then(function (response) {
                    totalGenerated += 1;

                    if (params['ai-content-structure'] == "table" || params['ai-content-structure'] == "tutorial" || params['ai-content-structure'] == "how-to" || params['ai-content-structure'] == "analysis") {
                        response = unescapeHTML(response).replace(/<br>/g, "");
                    } else if (params['ai-content-structure'] == "interviews" || params['ai-content-structure'] == "opinion" || params['ai-content-structure'] == "review" || params['ai-content-structure'] == "case-study" || params['ai-content-structure'] == "guide" || params['ai-content-structure'] == "email" || params['ai-content-structure'] == "youtube_script" || params['ai-content-structure'] == "social_media_post") {
                        response = unescapeHTML(response).replace(/<br><br>/g, "");
                    } else {
                        response = remove_first_br(unescapeHTML(response));
                    }

                    $('.ai-generated-contents').html(response);

                    if ("add-conclusion" in params) {
                        if ("add-conclusion-text" in params) {
                            add_conclusion_text();
                        }
                        $('.conclusion').removeClass('penciai-hidden');
                        scrollToBottom();

                        Object.assign(params, {"type": "conclusion"});
                        penciai_ajax(prompt, params, add_conclusion, 'conclusion').then(function (response) {
                            totalGenerated += 1;
                            $('.conclusion p').html(remove_first_br(unescapeHTML(response)));

                            scrollToBottom()

                            generation_finished();

                        })
                    } else if ("add-excerpt" in params) {
                        generate_eaxcerpt(prompt, params);
                    } else {
                        generation_finished();
                    }

                })
            }
        }
    }


    function request_topic_detailes_recursively(topics, params, now) {

        var i = now - 1;
        var prompt = topics[i];

        var to = topicsTitleStream(topics[i], i);
        setTimeout(function () {
            $('.topics .topic-' + now + ' .rc_loader').removeClass("penciai-hidden-important");
            scrollToBottom();
            penciai_ajax(prompt, params, function (response) {
                if (response.length > 0) {
                    $('.topics .topic-' + now + ' .rc_loader').remove();
                }
                $('.topics .topic-' + now + ' p').html(remove_first_br(unescapeHTML(response)));
            }, 'topic_wise').then(function (response) {

                $('.topics .topic-' + now + ' .rc_loader').remove();
                $('.topics .topic-' + now + ' p').html(remove_first_br(unescapeHTML(response)));

                if (topics.length > now) {
                    Object.assign(params, {"type": "topic_detailes"});
                    request_topic_detailes_recursively(topics, params, now + 1);
                } else {
                    $('#penciai_content_structure_completed').val("1");
                }
            });
            var ii = i + 1;
            $('.topics .topic-' + ii + ' .move-buttons').removeClass('penciai-hidden');
        }, to);
    }

    function generate_eaxcerpt(prompt, params) {
        Object.assign(params, {"type": "excerpt"});
        $('.excerpt').removeClass('penciai-hidden');
        scrollToBottom();

        penciai_ajax(prompt, params, function (response) {
            if (response.length > 0) {
                $('.excerpt .rc_loader').remove();
            }
            $('.excerpt p').removeClass('penciai-hidden').html(remove_first_br(unescapeHTML(response)));
        }, 'call_to_action').then(function (response) {
            $('.excerpt .rc_loader').remove();
            $('.excerpt p').removeClass('penciai-hidden').html(remove_first_br(unescapeHTML(response)));

            generation_finished();
        })
    }

    function getIntroAndConcText(lang = "en", lang_name = 'English', need = 'introduction') {
        var json = {
            "en": ["Introduction", "Conclusion"],
            "bn": ["ভূমিকা", "উপসংহার"],
            "es": ["Introducción", "Conclusión"],
            "de": ["Einleitung", "Schlussfolgerung"],
            "fr": ["Introduction", "Conclusion"],
            "hr": ["Uvod", "Zaključak"],
            "it": ["Introduzione", "Conclusione"],
            "nl": ["Inleiding", "Conclusie"],
            "pl": ["Wprowadzenie", "Wnioski"],
            "pt-BR": ["Introdução", "Conclusão"],
            "pt-PT": ["Introdução", "Conclusão"],
            "vi": ["Giới thiệu", "Kết luận"],
            "tr": ["Giriş", "Sonuç"],
            "ru": ["Введение", "Заключение"],
            "ar": ["مقدمة", "خاتمة"],
            "th": ["บทนำ", "บทสรุป"],
            "ko": ["서론", "결론"],
            "zh-CN": ["引言", "结论"],
            "zh-TW": ["引言", "結論"],
            "zh-HK": ["引言", "结论"],
            "ja": ["「はじめに」", "「結論」"],
            "ach": ["Entwodiksyon", "Konklizyon"],
            "af": ["Inleiding", "Gevolgtrekking"],
            "ak": ["Pengantar", "Kesimpulan"],
            "az": ["Giriş", "Nəticə"],
            "mk": ["Вовед", "Заклучок", ["Вовед", "Заклучок"]],
            "mn": ["Танилцуулга", "Дүгнэлт"],
            "hi": ["परिचय", "निष्कर्ष"],
            "sr": ["Увод", "Закључак"],
            "tt": ["Кереш", "Йомгаклау"],
            "tg": ["Муқаддима", "Хулоса"],
            "uk": ["Вступ", "Висновок"],
            "id": ["Pendahuluan", "Kesimpulan"],
            "ro": ["Introducere", "Concluzie"],
            "rm": ["Ro-ràdh", "Co-dhùnadh"],
            "sl": ["Uvod", "Zaključek"],
            "sk": ["Úvod", "Záver"],
            "tk": ["Giriş", "Netije"],
            "tw": ["Nnianim asɛm", "Awiei"],
            "be": ["Уводзіны", "Заключэнне"],
            "bg": ["Въведение", "Заключение"],
            "ky": ["Кириш", "Корутунду"],
            "kk": ["Кіріспе", "Қорытынды"],
            "fil": ["Panimula", "Konklusyon"],
            "fo": ["Inngangur", "Niðurstaða"],
            "fy": ["Ynlieding", "Konklúzje"],
            "ga": ["Réamhrá", "Conclúid"],
            "gd": ["Ro-ràdh", "Co-dhùnadh"],
            "gn": ["Introduzione", "Conclusione"],
            "haw": ["Introduction", "Hoʻopau"],
            "bem": ["Sumo", "Mhedziso"],
            "rn": ["Intangiriro", "Umwanzuro"],
            "xh": ["Intshayelelo", "Isiphelo"],
            "zu": ["Isingeniso", "Isiphetho"],
            "pa": ["ਜਾਣ-ਪਛਾਣ", "ਸਿੱਟਾ"]
        };
        return new Promise((resolve, reject) => {
            if (lang in json) {
                resolve(json[lang]);
            } else {
                penciai_ajax_('get_intro_and_conc', {'lang': lang, 'lang_name': lang_name}).then(
                    function (e) {
                        resolve(e);
                    },
                    function (error) {
                        reject(new Error('Something is not right!'));
                    }
                )
            }
        })
    }

    function checkForTopicsComplete() {
        return new Promise((resolve, reject) => {
            var intVal = setInterval(function () {
                if ($('#penciai_content_structure_completed').val() == "1") {
                    resolve('success');
                    clearInterval(intVal);
                }
            }, 3000);
        });
    }

    function topicsTitleStream(string, topic_class) {
        topic_class += 1;
        var splitWords = string.split(' ');
        for (let i = 0; i < splitWords.length; i++) {
            setTimeout(function () {
                $('.topics .topic-' + topic_class + ' .topic-heading').append(splitWords[i] + ' ');
                $('#penciai-generate-ai-content .penciai_spinner').removeClass('hide_spin');
                scrollToBottom()
            }, 100 * i);
        }

        return (100 * splitWords.length);
    }

    function generateKey() {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        for (let i = 0; i < 8; i++) {
            key += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return key;
    }

    function penciai_getTitle(html) {
        return penciai_replace_double_quo(penciai_remove_html_tags(unescapeHTML(html)));
    }

    function getTheListToArray(string) {
        if (string.includes("<br>")) {
            return penciai_removeNumbers(string).split("<br>");
        } else {
            return penciai_removeNumbers(string).split("</br>");
        }
    }

    function empty_html_implements_in_preview_body(params) {
        if ("ai-content-structure" in params && params['ai-content-structure'] === 'topic_wise') {
            if ("topics-count" in params && params['topics-count'] !== '') {
                var topics = parseInt(params['topics-count']);
                var topics_html = "";
                var topics_heading_tag = 'h2';
                if ("penciai-topics-tag" in params && params['penciai-topics-tag'] !== '') {
                    topics_heading_tag = params['penciai-topics-tag'];
                }

                var contentLoaderHtml = '<div class="rc_loader penciai-hidden-important"><div class="rc_loader-bar"></div><div class="rc_loader-bar"></div><div class="rc_loader-bar"></div></div>';

                for (let i = 1; i <= topics; i++) {
                    topics_html += '<div class="topic topic-' + i + '"><' + topics_heading_tag + ' class="topic-heading"></' + topics_heading_tag + '><div class="move-buttons penciai-hidden"><button class="move-up" onclick="penciai_moveUp.call(this)"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 14L12 9L17 14H7Z" fill="#000000"></path></svg></button><button class="move-down" onclick="penciai_moveDown.call(this)"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10L12 15L17 10H7Z" fill="#000000"></path></svg></button></div><p></p>' + contentLoaderHtml + '</div>';
                }

                $('.penciai-blog-post .topics').html(topics_html);
            }
        }
    }

    function penciai_ajax(prompt = "", ai_inputs, callback = null, currentAction = "") {
        if ($('#penciai_is_generation_cancelled').val() === "1") {
            generate_canceled(ai_inputs['session_key']);
            return;
        }
        if ('session_key' in ai_inputs && ai_inputs['session_key'] !== $('#generation_session_key').val()) {
            generate_canceled(ai_inputs['session_key']);
            return;
        }

        var datas = {
            'action': 'penci_ai_ai_data',
            'rc_nonce': pcacg.nonce,
            'prompt': prompt,
        };
        if (Object.keys(ai_inputs).length > 0) {
            Object.assign(datas, ai_inputs);
        }

        var ai_response = "";
        var error_message = "";
        return new Promise((resolve, reject) => {
            return $.ajax({
                url: pcacg.ajax_url,
                data: datas,
                type: 'post',
                //dataType: 'json',

                beforeSend: function () {

                },
                xhrFields: {
                    // Getting on progress streaming response
                    onprogress: function (e) {

                        var response = e.target.response;

                        ai_response = response;

                        if (penciai_isJSON(response)) {
                            var json = JSON.parse(response);
                            if (json.data !== "undefined" && json.data.error !== "undefined") {
                                ai_response = "__error__";
                                error_message = json.data.error.message
                            }
                        }

                        if ($('#penciai_is_generation_cancelled').val() === "1") {
                            generate_canceled(ai_inputs['session_key']);
                            reject("");
                            return;
                        }
                        if ('session_key' in ai_inputs && ai_inputs['session_key'] !== $('#generation_session_key').val()) {
                            generate_canceled(ai_inputs['session_key']);
                            reject("");
                            return;
                        }
                        if (callback !== null) callback(response, ai_inputs);

                        scrollToBottom()

                    }

                },
                success: function (e) {

                    if (e.data !== undefined) {
                        if (e.data !== "undefined" && e.data.error !== "undefined") {
                            ai_response = "__error__";
                            error_message = e.data.error.message
                        }
                    }

                    $('#penciai_recent_task_completed').val(currentAction);

                    if (currentAction === 'title') {
                        $('#penciai_title').val(penciai_getTitle(ai_response));
                    }
                    if (ai_response.trim() == "__api-empty__") {
                        alert("Please enter the API key on the settings panel first."); //todo
                        $('#ai-response').addClass('penciai-hidden-important');
                        generate_canceled(ai_inputs['session_key']);
                        reject(ai_response);
                    } else if (ai_response.trim() == '__invalid_api_key__') {
                        alert("API key is invalid. You can find your API key at https://platform.openai.com/account/api-keys"); //todo
                        $('#ai-response').addClass('penciai-hidden-important');
                        generate_canceled(ai_inputs['session_key']);
                        reject(ai_response);
                    } else if (ai_response.trim() == '__insufficient_quota__') {
                        alert("You exceeded your OpenAI's current quota, please check your OpenAI plan and billing details."); //todo
                        $('#ai-response').addClass('penciai-hidden-important');
                        generate_canceled(ai_inputs['session_key']);
                        reject(ai_response);
                    } else if (ai_response.trim() == '__server_error__') {
                        alert("The OpenAI server had an error while processing your request. Sorry about that!"); //todo
                        $('#ai-response').addClass('penciai-hidden-important');
                        generate_canceled(ai_inputs['session_key']);
                        reject(ai_response);
                    } else if (ai_response.trim() == '__error__') {
                        alert(error_message);
                        $('#ai-response').addClass('penciai-hidden-important');
                        generate_canceled(ai_inputs['session_key']);
                        reject(ai_response);
                    } else {
                        resolve(ai_response);
                    }
                    //console.log(ai_response)
                },
                error: function (e) {
                    $('#penciai-generate-ai-content .penciai_spinner').addClass('hide_spin');
                    $('#penciai-generate-ai-content .title').text('Generate'); //Todo
                    if (currentAction === 'title') {
                        $('#penciai_title').val(penciai_getTitle(ai_response));
                    }
                    reject(ai_response);
                    generate_canceled(ai_inputs['session_key']);
                }
            })
        });

    }

    $(document).on("mousemove", ".penciai-blog-post", function () {
        if ($(this).innerHeight() > 299) {
            $(this).addClass('expandable');
        } else {
            $(this).removeClass('expandable');
        }
    });

    $(document).on("click", ".extend-blog-post-preview .extend", function (e) {
        e.preventDefault();
        $('.penciai-blog-post.expandable').css({'max-height': 'max-content'});
        $(this).hide();
        $('.extend-blog-post-preview .compress').show();

    });
    $(document).on("click", ".extend-blog-post-preview .compress", function (e) {
        e.preventDefault();
        $('.penciai-blog-post.expandable').css({'max-height': '400px'});
        $(this).hide();
        $('.extend-blog-post-preview .extend').show();

    });


    function splitWords(string) {
        return string.split(' ');
    }

    $(document).on("input", ".range-input .slider", function () {
        $(this).siblings('label').children('input').val($(this).val());
    });

    $('.range-input label .input-box').keydown(function (event) {
        if (event.keyCode !== 8 && !$.isNumeric(event.key)) {
            event.preventDefault();
        }
    });

    $(document).on("input", ".range-input label .input-box", function () {
        $(this).closest('.range-input').find('.slider').val($(this).val());
        $(this).closest('.range-input').find('.slider').change();
    });

    $(document).on("click", ".penciai-settings-btn", function (e) {
        e.preventDefault();
        var setting = $(this).data('settings');
        $('.penciai-settings-btn').removeClass('pcactivel');
        $(this).addClass('pcactivel');
        $('.prompt-settings-item').not('.prompt-settings-item[data-tab="' + setting + '"]').slideUp();
        $('.prompt-settings-item[data-tab="' + setting + '"]').slideToggle();

    });

    $(document).on("click", ".minimize-btn", function (e) {
        e.preventDefault();
        $(this).closest('.prompt-settings-item').slideUp();
    });

    $(document).on("click", ".penciai_rating_close", function (e) {
        e.preventDefault();

        penciai_ajax_("penciai_rating_box_closed").then(function () {
            $('.penciai_rating_section').fadeOut(400);
        })
    });


    $(document).on("click", ".penciai_rating_already_did", function (e) {
        e.preventDefault();

        penciai_ajax_("penciai_rating_box_closed", {"already_did": "1"}).then(function () {
            $('.penciai_rating_section').fadeOut(400);
        })
    });

    $(document).on("click", ".penciai-before_content_generate-list-items .penciai-list-item", function () {
        var title = $(this).find('.penciai-list-title').text();
        $('#prompt-input').val(title.trim());
        $('.penciai_selected_title').val(title.trim());
        $('[name="penciai_is_title_selected"]').val("1");
        $('#penciai-generate-ai-content').click();
        $('.titles_before_content_generate').slideUp(300);
    });

    $(document).on("change", "select[data-has-subsettings]", function () {
        var id = $(this).attr('id');
        var settings_key = $(this).val();


        var isMultiple = false;
        var shown = false;
        $('[data-subsettings-of="' + id + '"]').each(function () {
            if ($(this).attr('data-sub-settings-key').indexOf(",")) {
                isMultiple = true;
                var keys = $(this).attr('data-sub-settings-key').split(',');
                for (let i = 0; i < keys.length; i++) {
                    if (settings_key == keys[i]) {
                        shown = true;
                        $(this).slideDown(300);
                    }

                }

                if (!shown) {
                    $(this).slideUp(300);
                }
            }
        });
        if (!isMultiple) {
            $('[data-subsettings-of="' + id + '"]').not('[data-sub-settings-key="' + settings_key + '"]').slideUp(300);
            $('[data-subsettings-of="' + id + '"][data-sub-settings-key="' + settings_key + '"]').slideDown(300);
        }

    });

    $(document).on("change", "input[data-has-subsettings]", function () {
        var id = $(this).attr('id');
        var is_checked = $(this).is(':checked');
        if (is_checked) {
            $('[data-subsettings-of="' + id + '"]').slideDown(300);
        } else {
            $('[data-subsettings-of="' + id + '"]').slideUp(300);
        }
    });

    $(document).on("change", '[name="ai-image-size"]', function () {
        if ($(this).val() == 'custom') {
            $('[name="custom-ai-image-size"]').removeClass('penciai-hidden');
        } else {
            $('[name="custom-ai-image-size"]').addClass('penciai-hidden');
        }
    });

    function penciai_removeNumbers(list) {
        return list.replace(/\d\.+/g, "");
    }

    $(document).on("click", "#penciai-content-generator-btn", function (e) {
        e.preventDefault();
        if (!$(this).hasClass('loading')) {
            $(this).toggleClass('activate');
            $('#penciai-promptbox').slideToggle();
        }

    });

    $(document).on("change", "#penciai-language", function () {
        var language = $(this).find('option:selected').data('name');
        $('#penciai_language_text').val(language);
    });

    $(document).on("focus", ".penciai-single-content-title", function () {
        $(this).siblings('label').addClass('screen-reader-text')
    });

    var expandBtnClicked = 0;
    $(document).on("click", "#expand-table-btn", function () {
        if (expandBtnClicked === 0) {
            $('.table.custom-table').addClass('penciai_table_expanded')
            $(this).text("Collapse the table") //todo
            expandBtnClicked = 1;
        } else {
            $('.table.custom-table').removeClass('penciai_table_expanded');
            $(this).text("Expand the table") //todo
            expandBtnClicked = 0;
        }
        $('.custom-table .language, .custom-table .content_length, .custom-table .keywords, .custom-table .writing_style, .custom-table .writing_tone').toggle();
    });

    $(document).on("click", ".code-box-insert-btn", function (e) {
        e.preventDefault();
        var generated_title = $('.penciai-blog-post .blog-title h1');
        var html = $(".penciai-blog-post").clone();
        html.find(".extend-blog-post-preview, .blog-title, .move-buttons, .penciai-hidden").remove();
        html.find("*").removeClass(function (index, className) {
            return (className.match(/(^|\s)topic-\S+/g) || []).join(' ');
        });
        if ($('#content').length) {
            $('#content').focus();
        }

        if ($('#penciai-editor').length) {
            $('#penciai-editor').focus();
        }

        $('.html-active #penciai-editor-tmce').click();
        if ($("#wp-content-wrap").hasClass('tmce-active')) {
            $('#title').siblings('label').addClass('screen-reader-text')
            $('#title').val(generated_title.html());

            setTimeout(function () {
                tinymce.get('content').execCommand('mceInsertContent', false, html.html());
            }, 1000);

            if ($('.excerpt').length && $('#excerpt').length) {
                $('#excerpt').text($('.excerpt p').text());
            }
        } else {
            if (wp.data.dispatch('core/editor') == undefined) {
                return
            }
            if (generated_title.length) {
                wp.data.dispatch('core/editor').editPost({title: generated_title.html()});
            }

            var name = 'core/freeform';
            var insertedBlock = wp.blocks.createBlock(name, {
                content: html.html(),
            });
            wp.data.dispatch('core/editor').insertBlocks(insertedBlock);

            setTimeout(function () {

                if ($('.components-button[aria-label="Settings"]').length) {
                    if ($('.edit-post-sidebar').length == 0) {
                        $('.components-button[aria-label="Settings"]').click();

                        setTimeout(function () {
                            $('.components-button[data-label="Post"]').click();
                        }, 500);
                    } else {
                        $('.components-button[data-label="Post"]').click();
                    }

                }
                setTimeout(function () {
                    var textarea = $('.editor-post-excerpt textarea');
                    if ($('.excerpt').length && textarea.length) {
                        textarea.text($('.excerpt p').text());
                    }
                }, 700);


            }, 100);
        }


    });


    function getMeridianTime(timeStamp) {

        var dateFormat = new Date(timeStamp);
        var options = {hour: 'numeric', minute: 'numeric', hour12: false};
        var meridian = dateFormat.toLocaleString("default", options);

        return meridian;
    }

    $(document).on("click", ".code-box-copy-btn", function (e) {
        e.preventDefault();


        var html = $(".penciai-blog-post").clone();
        html.find(".extend-blog-post-preview, .move-buttons").remove();
        html.find("*").removeClass(function (index, className) {
            return (className.match(/(^|\s)topic-\S+/g) || []).join(' ');
        });

        $('textarea.code-box-code').html(html.html());

        var t = $(this);

        var textarea = $('#ai-response .code-box-code');
        textarea.parent().show(); // make the textarea visible
        textarea.select(); // Select the contents of the textarea
        document.execCommand("copy"); // Execute the copy command
        textarea.hide(); // hide the textarea


        t.children('span').text('Copied!'); //Todo

        setTimeout(function () {
            t.children('span').text('Copy'); //Todo
        }, 5000);


    });

    $(document).ready(function () {

        if ($('#penciai_single_generation_promptbox').length) {
            $('#penciai_single_generation_promptbox').prepend($('#penciai-promptbox'));
            $('#penciai-promptbox').removeClass('penciai-hidden');
        }

        if ($('#penciai-image-generator').length) {
            $('#penciai-image-generator').prepend($('#penciai-promptbox'));
            $('#ai-response .code-box-header').html('<label>Generated images</label>');//todo
            $('#image-settings').show();
            $('#penciai-promptbox').removeClass('penciai-hidden');

        }

        const timeoutVar = setTimeout(function () {
            var gutenbergVitual_editor = document.getElementsByClassName('editor-post-title__input');
            var promptBoxHolder = document.getElementById('penciai-prompt-box-holder');
            if (gutenbergVitual_editor !== null && promptBoxHolder !== null) {
                const newElement = document.createElement('div');
                newElement.innerHTML = promptBoxHolder.innerHTML;

                const element = gutenbergVitual_editor[0];

                if (element !== undefined) {
                    element.parentNode.insertAdjacentHTML('beforebegin', newElement.outerHTML);
                }
            }
            var titleDiv = jQuery("#titlediv");
            if (titleDiv.length && titleDiv.siblings('#penciai-promptbox').length == 0) {
                $('#penciai-promptbox').insertBefore(jQuery("#titlediv"));
            }


            if (document.getElementById('penciai-placeholders') != null) {
                var placeholders = document.getElementById('penciai-placeholders').value;
                placeholders = placeholders.split(',');
                var rand = penciai_rand2(0, (placeholders.length - 1));
                var placeholder_init_text = penciai_removeNumbers2(placeholders[rand]).trim();
                //document.getElementById('prompt-input').setAttribute('placeholder', placeholder_init_text);


                document.getElementById('prompt-input').setAttribute('placeholder', '');
                for (let i = 0; i < placeholder_init_text.length; i++) {
                    setTimeout(function () {
                        var placeholder = document.getElementById('prompt-input').getAttribute('placeholder');
                        document.getElementById('prompt-input').setAttribute('placeholder', placeholder + placeholder_init_text[i]);
                    }, i * 50);
                }


                var AutoRefresh = setInterval(function () {
                    var rand = penciai_rand2(0, (placeholders.length - 1));
                    penciai_replace_placeholder_like_stream(penciai_removeNumbers2(placeholders[rand]).trim());
                }, 10000);

            }
            const bPost = document.getElementsByClassName('penciai-blog-post')[0];
            if (bPost !== undefined && window.innerHeight < 600) {
                bPost.style.maxHeight = '300px';
            }

            var penciai_btn = document.getElementById('penciai-content-generator-btn');
            if (penciai_btn !== null) {
                penciai_btn.classList.remove("loading");
            }

        }, 2000);
    });

    $(document).on("click", "#penciai-generate-title", function () {
        if ($(this).is(":checked")) {
            $("#penciai-select-title-before-generate").prop("checked", false);
        }
    });

    $(document).on("click", "#penciai-select-title-before-generate", function () {
        if ($(this).is(":checked")) {
            $("#penciai-generate-title").prop("checked", false);
        }
    });

    var penciai_get_time = 1;

    $(document).ready(function () {
        if ($('.penciai-scheduled-posts-table-section').length) {
            //console.log("asdasdasdasd")
            penciai_get_time = new Date($('.penciai_get_wp_current_timestamp').val()).getTime();
            //console.log(penciai_get_time)

            setInterval(function () {
                penciai_get_time += 1000;
            }, 1000);
        }

    });

    /*Image generation promptbox*/

    $(document).on("change", "#penciai_imagePresets", function () {
        var items = $(this).val();
        items = items.split(",");

        var elements = "";
        $(items).each(function (i) {
            var item = items[i].trim();

            elements += '.image-experiments #penciai_' + item + ',';


        });

        elements = elements.replace(/,\s*$/, "");

        $('.image-experiments input').prop('checked', false);
        $(elements).prop('checked', true);

    });


})(jQuery);

function penciai_moveUp() {
    let topic = this.parentNode.parentNode;
    topic.parentNode.insertBefore(topic, topic.previousSibling);
}

function penciai_moveDown() {
    let topic = this.parentNode.parentNode;
    topic.parentNode.insertBefore(topic.nextSibling, topic);
}

function penciai_rand2(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function penciai_removeNumbers2(list) {
    return list.replace(/\d\.|\d\d\.+/g, "");
}

function penciai_replace_placeholder_like_stream(string) {
    var prompt_input = document.getElementById('prompt-input');
    prompt_input.setAttribute('placeholder', '');
    for (let i = 0; i < string.length; i++) {

        setTimeout(function () {
            var placeholder = document.getElementById('prompt-input').getAttribute('placeholder');
            prompt_input.setAttribute('placeholder', placeholder + string[i]);
        }, i * 50);
    }
}


jQuery(function ($) {
    'use strict';


    var media_properties = ['id', 'url'];

    jQuery('.penciai-media-remove').on('click', function (e) {
        e.preventDefault();

        if (jQuery(this).attr('data-browse-button')) var $browse = jQuery(jQuery(this).attr('data-browse-button'));
        else var $browse = jQuery(this).siblings('.media-browse');

        if (!$browse.length) {
            alert('No sibling browse button found, or the data-browse-button attribute had no matching elements');
            return false;
        }

        $browse.data('attachment', false).trigger('attachment-removed');

        // Trigger the update for the browse button's fields
        for (i = 0; i < media_properties.length; i++) {
            var media_key = media_properties[i];
            var selector = $browse.attr('data-media-' + media_key); // data-media-url, data-media-link, data-media-height

            if (selector) {
                var $target = jQuery(selector);

                if ($target.length) {
                    $target.val('').trigger('media-updated').trigger('change');
                }
            }
        }

        return false;
    });

    var file_frame;
    jQuery('.penciai-media-browse').on('click', function (e) {
        e.preventDefault();

        var $this = jQuery(this);

        if (!wp || !wp.media) {
            alert('The media gallery is not available. You must admin_enqueue this function: wp_enqueue_media()');
            return;
        }

        // If the media frame already exists, reopen it.
        if (file_frame) {
            file_frame.open();
            return;
        }

        // Create the media frame.
        file_frame = wp.media.frames.file_frame = wp.media({
            title: $this.attr('data-media-title') || 'Browsing Media',
            button: {
                text: $this.attr('data-media-text') || 'Select',
            },
            multiple: false // Set to true to allow multiple files to be selected
        });

        // When an image is selected, run a callback.
        file_frame.on('select', function () {
            // We set multiple to false so only get one image from the uploader
            var attachment = file_frame.state().get('selection').first().toJSON();
            //console.log(attachment)
            $('.penciai-featured-image').attr('src', attachment.url)
            $('.penciai-featured-image-section').removeClass('penciai-hidden');
            $('.featured_image_id').val(attachment.id);

        });

        // Finally, open the modal
        file_frame.open();
    });
});

function generate_canceled(session_key) {
    var cncl_btn = jQuery('.penciai-cancel-btn[cancelled_session]');
    if (cncl_btn.length && cncl_btn.attr('cancelled_session') === session_key) {
        return;
    }
    jQuery('.penciai-cancel-btn').addClass('penciai-hidden').attr('cancelled_session', session_key);
    jQuery('#penciai-generate-ai-content .penciai_spinner').addClass('hide_spin');
    jQuery('#penciai-generate-ai-content .title').text('Generate'); //Todo
}

function unescapeHTML(escapedHTML) {
    return escapedHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
}

function penciai_remove_html_tags(content) {
    return content.replace(/<[^>]+>/g, '');
}

function penciai_replace_double_quo(content) {
    return content.replace(/"/g, '');
}

function remove_first_br(content) {
    var index = content.indexOf("<br><br>");
    return content.substring(index + 8);
}

function penciai_isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

function penciai_ajax_(action, input_data) {
    var datas = {
        'action': action,
        'rc_nonce': pcacg.nonce
    };
    Object.assign(datas, input_data);

    return new Promise((resolve, reject) => {
        return jQuery.ajax({
            url: pcacg.ajax_url,
            data: datas,
            type: 'post',
            dataType: 'json',

            beforeSend: function () {

            },
            success: function (r) {
                if (r.success) {
                    resolve(r);
                } else {
                    if (r.data !== undefined && r.data.trim() == "__api-empty__") {
                        alert("Please enter the API key on the settings panel first."); //todo
                        jQuery('#ai-response').addClass('penciai-hidden-important');
                        generate_canceled(input_data['session_key']);
                        reject(r.data);
                    } else if (r.data !== undefined && r.data.trim() == '__something_went_wrong__') {
                        alert("Something went wrong! please try again later"); //todo
                        jQuery('#ai-response').addClass('penciai-hidden-important');
                        generate_canceled(input_data['session_key']);
                        reject(r.data);
                    } else if (r.data !== undefined) {
                        alert(r.data); //todo
                        reject(r);
                    } else {
                        reject(r);
                    }
                }

            }, error: function (r) {
                if (r.data !== undefined && r.data.error !== undefined) {
                    alert(r.data.error.message);
                    reject(r);
                }
                console.log(r)
                reject(new Error('Something is not right!'));
            }
        });
    })
}

