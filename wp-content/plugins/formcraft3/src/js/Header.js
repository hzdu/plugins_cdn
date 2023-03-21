let translate = window.FormCraftGlobal.fct
let React = window.React
let ReactDOM = window.ReactDOM
let createReactClass = require('create-react-class')

let Header = createReactClass({
	getInitialState: function() {
		return {
			keepData: FormCraftGlobal.keepData === '1' ? true : false
		}
	},
	toggleKeepData: function(e) {
		this.setState({
			keepData: e.target.checked
		})
		let params = {
			action: 'formcraft3_toggle_keep_data',
			keep: e.target.checked
		}
		jQuery.getJSON(`${FormCraftGlobal.ajaxurl}${jQuery.param(params)}`, (response) => {
			this.setState({
				keepData: response.keepData
			})
		})
	},
	render() {
		return (
			<div className='formcraft_header'>
				<h1>FormCraft</h1>
				<span className='version'>v{FormCraftGlobal['version']}</span>
				<label style={{ float: 'left', margin: '.4em 1em' }}>
					<input checked={this.state.keepData} onChange={this.toggleKeepData} type='checkbox'/> {translate.keepdata}
				</label>
				<a className='exportall' href={`${FormCraftGlobal.baseurl}?formcraft3_export_all=true`}>{translate.exportall}</a>
				<div className='FormCraft-Notices'> {
						FormCraftGlobal.notices.map((notice, index) => {
							return (
								<div key={index}> {
									notice.link ?
									<a href={notice.link} className={notice.className}>{notice.message}</a>
									:
									<span className={notice.className} dangerouslySetInnerHTML={{ __html: notice.message }}></span>
								}
								</div>
							)
						})
					}
				</div>
			</div>
		)
	}
})

module.exports = Header
