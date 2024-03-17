let requireTest = require.context(
	'../../features/premium-header/items/',
	true,
	/sync\.js$/
)
requireTest.keys().forEach(requireTest)

requireTest = require.context(
	'../../extensions/woocommerce-extra/features/wish-list/header-items/',
	true,
	/sync\.js$/
)
requireTest.keys().forEach(requireTest)

requireTest = require.context(
	'../../extensions/woocommerce-extra/features/compare/header-items/',
	true,
	/sync\.js$/
)
requireTest.keys().forEach(requireTest)
