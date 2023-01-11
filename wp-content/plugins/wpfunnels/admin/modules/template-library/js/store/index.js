import { reactive } from "vue";

const store = ({
	state: reactive({
		showDrawer			: null,
		activeStepId		: null,
		activeStepTitle		: null,
		activeFunnelId		: null,
		component			: null,
		type				: null,
		showAlert			: null,
		isRemoteFunnels		: null,
		showLoader			: null,
		isGlobalFunnel		: null,
		isOrderbumpActive	: null,
		noProductTagSteps   : null,
		isEnableGbf         : null,
		componentMeta		: null,
	}),
	getters: {
		getShowDrawer() {
			return store.state.showDrawer
		},
		getIsRemoteFunnel() {
			return store.state.isRemoteFunnels
		},
		getActiveStepId() {
			return store.state.activeStepId
		},
		getActiveStepTitle() {
			return store.state.activeStepTitle
		},
		getActiveFunnelId() {
			return store.state.activeFunnelId
		},
		getComponent() {
			return store.state.component
		},
		getType() {
			return store.state.type
		},
		getShowAlert() {
			return store.state.showAlert
		},
		getIsGlobalFunnel() {
			return store.state.isGlobalFunnel
		},
		getIsOrderbumpActive() {
			return store.state.isOrderbumpActive
		},
		getNoProductTagSteps() {
			return store.state.noProductTagSteps
		},
		getIsEnableGbf() {
			return store.state.isEnableGbf
		},
		getComponentMeta() {
			return store.state.componentMeta
		},
		getShowLoader() {
			return store.state.showLoader
		}
	},
	mutations: {
		toggleDrawer() {
			store.state.showDrawer = !store.state.showDrawer
		},
		openDrawerLoader() {
			store.state.showLoader = true
		},
		closeDrawerLoader() {
			store.state.showLoader = false
		},
		setActiveStepId(stepID) {
			store.state.activeStepId = String(stepID)
		},
		setActiveStepTitle(stepTitle) {
			store.state.activeStepTitle = String(stepTitle)
		},
		setActiveFunnelId(funnelID) {
			store.state.activeFunnelId = String(funnelID)
		},
		setComponent(component) {
			store.state.component = component
		},
		setComponentMeta(meta) {
			store.state.componentMeta = meta
		},
		toggleAlert() {
			store.state.showAlert = !store.state.showAlert
		},
		getComponent() {
			return store.state.component
		},
		toggleGlobalFunnel() {
			store.state.isGlobalFunnel = !store.state.isGlobalFunnel
		},
		toggleGlobalFunnelButton() {
			store.state.isEnableGbf = !store.state.isEnableGbf
		},
		t(string, domain) {
			return __(string, domain)
		},
	},
	actions: {
		initializeStore() {
			store.state.showDrawer 			= false
			store.state.activeStepId 		= 0
			store.state.activeStepTitle 	= ''
			store.state.activeFunnelId 		= 0
			store.state.component 			= null
			store.state.type 				= ''
			store.state.showAlert 			= ''
			store.state.isRemoteFunnels 	= false
			store.state.showLoader 			= false
			store.state.isGlobalFunnel 		= window.WPFunnelVars.isGlobalFunnel
			store.state.isOrderbumpActive 	= false
			store.state.noProductTagSteps 	= []
			store.state.isEnableGbf 		= window.WPFunnelVars.isGbf === '1'
			store.state.componentMeta 		= {
				nodeID: '',
				node_identifier: '',
				funnelID: '',
			}
		}
	}
})

export default store ;
