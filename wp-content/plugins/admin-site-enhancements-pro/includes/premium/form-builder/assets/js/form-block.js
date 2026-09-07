'use strict';

const {createElement} = wp.element;
const {registerBlockType} = wp.blocks;
const {InspectorControls, useBlockProps} = wp.blockEditor;
const {serverSideRender: ServerSideRender} = wp;
const {PanelBody, SelectControl, ToggleControl, TextControl, RadioControl, Placeholder} = wp.components;

const FormBuilderIcon = <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g fill="currentColor"><path d="M19 25.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0m-2.5 0a2 2 0 1 0-4 0a2 2 0 0 0 4 0M10 15.25c0-.69.56-1.25 1.25-1.25h20.5a1.25 1.25 0 1 1 0 2.5h-20.5c-.69 0-1.25-.56-1.25-1.25m12.25 9.25a1.25 1.25 0 1 0 0 2.5h9.5a1.25 1.25 0 1 0 0-2.5z"/><path d="M10.75 5A5.75 5.75 0 0 0 5 10.75v21.5A5.75 5.75 0 0 0 10.75 38h21.5A5.75 5.75 0 0 0 38 32.25v-21.5A5.75 5.75 0 0 0 32.25 5zM7.5 10.75a3.25 3.25 0 0 1 3.25-3.25h21.5a3.25 3.25 0 0 1 3.25 3.25v21.5c0 .456-.094.89-.264 1.285A3.24 3.24 0 0 1 32.25 35.5h-21.5a3.24 3.24 0 0 1-2.999-1.995A3.2 3.2 0 0 1 7.5 32.25z"/><path d="M15.25 42.5a5.74 5.74 0 0 1-4.747-2.504q.123.004.247.004h21.5A7.75 7.75 0 0 0 40 32.25v-21.5q0-.123-.004-.247A5.74 5.74 0 0 1 42.5 15.25v17c0 5.66-4.59 10.25-10.25 10.25z"/></g></svg>;

registerBlockType('form-builder/form-selector', {
    apiVersion: 3,
    title: form_builder_block_data.i18n.title,
    icon: FormBuilderIcon,
    category: 'widgets',
    keywords: form_builder_block_data.i18n.form_keywords,
    description: form_builder_block_data.i18n.description,
    attributes: {
        formId: {
            type: 'string',
        },
    },

    edit(props) {
        const {attributes: {formId = '', displayTitle = false, displayDescription = false}, setAttributes} = props;
        const blockProps = useBlockProps();
        const formOptions = Object.entries(form_builder_block_data.forms).map(value => ({
            value: value[0],
            label: value[1]
        }));
        let jsx;

        formOptions.unshift({
            value: '',
            label: form_builder_block_data.i18n.form_select
        });

        function selectForm(value) {
            setAttributes({formId: value});
        }

        function toggleDisplayTitle(value) {
            setAttributes({displayTitle: value});
        }

        function toggleDisplayDescription(value) {
            setAttributes({displayDescription: value});
        }

        jsx = [
            <InspectorControls key="form-builder-selector-inspector-controls">
                <PanelBody title={form_builder_block_data.i18n.form_settings}>
                    <SelectControl
                        label={form_builder_block_data.i18n.form_selected}
                        value={formId}
                        options={formOptions}
                        onChange={selectForm}
                    />
                </PanelBody>
            </InspectorControls>
        ];

        if (formId) {
            jsx.push(
                <ServerSideRender
                    key="form-builder-selector-server-side-renderer"
                    block="form-builder/form-selector"
                    attributes={props.attributes}
                />
            );
        } else {
            jsx.push(
                <Placeholder
                    key="form-builder-selector-wrap"
                    icon={FormBuilderIcon}
                    instructions={form_builder_block_data.i18n.title}
                    className="form-builder-gutenberg-form-selector-wrap">
                    <SelectControl
                        key="form-builder-selector-select-control"
                        value={formId}
                        options={formOptions}
                        onChange={selectForm}
                    />
                </Placeholder>
            );
        }
        return <div {...blockProps}>{jsx}</div>;
    },
    save() {
        return null;
    },
    deprecated: [
        {
            attributes: {
                formId: {
                    type: 'string',
                },
            },
            save() {
                return null;
            },
        },
    ],
});
