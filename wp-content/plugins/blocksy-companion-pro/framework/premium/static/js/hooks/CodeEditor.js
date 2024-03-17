import ctEvents from 'ct-events'
import {
	RawHTML,
	useRef,
	useState,
	useEffect,
	render,
	createElement,
	Fragment,
} from '@wordpress/element'

import classnames from 'classnames'

import { Overlay } from 'blocksy-options'

import { subscribe, dispatch, select } from '@wordpress/data'
import { __ } from 'ct-i18n'
import { registerBlockType, createBlock } from '@wordpress/blocks'

import CodeEditor from '@uiw/react-textarea-code-editor'

const edit = ({ attributes, setAttributes }) => {
	const ref = useRef()
	const rootEl = useRef()

	const [num, setNum] = useState((attributes.code || '').split('\n').length)

	useEffect(() => {
		setNum(ref.current.querySelectorAll('.code-line').length)
	}, [attributes.code])

	return (
		<div ref={ref} className="ct-block-code-editor">
			<div className="w-tc-editor-numbers">
				{Array.from({ length: num }, (_, i) => (
					<span className="code-number">{i + 1}</span>
				))}
			</div>

			<CodeEditor
				value={attributes.code || ''}
				language="php"
				onChange={(evn) => setAttributes({ code: evn.target.value })}
				padding={10}
				minHeight={50}
			/>
		</div>
	)
}

if (
	wp.blocks &&
	(document.body.classList.contains('post-type-ct_content_block') ||
		document.body.classList.contains('post-type-ct_product_tab') ||
		document.body.classList.contains('post-type-ct_size_guide'))
) {
	registerBlockType('blocksy-companion-pro/code-editor', {
		title: __('Code Editor', 'blocksy-companion'),
		icon: 'editor-code',
		category: 'blocksy-blocks',
		supports: {
			className: false,
			html: false,
		},
		attributes: {
			code: {
				type: 'string',
			},
		},
		transforms: {
			to: [
				{
					type: 'block',
					blocks: ['core/html'],
					transform: function (attributes) {
						return createBlock('core/html', {
							content: attributes.code,
						})
					},
				},
				{
					type: 'block',
					blocks: ['core/shortcode'],
					transform: function (attributes) {
						return createBlock('core/shortcode', {
							content: attributes.code,
						})
					},
				},
			],
			from: [
				{
					type: 'block',
					blocks: ['core/html', 'core/shortcode'],
					transform: function (attributes) {
						return createBlock(
							'blocksy-companion-pro/code-editor',
							{
								code: attributes.content,
							}
						)
					},
				},
			],
		},

		deprecated: [
			{
				attributes: {
					content: {
						type: 'string',
						source: 'html',
					},
				},

				migrate: function (attributes) {
					return {
						code: decodeHtml(attributes.content),
					}
				},

				save(props) {
					return props.attributes.content
				},
			},
		],

		edit,

		save: (props) => {
			return null
		},
	})
}

const CodeEditorTrigger = () => {
	const [isEditing, setIsEditing] = useState(false)

	return (
		<Fragment>
			<button
				onClick={(e) => {
					e.preventDefault()
					setIsEditing(true)
				}}
				type="button"
				className="button button-primary button-large">
				<span className="disabled">
					{__('Use code editor', 'blocksy-companion')}
				</span>
				<span className="enabled">
					{__('Exit code editor', 'blocksy-companion')}
				</span>
			</button>

			<Overlay
				items={isEditing}
				className="ct-admin-modal ct-hooks-notice-modal"
				onDismiss={() => {
					setIsEditing(false)
				}}
				render={() => (
					<div className="ct-modal-content">
						<h2>{__('Heads up!', 'blocksy-companion')}</h2>
						<p>
							{__(
								'Enabling & disabling the code editor will erase everything from your post editor and this action is irreversible.',
								'blocksy-companion'
							)}
						</p>
						<p>
							<b>
								{__(
									'Are you sure you want to continue?',
									'blocksy-companion'
								)}
							</b>
						</p>

						<div
							className="ct-modal-actions has-divider "
							data-buttons="2">
							<button
								className={classnames('button ct-large-button')}
								onClick={() => {
									setIsEditing(false)
								}}>
								{__('Cancel', 'blocksy-companion')}
							</button>

							<button
								className={classnames('button-primary')}
								onClick={() => {
									setIsEditing(false)

									const isEnabled =
										document.body.classList.contains(
											'blocksy-inline-code-editor'
										)
									const { resetBlocks } =
										dispatch('core/block-editor')

									document.body.classList.remove(
										'blocksy-inline-code-editor'
									)

									if (!isEnabled) {
										document.body.classList.add(
											'blocksy-inline-code-editor'
										)
									}

									if (isEnabled) {
										resetBlocks([])
									} else {
										resetBlocks([
											createBlock(
												'blocksy-companion-pro/code-editor'
											),
										])
									}

									ctEvents.trigger(
										'ct:metabox:options:trigger-change',
										{
											id: 'has_inline_code_editor',
											value: isEnabled ? 'no' : 'yes',
										}
									)

									wp.data
										.dispatch('core/block-editor')
										.updateSettings({
											templateLock: !isEnabled,
										})
								}}>
								{__('Yes, continue', 'blocksy-companion')}
							</button>
						</div>
					</div>
				)}
			/>
		</Fragment>
	)
}

function decodeHtml(str) {
	var map = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#039;': "'",
	}

	return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function (m) {
		return map[m]
	})
}

export const mountCodeEditor = () => {
	if (
		!wp.data ||
		!wp.data.dispatch('core/block-editor') ||
		!wp.data.subscribe
	) {
		return
	}

	if (
		!document.body.classList.contains('post-type-ct_content_block') &&
		!document.body.classList.contains('post-type-ct_product_tab') &&
		!document.body.classList.contains('post-type-ct_size_guide')
	) {
		return
	}

	const isEnabled = document.body.classList.contains(
		'blocksy-inline-code-editor'
	)

	wp.data.dispatch('core/block-editor').updateSettings({
		templateLock: isEnabled,
	})

	setTimeout(() => {
		if (isEnabled) {
			const { resetBlocks } = dispatch('core/block-editor')
			const { getBlocks } = select('core/block-editor')
			const allBlocks = getBlocks()

			if (allBlocks.length === 1 && allBlocks[0].name === 'core/code') {
				resetBlocks([
					createBlock('blocksy-companion-pro/code-editor', {
						code: decodeHtml(allBlocks[0].attributes.content),
					}),
				])
			}
		}
	}, 1000)

	window.wp.data.subscribe(function () {
		setTimeout(function () {
			const editorToolbar = document.querySelector(
				'#editor .edit-post-header__toolbar'
			)

			const maybeTrigger = editorToolbar.querySelector(
				'.blocksy-code-editor-trigger'
			)

			if (editorToolbar && !maybeTrigger) {
				editorToolbar.insertAdjacentHTML(
					'beforeend',
					`<div class="blocksy-code-editor-trigger"></div>`
				)

				setTimeout(() => {
					render(
						<CodeEditorTrigger />,
						editorToolbar.querySelector(
							'.blocksy-code-editor-trigger'
						)
					)
				})
			}

			if (
				editorToolbar &&
				maybeTrigger &&
				maybeTrigger.parentNode.children[0] === maybeTrigger
			) {
				editorToolbar.appendChild(maybeTrigger)
			}
		}, 50)
	})
}
