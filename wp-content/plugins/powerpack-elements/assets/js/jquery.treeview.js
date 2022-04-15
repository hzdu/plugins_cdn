/**
 * This file should contain frontend logic for
 * all module instances.
 */
(function ($) {
	$.fn.extend(
		{
			treed: function (o) {
				var openedClass = 'fa-minus-circle';
				var closedClass = 'fa-plus-circle';

				if (typeof o != 'undefined') {
					if (typeof o.openedClass != 'undefined') {
						openedClass = o.openedClass;
					}
					if (typeof o.closedClass != 'undefined') {
						closedClass = o.closedClass;
					}
				};

				// initialize each of the top levels
				var tree = $(this);
				tree.addClass("pp-tree");
				tree.find('li').has("ul").each(
					function () {
						var branch = $(this); // li with children ul
						branch.prepend("<i class='indicator fas " + closedClass + "'></i>");
						branch.addClass('pp-tree-branch');
						branch.on(
							'click',
							function (e) {
								if (this == e.target) {
									var icon = $(this).children('i:first');
									icon.toggleClass(openedClass + " " + closedClass);
									if (branch.hasClass('pp-category-wrap')) {
										$(this).children().children('ul').toggle();
									} else {
										branch.children().children().toggle();
									}
								}
							}
						)
						//branch.children().children().toggle();
						if (branch.hasClass('pp-category-wrap')) {
							branch.find('> .pp-category > .pp-category-link').show();
							branch.children().children('ul').toggle();
						} else {
							branch.children().children().toggle();
						}
					}
				);
				// fire event from the dynamically added icon
				tree.find('.pp-tree-branch .indicator').each(
					function () {
						$(this).on(
							'click',
							function () {
								$(this).closest('li').click();
							}
						);
					}
				);
				// fire event to open branch if the li contains a button instead of text
				tree.find('.pp-tree-branch>button').each(
					function () {
						$(this).on(
							'click',
							function (e) {
								$(this).closest('li').click();
								e.preventDefault();
							}
						);
					}
				);
			}
		}
	);
})(jQuery);
