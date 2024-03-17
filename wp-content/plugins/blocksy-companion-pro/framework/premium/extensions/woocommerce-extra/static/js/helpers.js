export const handleResponsiveSwitch = ({
	selector,
	variable = 'visibility',
	on = 'block',
	off = 'none'
}) => ({
	selector,
	variable,
	responsive: true,
	extractValue: ({ mobile, tablet, desktop }) => ({
		mobile: mobile ? on : off,
		tablet: tablet ? on : off,
		desktop: desktop ? on : off
	})
})
