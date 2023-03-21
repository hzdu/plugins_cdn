/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	'use strict';

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var translate = window.FormCraftGlobal.fct;
	var _wp$blocks = wp.blocks,
	    registerBlockType = _wp$blocks.registerBlockType,
	    query = _wp$blocks.query;

	var el = wp.element.createElement;

	registerBlockType('formcraft/embed-form', {
		title: 'FormCraft Form',
		description: translate['Add a FormCraft form'],
		icon: React.createElement(
			'svg',
			{ 'aria-hidden': 'true', role: 'img', focusable: 'false', 'class': 'dashicon dashicons-editor-table', xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 20 20' },
			React.createElement('path', { d: 'M18 17V3H2v14h16zM16 7H4V5h12v2zm-7 4H4V9h5v2zm7 0h-5V9h5v2zm-7 4H4v-2h5v2zm7 0h-5v-2h5v2z' })
		),
		category: 'common',
		keywords: ['form', 'formcraft', 'contact us'],
		attributes: {
			id: {
				type: 'number'
			},
			auto: {
				type: 'string'
			},
			align: {
				type: 'string'
			},
			type: {
				type: 'string'
			},
			bind: {
				type: 'string'
			},
			class: {
				type: 'string'
			},
			font_color: {
				type: 'string'
			},
			placement: {
				type: 'string'
			},
			button_color: {
				type: 'string'
			},
			text: {
				type: 'string'
			}
		},
		edit: function edit(props) {
			function onChangeSelect(type, event) {
				props.setAttributes(_defineProperty({}, type, event.target.value));
			}
			function onChangeText(type, event) {
				props.setAttributes(_defineProperty({}, type, event.target.value));
			}

			return React.createElement(
				'div',
				{ className: 'formcraft-block' },
				React.createElement(
					'label',
					null,
					React.createElement(
						'div',
						{ className: 'main-label-cover' },
						React.createElement(
							'span',
							{ className: 'main-label' },
							translate['Form:']
						)
					),
					React.createElement(
						'select',
						{ onChange: onChangeSelect.bind(null, 'id'), value: props.attributes.id },
						React.createElement('option', { value: '' }),
						Object.keys(window.FormCraftGlobal.forms).map(function (x) {
							return React.createElement(
								'option',
								{ key: window.FormCraftGlobal.forms[x].id, value: window.FormCraftGlobal.forms[x].id },
								window.FormCraftGlobal.forms[x].name
							);
						})
					)
				),
				React.createElement(
					'label',
					null,
					React.createElement(
						'div',
						{ className: 'main-label-cover' },
						React.createElement(
							'span',
							{ className: 'main-label' },
							translate['Embed Type:']
						)
					),
					React.createElement(
						'select',
						{ onChange: onChangeSelect.bind(null, 'type'), value: props.attributes.type },
						React.createElement(
							'option',
							{ value: 'inline' },
							translate['Inline']
						),
						React.createElement(
							'option',
							{ value: 'popup' },
							translate['Popup']
						),
						React.createElement(
							'option',
							{ value: 'slide' },
							translate['Slide In']
						)
					)
				),
				React.createElement(
					'label',
					{ style: { display: props.attributes.type !== 'inline' ? 'block' : 'none' } },
					React.createElement(
						'div',
						{ className: 'main-label-cover' },
						React.createElement(
							'span',
							{ className: 'main-label' },
							translate['Button Text:']
						)
					),
					React.createElement('input', { type: 'text', onChange: onChangeText.bind(null, 'text'), value: props.attributes.text })
				),
				React.createElement('hr', null),
				React.createElement(
					'div',
					{ className: 'formcraft-block-small' },
					React.createElement(
						'label',
						{ style: { display: props.attributes.type === 'inline' ? 'inline-block' : 'none' } },
						React.createElement(
							'div',
							{ className: 'main-label-cover' },
							React.createElement(
								'span',
								{ className: 'main-label' },
								translate['Alignment:']
							)
						),
						React.createElement(
							'select',
							{ onChange: onChangeSelect.bind(null, 'align'), value: props.attributes.align },
							React.createElement(
								'option',
								{ value: 'left' },
								translate['Left']
							),
							React.createElement(
								'option',
								{ value: 'center' },
								translate['Center']
							),
							React.createElement(
								'option',
								{ value: 'right' },
								translate['Right']
							)
						)
					),
					React.createElement(
						'label',
						{ style: { display: props.attributes.type !== 'inline' ? 'inline-block' : 'none' } },
						React.createElement(
							'div',
							{ className: 'main-label-cover' },
							React.createElement(
								'span',
								{ className: 'main-label' },
								translate['Placement:']
							)
						),
						React.createElement(
							'select',
							{ onChange: onChangeSelect.bind(null, 'placement'), value: props.attributes.placement },
							React.createElement(
								'option',
								{ value: 'left' },
								translate['Left']
							),
							props.attributes.type === 'slide' ? React.createElement(
								'option',
								{ value: 'bottom-right' },
								translate['Bottom Right']
							) : React.createElement(
								'option',
								{ value: 'center' },
								translate['Center']
							),
							React.createElement(
								'option',
								{ value: 'right' },
								translate['Right']
							)
						)
					),
					React.createElement(
						'label',
						{ style: { display: props.attributes.type !== 'inline' ? 'inline-block' : 'none' } },
						React.createElement(
							'div',
							{ className: 'main-label-cover' },
							React.createElement(
								'span',
								{ className: 'main-label' },
								translate['Bind:']
							),
							React.createElement(
								'span',
								{ className: 'desc' },
								translate['bind form popup action to a CSS selector']
							)
						),
						React.createElement('input', { placeholder: '.open-form', type: 'text', onChange: onChangeText.bind(null, 'bind'), value: props.attributes.bind })
					),
					React.createElement(
						'label',
						{ style: { display: props.attributes.type === 'popup' ? 'inline-block' : 'none' } },
						React.createElement(
							'div',
							{ className: 'main-label-cover' },
							React.createElement(
								'span',
								{ className: 'main-label' },
								translate['Class:']
							),
							React.createElement(
								'span',
								{ className: 'desc' },
								translate['add a custom class to the popup button']
							)
						),
						React.createElement('input', { placeholder: 'btn', type: 'text', onChange: onChangeText.bind(null, 'class'), value: props.attributes.class })
					),
					React.createElement(
						'label',
						{ style: { display: props.attributes.type !== 'inline' ? 'inline-block' : 'none' } },
						React.createElement(
							'div',
							{ className: 'main-label-cover' },
							React.createElement(
								'span',
								{ className: 'main-label' },
								translate['Font Color:']
							),
							React.createElement(
								'span',
								{ className: 'desc' },
								translate['font color of the button']
							)
						),
						React.createElement('input', { placeholder: 'red', type: 'text', onChange: onChangeText.bind(null, 'font_color'), value: props.attributes.font_color })
					),
					React.createElement(
						'label',
						{ style: { display: props.attributes.type !== 'inline' ? 'inline-block' : 'none' } },
						React.createElement(
							'div',
							{ className: 'main-label-cover' },
							React.createElement(
								'span',
								{ className: 'main-label' },
								translate['Button Color:']
							),
							React.createElement(
								'span',
								{ className: 'desc' },
								translate['color of the button']
							)
						),
						React.createElement('input', { placeholder: 'white', type: 'text', onChange: onChangeText.bind(null, 'button_color'), value: props.attributes.button_color })
					),
					React.createElement(
						'label',
						{ style: { display: props.attributes.type !== 'inline' ? 'inline-block' : 'none' } },
						React.createElement(
							'div',
							{ className: 'main-label-cover' },
							React.createElement(
								'span',
								{ className: 'main-label' },
								translate['Auto Popup:']
							),
							React.createElement(
								'span',
								{ className: 'desc' },
								translate['auto popup the form on page load after x seconds']
							)
						),
						React.createElement('input', { placeholder: '2', type: 'text', onChange: onChangeText.bind(null, 'auto'), value: props.attributes.auto })
					)
				)
			);
		},
		save: function save(props) {
			props.attributes.type = props.attributes.type || 'inline';
			props.attributes.id = parseInt(props.attributes.id, 10) || 1;
			props.attributes.bind = props.attributes.bind || '';
			props.attributes.class = props.attributes.class || '';
			props.attributes.font_color = props.attributes.font_color || 'white';
			props.attributes.button_color = props.attributes.button_color || '#4488ee';
			props.attributes.auto = props.attributes.auto || '';

			if (props.attributes.type === 'slide') {
				props.attributes.placement = props.attributes.placement || 'left';
			} else {
				props.attributes.placement = props.attributes.placement || 'inline';
			}

			props.attributes.align = props.attributes.align || 'left';
			props.attributes.text = props.attributes.text || 'Text';

			return React.createElement(
				'div',
				null,
				'[fc align=\'',
				props.attributes.align,
				'\' id=\'',
				props.attributes.id,
				'\' type=\'',
				props.attributes.type,
				'\' bind=\'',
				props.attributes.bind,
				'\' class=\'',
				props.attributes.class,
				'\' font_color=\'',
				props.attributes.font_color,
				'\' button_color=\'',
				props.attributes.button_color,
				'\' auto=\'',
				props.attributes.auto,
				'\' placement=\'',
				props.attributes.placement,
				'\']',
				props.attributes.text,
				'[/fc]'
			);
		}
	});

/***/ })
/******/ ]);