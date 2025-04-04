(() => {
	'use strict';

	var reactElement = window.wp.element,
			wc_plugin_data = window.wc.wcSettings,
			wc_blocks_registry = window.wc.wcBlocksRegistry;

	// Get the gateway method data.
	const getGatewayMethodData = () => {
		const serverData = wc_plugin_data.getSetting('wal_wallet_data', null);
		if (!serverData) {
			throw new Error('Gateway initialization data is not available');
		}

		return serverData;
	};

	// Register the wallet payment gateway.
	wc_blocks_registry.registerPaymentMethod({
		name: getGatewayMethodData().id,
		label: getGatewayMethodData().title,
		ariaLabel: getGatewayMethodData().title,
		content: reactElement.createElement(reactElement.RawHTML, {}, getGatewayMethodData().description),
		edit: null,
		canMakePayment: (args) => {
			return true;
		},
		supports: {
			features: getGatewayMethodData().supports ?? []
		}
	});
})();