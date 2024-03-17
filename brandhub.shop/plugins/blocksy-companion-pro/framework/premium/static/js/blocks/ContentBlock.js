import { createElement } from '@wordpress/element'

import { __ } from 'ct-i18n'
import { registerBlockType } from '@wordpress/blocks'
import { InspectorControls, useBlockProps } from '@wordpress/block-editor'

import {
	Panel,
	PanelBody,
	PanelRow,
	Button,
	SelectControl,
} from '@wordpress/components'

const { content_blocks = {}, admin_url } = window.blocksy_premium_admin

const actuallyRegisterBlockType = () => {
	const categories = wp.blocks.getCategories()

	if (!categories.find((c) => c.slug === 'blocksy-blocks')) {
		return
	}

	registerBlockType('blocksy/content-block', {
		title: __('Content Block', 'blocksy-companion'),
		description: __(
			'Insert a specific Content Block anywhere on the site.',
			'blocksy-companion'
		),
		icon: {
			src: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					className="wc-block-editor-components-block-icon">
					<path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h12c.3 0 .5.2.5.5v12zm-8.7-3.3c.2.1.2.4.1.5l-.4.6c-.1.2-.4.2-.6.1-.3-.2-.6-.5-.8-.8-.1-.2-.1-.5.1-.6l.6-.4c.2-.1.4 0 .5.1.1.2.3.4.5.5zm0-5.9c.2.2.1.4 0 .5-.2.1-.4.3-.5.5-.1.1-.3.2-.5 0l-.6-.3c-.2-.2-.3-.4-.1-.6.2-.3.5-.6.8-.8.2-.2.4-.1.6.1l.3.6zm4.4.5c-.1-.1-.2-.3 0-.5l.4-.6c.1-.2.4-.2.6-.1.3.2.6.5.8.8.1.2.1.5-.1.6l-.6.4c-.3.1-.5 0-.6-.1-.1-.2-.3-.4-.5-.5zm1.6 5.2c.2.1.2.4.1.6-.2.3-.5.6-.8.8-.2.1-.5.1-.6-.1l-.4-.6c-.1-.2-.1-.4.1-.5.2-.1.3-.3.4-.4.1-.2.4-.2.5-.1l.7.3zm-7.6-1.7-.7.1c-.2 0-.5-.1-.5-.3v-1.1c0-.2.3-.4.5-.3l.7.1c.2 0 .3.2.3.4v.6c0 .2-.1.4-.3.5zm8.8-1.4v1.1c0 .2-.3.4-.5.3l-.7-.1c-.2 0-.3-.2-.3-.4v-.6c0-.2.1-.4.3-.4l.7-.1c.2-.1.4 0 .5.2zm-4.2 4.4.1.7c0 .2-.1.5-.3.5h-1.1c-.2 0-.4-.3-.3-.5l.1-.7c0-.2.2-.3.4-.3h.6c.2 0 .4.1.5.3zm.1-8.3-.1.7c0 .2-.2.3-.4.3h-.6c-.2 0-.4-.1-.4-.3l-.1-.7c0-.2.1-.5.3-.5h1.1c.1.1.2.3.2.5z" />
				</svg>
			),
		},
		category: 'blocksy-blocks',
		attributes: {
			content_block: {
				type: 'string',
				default: '',
			},
		},
		edit: ({ attributes, setAttributes }) => {
			const { content_block } = attributes

			const Controller = (props) => (
				<SelectControl
					label={__('Select Content Block', 'blocksy-companion')}
					value={content_block}
					options={[
						{
							label: __('None', 'blocksy-companion'),
							value: '',
						},
						...Object.keys(content_blocks).map((key) => ({
							label: content_blocks[key],
							value: key,
						})),
					]}
					onChange={(value) =>
						setAttributes({ content_block: value })
					}
					__nextHasNoMarginBottom
					{...props}
				/>
			)

			const blockProps = useBlockProps()

			return (
				<div {...blockProps}>
					<InspectorControls>
						<PanelBody
							title={__('Content Block', 'blocksy-companion')}>
							<PanelRow className="ct-components-panel__row-full-width">
								<Controller />
							</PanelRow>

							{content_block && (
								<PanelRow className="ct-components-panel__row-full-width">
									<Button
										variant="secondary"
										href={`${admin_url}post.php?post=${content_block}&action=edit`}
										target="_blank">
										{__(
											'Edit Content Block',
											'blocksy-companion'
										)}
									</Button>
								</PanelRow>
							)}
						</PanelBody>
					</InspectorControls>

					<div className="ct-content-block-placeholder components-placeholder">
						<fieldset className="components-placeholder__fieldset">
							<div className="components-placeholder__label">
								<span className="block-editor-block-icon has-colors">
									<svg
										width="24"
										heights="24"
										viewBox="0 0 24 24">
										<path d="M18 4H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 14c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h12c.3 0 .5.2.5.5v12zm-8.7-3.3c.2.1.2.4.1.5l-.4.6c-.1.2-.4.2-.6.1-.3-.2-.6-.5-.8-.8-.1-.2-.1-.5.1-.6l.6-.4c.2-.1.4 0 .5.1.1.2.3.4.5.5zm0-5.9c.2.2.1.4 0 .5-.2.1-.4.3-.5.5-.1.1-.3.2-.5 0l-.6-.3c-.2-.2-.3-.4-.1-.6.2-.3.5-.6.8-.8.2-.2.4-.1.6.1l.3.6zm4.4.5c-.1-.1-.2-.3 0-.5l.4-.6c.1-.2.4-.2.6-.1.3.2.6.5.8.8.1.2.1.5-.1.6l-.6.4c-.3.1-.5 0-.6-.1-.1-.2-.3-.4-.5-.5zm1.6 5.2c.2.1.2.4.1.6-.2.3-.5.6-.8.8-.2.1-.5.1-.6-.1l-.4-.6c-.1-.2-.1-.4.1-.5.2-.1.3-.3.4-.4.1-.2.4-.2.5-.1l.7.3zm-7.6-1.7-.7.1c-.2 0-.5-.1-.5-.3v-1.1c0-.2.3-.4.5-.3l.7.1c.2 0 .3.2.3.4v.6c0 .2-.1.4-.3.5zm8.8-1.4v1.1c0 .2-.3.4-.5.3l-.7-.1c-.2 0-.3-.2-.3-.4v-.6c0-.2.1-.4.3-.4l.7-.1c.2-.1.4 0 .5.2zm-4.2 4.4.1.7c0 .2-.1.5-.3.5h-1.1c-.2 0-.4-.3-.3-.5l.1-.7c0-.2.2-.3.4-.3h.6c.2 0 .4.1.5.3zm.1-8.3-.1.7c0 .2-.2.3-.4.3h-.6c-.2 0-.4-.1-.4-.3l-.1-.7c0-.2.1-.5.3-.5h1.1c.1.1.2.3.2.5z" />
									</svg>
								</span>
								{__(
									'Select Content Block',
									'blocksy-companion'
								)}
							</div>

							<div className="ct-content-block-select">
								<Controller hideLabelFromVision />
							</div>
						</fieldset>
					</div>
				</div>
			)
		},
		save: function () {
			return <div>Blocksy: Content Block Filter</div>
		},
	})
}

if (
	wp.blocks &&
	!document.body.classList.contains('post-type-ct_content_block')
) {
	actuallyRegisterBlockType()
}
