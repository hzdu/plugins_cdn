import React from 'react';
import { __ } from '@wordpress/i18n';
import { isRenderDebugOn } from '../../common/utils';
import DebugRender from '../shared/DebugRender';
import RuleGroup from './RuleGroup';

/**
 * Check if an item is an object
 *
 * @param {any} itemToCheck
 */
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const isObject = ( itemToCheck: any ) => {
	return (
		itemToCheck &&
		typeof itemToCheck === 'object' &&
		! Array.isArray( itemToCheck )
	);
};

/**
 * Type of Rules
 */
export type Rules = {
	root: string | [  ];
	condition: string | [  ];
	end: string | [  ];
};

/**
 * Type for ConditionalPanel
 */
type ConditionalPanelArgs = {
	selectedRules: Record< number, Record< number, Rules > >;
	onChange: ( nextValue: Record< number, Record< number, Rules > > ) => void;
	updateDb: ( nextValue: Record< number, Record< number, Rules > > ) => void;
};

/**
 * ConditionalPanel.
 *
 * @param {ConditionalPanelArgs} args
 * @class
 */
const ConditionalPanel = React.memo(
	( { selectedRules, onChange, updateDb }: ConditionalPanelArgs ) => {
		const migrateGroupData = ( oldGroup: Record< number, Rules > ) => {
			const newGroupData: Rules[] = [];
			Object.values( oldGroup ).forEach( ( groupItem: Rules ) => {
				if ( Array.isArray( groupItem.end ) ) {
					groupItem.end.forEach( ( item: [  ] ) => {
						const currentItem = {
							root: groupItem.root,
							condition: groupItem.condition,
							end: item,
						};
						newGroupData.push( currentItem );
					} );
				} else {
					newGroupData.push( groupItem );
				}
			} );

			return newGroupData;
		};

		const getRules = () => {
			let result = selectedRules;
			if (
				( Array.isArray( selectedRules ) &&
					selectedRules.length === 0 ) ||
				! selectedRules
			) {
				result = [ [ { root: '', condition: '===', end: '' } ] ];
			}

			if ( isObject( result ) ) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				result = Object.values( selectedRules ).map( ( item, _ ) => {
					return isObject( item ) ? Object.values( item ) : item;
				} );
			}

			const rulesAreEmpty =
				! Array.isArray( result[ 0 ] ) || result[ 0 ].length === 0;

			if ( rulesAreEmpty ) {
				result = [ [ { root: '', condition: '===', end: '' } ] ];
			}

			return Object.values( result ).map( ( gr ) =>
				migrateGroupData( gr )
			);
		};
		const rules = getRules() as Rules[][];

		const updateValue = (
			val: string | [  ],
			type: keyof Rules,
			ruleSetIndex: number,
			groupIndex: number
		) => {
			const newValue = [ ...rules ];

			newValue[ groupIndex ][ ruleSetIndex ][ type ] = val;
			if ( type === 'root' && ! selectedRules ) {
				newValue[ groupIndex ][ ruleSetIndex ].end = '';
			}

			onChange( newValue );
			updateDb( newValue );
		};

		const addRuleSet = ( ruleIndex: number, groupIndex: number ) => {
			const newValue = [ ...rules ];

			newValue[ groupIndex ].splice( ruleIndex + 1, 0, {
				root: '',
				condition: '===',
				end: '',
			} );

			onChange( newValue );
			updateDb( newValue );
		};

		const addRuleGroup = ( groupIndex: number ) => {
			const newValue = [ ...rules ];

			newValue.splice( groupIndex + 1, 0, [
				{ root: '', condition: '===', end: '' },
			] );

			onChange( newValue );
			updateDb( newValue );
		};

		const removeRuleSet = ( ruleIndex: number, groupIndex: number ) => {
			const newValue = [ ...rules ];

			newValue[ groupIndex ].splice( ruleIndex, 1 );

			onChange( newValue );
			updateDb( newValue );
		};

		const removeRuleGroup = ( groupIndex: number ) => {
			const newValue = [ ...rules ];

			newValue.splice( groupIndex, 1 );

			onChange( newValue );
			updateDb( newValue );
		};

		return (
			<>
				<div className="neve-white-background-control">
					{ isRenderDebugOn && <DebugRender forLabel="cond" /> }
					{ /* eslint-disable-next-line jsx-a11y/label-has-for */ }
					<label>{ __( 'Conditional Logic', 'neve' ) }</label>
					<span
						style={ {
							display: 'block',
							marginTop: '8px',
							marginBottom: '8px',
							color: '#898A8B',
						} }
					>
						<i>
							{ __(
								'If no conditional logic is selected, the Custom Layout will be applied site-wide.',
								'neve'
							) }
						</i>
					</span>
					{ rules.map( ( group, index ) => {
						group = migrateGroupData( group );
						return (
							<RuleGroup
								key={ index }
								group={ group }
								isFirst={ index === 0 }
								isLast={ index === rules.length - 1 }
								canAddMore={ rules.length < 5 }
								onChange={ (
									val: string | [  ],
									type: keyof Rules,
									ruleSetIndex: number
								) => {
									updateValue(
										val,
										type,
										ruleSetIndex,
										index
									);
								} }
								addRuleSet={ ( ruleIndex: number ) => {
									addRuleSet( ruleIndex, index );
								} }
								addRuleGroup={ () => {
									addRuleGroup( index );
								} }
								removeRuleSet={ ( ruleIndex: number ) => {
									removeRuleSet( ruleIndex, index );
								} }
								removeRuleGroup={ () => {
									removeRuleGroup( index );
								} }
							/>
						);
					} ) }
				</div>
			</>
		);
	}
);

export default ConditionalPanel;
