import { createElement, useMemo } from '@wordpress/element'

import { useSelect } from '@wordpress/data'

const CategoryItem = ({
	category,
	showCheckbox,
	showCounters,
	hierarchical,
	expandable,
	defaultExpanded,
	excludeTaxonomy,
	taxonomy_not_in,
}) => {
	const allCat = useSelect(
		(select) =>
			select('core').getEntityRecords('taxonomy', 'product_cat', {
				per_page: -1,
			}) || []
	)

	const children = useMemo(() => {
		return allCat.filter((cat) => cat.parent === category.id)
	}, [category.id])

	return (
		<li className="ct-filter-item">
			<div className="ct-filter-item-inner">
				<a href="#">
					{showCheckbox ? <span className="ct-filter-checkbox" /> : null}
					{
						<span className="ct-filter-label">
							{category.name}{' '}
							{showCounters && expandable && hierarchical ? (
								<span className="ct-filter-count">
									({category.count})
								</span>
							) : null}
						</span>
					}
					{showCounters && (!expandable || !hierarchical) ? (
						<span className="ct-filter-count">
							{category.count}
						</span>
					) : null}
				</a>
				{children.length && hierarchical && expandable ? (
					<span className="ct-expandable-trigger">
						<svg
							class="ct-icon"
							width="10"
							height="10"
							viewBox="0 0 25 25">
							<path d="M.207 17.829 12.511 5.525l1.768 1.768L1.975 19.596z"></path>
							<path d="m10.721 7.243 1.768-1.768L24.793 17.78l-1.768 1.767z"></path>
						</svg>
					</span>
				) : null}
			</div>
			{children.length && hierarchical && defaultExpanded ? (
				<ul className="ct-filter-children">
					{children.map((item) => {
						if (
							taxonomy_not_in.includes(item.id) &&
							excludeTaxonomy
						) {
							return null
						}
						return (
							<CategoryItem
								key={item.id}
								category={item}
								showCheckbox={showCheckbox}
								showCounters={showCounters}
								hierarchical={hierarchical}
								expandable={expandable}
								taxonomy_not_in={taxonomy_not_in}
								excludeTaxonomy={excludeTaxonomy}
							/>
						)
					})}
				</ul>
			) : null}
		</li>
	)
}

export default CategoryItem
