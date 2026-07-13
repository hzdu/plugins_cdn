/**
 * EmbedPress Pro — Dynamic Source controls (fbs-81736).
 *
 * Hand-authored, *not* a vite/cgb output. The Pro Gutenberg src/ build
 * chain (cgb-scripts 1.x → node-sass 7) doesn't run on modern Node/arm,
 * so this filter ships as a standalone IIFE that pulls everything from
 * window.wp.* globals at runtime. Enqueued by Gutenberg/init.php after
 * `embedpress-blocks-js`.
 *
 * Hooks `embedpress.dynamicSourceSettings` (registered by the free
 * plugin's <DynamicSource> placeholder; see
 * src/Blocks/GlobalCoponents/dynamic-source.js). Replaces the free
 * upsell card with the functional Source + Field controls; field
 * dropdown populates from GET /embedpress/v1/dynamic-fields.
 */
(function () {
    if (!window.wp || !wp.hooks || !wp.element || !wp.components || !wp.apiFetch || !wp.i18n) {
        return;
    }

    var wpSelect = (wp.data && wp.data.select) ? wp.data.select : null;
    var addFilter = wp.hooks.addFilter;
    var createElement = wp.element.createElement;
    var useState = wp.element.useState;
    var useEffect = wp.element.useEffect;
    var Fragment = wp.element.Fragment;
    var SelectControl = wp.components.SelectControl;
    var TextControl = wp.components.TextControl;
    var __ = wp.i18n.__;
    var apiFetch = wp.apiFetch;

    var SOURCE_OPTIONS = [
        { label: __('— None —', 'embedpress-pro'), value: '' },
        { label: 'MetaBox', value: 'metabox' },
        { label: 'ACF', value: 'acf' },
        { label: 'Pods', value: 'pods' },
        { label: 'Toolset', value: 'toolset' },
        { label: 'JetEngine', value: 'jetengine' },
        { label: __('Raw post meta', 'embedpress-pro'), value: 'meta' },
    ];

    function DynamicSourceControls(props) {
        var attributes = props.attributes;
        var setAttributes = props.setAttributes;

        var fieldsState = useState([]);
        var fields = fieldsState[0];
        var setFields = fieldsState[1];

        var loadingState = useState(false);
        var loading = loadingState[0];
        var setLoading = loadingState[1];

        var unavailableState = useState('');
        var unavailable = unavailableState[0];
        var setUnavailable = unavailableState[1];

        useEffect(function () {
            if (!attributes.dynamicSource) {
                setFields([]);
                setUnavailable('');
                return;
            }
            setLoading(true);
            apiFetch({ path: '/embedpress/v1/dynamic-fields?source=' + encodeURIComponent(attributes.dynamicSource) })
                .then(function (res) {
                    setFields(res.fields || []);
                    setUnavailable(res.available === false ? (res.message || '') : '');
                })
                .catch(function () {
                    setFields([]);
                    setUnavailable(__('Could not load fields.', 'embedpress-pro'));
                })
                .then(function () { setLoading(false); });
        }, [attributes.dynamicSource]);

        // Live editor preview: resolve the selected field to a URL for the
        // current post and store it in dynamicPreviewUrl, which the block's
        // edit.js prefers over the saved placeholder so the editor canvas
        // matches the front-end. Cleared when source/field are removed.
        useEffect(function () {
            if (!attributes.dynamicSource || !attributes.dynamicField) {
                if (attributes.dynamicPreviewUrl) {
                    setAttributes({ dynamicPreviewUrl: '' });
                }
                return;
            }
            var postId = (wpSelect && wpSelect('core/editor')) ? wpSelect('core/editor').getCurrentPostId() : 0;
            apiFetch({
                path: '/embedpress/v1/dynamic-resolve?source=' + encodeURIComponent(attributes.dynamicSource) +
                    '&field=' + encodeURIComponent(attributes.dynamicField) +
                    '&post_id=' + (postId || 0),
            })
                .then(function (res) {
                    var url = (res && res.url) ? res.url : '';
                    if (url !== attributes.dynamicPreviewUrl) {
                        setAttributes({ dynamicPreviewUrl: url });
                    }
                })
                .catch(function () {});
        }, [attributes.dynamicSource, attributes.dynamicField]);

        var fieldOptions = [{ label: __('— Select field —', 'embedpress-pro'), value: '' }].concat(fields);

        var children = [
            createElement('p', { key: 'desc', style: { marginTop: 0, color: '#6b7280', fontSize: 12 } },
                __('Pull the PDF URL from a custom field on each post (great for archive/loop pages).', 'embedpress-pro')
            ),
            createElement(SelectControl, {
                key: 'source',
                label: __('Source', 'embedpress-pro'),
                value: attributes.dynamicSource || '',
                options: SOURCE_OPTIONS,
                onChange: function (value) { setAttributes({ dynamicSource: value, dynamicField: '' }); },
            }),
        ];

        if (attributes.dynamicSource) {
            if (unavailable) {
                children.push(createElement('p', { key: 'err', style: { color: '#b91c1c', fontSize: 12 } }, unavailable));
            } else {
                children.push(createElement(SelectControl, {
                    key: 'field',
                    label: __('Field', 'embedpress-pro'),
                    help: loading ? __('Loading fields…', 'embedpress-pro') : __('Pick a custom field that holds the PDF URL.', 'embedpress-pro'),
                    value: attributes.dynamicField || '',
                    options: fieldOptions,
                    onChange: function (value) { setAttributes({ dynamicField: value }); },
                }));
                children.push(createElement(TextControl, {
                    key: 'manual',
                    label: __('Or enter a field key manually', 'embedpress-pro'),
                    help: __('Use this when your field is not in the dropdown (e.g. dynamic keys).', 'embedpress-pro'),
                    value: attributes.dynamicField || '',
                    onChange: function (value) { setAttributes({ dynamicField: value }); },
                }));
            }
        }

        if (attributes.dynamicSource && attributes.dynamicField) {
            children.push(createElement('p', {
                key: 'note',
                style: { color: '#9ca3af', fontSize: 12, marginBottom: 0 },
            }, __('Editor preview uses the file above. The front-end will replace it with the value from this field.', 'embedpress-pro')));
        }

        return createElement('div', { key: 'pro-dynamic-source' }, children);
    }

    addFilter(
        'embedpress.dynamicSourceSettings',
        'embedpress-pro/dynamicSourceSettings',
        function (settings, attributes, setAttributes) {
            return [createElement(DynamicSourceControls, {
                key: 'pro-dynamic-source-controls',
                attributes: attributes,
                setAttributes: setAttributes,
            })];
        }
    );
})();
