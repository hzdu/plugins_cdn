let requireTest = require.context(
	'../../features/premium-header/items/',
	true,
	/sync\.js$/
)
requireTest.keys().forEach(requireTest)

requireTest = require.context(
	'../../extensions/woocommerce-extra/header-items/',
	true,
	/sync\.js$/
)
requireTest.keys().forEach(requireTest)
