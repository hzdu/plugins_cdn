import {
	useEffect,
	createElement,
	Fragment,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element'
import classnames from 'classnames'
import { addFilter } from '@wordpress/hooks'

import { Select } from 'blocksy-options'
import { __ } from 'ct-i18n'
import { BlockContextProvider } from '@wordpress/block-editor'

import { useSelect } from '@wordpress/data'

if (wp.compose) {
	addFilter(
		'editor.BlockEdit',
		'blocksy.WrapWithPostId',
		wp.compose.createHigherOrderComponent((C) => (props) => {
			const data = useSelect((select) => {
				if (!select('core/editor')) {
					return {}
				}

				return select('core/editor').getEditedPostAttribute(
					'blocksy_meta'
				)
			}, [])

			if (
				!data ||
				!data.previewedPost ||
				!data.previewedPost.post_id ||
				(data.template_type === 'archive' &&
					data.template_subtype === 'canvas')
			) {
				return <C {...props} />
			}

			const previewedPost = data.previewedPost

			return (
				<BlockContextProvider
					value={{
						postId: previewedPost.post_id,
						postType: previewedPost.post_type || 'post',
					}}>
					<C {...props} />
				</BlockContextProvider>
			)
		})
	)
}

const withUniqueIDs = (data) =>
	data.filter(
		(value, index, self) =>
			self.findIndex((m) => m.ID === value.ID) === index
	)

let allPostsCache = []

const PreviewedPostsSelect = ({ value, onChange }) => {
	const [allPosts, setAllPosts] = useState(allPostsCache)

	const currentPostId = useMemo(() => value.post_id || '', [value.post_id])

	const fetchPosts = (searchQuery = '') => {
		fetch(
			`${wp.ajax.settings.url}?action=blocksy_conditions_get_all_posts`,
			{
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					post_type: 'ct_all_posts',

					...(searchQuery ? { search_query: searchQuery } : {}),
					...(currentPostId ? { alsoInclude: currentPostId } : {}),
				}),
				method: 'POST',
			}
		)
			.then((r) => r.json())
			.then(({ data: { posts } }) => {
				setAllPosts((allPosts) =>
					withUniqueIDs([...allPosts, ...posts])
				)

				allPostsCache = withUniqueIDs([...allPostsCache, ...posts])
			})
	}

	useEffect(() => {
		fetchPosts()
	}, [])

	return (
		<div className="ct-previewed-post">
			<Select
				option={{
					appendToBody: true,
					defaultToFirstItem: false,
					searchPlaceholder: __(
						'Type to search by ID or title...',
						'blocksy-companion'
					),
					placeholder: __('Select post', 'blocksy-companion'),
					choices: allPosts.map((post) => ({
						key: post.ID,
						value: post.post_title,
					})),
					search: true,
				}}
				value={currentPostId}
				onChange={(post_id) => {
					const post = allPosts.find(({ ID }) => ID === post_id)

					onChange({
						post_id: post.ID,
						post_type: post.post_type,
					})
				}}
				onInputValueChange={(value) => {
					if (
						allPosts.find(({ post_title }) => post_title === value)
					) {
						return
					}

					fetchPosts(value)
				}}
			/>
		</div>
	)
}

export default PreviewedPostsSelect
