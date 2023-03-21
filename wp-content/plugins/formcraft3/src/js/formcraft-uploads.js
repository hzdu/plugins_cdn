let translate = window.FormCraftGlobal.fct
let React = window.React
let ReactDOM = window.ReactDOM
let moment = window.moment
let createReactClass = require('create-react-class')

import AutosizeInput from 'react-input-autosize'

import Header from './Header.js'
import Pagination from './Pagination.js'
import Helpers from './Helpers.js'

if (FormCraftGlobal.ajaxurl.indexOf('?') > -1) {
	FormCraftGlobal.ajaxurl = `${FormCraftGlobal.ajaxurl}&`
} else {
	FormCraftGlobal.ajaxurl = `${FormCraftGlobal.ajaxurl}?`
}

jQuery(document).ready(function() {
	if (jQuery('#formcraft3_wpnonce').length) {
		jQuery.ajaxSetup({
			data: {
				formcraft3_wpnonce: jQuery('#formcraft3_wpnonce').val()
			}
		})
	}
})


let FormCraftEntries = createReactClass({
	getInitialState() {
		return {
			source: {
				page: 1,
				pages: 1,
				action: 'formcraft3_get_files',
				query: '',
				whichForm: 0,
				max: 11
			},
			fileList: {
				files: [],
				loading: false,
				toggleChecked: false
			},
			editedEntry: {
			},
			formList: []
		}
	},
	componentDidMount() {
		this.refreshList()
		this.getFormList()
	},
	getFormList: function() {
		let formSource = {
			max: 999,
			sortWhat: 'name',
			sortOrder: 'ASC',
			action: 'formcraft3_get_forms'
		}
		this.serverRequest = jQuery.getJSON(`${FormCraftGlobal.ajaxurl}${jQuery.param(formSource)}`, (response) => {
			this.setState({
				formList: response.forms || []
			})
		})
	},
	refreshList: function(newParams = {}) {
		this.setState({
			fileList: Object.assign(this.state.fileList, { loading: true }),
			source: Object.assign(this.state.source, newParams)
		})
		let combinedParams = Object.assign({}, this.state.source, newParams)
		this.serverRequest = jQuery.getJSON(`${FormCraftGlobal.ajaxurl}${jQuery.param(combinedParams)}`, function (result) {
			this.setState({
				fileList: {
					pages: result.pages,
					total: result.total,
					files: result.files || [],
					toggleChecked: false,
					loading: false
				}
			})
		}.bind(this))
	},
	onTrash() {
	},
	updatePage: function(newPage) {
		this.refreshList({ page: newPage })
	},
	toggleChecked(element) {
		this.setState({
			fileList: Object.assign({}, this.state.fileList, { toggleChecked: element.target.checked })
		}, () => {
			if (this.state.fileList.toggleChecked) {
				this.state.fileList.files.forEach((x, index) => {
					this.updateChecked(index, true)
				})
			} else {
				this.state.fileList.files.forEach((x, index) => {
					this.updateChecked(index, false)
				})
			}
		})
	},
	updateChecked(entryIndex, element) {
		let isChecked = typeof element === 'object' ? element.target.checked : element
		this.state.fileList.files[entryIndex].isChecked = isChecked
		let checkedNos = this.state.fileList.files.reduce((checked, current) => {
			if (current.isChecked) {
				checked.push(current.id)
			}
			return checked
		}, [])
		this.state.fileList.totalChecked = checkedNos.length
		this.setState({
			fileList: this.state.fileList
		})
	},
	updateSearch(type, element) {
		element.preventDefault()
		let value = element.target.getElementsByTagName('input')[0].value
		this.refreshList({ page: 1, query: value })
	},
	updateConfig(type, element) {
		let value = type === 'whichForm' ? parseInt(element.target.value, 10) : element.target.value
		this.setState({
			config: Object.assign(this.state.source, { [type]: value })
		})
		if (type === 'whichForm') {
			this.refreshList({ page: 1, whichForm: value })
		}
	},
	trashFiles() {
		let deleteFiles = []
		this.state.fileList.files.forEach((entry) => {
			if (entry.isChecked) {
				deleteFiles.push(entry.id)
			}
		})
		if (deleteFiles.length === 0) return
		this.setState({
			fileList: Object.assign(this.state.fileList, { loading: true })
		})
		let deleteSource = {
			files: deleteFiles,
			action: 'formcraft3_delete_files'
		}
		this.serverRequest = jQuery.getJSON(`${FormCraftGlobal.ajaxurl}${jQuery.param(deleteSource)}`, () => {
			this.refreshList()
		})
	},
	render() {
		return (
			<div>
				<Header/>
				<div>
					<div className='block entry-list-block padding-right width-10' style={{ maxWidth: '75em' }}>
						<FileList trashFiles={this.trashFiles} updateSearch={this.updateSearch} toggleChecked={this.toggleChecked} updateChecked={this.updateChecked} refreshList={this.refreshList} updateConfig={this.updateConfig} updatePage={this.updatePage} {...this.state}/>
					</div>
				</div>
			</div>
		)
	}
})

