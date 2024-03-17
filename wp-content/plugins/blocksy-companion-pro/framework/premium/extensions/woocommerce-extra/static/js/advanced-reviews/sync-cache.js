import { registerDynamicChunk } from 'blocksy-frontend'

registerDynamicChunk('blocksy_ext_woo_extra_advanced_reviews_sync_cache', {
	mount: (el) => {
		const commentsEls = el.querySelectorAll('.ct-review-vote')

		if (!commentsEls.length) {
			return
		}

		const comments_ids = [
			...new Set(
				Array.from(commentsEls).map((el) => +el.dataset.commentId)
			),
		]

		fetch(`${ct_localizations.ajax_url}?action=ct_sync_votes`, {
			method: 'POST',
			body: JSON.stringify({
				comments_ids,
			}),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then(({ votes: allVotes, user }) => {
				Object.entries(allVotes).forEach(([id, commentVotes]) => {
					if (!commentVotes) {
						return
					}

					const commentElUp = document.querySelector(
						`.ct-review-vote[data-comment-id="${id}"][data-vote="up"]`
					)

					const commentElDown = document.querySelector(
						`.ct-review-vote[data-comment-id="${id}"][data-vote="down"]`
					)

					if (!commentElUp || !commentElDown) {
						return
					}

					const { up = [], down = [] } = commentVotes

					if (up.includes(user)) {
						commentElUp.dataset.buttonState = 'active'
						commentElDown.dataset.buttonState = ''
					}

					if (down.includes(user)) {
						commentElUp.dataset.buttonState = ''
						commentElDown.dataset.buttonState = 'active'
					}

					const wrapper = commentElUp.closest('.ct-review-votes')

					const totalEl = wrapper.querySelector(
						'.ct-review-total-count'
					)

					const upvotesEl = wrapper.querySelector(
						'.ct-review-upvote-count'
					)
					const messageEl = wrapper.querySelector(
						'.ct-review-vote-count'
					)

					messageEl.dataset.count = up.length
					totalEl.innerHTML = up.length + down.length
					upvotesEl.innerHTML = up.length
				})
			})
	},
})
