let translate = window.FormCraftGlobal.fct
let React = window.React
let ReactDOM = window.ReactDOM
let moment = window.moment
let createReactClass = require('create-react-class')

import Header from './Header.js'
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

let FormCraftInsights = createReactClass({
	getInitialState() {
		return {
			loading: false,
			charts: [],
			forms: []
		}
	},
	componentDidMount() {
		this.getFormList()
	},
	getFormList: function() {
		let formSource = {
			max: 999,
			sortWhat: 'name',
			sortOrder: 'ASC',
			action: 'formcraft3_get_forms'
		}
		this.setState({ loading: true })
		this.serverRequest = jQuery.getJSON(`${FormCraftGlobal.ajaxurl}${jQuery.param(formSource)}`, (response) => {
			this.setState({
				forms: response.forms || [],
				loading: false
			})
		})
	},
	plotChart: function(charts) {

		let finalCharts = []
		let commonOptions = {
			borderCapStyle: 'butt',
			borderJoinStyle: 'miter',
			pointRadius: 0,
			pointHoverRadius: 0,
			borderWidth: 0
		}

		for (let field in charts) {
			let toPlotMain = {}
			toPlotMain.labels = charts[field].labelsAlt ? charts[field].labelsAlt : charts[field].labels
			toPlotMain.datasets = []
			toPlotMain.datasets.push(Object.assign({
				label: 'Count',
				backgroundColor: 'rgba(120, 171, 253, 1)',
				hoverBackgroundColor: 'rgba(100, 151, 243, 1)',
				data: charts[field].data
			}, commonOptions))
			finalCharts.push({
				label: charts[field].label,
				total: charts[field].totalAnalyzed,
				chartData: toPlotMain
			})
		}
		this.setState({ charts: finalCharts.length > 0 ? finalCharts : false })

	},
	getInsights: function(config) {
		let parameters = Object.assign({}, config)
		this.setState({ loading: true })
		jQuery.getJSON(`${FormCraftGlobal.ajaxurl}${jQuery.param(parameters)}`, function(response) {
			this.plotChart(response.charts)
			this.setState({ loading: false })
		}.bind(this))
	},
	render() {
		return (
			<div>
				<Header/>
				<div>
					<div className='block padding-right width-4'>
						<InsightsConfig getInsights={this.getInsights} forms={this.state.forms} loading={this.state.loading}/>
					</div>
					<div className='block width-6'>
						<AnalyticsCover forms={this.state.forms} charts={this.state.charts}/>
					</div>
				</div>
			</div>
		)
	}
})

let InsightsConfig = createReactClass({
	getInitialState() {
		return {
			config: {
				form: 0,
				maxEntries: 100,
				action: 'formcraft3_get_insights'
			}
		}
	},
	componentDidMount() {
		let options = {}
		options.beforeShow = function(element) {
			jQuery(element).addClass('isActive')
			jQuery('#ui-datepicker-div').removeClass('ui-datepicker').addClass('formcraft-datepicker')
		}
		options.onClose = (e, element) => {
			let Element = jQuery(`#${jQuery(element).attr('id')}`)
			Element.removeClass('isActive')
			if (jQuery(element).attr('id') === 'period-from') {
				let minDate = jQuery('#period-from').datepicker('getDate')
				jQuery('#period-to').datepicker('option', 'minDate', minDate)
				jQuery('#period-to').trigger('focus')
				this.setState({
					config: Object.assign(this.state.config, { 'period-from': jQuery.datepicker.formatDate('yy-mm-dd', Element.datepicker('getDate')) })
				})
			} else {
				this.setState({
					config: Object.assign(this.state.config, { 'period-to': jQuery.datepicker.formatDate('yy-mm-dd', Element.datepicker('getDate')) })
				})
			}
		}
		options.onSelect = function() {
			jQuery(this).trigger('change').trigger('input')
		}
		options.nextText = '❯'
		options.prevText = '❮'
		options.hideIfNoPrevNext = true
		options.changeYear = true
		options.changeMonth = true
		options.showAnim = false
		options.yearRange = 'c-2:c+2'
		options.dateFormat = 'd M, yy'
		jQuery('#period-from, #period-to').datepicker(options)
		jQuery('#ui-datepicker-div').removeClass('ui-datepicker').addClass('formcraft-datepicker')
	},
	updateConfig(type, element) {
		let value = element.target.value
		if (type === 'maxEntries') {
			if (/^\d+$/.test(value) === false || value < 0 || value > 99999999) {
				return false
			}
		}
		this.setState({
			config: Object.assign(this.state.config, { [type]: value })
		})
	},
	render() {
		return (
			<div className='formcraft_card formcraft_table insights_config_table'>
				<div className='block-header'>
					<span className='block-title'>{translate['Insights']}</span>
					{
						this.props.loading ?
							<div className='formcraft-loader'></div> :
							''
					}
					<button onClick={this.props.getInsights.bind(null, this.state.config)} className='float-right formcraft-button small'>
						<i className='formcraft-icon'>show_chart</i>
						{translate['Get Insights']}
					</button>
				</div>
				<div className='tbody'>
					<div className='tr'>
						<div className='td' style={{ width: '62%' }}>
						{translate['Select Form']}
						</div>
						<select className='td' style={{ width: '38%' }} onChange={this.updateConfig.bind(null, 'form')} value={this.state.config.form}>
						<option value='0'>Select a Form</option>
							{this.props.forms.map((form) => {
								return <option value={form.id} key={form.id}>{form.name}</option>
							})}
						</select>
					</div>
					<div className='tr'>
						<div className='td' style={{ width: '62%' }}>
						{translate['Period']}
						</div>
						<select className='td' style={{ width: '38%' }} onChange={this.updateConfig.bind(null, 'period')} value={this.state.config.period}>
							<option value='all'>{translate['All']}</option>
							<option value='custom'>{translate['Custom']}</option>
						</select>
						<div style={{ display: this.state.config.period === 'custom' ? 'block' : 'none' }}>
							<div className='td' style={{ marginLeft: '4%', width: '58%' }}>
							{translate['From']}
							</div>
							<input id='period-from' type='text' className='td' style={{ width: '38%' }} onChange={this.updateConfig.bind(null, 'periodFrom')} value={this.state.config.periodFrom}/>
							<div className='td' style={{ marginLeft: '4%', width: '58%' }}>
							{translate['To']}
							</div>
							<input id='period-to' type='text' className='td' style={{ width: '38%' }} onChange={this.updateConfig.bind(null, 'periodTo')} value={this.state.config.periodTo}/>
						</div>
					</div>
					<div className='tr'>
						<div className='td' style={{ width: '62%' }}>
						{translate['Max Entries']}
						</div>
						<input onChange={this.updateConfig.bind(null, 'maxEntries')} value={this.state.config.maxEntries} type='text' className='td' style={{ width: '38%' }}/>
					</div>
				</div>
			</div>
		)
	}
})

