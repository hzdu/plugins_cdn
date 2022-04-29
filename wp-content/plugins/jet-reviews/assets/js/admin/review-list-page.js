(function( $, pageConfig ) {

	'use strict';

	Vue.config.devtools = true;

	window.JetReviewsListPage = new Vue( {
		el: '#jet-reviews-list-page',

		data: {
			reviewsGetting: false,
			itemsList: pageConfig.reviewsList,
			reviewsCount: +pageConfig.reviewsCount,
			postTypeOptions: pageConfig.postTypeOptions,
			postTypeFilter: '',
			titleSearchText: '',
			page: +pageConfig.currentPage,
			pageSize: +pageConfig.pageSize,
			commentsPageUrl: pageConfig.commentsPageUrl,
			editPopupVisible: false,
			editReviewId: false,
			reviewSavingState: false,
			deletePopupVisible: false,
			deleteReviewId: false,
			actionExecution: false,
		},

		mounted: function() {
			this.$el.className = this.$el.className + ' is-mounted';
			this.getReviews();
		},

		computed: {
			editReviewData: function() {

				if ( 'undefined' !== typeof this.itemsList[ this.editReviewId ] ) {
					return this.itemsList[ this.editReviewId ];
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
					post_slug: '',
					rating_data: {},
					title: '',
					type_slug: 'default',
				};
			},

			deleteReviewData: function() {

				if ( 'undefined' !== typeof this.itemsList[ this.deleteReviewId ] ) {
					return this.itemsList[ this.deleteReviewId ];
				}

				return false;
			}
		},

		methods: {
			changePage: function( page ) {
				this.page = page;
				this.getReviews();
			},

			postTypeFilterHandler: function() {
				this.getReviews();
			},

			searchReviewHandle: function() {
				this.getReviews();
			},

			getReviews: function() {
				let self = this;

				if ( '' !== this.titleSearchText ) {
					this.page = 1;
				}

				this.reviewsGetting = true;

				wp.apiFetch( {
					method: 'post',
					path: pageConfig.getReviewsRoute,
					data: {
						page: self.page - 1,
						title: self.titleSearchText,
						post_type: self.postTypeFilter,
					},
				} ).then( function( response ) {

					self.reviewsGetting = false;

					if ( response.success && response.data ) {
						self.itemsList = response.data.page_list;
						self.reviewsCount = +response.data.total_count;
					} else {
						self.$CXNotice.add( {
							message: response.message,
							type: 'error',
							duration: 5000,
						} );
					}
				} );
			},

			approveHandler: function( index, reviewId ) {
				let self = this;

				this.editReviewId = index;

				this.actionExecution = true;

				wp.apiFetch( {
					method: 'post',
					path: pageConfig.toggleReviewApproveRoute,
					data: {
						id: reviewId,
						approved: self.editReviewData.approved
					},
				} ).then( function( response ) {

					self.actionExecution = false;

					if ( response.success ) {

						let newStatus = ! self.editReviewData.approved;

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

			openEditReviewPopup: function( index ) {
				this.editReviewId = index;
				this.editPopupVisible = true;
			},

			openDeleteReviewPopup: function( index ) {
				this.deleteReviewId = index;
				this.deletePopupVisible = true;
			},

			saveReviewHandle: function() {
				let self = this;

				this.reviewSavingState = true;

				wp.apiFetch( {
					method: 'post',
					path: pageConfig.updateReviewRoute,
					data: {
						data: self.editReviewData
					},
				} ).then( function( response ) {

					self.reviewSavingState = false;

					if ( response.success ) {

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

			deleteReviewHandle: function() {
				let self = this;

				this.actionExecution = true;

				wp.apiFetch( {
					method: 'post',
					path: pageConfig.deleteReviewRoute,
					data: {
						id: self.deleteReviewData.id,
						post_id: self.deleteReviewData.post.id
					},
				} ).then( function( response ) {

					self.actionExecution = false;

					if ( response.success ) {
						Vue.delete( self.itemsList, self.deleteReviewId );

						self.reviewsCount--;

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

			getRating: function( rating ) {
				let averageRating = +rating,
					ratingColor   = 'very-high';

				if ( averageRating >= 80 && averageRating <= 100 ) {
					ratingColor = 'very-high';
				}

				if ( averageRating >= 60 && averageRating <= 79 ) {
					ratingColor = 'high';
				}

				if ( averageRating >= 40 && averageRating <= 59 ) {
					ratingColor = 'medium';
				}

				if ( averageRating >= 20 && averageRating <= 39 ) {
					ratingColor = 'low';
				}

				if ( averageRating >= 0 && averageRating <= 19 ) {
					ratingColor = 'very-low';
				}

				return `<span class="rating-value ${ratingColor}-rating">${ averageRating }%</span>`;
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

})( jQuery, window.JetReviewsListPageConfig );
