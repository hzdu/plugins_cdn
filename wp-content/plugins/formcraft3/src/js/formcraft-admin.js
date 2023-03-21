let translate = window.FormCraftGlobal.fct
const { registerBlockType, query } = wp.blocks
const el = wp.element.createElement


registerBlockType('formcraft/embed-form', {
	title: 'FormCraft Form',
	description: translate['Add a FormCraft form'],
	icon: <svg aria-hidden="true" role="img" focusable="false" class="dashicon dashicons-editor-table" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20"><path d="M18 17V3H2v14h16zM16 7H4V5h12v2zm-7 4H4V9h5v2zm7 0h-5V9h5v2zm-7 4H4v-2h5v2zm7 0h-5v-2h5v2z"></path></svg>,
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
	edit: function(props) {
		function onChangeSelect(type, event) {
			props.setAttributes({ [type]: event.target.value })
		}
		function onChangeText(type, event) {
			props.setAttributes({ [type]: event.target.value })
		}

		return (
			<div className='formcraft-block'>
				<label>
					<div className='main-label-cover'>
						<span className='main-label'>{translate['Form:']}</span>
					</div>
					<select onChange={onChangeSelect.bind(null, 'id')} value={props.attributes.id}>
						<option value=''></option>
						{Object.keys(window.FormCraftGlobal.forms).map((x) => {
							return <option key={window.FormCraftGlobal.forms[x].id} value={window.FormCraftGlobal.forms[x].id}>{window.FormCraftGlobal.forms[x].name}</option>
						})}
					</select>
				</label>
				<label>
					<div className='main-label-cover'>
						<span className='main-label'>{translate['Embed Type:']}</span>
					</div>
					<select onChange={onChangeSelect.bind(null, 'type')} value={props.attributes.type}>
						<option value='inline'>{translate['Inline']}</option>
						<option value='popup'>{translate['Popup']}</option>
						<option value='slide'>{translate['Slide In']}</option>
					</select>
				</label>
				<label style={{ display: props.attributes.type !== 'inline' ? 'block' : 'none' }}>
					<div className='main-label-cover'>
						<span className='main-label'>{translate['Button Text:']}</span>
					</div>
					<input type='text' onChange={onChangeText.bind(null, 'text')} value={props.attributes.text}/>
				</label>
				<hr/>
				<div className='formcraft-block-small'>
					<label style={{ display: props.attributes.type === 'inline' ? 'inline-block' : 'none' }}>
					<div className='main-label-cover'>
						<span className='main-label'>{translate['Alignment:']}</span>
					</div>
						<select onChange={onChangeSelect.bind(null, 'align')} value={props.attributes.align}>
							<option value='left'>{translate['Left']}</option>
							<option value='center'>{translate['Center']}</option>
							<option value='right'>{translate['Right']}</option>
						</select>
					</label>
					<label style={{ display: props.attributes.type !== 'inline' ? 'inline-block' : 'none' }}>
					<div className='main-label-cover'>
						<span className='main-label'>{translate['Placement:']}</span>
					</div>
						<select onChange={onChangeSelect.bind(null, 'placement')} value={props.attributes.placement}>
							<option value='left'>{translate['Left']}</option>
							{
								props.attributes.type === 'slide' ?
								<option value='bottom-right'>{translate['Bottom Right']}</option> :
								<option value='center'>{translate['Center']}</option>
							}
							<option value='right'>{translate['Right']}</option>
						</select>
					</label>
					<label style={{ display: props.attributes.type !== 'inline' ? 'inline-block' : 'none' }}>
					<div className='main-label-cover'>
						<span className='main-label'>{translate['Bind:']}</span>
						<span className='desc'>{translate['bind form popup action to a CSS selector']}</span>
					</div>
					<input placeholder='.open-form' type='text' onChange={onChangeText.bind(null, 'bind')} value={props.attributes.bind}/>
					</label>
					<label style={{ display: props.attributes.type === 'popup' ? 'inline-block' : 'none' }}>
					<div className='main-label-cover'>
						<span className='main-label'>{translate['Class:']}</span>
						<span className='desc'>{translate['add a custom class to the popup button']}</span>
					</div>
					<input placeholder='btn' type='text' onChange={onChangeText.bind(null, 'class')} value={props.attributes.class}/>
					</label>
					<label style={{ display: props.attributes.type !== 'inline' ? 'inline-block' : 'none' }}>
					<div className='main-label-cover'>
						<span className='main-label'>{translate['Font Color:']}</span>
						<span className='desc'>{translate['font color of the button']}</span>
					</div>
					<input placeholder='red' type='text' onChange={onChangeText.bind(null, 'font_color')} value={props.attributes.font_color}/>
					</label>
					<label style={{ display: props.attributes.type !== 'inline' ? 'inline-block' : 'none' }}>
					<div className='main-label-cover'>
						<span className='main-label'>{translate['Button Color:']}</span>
						<span className='desc'>{translate['color of the button']}</span>
					</div>
					<input placeholder='white' type='text' onChange={onChangeText.bind(null, 'button_color')} value={props.attributes.button_color}/>
					</label>
					<label style={{ display: props.attributes.type !== 'inline' ? 'inline-block' : 'none' }}>
					<div className='main-label-cover'>
						<span className='main-label'>{translate['Auto Popup:']}</span>
						<span className='desc'>{translate['auto popup the form on page load after x seconds']}</span>
					</div>
					<input placeholder='2' type='text' onChange={onChangeText.bind(null, 'auto')} value={props.attributes.auto}/>
					</label>
				</div>
			</div>
		)
	},
	save: function(props) {
		props.attributes.type = props.attributes.type || 'inline'
		props.attributes.id = parseInt(props.attributes.id, 10) || 1
		props.attributes.bind = props.attributes.bind || ''
		props.attributes.class = props.attributes.class || ''
		props.attributes.font_color = props.attributes.font_color || 'white'
		props.attributes.button_color = props.attributes.button_color || '#4488ee'
		props.attributes.auto = props.attributes.auto || ''

		if (props.attributes.type === 'slide') {
			props.attributes.placement = props.attributes.placement || 'left'
		} else {
			props.attributes.placement = props.attributes.placement || 'inline'
		}

		props.attributes.align = props.attributes.align || 'left'
		props.attributes.text = props.attributes.text || 'Text'


		return <div>[fc align='{props.attributes.align}' id='{props.attributes.id}' type='{props.attributes.type}' bind='{props.attributes.bind}' class='{props.attributes.class}' font_color='{props.attributes.font_color}' button_color='{props.attributes.button_color}' auto='{props.attributes.auto}' placement='{props.attributes.placement}']{props.attributes.text}[/fc]</div>
	}
})
