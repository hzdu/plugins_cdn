function transitionExists( target, customSelector, allTransitions ) {
	return allTransitions.some( function( el ) {
		let hasTarget = false;

		if ( el.target === target ) {
			hasTarget = true;

			if ( 'undefined' !== typeof customSelector && '' !== customSelector ) {
				if ( el.customSelector !== customSelector ) {
					hasTarget = false;
				}
			}
		}

		return hasTarget;
	} );
}

export {
	transitionExists,
};
