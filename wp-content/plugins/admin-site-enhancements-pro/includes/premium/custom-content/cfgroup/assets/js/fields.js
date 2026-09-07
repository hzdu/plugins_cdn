(function($) {
    // Accented chars and their non-accented replacements
    var latin_map = {"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};

    $(function() {
        function zebra_stripes() {
            $('.fields .field_meta').removeClass('even');
            $('.fields .field_meta:even').addClass('even');
        }

        function init_tooltip() {
            $(document).on('mouseover', '.cfgroup_tooltip', function() {
                if ('undefined' == typeof $(this).data('powertip')) {
                    var content = $(this).find('.tooltip_inner').html();
                    $(this).data('powertip', content);
                    $(this).powerTip({
                        placement: 'e',
                        mouseOnToPopup: true
                    });
                    $.powerTip.show(this);
                }
            });
        }

        // zebra_stripes();
        init_tooltip();

        /**
         * Set a field row's parent_id from its nearest ancestor repeater (or 0 at root).
         *
         * @param {jQuery} $item Field row <li.sortable-item>.
         */
        function cfgroupSyncFieldParentId($item) {
            var parent_id = 0;
            var $repeaterParent = $item.parents('li.sortable-item').filter(function() {
                return 'repeater' === $(this).children('.field').find('.field_form .field_type select').val();
            }).first();
            if (0 < $repeaterParent.length) {
                parent_id = $repeaterParent.children('.field').find('.field_id').first().val();
            }
            $item.children('.field').find('.parent_id').first().val(parent_id);
        }

        /**
         * Field rows in depth-first DOM order (flat save order), excluding nested wrapper quirks.
         *
         * @return {jQuery}
         */
        function cfgroupGetFieldRows() {
            return $('ul.fields').first().find('li.sortable-item').filter(function() {
                return 0 < $(this).children('.field').length;
            });
        }

        /**
         * Reindex cfgroup[fields][N] names to contiguous 0..n-1 in DOM order and sync parent_id.
         * Ensures add-without-drag saves at the visual position (bottom / outside nested repeaters).
         */
        function cfgroupSyncFieldsForSave() {
            var $rows = cfgroupGetFieldRows();
            $rows.each(function(newIndex) {
                var $item = $(this);
                var $field = $item.children('.field');

                cfgroupSyncFieldParentId($item);

                $field.find('[name^="cfgroup[fields]"]').each(function() {
                    var name = $(this).attr('name');
                    if (!name) {
                        return;
                    }
                    $(this).attr('name', name.replace(/^cfgroup\[fields\]\[[^\]]+\]/, 'cfgroup[fields][' + newIndex + ']'));
                });

                $field.find('[id^="cfgnotes_"]').each(function() {
                    $(this).attr('id', 'cfgnotes_' + newIndex);
                });
            });

            if ('undefined' !== typeof CFG) {
                CFG.field_index = $rows.length;
            }
        }

        // Setup checkboxes
        $(document).on('change click', 'input[type="checkbox"]', function() {
            var val = $(this).prop('checked') ? 1 : 0;
            $(this).siblings('input').val(val);
        });

        // Drag-and-drop support
        $('.connected-sortable').sortable({
            // items: 'ul, li',
            items: '.sortable-item',
            connectWith: '.connected-sortable',
            placeholder: 'ui-sortable-placeholder',
            // forcePlaceholderSize: true,
            handle: '.field_order',
            // helper: 'clone',
            // forceHelperSize: true,
            // tolerance: 'pointer',
            create: function(event, ui) {
                // Append <ul> to empty repeater fields. 
                // Wrap in a <div> to fix jittery drag and drop of sub-fields. Ref: https://stackoverflow.com/a/21024291
                // Do not add sortable-item to the nested <ul> — only field <li>s are sortable items.
                $('ul.fields li.sortable-item').filter(function() {
                    return 'repeater' === $(this).children('.field').find('.field_form .field_type select').val();
                }).filter(function() {
                    return $(this).children('.connected-sortable-wrapper').length < 1;
                }).append('<div class="connected-sortable-wrapper"><ul class="connected-sortable"></ul></div>');
                $('.connected-sortable').sortable({
                    items: '.sortable-item',
                    connectWith: '.connected-sortable',
                    placeholder: 'ui-sortable-placeholder',
                    handle: '.field_order',
                    update: function(event, ui) {
                        cfgroupSyncFieldParentId(ui.item);
                    }
                });
            },
            update: function(event, ui) {
                cfgroupSyncFieldParentId(ui.item);
            }
        });

        // Sync DOM order + parent_id into POST names before save (field group editor).
        $('#post').on('submit', function() {
            if (0 === $('ul.fields').length || 'undefined' === typeof CFG || !CFG.field_clone) {
                return;
            }
            cfgroupSyncFieldsForSave();
        });

        // Add a new field (field group editor only; repeater "Add Row" uses the same class and data-repeater-tag).
        $(document).on('click', '.cfgroup_add_field', function() {
            if ($(this).attr('data-repeater-tag')) {
                return;
            }
            var html = CFG.field_clone.replace(/\[clone\]/g, '['+CFG.field_index+']');
            var $newItem = $('<li class="sortable-item">' + html + '</li>');
            $('ul.fields').first().append($newItem);
            $newItem.children('.field').find('.parent_id').first().val(0);
            $newItem.find('.field_label a').first().click();
            $newItem.find('.field_type select').first().change();
            CFG.field_index = CFG.field_index + 1;
            init_tooltip();
            $(document).trigger('cfgroup/field_notes_init', [$newItem]);
        });

        // Delete a field
        $(document).on('click', '.cfgroup_delete_field', function() {
            var $field = $(this).closest('.field');
            $(document).trigger('cfgroup/field_notes_remove', [$field]);
            $(this).closest('li').remove();
        });
        
        // Expand all fields edit forms
        $(document).on('click', '.cfgroup_toggle_fields', function() {
            $(this).addClass('icon-rotated');
            $(this).addClass('all-expanded');
            $('.field:not(.form_open) .field_toggle .cfgroup_edit_field').click();
            $(document).trigger('cfgroup/field_notes_init', [$('#cfgroup_fields')]);
        });
        
        // Collapse all fields edit forms
        $(document).on('click', '.cfgroup_toggle_fields.all-expanded', function() {
            $(this).removeClass('icon-rotated');
            $('.field_toggle .cfgroup_edit_field').click();            
            $(this).removeClass('all-expanded');
        });

        // Pop open the edit fields
        $(document).on('click', '.cfgroup_edit_field', function() {
            var field = $(this).closest('.field');
            field.toggleClass('form_open');
            field.find('.field_form').slideToggle('fast');
            
            var type = field.find('.field_form .field_type select').val();
            console.log(type);
            if (type == 'line_break') {
                field.find('.field_notes').hide();
            } else {
                field.find('.field_notes').show();                
            }

            if (field.hasClass('form_open')) {
                $(document).trigger('cfgroup/field_notes_init', [field]);
            }
        });

        // Add or replace field_type options
        $(document).on('change', '.field_form .field_type select', function() {
            var type = $(this).val();
            var input_name = $(this).attr('name').replace('[type]', '');
            var html = CFG.options_html[type].replace(/cfgroup\[fields\]\[clone\]/g, input_name);
            $(this).closest('.field').find('.field_meta .field_type').html(type);
            $(this).closest('.field').find('.field_option').remove();
            $(this).closest('.field_basics').after(html);
            // Ensure field type classes do not accumulate on the sortable item.
            // Accumulated classes can cause non-repeater fields to be treated as repeater containers.
            var $item = $(this).closest('.sortable-item');
            $item.removeClass([
                'text', 'textarea', 'wysiwyg', 'file', 'gallery',
                'true_false', 'radio', 'select', 'checkbox',
                'hyperlink', 'number', 'date', 'time', 'datetime', 'color', 'map',
                'relationship', 'term', 'user',
                'repeater',
                'tab', 'heading', 'line_break'
            ].join(' '));
            $item.addClass(type);

            // If switching away from repeater, remove any empty wrapper that may have been added previously.
            if ('repeater' !== type) {
                var $wrapper = $item.children('.connected-sortable-wrapper');
                if (0 < $wrapper.length && 0 === $wrapper.find('li.sortable-item').length) {
                    $wrapper.remove();
                }
            }
            if (type == 'tab') {
                var fieldLabelHtml = $(this).closest('.field').find('.field_meta .field_label');
                fieldLabelHtml.append('<span class="tab-flag">tab</span>');                
            } else {
                var fieldLabelHtml = $(this).closest('.field').find('.field_meta .field_label').html();
                var newLabel = fieldLabelHtml.replace('<span class="tab-flag">tab</span>', '');
                $(this).closest('.field').find('.field_meta .field_label').html(newLabel);
            }

            if (type == 'heading' || type == 'line_break') {
                $(this).closest('.field').find('.field_notes').hide();
            } else {
                $(this).closest('.field').find('.field_notes').show();                
            }

            // Try to make new 'repeater' field immediately usable to contain sub-fields
            // Does not work because field ID is not assigned yet until field group is saved
            // so, sub-fields positions are not being saved.
            // if ( type == 'repeater' ) {
            //     var newRepeater = $(this).parents('ul.fields li');
            //     newRepeater.addClass('repeater');
            //     newRepeater.append('<div class="connected-sortable-wrapper"><ul class="connected-sortable"></ul></div>');
            //     $('.connected-sortable').sortable({
            //         items: '.sortable-item',
            //         connectWith: '.connected-sortable',
            //         placeholder: 'ui-sortable-placeholder',
            //         handle: '.field_order'
            //     });
            // }
            init_tooltip();
            cfgroup_toggle_date_year_only_output_format( $(this).closest('.field') );
            cfgroup_init_file_allowed_extensions( $(this).closest('.field') );
            cfgroup_init_wysiwyg_toolbar_buttons( $(this).closest('.field') );
            cfgroup_toggle_quick_edit_setting( $(this).closest('.field') );
            cfgroup_toggle_bulk_edit_setting( $(this).closest('.field') );
        });

        /**
         * Quick Edit field types. Keep in sync with cfgroup_quick_edit::supported_types().
         */
        var cfgroupQuickEditSupportedTypes = [ 'text', 'textarea', 'number', 'true_false', 'select', 'radio', 'checkbox', 'date', 'time', 'datetime', 'color', 'hyperlink', 'map', 'wysiwyg', 'file', 'gallery', 'relationship', 'term', 'user' ];

        /**
         * Bulk Edit field types. Keep in sync with cfgroup_bulk_edit::supported_types().
         */
        var cfgroupBulkEditSupportedTypes = [ 'text', 'textarea', 'number', 'true_false', 'select', 'radio', 'checkbox', 'date', 'time', 'datetime', 'color', 'hyperlink', 'map', 'file', 'gallery', 'wysiwyg', 'relationship', 'term', 'user' ];

        function cfgroup_toggle_quick_edit_setting( $field ) {
            var $row = $field.find( '.asenha-cfgroup-quick-edit-setting' );
            if ( ! $row.length ) {
                return;
            }

            var parentId = parseInt( $field.find( '.parent_id' ).val(), 10 ) || 0;
            var type = $field.find( '.field_form .field_type select' ).val();
            var supported = ( 0 === parentId ) && ( -1 !== cfgroupQuickEditSupportedTypes.indexOf( type ) );

            $row.attr( 'data-cfgroup-qe-supported', supported ? '1' : '0' );
            $row.toggle( supported );

            if ( ! supported ) {
                $row.find( 'input[type="checkbox"]' ).prop( 'checked', false );
                $row.find( 'input.true_false' ).val( '0' );
            }
        }

        function cfgroup_toggle_bulk_edit_setting( $field ) {
            var $row = $field.find( '.asenha-cfgroup-bulk-edit-setting' );
            if ( ! $row.length ) {
                return;
            }

            var parentId = parseInt( $field.find( '.parent_id' ).val(), 10 ) || 0;
            var type = $field.find( '.field_form .field_type select' ).val();
            var supported = ( 0 === parentId ) && ( -1 !== cfgroupBulkEditSupportedTypes.indexOf( type ) );

            $row.attr( 'data-cfgroup-be-supported', supported ? '1' : '0' );
            $row.toggle( supported );

            if ( ! supported ) {
                $row.find( 'input[type="checkbox"]' ).prop( 'checked', false );
                $row.find( 'input.true_false' ).val( '0' );
            }
        }

        function cfgroup_toggle_date_year_only_output_format( $field ) {
            var $outputFormatRow = $field.find( '.field_option_date_output_format' );

            if ( ! $outputFormatRow.length ) {
                return;
            }

            var yearOnly = '1' === $field.find( 'input[name$="[options][year_only]"]' ).val();
            $outputFormatRow.toggle( ! yearOnly );
        }

        $(document).on( 'change click', '.field_option_date_year_only input[type="checkbox"]', function() {
            var $field = $(this).closest( '.field' );
            setTimeout( function() {
                cfgroup_toggle_date_year_only_output_format( $field );
            }, 0 );
        } );

        // Auto-populate the field name
        $(document).on('blur', '.field_form .field_label input', function() {
            var val = $(this).val();

            // browser autofill support
            $(this).closest('.field').find('.field_meta .field_label a').text(val);

            var name = $(this).closest('tr').find('.field_name input');
            if ('' == name.val()) {
                val = $.trim(val).toLowerCase();
                val = val.replace(/[^\w- ]/g, function(a) { return latin_map[a] || ''; } ); // replace accented chars with non-accented ones or strip it out
                val = val.replace(/[- ]/g, '_'); // replace space and hyphen with underscore
                val = val.replace(/[_]{2,}/g, '_'); // strip consecutive underscores
                name.val(val);
                name.trigger('keyup');
            }
        });

        $(document).on('keyup paste', '.field_form .field_label input', function() {
            var $this = $(this);
            setTimeout(function() {
                $this.closest('.field').find('.field_meta .field_label a').text($this.val());
            }, 1);
        });

        $(document).on('keyup', '.field_form .field_name input', function() {
            var val = jQuery(this).val();
            $(this).closest('.field').find('.field_meta .field_name').text(val);
        });

        // Change field width text
        $(document).on('change', '.field_form .field_column_width select', function() {
            var $selected = $(this).find('option:selected');
            var width = $selected.data('column-label') || $selected.val();
            $(this).parents('.field').find('.field_width').html(width);
        });

        // Change append text type to 'text' field type 
        $(document).on('change', '.field_form .field_option_text select', function() {
            var text_type = $(this).val();
            $(this).parents('.field').find('.field_meta .field_type').text('');
            $(this).parents('.field').find('.field_meta .field_type').append('text ('+text_type+')');
        });

        // Change append file type to 'file' field type
        $(document).on('change', '.field_form .field_option_file .cfgroup-file-type-select', function() {
            var file_type = $(this).val();
            var $field = $(this).closest('.field');

            if ( file_type == 'file' ) {
                file_type = 'any';
            }
            $field.find('.field_meta .field_type').text('');
            $field.find('.field_meta .field_type').append('file ('+file_type+')');

            if ('selected' === $field.find('input.cfgroup-allowed-mime-mode:checked').val()) {
                cfgroup_render_file_allowed_extension_checkboxes($field, $(this).val(), false);
            }
        });

        function cfgroup_toggle_file_allowed_extensions($field) {
            var $wrap = $field.find('.cfgroup-allowed-extensions-wrap');

            if (!$wrap.length) {
                return;
            }

            var mode = $field.find('input.cfgroup-allowed-mime-mode:checked').val();
            $wrap.toggle('selected' === mode);
        }

        function cfgroup_get_file_extension_input_name($field) {
            var $sample = $field.find('.cfgroup-allowed-extension').first();

            if ($sample.length) {
                return $sample.attr('name');
            }

            var $radio = $field.find('input.cfgroup-allowed-mime-mode').first();

            if ($radio.length) {
                return $radio.attr('name').replace('[allowed_mime_mode]', '[allowed_extensions][]');
            }

            return '';
        }

        function cfgroup_render_file_allowed_extension_checkboxes($field, fileType, preserveChecked) {
            var $wrap = $field.find('.cfgroup-allowed-extensions-wrap');

            if (!$wrap.length) {
                return;
            }

            var entries = (window.cfgroupFileExtensions && window.cfgroupFileExtensions[fileType]) ? window.cfgroupFileExtensions[fileType] : [];
            var inputName = cfgroup_get_file_extension_input_name($field);
            var checkedValues = {};

            if (preserveChecked) {
                $field.find('.cfgroup-allowed-extension:checked').each(function() {
                    checkedValues[$(this).val()] = true;
                });
            }

            var html = '<div class="cfgroup-allowed-extensions">';

            $.each(entries, function(index, entry) {
                var ext = entry.ext;
                var mime = entry.mime;
                var checked = preserveChecked ? !!checkedValues[ext] : false;
                var checkedAttr = checked ? ' checked' : '';

                html += '<label>';
                html += '<input type="checkbox" name="' + inputName + '" value="' + ext + '" class="cfgroup-allowed-extension"' + checkedAttr + ' />';
                html += ' .' + ext + ' <span class="cfgroup-ext-mime">(' + mime + ')</span>';
                html += '</label>';
            });

            html += '</div>';
            $wrap.html(html);
        }

        $(document).on('change', '.field_form .field_option_file_allowed_extensions input.cfgroup-allowed-mime-mode', function() {
            var $field = $(this).closest('.field');
            cfgroup_toggle_file_allowed_extensions($field);

            if ('selected' === $(this).val()) {
                var fileType = $field.find('.cfgroup-file-type-select').val() || 'file';
                cfgroup_render_file_allowed_extension_checkboxes($field, fileType, false);
            }
        });

        function cfgroup_init_file_allowed_extensions($field) {
            cfgroup_toggle_file_allowed_extensions($field);
        }

        function cfgroup_toggle_wysiwyg_toolbar_buttons($field) {
            var $wrap = $field.find('.cfgroup-wysiwyg-toolbar-buttons-wrap');

            if (!$wrap.length) {
                return;
            }

            var mode = $field.find('input.cfgroup-wysiwyg-toolbar-mode:checked').val();
            $wrap.toggle('custom' === mode);
        }

        function cfgroup_init_wysiwyg_toolbar_buttons($field) {
            cfgroup_toggle_wysiwyg_toolbar_buttons($field);
        }

        $(document).on('change', '.field_form .field_option_wysiwyg_toolbar input.cfgroup-wysiwyg-toolbar-mode', function() {
            cfgroup_toggle_wysiwyg_toolbar_buttons($(this).closest('.field'));
        });

        $(document).on('click', '.cfgroup_edit_field', function() {
            var $field = $(this).closest('.field');
            if ( $field.hasClass( 'form_open' ) ) {
                cfgroup_toggle_date_year_only_output_format( $field );
                cfgroup_init_file_allowed_extensions($field);
                cfgroup_init_wysiwyg_toolbar_buttons($field);
                cfgroup_toggle_quick_edit_setting( $field );
                cfgroup_toggle_bulk_edit_setting( $field );
            }
        });

        $('.field').each(function() {
            cfgroup_toggle_date_year_only_output_format($(this));
            cfgroup_init_file_allowed_extensions($(this));
            cfgroup_init_wysiwyg_toolbar_buttons($(this));
            cfgroup_toggle_quick_edit_setting($(this));
            cfgroup_toggle_bulk_edit_setting($(this));
        });

        $(document).on('click', '.cfgroup_add_field', function() {
            setTimeout(function() {
                $('.field').each(function() {
                    cfgroup_toggle_quick_edit_setting($(this));
                    cfgroup_toggle_bulk_edit_setting($(this));
                });
            }, 20);
        });

        // --- Conditional logic (field group editor) ---
        function cfgroupClL10nString(key, fallback) {
            var L = window.cfgroupClL10n;
            if (L && L[key]) {
                return L[key];
            }
            return fallback;
        }

        function cfgroupClOperatorLabel(op, depType) {
            switch (op) {
                case 'empty':
                    return cfgroupClL10nString('has_no_value', 'has no value');
                case 'not_empty':
                    return cfgroupClL10nString('has_any_value', 'has any value');
                case '==':
                    if (depType === 'true_false') {
                        return cfgroupClL10nString('is_checked', 'is checked');
                    }
                    return cfgroupClL10nString('is_equal_to', 'is equal to');
                case '!=':
                    if (depType === 'true_false') {
                        return cfgroupClL10nString('is_not_checked', 'is not checked');
                    }
                    return cfgroupClL10nString('is_not_equal_to', 'is not equal to');
                case 'contains':
                    return cfgroupClL10nString('contains', 'contains');
                case 'not_contains':
                    return cfgroupClL10nString('does_not_contain', 'does not contain');
                case 'match':
                    return cfgroupClL10nString('matches_pattern', 'matches pattern');
                case '<':
                    return cfgroupClL10nString('less_than', 'less than');
                case '<=':
                    return cfgroupClL10nString('less_than_or_equal_to', 'less than or equal to');
                case '>':
                    return cfgroupClL10nString('greater_than', 'greater than');
                case '>=':
                    return cfgroupClL10nString('greater_than_or_equal_to', 'greater than or equal to');
                case 'date_before':
                    return cfgroupClL10nString('date_before', 'is before');
                case 'date_before_or_equal':
                    return cfgroupClL10nString('date_before_or_equal', 'is before or equal to');
                case 'date_between':
                    return cfgroupClL10nString('date_between', 'is between');
                case 'date_after_or_equal':
                    return cfgroupClL10nString('date_after_or_equal', 'is after or equal to');
                case 'date_after':
                    return cfgroupClL10nString('date_after', 'is after');
                default:
                    return op;
            }
        }

        function cfgroupClOperatorsForType(type) {
            if (type === 'hyperlink') {
                return ['not_empty', 'contains'];
            }
            if (type === 'number') {
                return ['not_empty', '<', '<=', '==', '>', '>='];
            }
            if (type === 'date') {
                return ['not_empty', 'date_before', 'date_before_or_equal', 'date_between', 'date_after_or_equal', 'date_after'];
            }
            if (type === 'time') {
                return ['not_empty', 'date_before', 'date_before_or_equal', 'date_between', 'date_after_or_equal', 'date_after'];
            }
            if (type === 'datetime') {
                return ['not_empty', 'date_before', 'date_before_or_equal', 'date_between', 'date_after_or_equal', 'date_after'];
            }
            var textual = { text:1, textarea:1, wysiwyg:1, color:1 };
            var choice = { radio:1, select:1 };
            if (textual[type]) {
                return ['not_empty','==','!=','contains','match'];
            }
            if (type === 'true_false') {
                return ['==','!='];
            }
            if (choice[type]) {
                return ['not_empty','==','!='];
            }
            if (type === 'checkbox') {
                return ['not_empty','contains','not_contains'];
            }
            if (type === 'file' || type === 'gallery' || type === 'relationship' || type === 'term' || type === 'user') {
                return ['not_empty'];
            }
            if (type === 'repeater') {
                return ['not_empty', 'contains'];
            }
            return ['empty','not_empty','==','!=','contains','match'];
        }

        function cfgroupClFillOperatorSelect($sel, type, current) {
            var ops = cfgroupClOperatorsForType(type);
            if (current && $.inArray(current, ops) === -1) {
                ops = ops.slice();
                ops.push(current);
            }
            $sel.empty();
            for (var i = 0; i < ops.length; i++) {
                var op = ops[i];
                var lbl = cfgroupClOperatorLabel(op, type);
                $sel.append($('<option></option>').attr('value', op).text(lbl));
            }
            if (current && $.inArray(current, ops) !== -1) {
                $sel.val(current);
            } else {
                $sel.val(ops[0]);
            }
        }

        /**
         * Base name for conditional logic POST keys (strips [field_id] from the field select name).
         *
         * @param {jQuery} $rule .cfgroup-cl-rule
         * @return {string}
         */
        function cfgroupClConditionalLogicBaseName($rule) {
            var n = $rule.find('.cfgroup-cl-field-id').first().attr('name');
            if (!n) {
                return '';
            }
            return n.replace(/\[field_id\]$/, '');
        }

        /**
         * Ensure .cfgroup-cl-value-slot exists (wrap legacy single input if needed).
         *
         * @param {jQuery} $rule .cfgroup-cl-rule
         * @return {jQuery}
         */
        function cfgroupClEnsureValueSlot($rule) {
            var $slot = $rule.find('.cfgroup-cl-value-slot');
            if ($slot.length) {
                return $slot;
            }
            var $bare = $rule.find('.cfgroup-cl-rule-inputs input.cfgroup-cl-value').first();
            if ($bare.length) {
                $bare.wrap('<div class="cfgroup-cl-value-slot"></div>');
                return $rule.find('.cfgroup-cl-value-slot');
            }
            return $();
        }

        /**
         * Destroy Flatpickr instances inside a rule row before replacing inputs.
         *
         * @param {jQuery} $rule .cfgroup-cl-rule
         */
        function cfgroupClDestroyFlatpickrInRule($rule) {
            $rule.find('.cfgroup-cl-value-slot input').each(function() {
                if (this._flatpickr) {
                    this._flatpickr.destroy();
                }
            });
        }

        /**
         * Toggle value control: hidden "1" for true_false (==/!=), empty for empty/not_empty, text otherwise.
         * Date dependencies use Flatpickr for comparison operators.
         *
         * @param {jQuery} $rule .cfgroup-cl-rule
         */
        function cfgroupClUpdateValueVisibility($rule) {
            var $fid = $rule.find('.cfgroup-cl-field-id').first();
            var fidVal = $fid.val();
            if (!fidVal || fidVal === '') {
                return;
            }
            var depType = $fid.find('option:selected').attr('data-field-type') || '';
            var op = $rule.find('.cfgroup-cl-operator').val() || '';
            var $slot = cfgroupClEnsureValueSlot($rule);
            if (!$slot.length) {
                return;
            }
            cfgroupClDestroyFlatpickrInRule($rule);
            var baseName = cfgroupClConditionalLogicBaseName($rule);
            if (!baseName) {
                return;
            }

            if (op === 'empty' || op === 'not_empty') {
                $slot.empty().append(
                    $('<input type="hidden" class="cfgroup-cl-value" />').attr('name', baseName + '[value]').val('')
                );
                $slot.hide();
                return;
            }
            $slot.show();

            if (depType === 'true_false') {
                $slot.empty().append(
                    $('<input type="hidden" class="cfgroup-cl-value" />').attr('name', baseName + '[value]').val('1')
                );
                return;
            }

            if (depType === 'date') {
                if (op === 'date_between') {
                    var startVal = '';
                    var endVal = '';
                    var $sIn = $slot.find('input[name*="[value][start]"]');
                    var $eIn = $slot.find('input[name*="[value][end]"]');
                    if ($sIn.length) {
                        startVal = $sIn.val() || '';
                        endVal = $eIn.length ? ($eIn.val() || '') : '';
                    }
                    $slot.empty();
                    var $wrap = $('<div class="cfgroup-cl-date-range"></div>');
                    $wrap.append(
                        $('<input type="text" class="cfgroup-cl-value cfgroup-cl-date-input" />')
                            .attr('name', baseName + '[value][start]')
                            .attr('autocomplete', 'off')
                            .val(startVal),
                        $('<span class="cfgroup-cl-date-range-sep" aria-hidden="true">–</span>'),
                        $('<input type="text" class="cfgroup-cl-value cfgroup-cl-date-input" />')
                            .attr('name', baseName + '[value][end]')
                            .attr('autocomplete', 'off')
                            .val(endVal)
                    );
                    $slot.append($wrap);
                    $slot.find('.cfgroup-cl-date-input').each(function() {
                        if (typeof flatpickr !== 'undefined') {
                            flatpickr(this, { dateFormat: 'Y-m-d' });
                        }
                    });
                    return;
                }
                if (op === 'date_before' || op === 'date_before_or_equal' || op === 'date_after_or_equal' || op === 'date_after') {
                    var sv = '';
                    var $single = $slot.find('input[name$="[value]"]').filter(function() {
                        var nm = $(this).attr('name') || '';
                        return nm.indexOf('[value][start]') === -1 && nm.indexOf('[value][end]') === -1;
                    });
                    if ($single.length) {
                        sv = $single.val() || '';
                    }
                    $slot.empty();
                    var $inp = $('<input type="text" class="cfgroup-cl-value cfgroup-cl-date-input" />')
                        .attr('name', baseName + '[value]')
                        .attr('autocomplete', 'off')
                        .attr('placeholder', cfgroupClL10nString('value_placeholder', 'Value'))
                        .val(sv);
                    $slot.append($inp);
                    if (typeof flatpickr !== 'undefined') {
                        flatpickr($inp[0], { dateFormat: 'Y-m-d' });
                    }
                    return;
                }
            }

            if (depType === 'datetime') {
                var fpDatetimeCfg = {
                    enableTime: true,
                    time_24hr: true,
                    dateFormat: 'Y-m-d H:i',
                    minuteIncrement: 1
                };
                if (op === 'date_between') {
                    var dtStartVal = '';
                    var dtEndVal = '';
                    var $dtSIn = $slot.find('input[name*="[value][start]"]');
                    var $dtEIn = $slot.find('input[name*="[value][end]"]');
                    if ($dtSIn.length) {
                        dtStartVal = $dtSIn.val() || '';
                        dtEndVal = $dtEIn.length ? ($dtEIn.val() || '') : '';
                    }
                    $slot.empty();
                    var $dtWrap = $('<div class="cfgroup-cl-date-range"></div>');
                    $dtWrap.append(
                        $('<input type="text" class="cfgroup-cl-value cfgroup-cl-date-input" />')
                            .attr('name', baseName + '[value][start]')
                            .attr('autocomplete', 'off')
                            .val(dtStartVal),
                        $('<span class="cfgroup-cl-date-range-sep" aria-hidden="true">–</span>'),
                        $('<input type="text" class="cfgroup-cl-value cfgroup-cl-date-input" />')
                            .attr('name', baseName + '[value][end]')
                            .attr('autocomplete', 'off')
                            .val(dtEndVal)
                    );
                    $slot.append($dtWrap);
                    $slot.find('.cfgroup-cl-date-input').each(function() {
                        if (typeof flatpickr !== 'undefined') {
                            flatpickr(this, fpDatetimeCfg);
                        }
                    });
                    return;
                }
                if (op === 'date_before' || op === 'date_before_or_equal' || op === 'date_after_or_equal' || op === 'date_after') {
                    var dtsv = '';
                    var $dtSingle = $slot.find('input[name$="[value]"]').filter(function() {
                        var dtnm = $(this).attr('name') || '';
                        return dtnm.indexOf('[value][start]') === -1 && dtnm.indexOf('[value][end]') === -1;
                    });
                    if ($dtSingle.length) {
                        dtsv = $dtSingle.val() || '';
                    }
                    $slot.empty();
                    var $dtInp = $('<input type="text" class="cfgroup-cl-value cfgroup-cl-date-input" />')
                        .attr('name', baseName + '[value]')
                        .attr('autocomplete', 'off')
                        .attr('placeholder', cfgroupClL10nString('value_placeholder', 'Value'))
                        .val(dtsv);
                    $slot.append($dtInp);
                    if (typeof flatpickr !== 'undefined') {
                        flatpickr($dtInp[0], fpDatetimeCfg);
                    }
                    return;
                }
            }

            if (depType === 'time') {
                if (op === 'date_between') {
                    var timeStartVal = '';
                    var timeEndVal = '';
                    var $tsIn = $slot.find('input[name*="[value][start]"]');
                    var $teIn = $slot.find('input[name*="[value][end]"]');
                    if ($tsIn.length) {
                        timeStartVal = $tsIn.val() || '';
                        timeEndVal = $teIn.length ? ($teIn.val() || '') : '';
                    }
                    $slot.empty();
                    var $timeWrap = $('<div class="cfgroup-cl-date-range"></div>');
                    $timeWrap.append(
                        $('<input type="text" class="cfgroup-cl-value cfgroup-cl-date-input" />')
                            .attr('name', baseName + '[value][start]')
                            .attr('autocomplete', 'off')
                            .val(timeStartVal),
                        $('<span class="cfgroup-cl-date-range-sep" aria-hidden="true">–</span>'),
                        $('<input type="text" class="cfgroup-cl-value cfgroup-cl-date-input" />')
                            .attr('name', baseName + '[value][end]')
                            .attr('autocomplete', 'off')
                            .val(timeEndVal)
                    );
                    $slot.append($timeWrap);
                    $slot.find('.cfgroup-cl-date-input').each(function() {
                        if (typeof flatpickr !== 'undefined') {
                            flatpickr(this, {
                                noCalendar: true,
                                enableTime: true,
                                time_24hr: true,
                                dateFormat: 'H:i'
                            });
                        }
                    });
                    return;
                }
                if (op === 'date_before' || op === 'date_before_or_equal' || op === 'date_after_or_equal' || op === 'date_after') {
                    var tsv = '';
                    var $timeSingle = $slot.find('input[name$="[value]"]').filter(function() {
                        var tnm = $(this).attr('name') || '';
                        return tnm.indexOf('[value][start]') === -1 && tnm.indexOf('[value][end]') === -1;
                    });
                    if ($timeSingle.length) {
                        tsv = $timeSingle.val() || '';
                    }
                    $slot.empty();
                    var $timeInp = $('<input type="text" class="cfgroup-cl-value cfgroup-cl-date-input" />')
                        .attr('name', baseName + '[value]')
                        .attr('autocomplete', 'off')
                        .attr('placeholder', cfgroupClL10nString('value_placeholder', 'Value'))
                        .val(tsv);
                    $slot.append($timeInp);
                    if (typeof flatpickr !== 'undefined') {
                        flatpickr($timeInp[0], {
                            noCalendar: true,
                            enableTime: true,
                            time_24hr: true,
                            dateFormat: 'H:i'
                        });
                    }
                    return;
                }
            }

            var sv = '';
            var $fv = $slot.find('input.cfgroup-cl-value').first();
            if ($fv.length) {
                sv = $fv.val() || '';
            }
            $slot.empty();
            var $t = $('<input type="text" class="cfgroup-cl-value" />')
                .attr('name', baseName + '[value]')
                .attr('placeholder', cfgroupClL10nString('value_placeholder', 'Value'))
                .val(sv);
            $slot.append($t);
        }

        /**
         * Show operator/value only after a dependency field is chosen; hide and disable when cleared.
         *
         * @param {jQuery} $rule .cfgroup-cl-rule
         */
        function cfgroupClUpdateControlsVisibility($rule) {
            var $fid = $rule.find('.cfgroup-cl-field-id').first();
            var fidVal = $fid.val();
            var $op = $rule.find('.cfgroup-cl-operator');
            var $slot = cfgroupClEnsureValueSlot($rule);
            if (!fidVal || fidVal === '') {
                $op.hide().prop('disabled', true);
                if ($slot.length) {
                    $slot.hide();
                    $slot.find('input').prop('disabled', true);
                }
                return;
            }
            $op.show().prop('disabled', false);
            if ($slot.length) {
                $slot.find('input').prop('disabled', false);
            }
            cfgroupClUpdateValueVisibility($rule);
        }

        function cfgroupClRebuildFieldDropdowns() {
            $('ul.fields li.sortable-item .field').each(function() {
                var $field = $(this);
                var selfId = parseInt($field.find('.field_id').val(), 10) || 0;
                var parentId = parseInt($field.find('.parent_id').val(), 10) || 0;
                var $rows = $field.find('.cfgroup-cl-field-id');
                $rows.each(function() {
                    var $row = $(this);
                    var cur = $row.val();
                    $row.find('option:not(:first)').remove();
                    $('ul.fields li.sortable-item .field').each(function() {
                        var $other = $(this);
                        var oid = parseInt($other.find('.field_id').val(), 10) || 0;
                        var opar = parseInt($other.find('.parent_id').val(), 10) || 0;
                        var otype = $other.find('.field_type select').val();
                        var oname = $other.find('.field_name input').val();
                        var olab = $other.find('.field_label input').val();
                        if (!otype || oid === selfId || opar !== parentId) {
                            return;
                        }
                        if (otype === 'tab' || otype === 'heading' || otype === 'line_break') {
                            return;
                        }
                        var ops = cfgroupClOperatorsForType(otype);
                        var label = (olab || oname || '') + ' (' + (oname || '') + ')';
                        var $opt = $('<option></option>').val(oid).text(label).attr('data-field-type', otype).attr('data-operators', JSON.stringify(ops));
                        $row.append($opt);
                    });
                    if (cur) {
                        $row.val(cur);
                    }
                    cfgroupClUpdateControlsVisibility($row.closest('.cfgroup-cl-rule'));
                });
            });
        }

        $(document).on('change', '.cfgroup-cl-field-id', function() {
            var $sel = $(this);
            var $rule = $sel.closest('.cfgroup-cl-rule');
            var fidVal = $sel.val();
            if (!fidVal || fidVal === '') {
                cfgroupClUpdateControlsVisibility($rule);
                return;
            }
            var $opt = $sel.find('option:selected');
            var t = $opt.attr('data-field-type') || 'text';
            cfgroupClFillOperatorSelect($rule.find('.cfgroup-cl-operator'), t, null);
            cfgroupClUpdateControlsVisibility($rule);
        });

        $(document).on('change', '.cfgroup-cl-operator', function() {
            var $rule = $(this).closest('.cfgroup-cl-rule');
            var $fid = $rule.find('.cfgroup-cl-field-id').first();
            if (!$fid.val()) {
                return;
            }
            cfgroupClUpdateValueVisibility($rule);
        });

        $(document).on('change', '.cfgroup-cl-toggle', function() {
            var $td = $(this).closest('td');
            var on = $(this).is(':checked');
            $td.find('.cfgroup-cl-builder').toggle(on);
            if (on) {
                $td.find('.cfgroup-cl-rule').each(function() {
                    cfgroupClUpdateControlsVisibility($(this));
                });
            }
        });

        function cfgroupClNameBaseFromRule($rule) {
            var fname = $rule.find('.cfgroup-cl-field-id').first().attr('name');
            if (!fname) {
                return '';
            }
            var m = fname.match(/^(cfgroup\[fields\]\[[^\]]+\]\[conditional_logic\])/);
            return m ? m[1] : '';
        }

        function cfgroupClSyncAndLabelA11y($andRules) {
            $andRules.find('.cfgroup-cl-rule').each(function() {
                var $label = $(this).find('.cfgroup-cl-and-label');
                if (!$label.length) {
                    return;
                }
                if ($(this).is(':last-child')) {
                    $label.attr('aria-hidden', 'true');
                } else {
                    $label.removeAttr('aria-hidden');
                }
            });
        }

        function cfgroupClRuleHtml(nameBase, gi, ri) {
            var defaultEqLabel = cfgroupClOperatorLabel('==', 'text');
            var andLabel = (typeof cfgroupFieldsI18n !== 'undefined' && cfgroupFieldsI18n.and) ? cfgroupFieldsI18n.and : 'and';
            var andHtml = $('<span/>').text(andLabel).html();
            return '<div class="cfgroup-cl-rule" data-and-index="' + ri + '">' +
                '<span class="cfgroup-cl-drag-handle" title="Reorder rule">' +
                '<span class="screen-reader-text">Reorder rule</span>' +
                '<span class="dashicons dashicons-menu" aria-hidden="true"></span></span>' +
                '<div class="cfgroup-cl-rule-inputs">' +
                '<select name="' + nameBase + '[groups][' + gi + '][' + ri + '][field_id]" class="cfgroup-cl-field-id"><option value="">Select a field</option></select>' +
                '<select name="' + nameBase + '[groups][' + gi + '][' + ri + '][operator]" class="cfgroup-cl-operator"><option value="==">' + $('<span/>').text(defaultEqLabel).html() + '</option></select>' +
                '<div class="cfgroup-cl-value-slot"><input type="text" name="' + nameBase + '[groups][' + gi + '][' + ri + '][value]" class="cfgroup-cl-value" value="" /></div>' +
                '</div>' +
                '<div class="cfgroup-cl-rule-actions">' +
                '<span class="cfgroup-cl-and-label">' + andHtml + '</span>' +
                '<button type="button" class="button cfgroup-cl-add-rule-btn" aria-label="Add rule">' +
                '<span class="dashicons dashicons-plus-alt2" aria-hidden="true"></span></button>' +
                '<button type="button" class="button cfgroup-cl-remove-rule-btn" aria-label="Remove rule">' +
                '<span class="dashicons dashicons-minus" aria-hidden="true"></span></button>' +
                '</div></div>';
        }

        function cfgroupClReindexGroup($andRules) {
            var $og = $andRules.closest('.cfgroup-cl-or-group');
            var gi = parseInt($og.attr('data-or-index'), 10);
            if (isNaN(gi)) {
                gi = 0;
            }
            $andRules.find('.cfgroup-cl-rule').each(function(ri) {
                var $rule = $(this);
                $rule.attr('data-and-index', ri);
                $rule.find('select, input').each(function() {
                    var name = $(this).attr('name');
                    if (!name) {
                        return;
                    }
                    name = name.replace(/\[groups\]\[\d+\]\[\d+\]/, '[groups][' + gi + '][' + ri + ']');
                    $(this).attr('name', name);
                });
            });
            cfgroupClSyncAndLabelA11y($andRules);
        }

        function cfgroupClReindexOrGroups($builder) {
            $builder.find('.cfgroup-cl-or-group').each(function(gi) {
                $(this).attr('data-or-index', gi);
                cfgroupClReindexGroup($(this).find('.cfgroup-cl-and-rules'));
            });
        }

        function cfgroupClInitSortable() {
            $('.cfgroup-cl-and-rules').each(function() {
                var $container = $(this);
                if ($container.data('ui-sortable')) {
                    $container.sortable('destroy');
                }
                $container.sortable({
                    items: '> .cfgroup-cl-rule',
                    handle: '.cfgroup-cl-drag-handle',
                    axis: 'y',
                    tolerance: 'pointer',
                    placeholder: 'cfgroup-cl-rule-placeholder',
                    update: function() {
                        cfgroupClReindexGroup($container);
                    }
                });
            });
        }

        $(document).on('click', '.cfgroup-cl-add-rule-btn', function(e) {
            e.preventDefault();
            var $rule = $(this).closest('.cfgroup-cl-rule');
            var $og = $rule.closest('.cfgroup-cl-or-group');
            var $rules = $og.find('.cfgroup-cl-and-rules');
            var gi = parseInt($og.attr('data-or-index'), 10);
            if (isNaN(gi)) {
                gi = 0;
            }
            var nameBase = cfgroupClNameBaseFromRule($rule);
            if (!nameBase) {
                return;
            }
            var ri = $rules.find('.cfgroup-cl-rule').length;
            var html = cfgroupClRuleHtml(nameBase, gi, ri);
            var $newRule = $(html);
            $rule.after($newRule);
            cfgroupClReindexGroup($rules);
            cfgroupClRebuildFieldDropdowns();
            cfgroupClInitSortable();
        });

        $(document).on('click', '.cfgroup-cl-add-or', function(e) {
            e.preventDefault();
            var $builder = $(this).closest('.cfgroup-cl-builder');
            var gi = $builder.find('.cfgroup-cl-or-group').length;
            var $firstOg = $builder.find('.cfgroup-cl-or-group').first();
            var fname = $firstOg.find('.cfgroup-cl-field-id').first().attr('name');
            if (!fname) {
                return;
            }
            var m = fname.match(/^(cfgroup\[fields\]\[[^\]]+\]\[conditional_logic\])/);
            var nameBase = m ? m[1] : '';
            if (!nameBase) {
                return;
            }
            var html = '<div class="cfgroup-cl-or-group" data-or-index="' + gi + '">' +
                '<div class="cfgroup-cl-or-label">or</div><div class="cfgroup-cl-and-rules">' +
                cfgroupClRuleHtml(nameBase, gi, 0) +
                '</div></div>';
            $(this).closest('.cfgroup-cl-add-or-wrap').before(html);
            cfgroupClReindexOrGroups($builder);
            cfgroupClRebuildFieldDropdowns();
            cfgroupClInitSortable();
        });

        $(document).on('click', '.cfgroup-cl-remove-rule-btn', function(e) {
            e.preventDefault();
            var $rule = $(this).closest('.cfgroup-cl-rule');
            var $og = $rule.closest('.cfgroup-cl-or-group');
            var $rules = $og.find('.cfgroup-cl-and-rules');
            var $builder = $og.closest('.cfgroup-cl-builder');
            var $allGroups = $builder.find('.cfgroup-cl-or-group');
            var ruleCount = $rules.find('.cfgroup-cl-rule').length;

            if (ruleCount >= 2) {
                $rule.remove();
                cfgroupClReindexGroup($rules);
                cfgroupClInitSortable();
                return;
            }

            if ($allGroups.length > 1 && !$og.is($allGroups.first())) {
                $og.remove();
                cfgroupClReindexOrGroups($builder);
                cfgroupClRebuildFieldDropdowns();
                cfgroupClInitSortable();
            }
        });

        $(document).on('click', '.cfgroup_add_field', function() {
            setTimeout(cfgroupClRebuildFieldDropdowns, 0);
        });

        $('.connected-sortable').on('sortupdate', function() {
            cfgroupClRebuildFieldDropdowns();
        });

        $(function() {
            cfgroupClRebuildFieldDropdowns();
            $('.cfgroup-cl-and-rules').each(function() {
                cfgroupClSyncAndLabelA11y($(this));
            });
            $('.cfgroup-cl-rule').each(function() {
                cfgroupClUpdateControlsVisibility($(this));
            });
            cfgroupClInitSortable();
        });

    });
})(jQuery);
