import { createElement, useRef } from '@wordpress/element'

import { useBlockProps } from '@wordpress/block-editor'

import { __ } from 'ct-i18n'
import { registerBlockType } from '@wordpress/blocks'
import { InspectorControls } from '@wordpress/block-editor'
import { PanelBody, PanelRow, ToggleControl } from '@wordpress/components'
import Preview from './Preview'

if (
	wp.blocks &&
	document.body.classList.contains('post-type-ct_thank_you_page')
) {
	registerBlockType('blocksy/woo-order', {
		apiVersion: 3,
		title: __('Order Details', 'blocksy-companion'),
		icon: {
			src: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					className="wc-block-editor-components-block-icon">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M5 4L7.5 5L9.5 4L12.5 5L15.5 4L17.5 5L20 4V21L17.5 20L15.5 21L12.5 20L9.5 21L7.5 20L5 21V4ZM7.56834 6.64288L9.61509 5.6195L12.5 6.58114L15.3849 5.6195L17.4317 6.64288L18.5 6.21555V18.7845L17.4317 18.3571L15.3849 19.3805L12.5 18.4189L9.61509 19.3805L7.56834 18.3571L6.5 18.7845V6.21555L7.56834 6.64288ZM8.5 8.75V10.25H16.5V8.75H8.5ZM8.5 11.75V13.25H16.5V11.75H8.5ZM16.5 14.75V16.25H8.5V14.75H16.5Z"/>
				</svg>
			),
		},
		category: 'blocksy-blocks',
		attributes: {
			showOrderOverview: {
				type: 'boolean',
				default: true,
			},
			showOrderDetails: {
				type: 'boolean',
				default: true,
			},
			showCustomerDetails: {
				type: 'boolean',
				default: true,
			},
		},
		supports: {
			className: true,
			spacing: {
				margin: true,
				padding: true,
			},
		},
		edit: ({ attributes, setAttributes }) => {
			const navRef = useRef()

			const {
				className,
				showOrderOverview,
				showOrderDetails,
				showCustomerDetails,
			} = attributes

			const blockProps = useBlockProps({
				ref: navRef,
				className,
			})
			return (
				<div {...blockProps}>
					<Preview attributes={attributes} />
					<InspectorControls>
						<PanelBody>
							<PanelRow>
								<ToggleControl
									label={__(
										'Order Overview',
										'blocksy-companion'
									)}
									help={__(
										'Display order overhiew section.',
										'blocksy-companion'
									)}
									checked={showOrderOverview}
									onChange={() =>
										setAttributes({
											showOrderOverview:
												!showOrderOverview,
										})
									}
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={__(
										'Order Details',
										'blocksy-companion'
									)}
									help={__(
										'Display order details section.',
										'blocksy-companion'
									)}
									checked={showOrderDetails}
									onChange={() =>
										setAttributes({
											showOrderDetails: !showOrderDetails,
										})
									}
								/>
							</PanelRow>
							<PanelRow>
								<ToggleControl
									label={__(
										'Customer Details',
										'blocksy-companion'
									)}
									help={__(
										'Display customer details section.',
										'blocksy-companion'
									)}
									checked={showCustomerDetails}
									onChange={() =>
										setAttributes({
											showCustomerDetails:
												!showCustomerDetails,
										})
									}
								/>
							</PanelRow>
						</PanelBody>
					</InspectorControls>
				</div>
			)
		},
		save: function () {
			return <div>Blocksy: Woo Order</div>
		},
	})
}
