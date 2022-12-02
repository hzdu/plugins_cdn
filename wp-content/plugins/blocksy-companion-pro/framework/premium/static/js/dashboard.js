import ctEvents from 'ct-events'
import { createElement, Component } from '@wordpress/element'
import BetaConsent from './components/BetaConsent'

ctEvents.on('ct:dashboard:home:after', (r) => {
	if (ctDashboardLocalizations.plugin_data.hide_beta_updates) {
		return
	}

	r.content = <BetaConsent />
})