let FileList = createReactClass({
	getInitialState() {
		return {
			tempSearch: ''
		}
	},
	render() {
		let fileList = this.props.fileList
		let source = this.props.source
		let tbody = <div className='NoResults'>{translate['No Files Found']}</div>
		if (fileList.files.length > 0) {
			tbody = fileList.files.map((file, fileIndex) => {
				file.isChecked = file.isChecked || false
				fileSize = file.size / 1024
				let fileSize = fileSize < 1024 ? `${Math.round(fileSize)} KB` : `${Math.round((fileSize / 1024) * 100) / 100} MB`
				return (
					<div key={file.id} className='tr canHover'>
						<label style={{ width: '5%' }}>
							<input checked={file.isChecked} type='checkbox' onChange={this.props.updateChecked.bind(null, fileIndex)}/>
						</label>
						<a title={file.name} style={{ width: '40%' }} href={file.file_url} target='_blank'>
							{file.name}
						</a>
						<a title={file.mime} style={{ width: '23%' }} href={file.file_url} target='_blank'>
							{file.mime}
						</a>
						<a style={{ width: '12%', textAlign: 'right' }} href={file.file_url} target='_blank'>
							{fileSize}
						</a>
						<a style={{ width: '20%', textAlign: 'right', paddingRight: '1.8em' }} href={file.file_url} target='_blank'>
							{moment.unix(file.created).fromNow()}
						</a>
					</div>
				)
			})
		}
		return (
			<div className='formcraft_card formcraft_entry_list'>
				<div className='formcraft_table'>
					<div className='block-header'>
						<span className='block-title'>{translate['File Uploads']}</span>
						{
							fileList.loading ?
								<div className='formcraft-loader'></div> :
								''
						}
						<select className='formcraft-button small white float-right' style={{ width: '20em' }} onChange={this.props.updateConfig.bind(null, 'whichForm')} value={this.props.source.whichForm}>
							<option value={0}>{translate['(All Forms)']}</option>
							{this.props.formList.map((form) => {
								return <option value={form.id} key={form.id}>{form.name}</option>
							})}
						</select>
						<form className='float-right type-search formcraft-input-button small' onSubmit={this.props.updateSearch.bind(null, 'query')}>
							<AutosizeInput placeholder={translate['Search']} value={this.state.tempSearch} onChange={(e) => {
								this.setState({ tempSearch: e.target.value })
							}}/>
						</form>
						<button className='TrashEntries float-right formcraft-button small red' style={{ display: fileList.totalChecked ? 'inline-block' : 'none' }} onClick={this.props.trashFiles}>
							{translate['Trash']}
						</button>
					</div>
					<div className='tr thead'>
						<label style={{ width: '5%' }}>
							<input type='checkbox' onChange={this.props.toggleChecked} checked={fileList.toggleChecked}/>
						</label>
						<span style={{ width: '40%' }}>
							{translate['Name']}
						</span>
						<span style={{ width: '23%' }}>
							{translate['Type']}
						</span>
						<span style={{ width: '12%', textAlign: 'right' }}>
							{translate['Size']}
						</span>
						<span style={{ width: '20%', textAlign: 'right', paddingRight: '1.8em' }}>
							{translate['Created']}
						</span>
					</div>
					<div className='tbody' style={{ opacity: fileList.loading ? '.5' : '1' }}>
						{tbody}
					</div>
				</div>
				<Pagination updatePage={this.props.updatePage} page={source.page} pages={fileList.pages}/>
				{this.props.children}
			</div>
		)
	}
})


jQuery(document).ready(function() {
	ReactDOM.render(<FormCraftEntries/>, document.getElementById('formcraft_dashboard'))
})
