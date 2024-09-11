/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { __experimentalNumberControl as NumberInput } from '@wordpress/components';
import { map } from 'lodash';
import { CollapsibleContent } from '@woocommerce/components';

/**
 * FeesField component.
 * @param {Object} props
 * @returns
 */
export function FeesField( {
	fields,
	feeValues,
	setValue,
	attributeSlug,
	attributeSwatchesValue,
	getUpdatedAttributeSwatchesValue,
} ) {
	return (
		<div className="wp-block-iconic-was-product-block-editor__fees">
			<CollapsibleContent toggleText={ __( 'Fees', 'iconic-was' ) }>
				{ fields?.map( ( field ) => {
					const { field_settings: settings } = field;
					const { columns, values } = settings;

					return (
						<table className="iconic-was-table widefat fixed striped">
							<thead>
								<tr>
									{ columns?.map( ( column ) => (
										<th key={ column }>{ column }</th>
									) ) }
								</tr>
							</thead>
							<tbody>
								{ map( values, ( value ) => (
									<tr key={ value?.slug }>
										<td>{ value?.label }</td>
										<td>
											<NumberInput
												min={ value?.min || 0 }
												step={ value?.step || 0.01 }
												value={
													feeValues?.[ value.slug ]
												}
												onChange={ ( newValue ) => {
													const fieldValue = {
														...feeValues,
														[ value.slug ]:
															newValue,
													};

													setValue(
														getUpdatedAttributeSwatchesValue(
															attributeSwatchesValue,
															attributeSlug,
															'fees',
															fieldValue
														)
													);
												} }
												placeholder={
													value?.placeholder
												}
											/>
										</td>
									</tr>
								) ) }
							</tbody>
						</table>
					);
				} ) }
			</CollapsibleContent>
		</div>
	);
}
