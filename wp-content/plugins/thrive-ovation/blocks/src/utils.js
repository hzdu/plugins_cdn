import {__} from '@wordpress/i18n';
import {PanelBody, PanelRow, Button} from '@wordpress/components';
import {InspectorControls} from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import thriveLogo from './thrive-logo';

const createElement = wp.element.createElement,
	tveOuterHeight = el => {
		if ( ! el ) {
			return 0;
		}
		let height = el.offsetHeight;
		const style = getComputedStyle( el );

		height += parseInt( style.marginTop ) + parseInt( style.marginBottom );
		return height;
	},
	generateRandomString = ( radix = 16 ) => {
		return (
			new Date().getTime() + Math.floor( Math.random() * 100000 )
		).toString( radix );
	},
	getNonCachedLink = ( link ) => {
		return `${link}${
			link.split( '?' )[ 1 ] ? '&' : '?'
		}tvo=${generateRandomString()}`
	};


wp.domReady( function () {
	wp.blocks.updateCategory( 'thrive', {icon: thriveLogo} );
} );

/**
 * Once an block is update try to update the preview in gutenberg too
 */
window.addEventListener(
	'storage',
	( storageEvent ) => {
		if (
			storageEvent.key &&
			storageEvent.key.includes( 'tvo_block' )
		) {
			const id = storageEvent.key.split( '-' )[ 1 ],
				iframes = document.getElementsByClassName(
					`tvo-block-${id}`
				);

			/**
			 * in case of duplicate / copy-paste
			 */
			Array.prototype.forEach.call( iframes, ( iframe ) => {
				iframe.setAttribute(
					'src',
					getNonCachedLink( iframe.getAttribute(
						'src'
					) )
				);
			} );

			localStorage.removeItem( storageEvent.key );
		}
	},
	false
);

/**
 * Render the sidebar & iframe once you added a block
 * @param props
 * @param label
 * @returns {(*)[]}
 */
export function renderSidebar( props, label ) {
	let previewLink = props.attributes.previewLink || '',
		editLink = props.attributes.editLink || '';
	if ( ! previewLink ) {
		const selectedPost = props.posts ? props.posts.find(
			( post ) =>
				Number( post.id ) === Number( props.attributes.selectedBlock )
		) : 0;
		if ( selectedPost ) {
			previewLink = selectedPost.link;
			editLink = selectedPost.edit_url;
		}
	}

	if ( previewLink ) {
		previewLink += `${previewLink.split( '?' )[ 1 ] ? '&' : '?'}tve_block_preview=1`;
	}

	return [ createElement(
		InspectorControls,
		null,
		createElement(
			PanelBody,
			{
				title: __( 'Settings', 'thrive-ovation' ),
				initialOpen: true,
			},
			createElement(
				PanelRow,
				{},
				createElement(
					'a',
					{
						class: 'tvo-sidebar-edit-button',
						href: editLink,
						target: '_blank',
					},
					__( label, 'thrive-ovation' )
				)
			),
		)
	),
		createElement( 'iframe', {
			src: `${previewLink}`,
			id: `tvo-block-${props.attributes.selectedBlock}`,
			class: `${props.attributes.className} tvo-block-preview tvo-block-${props.attributes.selectedBlock}`,
			scrolling: 'no',
			onLoad() {
				const iframes = document.getElementsByClassName(
					`tvo-block-${props.attributes.selectedBlock}`
				);

				/**
				 * in case of duplicate / copy-paste
				 */
				Array.prototype.forEach.call( iframes, ( iframe ) => {
					const iframeDocument = iframe.contentDocument,
						setHeight = () => {
							const height = tveOuterHeight( iframeDocument.body );

							iframe.style.setProperty(
								'height',
								`${height}px`
							);
							iframe.parentNode.style.setProperty(
								'height',
								`${height}px`
							);
						};

					iframe.style.setProperty(
						'pointer-events',
						'none'
					);

					setHeight();
					/**
					 * in case there is content loaded via ajax calls
					 */
					setTimeout( () => {
						setHeight();
					}, 3000 );

					if ( iframe.contentWindow.TVE_Dash ) {
						iframe.contentWindow.TVE_Dash.forceImageLoad( iframeDocument );
					}
				} );
			},
		} ),
	]
}

/**
 * Render the add block view
 * @param props
 * @param title
 * @param description
 * @param logo
 * @param postType
 * @returns {any}
 */
export function renderBlock( props, title, description, logo, postType ) {
	return createElement(
		'div',
		{
			class: 'tvo-new-block-container',
		},
		logo(),
		createElement(
			'div',
			{
				class: 'tvo-block-title',
			},
			createElement( 'h2', {}, __( title, 'thrive-ovation' ) )
		),
		createElement(
			'div',
			{
				class: 'tvo-new-block-description',
			},
			__( description, 'thrive-ovation' )
		),

		createElement(
			Button,
			{
				className: 'tvo-create-block-button',
				type: 'button',
				onClick() {
					apiFetch( {
						path: `/wp/v2/${postType}`,
						method: 'POST',
						data: {
							status: 'publish',
						},
					} )
						.then( ( data ) => {
							props.setAttributes( {
								selectedBlock: parseInt(
									data.id
								),
								previewLink: data.link,
								editLink: data.edit_url
							} );
							window.open(
								data.edit_url,
								'_blank'
							);
						} )
						.catch( function ( data ) {
						} );
				},
			},
			__( 'Setup', 'thrive-ovation' )
		)
	);
}