let Bar = createReactClass({
	getInitialState() {
		return {
			chart: false
		}
	},
	componentDidMount() {
		this.initializeChart()
	},
	componentDidUpdate(prevProps, prevState) {
		this.initializeChart()
	},
	initializeChart() {
		if (this.state.chart !== false) {
			this.state.chart.destroy()
		}		
		let el = ReactDOM.findDOMNode(this.refs.chart)
		let ctx = el.getContext('2d')
		this.state.chart = new Chart(ctx, {
			type: 'bar',
			data: this.props.data,
			options: this.props.options
		})
	},
	render() {
		return (<canvas ref='chart' height={this.props.height} width={this.props.width}/>)
	}
})

let AnalyticsCover = createReactClass({
	getInitialState() {
		return {
			chartHeight: 250,
			chartWidth: 250,
			chartOptions: {
				maintainAspectRatio: false,
				scales: {
					xAxes: [{
						ticks: {
							autoSkip: true,
							maxTicksLimit: 20,
							maxRotation: 0,
							minRotation: 0
						}
					}],
					yAxes: [{
						ticks: {
							beginAtZero: true,
							autoSkip: true,
							maxTicksLimit: 20,
							userCallback: function(label) {
								if (Math.floor(label) === label) {
									return label
								}
							}
						}
					}]
				},
				tooltips: {
					titleFontSize: 13,
					bodyFontSize: 12,
					xPadding: 12,
					yPadding: 10,
					caretSize: 6,
					cornerRadius: 3,
					displayColors: false,
					backgroundColor: 'rgb(85, 102, 119)',
					bodyFontColor: '#fff',
					intersect: false,
					mode: 'index',
					borderWidth: 1,
					borderColor: 'rgb(85, 102, 119)',
					callbacks: {
						label: function(tooltipItem, data) {
							let sum = data.datasets[0].data.reduce((a, b) => a + b, 0)
							let percent = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] / sum * 100
							return `${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]} (${percent.toFixed(2)}%)`
						}
					}
				},
				hover: {
					intersect: false,
					mode: 'index'
				},
				animation: {
					duration: 500
				},
				legend: {
					display: false
				}
			}
		}
	},
	componentDidMount() {
		let height = jQuery('.chart-container').height()
		let width = jQuery('.chart-container').width()
		this.setState({ chartHeight: height, chartWidth: width })
	},
	render() {

		return (
			<div className='insights_cover'>
				{
					this.props.charts ?
					<div>
						{
							this.props.charts.map((field, index) => {
								return (
									<div key={index} className='formcraft_card'>
										<div className='block-header'>
											<span className='block-title'>{field.label ? field.label : '(empty field label)'}</span>
											<span className='block-description float-right'>{translate['Entries Analyzed']}: {field.total}</span>
										</div>
										<div className='chart-container'>
											<Bar data={field.chartData} options={this.state.chartOptions} height={this.state.chartHeight} width={this.state.chartWidth}/>
										</div>
									</div>
								)
							})
						}
					</div>
					:
					<div className='formcraft_table' style={{ height: '14.18em' }}>
						<div className='tbody' style={{ minHeight: '0', height: '100%', background: 'transparent' }}>
							<div className='NoResults'>
								{translate['No Insights Available']}
								<br/>
								<a href='http://formcraft-wp.com/help/form-data-insights/' target='_blank'>{translate['learn more']}</a>
							</div>
						</div>
					</div>
				}
			</div>
		)
	}
})

jQuery(document).ready(function() {
	ReactDOM.render(<FormCraftInsights/>, document.getElementById('formcraft_dashboard'))
})

