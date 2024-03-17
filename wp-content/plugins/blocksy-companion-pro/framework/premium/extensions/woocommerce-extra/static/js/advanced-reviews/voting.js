import { registerDynamicChunk } from 'blocksy-frontend'

registerDynamicChunk('blocksy_ext_woo_extra_advanced_reviews_voting', {
	mount: (el, { event }) => {
		const wasActive = el.dataset.buttonState === 'active'
		const upvoting = el.dataset.vote === 'up'
		el.dataset.buttonState = 'loading'

		fetch(`${ct_localizations.ajax_url}?action=ct_review_vote`, {
			method: 'POST',
			body: JSON.stringify({
				comment_id: el.dataset.commentId,
				vote: el.dataset.vote,
			}),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then(({ votes, upvotes, total }) => {
				if (votes) {
					const wrapper = el.closest('.ct-review-votes')

					wrapper.querySelector(
						'.ct-review-upvote-count'
					).textContent = upvotes

					wrapper.querySelector(
						'.ct-review-vote-count'
					).dataset.count = upvotes

					wrapper.querySelector(
						'.ct-review-total-count'
					).textContent = total

					el.dataset.buttonState = wasActive ? '' : 'active'

					if (!wasActive) {
						wrapper.querySelector(
							`[data-vote=${upvoting ? 'down' : 'up'}]`
						).dataset.buttonState = ''
					}
				}
			})
	},
})
