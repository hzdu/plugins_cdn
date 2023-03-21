let React = window.React
let ReactDOM = window.ReactDOM
let moment = window.moment
let createReactClass = require('create-react-class')

import Header from './Header.js'
import Helpers from './Helpers.js'

let Pagination = createReactClass({
	render: function() {
		return (
			<div className='pagination-cover'>
			<div className='pagination'>
			<div style={{ left: '0px' }}>
			{[...Array(this.props.pages)].map((x, index) => {
				return (
					<span key={index} className={ index + 1 === this.props.page ? 'active' : '' } onClick={this.props.updatePage.bind(null, index + 1)}>
						{index + 1}
					</span>
				)
			})}
			</div>
			</div>
			</div>
			)
	}
})

module.exports = Pagination
