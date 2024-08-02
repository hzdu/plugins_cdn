/**
 * Social Reviews
 */
document.addEventListener('DOMContentLoaded', () => {
	tpsocialReview(document)
});

function tpsocialReview(doc){
	let allSocRev = doc.querySelectorAll('.tpgb-social-reviews');
    if(allSocRev){
        allSocRev.forEach((sr)=>{
            var scroll_nrml = {
            ScrollOn: sr.getAttribute("data-scroll-normal"),
            TextLimit: sr.getAttribute("data-textlimit")
            };
            var Get_TL = sr.getAttribute("data-textlimit");
            Get_TL = (Get_TL) ? JSON.parse(Get_TL) : '';

            if (scroll_nrml.ScrollOn == "true" && scroll_nrml.TextLimit == "false") {
                var SF_Text = sr.querySelectorAll(".showtext");
                if(SF_Text){
                    SF_Text.forEach(function(element) {
                        if (element.clientHeight >= scroll_nrml.Height) {
                            element.classList.add(scroll_nrml.className);
                            element.style.height = scroll_nrml.Height;
                        }
                    });
                }
            }

			document.addEventListener('click', function(e) {
				if (e.target.matches('.readbtn')) {
					let target = e.target;
					var rMsg = target.closest('.tpgb-message');
					var container = rMsg.closest('.tpgb-isotope .post-loop-inner');
					var Scroll = target.closest('.tpgb-social-reviews').dataset.scrollNormal;
					Scroll = (Scroll) ? JSON.parse(Scroll) : '';

					var showtxt = rMsg.querySelector('.showtext');

					if (rMsg.classList.contains('show-text')) {
						rMsg.classList.remove('show-text', 'show-less');
						target.innerHTML = Get_TL.showmoretxt;
						rMsg.querySelector('.sf-dots').style.display = 'inline';
						if (Scroll && Scroll.ScrollOn && Scroll.TextLimit) {
							showtxt.classList.remove(Scroll.className);
							showtxt.removeAttribute('style');
						}
					} else {
						rMsg.classList.add('show-text', 'show-less');
						target.innerHTML = Get_TL.showlesstxt;
						rMsg.querySelector('.sf-dots').style.display = 'none';
						if (Scroll && Scroll.ScrollOn && Scroll.TextLimit) {
							if (showtxt.clientHeight >= Scroll.Height) {
								showtxt.classList.add(Scroll.className);
								showtxt.style.height = Scroll.Height+'px';
							}
						}
					}
					if(container){
						new Isotope( container, {
							itemSelector: '.grid-item',
							resizable: true,
							sortBy: 'original-order'
						});
					}			
				}
			});

			/**Load More*/
			let loadMoreSR = sr.querySelector(".review-load-more");
			if (loadMoreSR) {
				loadMoreSR.addEventListener('click', function(e) {
				  e.preventDefault();
				  var loadFeed_click = e.currentTarget,
					loadFeed = loadFeed_click.getAttribute('data-loadattr'),
					display = loadFeed_click.getAttribute('data-display'),
					loadFview = loadFeed_click.getAttribute('data-loadview'),
					loadclass = loadFeed_click.getAttribute('data-loadclass'),
					loadlayout = loadFeed_click.getAttribute('data-layout'),
					loadloadingtxt = loadFeed_click.getAttribute('data-loadingtxt'),
					current_text = loadFeed_click.textContent;
				  if (loadFeed_click.getAttribute('data-requestRunning')) {
					return;
				  }
				  loadFeed_click.setAttribute('data-requestRunning', true);
				  loadFeed_click.textContent = loadloadingtxt;
			  
				  var formData = new FormData();
				  formData.append('action', 'tpgb_reviews_load');
				  formData.append('view', display);
				  formData.append('loadFview', loadFview);
				  formData.append('loadattr', loadFeed);
			  
				  fetch( (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl, {
					  method: 'POST',
					  body: formData
					})
					.then(function(response) {
					  if (!response.ok) {
						throw new Error('Network response was not ok');
					  }
					  return response.json();
					})
					.then(function(data) {
					  var HtmlData = (data && data.HTMLContent) ? data.HTMLContent : '';
					  var TotalReview = (data && data.TotalReview) ? data.TotalReview : '';
					  var FilterStyle = (data && data.FilterStyle) ? data.FilterStyle : '';
					  var Allposttext = (data && data.allposttext) ? data.allposttext : '';
					  if (data == '') {
						loadFeed_click.classList.add("hide");
					  } else {
						var BlockClass = '.tpgb-block-' + loadclass;
						var CategoryClass = document.querySelector(BlockClass + " .all .tpgb-category-count");
						var PostLoopClass = document.querySelector(BlockClass + " .post-loop-inner");
						if(PostLoopClass){
							PostLoopClass.insertAdjacentHTML('beforeend', HtmlData);
						}
			  
						var Totalcount = document.querySelector(BlockClass).querySelectorAll('.grid-item').length;
						if(CategoryClass){
							CategoryClass.innerHTML = Totalcount;
						}
			  
						if (FilterStyle == 'style-2' || FilterStyle == 'style-3') {
						  var Categoryload = document.querySelectorAll(BlockClass + ' .tpgb-filter-list .tpgb-category-list:not(.all)');
			  
						  if(Categoryload){
							Categoryload.forEach(function(value) {
								var span2 = value.querySelector('span:nth-child(2)').dataset.hover;
								var Toatal2 = document.querySelector(BlockClass).querySelectorAll('.grid-item.' + span2).length;
								value.querySelector('span:nth-child(1).tpgb-category-count').innerHTML = Toatal2;
							  });
						  }
						}
						if (loadlayout == 'grid' || loadlayout == 'masonry') {
						  if (sr.classList.contains("tpgb-isotope") && typeof tppoMaso == 'function') {
							tppoMaso( doc )
						  }
						}
						if (Totalcount >= Number(TotalReview)) {
						  loadFeed_click.classList.add("hide");
						  loadFeed_click.parentNode.insertAdjacentHTML('beforeend', '<div class="tpgb-review-loaded">' + Allposttext + '</div>');
						} else {
						  loadFeed_click.textContent = current_text;
						}
					  }
					  display = Number(display) + Number(loadFview);
					  loadFeed_click.setAttribute("data-display", display);
					})
					.catch(function(error) {
					  console.log('Error:', error);
					})
					.finally(function() {
					  loadFeed_click.removeAttribute('data-requestRunning');
					})
					.then(function() {
					  if (document.querySelector(".tpgb-block-" + loadclass).classList.contains("tpgb-isotope")) {
						if (loadlayout == 'grid' || loadlayout == 'masonry' && typeof tppoMaso == 'function') {
							tppoMaso( doc )
						}
					  }
					});
				})
			}

			/** Lazyload */
            let lazyLoad = sr.querySelector('.tpgb-review-lazy-load')
            if (lazyLoad && sr.classList.contains('tpgb-isotope')) {
            	var windowWidth, windowHeight, documentHeight, scrollTop, containerHeight, containerOffset;
            	var $window = window;
                
                var recalcValues = function() {
                	windowWidth = $window.innerWidth;
                	windowHeight = $window.innerHeight;
                	documentHeight = document.querySelector('body').offsetHeight;
                	containerHeight = sr.offsetHeight;
                	containerOffset = sr.offsetTop + 50;
                	setTimeout(function() {
                		containerHeight = sr.offsetHeight;
                		containerOffset = sr.offsetTop + 50;
                	}, 50);
                };
                
                recalcValues();
                $window.addEventListener('resize', recalcValues);
                $window.addEventListener('scroll', function(e) {
                	e.preventDefault();
                	recalcValues();
                	scrollTop = $window.pageYOffset;
                	containerHeight = sr.offsetHeight;
                	containerOffset = sr.offsetTop + 50;
                    
                    if (sr.querySelector('.tpgb-review-lazy-load') && scrollTop < documentHeight && (scrollTop + 60 > (containerHeight + containerOffset - windowHeight))) {
                        let lazyReview_click = lazyLoad.querySelector('.review-lazy-load'),
                            lazyFeed = lazyReview_click.dataset.lazyattr,
                            totalReviews = lazyReview_click.getAttribute('data-totalreviews'),
                            display = lazyReview_click.getAttribute('data-display'),
                            loadFview = lazyReview_click.dataset.lazyview,
                            loadclass = lazyReview_click.dataset.lazyclass,
                            loadlayout = lazyReview_click.dataset.lazylayout,
                            current_text = lazyReview_click.innerHTML;

                    	let BlockClass = lazyReview_click.closest('.tpgb-block-'+loadclass);
                      
                    	if (lazyReview_click.dataset.requestRunning && lazyReview_click.dataset.requestRunning=="true") {
                    		return;
                    	}
                      
                    	if (Number(totalReviews) >= Number(display)) {
							lazyReview_click.dataset.requestRunning = "true";
							fetch( (tpgb_config && tpgb_config.ajax_url) ? tpgb_config.ajax_url : tpgb_load.ajaxUrl , {
								method: 'POST',
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								},
								body: 'action=tpgb_reviews_load&view=' + display + '&loadFview=' + loadFview + '&loadattr=' + lazyFeed
							})
							.then(function(response) {
								return response.json();
							})
							.then(function(data) {
								var HtmlData = (data && data.HTMLContent) ? data.HTMLContent : '';
								var TotalReview = (data && data.TotalReview) ? data.TotalReview : '';
								var FilterStyle = (data && data.FilterStyle) ? data.FilterStyle : '';
								var Allposttext = (data && data.allposttext) ? data.allposttext : '';
							
								if (data === '' ) {
									lazyReview_click.classList.add('hide');
								} else {
									var CategoryClass = BlockClass.querySelector('.all .tpgb-category-count');
									var PostLoopClass = BlockClass.querySelector('.post-loop-inner');
									PostLoopClass.insertAdjacentHTML('beforeend', HtmlData);
									var Totalcount = BlockClass.querySelectorAll('.grid-item').length;
									if(CategoryClass){
										CategoryClass.innerHTML = '';
										CategoryClass.appendChild(document.createTextNode(Totalcount));
									}
									
									if (FilterStyle === 'style-2' || FilterStyle === 'style-3') {
										var Categoryload = BlockClass.querySelectorAll('.tpgb-filter-list .tpgb-category-list:not(.all)');
										if(Categoryload){
											Categoryload.forEach(function(value) {
												var span2 = value.querySelector('span:nth-child(2)').dataset.hover;
												var Toatal2 = BlockClass.querySelectorAll('.grid-item.' + span2).length;
												value.querySelector('span:nth-child(1).tpgb-category-count').innerHTML = '';
												value.querySelector('span:nth-child(1).tpgb-category-count').appendChild(document.createTextNode(Toatal2));
											});
										}
									}
									
									if (loadlayout === 'grid' || loadlayout === 'masonry') {
										if (BlockClass.classList.contains('tpgb-isotope') && typeof tppoMaso == 'function') {
											tppoMaso( doc )
										}
									}
									if (Totalcount >= Number(TotalReview)) {
										if (!lazyReview_click.nextElementSibling || !lazyReview_click.nextElementSibling.classList.contains('tpgb-review-loaded')) {
											
											lazyReview_click.classList.add('hide');
											var feedLoadedDiv = document.createElement('div');
											feedLoadedDiv.classList.add('tpgb-review-loaded');
											feedLoadedDiv.innerHTML = Allposttext;
											lazyReview_click.parentNode.appendChild(feedLoadedDiv);
										}
									} else {
										lazyReview_click.innerHTML = current_text;
									}
								}
								display = Number(display) + Number(loadFview);
								lazyReview_click.setAttribute('data-display', display);
							})
							.catch(function(error) {
								console.log('Error:', error);
							})
							.finally(function() {
								lazyReview_click.dataset.requestRunning = "false";
							})
							.then(function() {
								if (BlockClass.classList.contains('tpgb-isotope')) {
									if ( (loadlayout === 'grid' || loadlayout === 'masonry') && typeof tppoMaso == 'function' ) {
										tppoMaso(doc)
									}
									
									var fancySplide = BlockClass.querySelectorAll('.tpgb-carousel:not(.is-initialized)');
									fancySplide.forEach(function(obj) {
										if (typeof splide_init === 'function') {
											splide_init(obj);
										}
									});
								}
							});
                    	}
                    }
                });
            }
			
            var batchBtnNo = sr.querySelector('.batch-btn-no');
            if(batchBtnNo){
                batchBtnNo.addEventListener('click', function(p) {
                    p.preventDefault();
                    var closestBatchRecommend = this.closest('.tpgb-batch-recommend');
                    closestBatchRecommend.style.display = (closestBatchRecommend.style.display === 'none') ? 'block' : 'none';
                });
            }
        });
    }
}