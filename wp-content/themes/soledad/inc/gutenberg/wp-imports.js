export const { registerBlockType } = wp.blocks
export const { __ } = wp.i18n
export const {
	ResizableBox,
	FontSizePicker,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	Dashicon,
	IconButton,
	Button,
	ButtonGroup,
	Toolbar,
	PanelBody,
	Disabled,
	RadioControl,
	BaseControl,
	ServerSideRender,
	AccessibleSVG,
	FormFileUpload,
} = wp.components

export const {
	withState
} = wp.compose

export const {
	InspectorControls,
	BlockControls,
	ColorPalette,
	AlignmentToolbar,
	RichText,
	URLInput,
	MediaUpload,
} = wp.editor.InspectorControls ? wp.editor : wp.blocks

export const {
	PanelColorSettings,
	BlockAlignmentToolbar,
} = wp.editor

export const {
	Fragment,
} = wp.element

export const {
	omit,
	merge,
} = lodash

export const {
	doAction,
	addAction,
	applyFilters,
	addFilter,
} = wp.hooks

const { withSelect } = wp.data;


