(function( $, pageConfig ) {

	'use strict';

	Vue.config.devtools = true;

	window.JetReviewsCommentsListPage = new Vue( {
		el: '#jet-reviews-comments-list-page',

		data: {
			commentsGetting: false,
			itemsList: pageConfig.commentsList,
			commentsCount: +pageConfig.commentsCount,
			page: +pageConfig.currentPage,
			pageSize: +pageConfig.pageSize,
			reviewId: +pageConfig.reviewId,
			searchText: '',
			editPopupVisible: false,
			editCommentId: false,
			commentSavingState: false,
			deletePopupVisible: false,
			deleteCommentId: false,
			actionExecution: false,
		},

		mounted: function() {
			this.$el.className = this.$el.className + ' is-mounted';

			this.getComments();
		},

		computed: {

			editCommentData: function() {

				if ( 'undefined' !== typeof this.itemsList[ this.editCommentId ] ) {
					return this.itemsList[ this.editCommentId ];
				}

				return {
					approved: 'true',
					author: {
						avatar: '',
						id: '1',
						mail: 'demo@demo.com',
						name: 'admin',
					},
					content: '',
					date: '2000-01-01 00:00:00',
					id: '0',
					post: {},
				};
			},

			deleteReviewData: function() {

				if ( 'undefined' !== typeof this.itemsList[ this.deleteCommentId ] ) {
					return this.itemsList[ this.deleteCommentId ];
				}

				return false;
			}
		},

		methods: {
			changePage: function( page ) {
				this.page = page;

				this.getComments();
			},

			searchCommentHandle: function() {
				this.getComments();
			},

			getComments: function() {

				let self = this;

				if ( '' !== this.searchText ) {
					this.page = 1;
				}

				this.commentsGetting = true;

				wp.apiFetch( {
					method: 'post',
					path: pageConfig.getCommentsRoute,
					data: {
						page: self.page - 1,
						search: self.searchText,
						reviewId: self.reviewId,
					},
				} ).then( function( response ) {

					self.commentsGetting = false;

					if ( response.success && response.data ) {
						self.itemsList = response.data.page_list;
						self.commentsCount = +response.data.total_count;
					} else {
						self.$CXNotice.add( {
							message: response.message,
							type: 'error',
							duration: 5000,
						} );
					}
				} );
			},

			approveHandler: function( index, commentId ) {
				let self = this;

				this.editCommentId = index;

				this.actionExecution = true;

				wp.apiFetch( {
					method: 'post',
					path: pageConfig.toggleCommentApproveRoute,
					data: {
						id: commentId,
						approved: self.editCommentData.approved
					},
				} ).then( function( response ) {

					self.actionExecution = false;

					if ( response.success ) {

						let newStatus = ! self.editCommentData.approved;

						self.$set( self.itemsList[ index ], 'approved', newStatus );

						self.$CXNotice.add( {
							message: response.message,
							type: 'success',
							duration: 3000,
						} );
					} else {
						self.$CXNotice.add( {
							message: response.message,
							type: 'error',
							duration: 3000,
						} );
					}
				} );
			},

			openEditPopup: function( index ) {
				this.editCommentId = index;
				this.editPopupVisible = true;
			},

			openDeletePopup: function( index ) {
				this.deleteCommentId = index;
				this.deletePopupVisible = true;
			},

			saveCommentHandle: function() {
				let self = this;

				this.commentSavingState = true;

				wp.apiFetch( {
					method: 'post',
					path: pageConfig.updateCommentRoute,
					data: {
						data: self.editCommentData
					},
				} ).then( function( response ) {

					self.commentSavingState = false;

					if ( response.success ) {
						self.editPopupVisible = false;

						self.$CXNotice.add( {
							message: response.message,
							type: 'success',
							duration: 5000,
						} );
					} else {
						self.$CXNotice.add( {
							message: response.message,
							type: 'error',
							duration: 5000,
						} );
					}
				} );
			},

			deleteCommentHandle: function() {
				let self = this;

				this.actionExecution = false;

				wp.apiFetch( {
					method: 'post',
					path: pageConfig.deleteCommentRoute,
					data: {
						id: self.deleteReviewData.id
					},
				} ).then( function( response ) {

					self.actionExecution = false;

					if ( response.success ) {

						self.itemsList = response.data.page_list;
						self.commentsCount = +response.data.total_count;

						self.$CXNotice.add( {
							message: response.message,
							type: 'success',
							duration: 5000,
						} );
					} else {
						self.$CXNotice.add( {
							message: response.message,
							type: 'error',
							duration: 5000,
						} );
					}
				} );
			},

			getRolesLabel: function( $rolesList ) {
				let label = '';

				if ( 'function' !== typeof $rolesList[ Symbol.iterator ] ) {
					return label;
				}

				for ( let role of $rolesList ) {
					label += `<span class="${ role }-role">${ role }</span>`;
				}

				return label;
			}

		}
	} );

})( jQuery, window.JetReviewsCommentsListPageConfig );
