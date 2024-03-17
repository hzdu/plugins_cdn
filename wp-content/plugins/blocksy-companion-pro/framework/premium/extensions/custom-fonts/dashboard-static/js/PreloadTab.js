import { createElement } from '@wordpress/element'

import { __, sprintf } from 'ct-i18n'
import PreloadManager from './PreloadManager'

const PreloadTab = ({
	variations,
	futurePreloadFonts,
	setFuturePreloadFonts,
}) => {
	return (
		<>
			<h4 className="ct-title">
				{__('Preload Variations', 'blocksy-companion')}
			</h4>

			<PreloadManager
				variations={variations}
				setFuturePreloadFonts={setFuturePreloadFonts}
				futurePreloadFonts={futurePreloadFonts}
			/>
		</>
	)
}

export default PreloadTab
