/**
 * Block: Template Library
 */

import { TemplatesModal } from './library';

import {
	__,
} from '@wordpress/i18n';

import {
	Placeholder,
	Button,
} from '@wordpress/components';

import {
	Fragment,
	Component,
} from '@wordpress/element';

class GenerateBlocksTemplateLibrary extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isModalOpen: false,
		};
	}

	componentDidMount() {
		this.setState( { isModalOpen: 'templates' } );
	}

	render() {
		const {
			isModalOpen,
		} = this.state;

		const {
			clientId,
		} = this.props;

		return (
			<Fragment>
				<Placeholder
					label={ __( 'Template Library', 'generateblocks-pro' ) }
					instructions={ __( 'Insert pre-built templates directly into your content.', 'generateblocks-pro' ) }
					className="gblocks-select-template"
				>
					<Button
						className="plugin-generateblocks-panel-button is-large"
						isPrimary
						onClick={ () => {
							this.setState( { isModalOpen: 'templates' } );
						} }
					>
						{ __( 'Open Template Library', 'generateblocks-pro' ) }
					</Button>

					{ 'templates' === isModalOpen &&
						<TemplatesModal
							onRequestClose={ () => this.setState( { isModalOpen: false } ) }
							clientId={ clientId }
							blockCount={ wp.data.select( 'core/block-editor' ).getBlockCount() }
						/>
					}
				</Placeholder>

			</Fragment>
		);
	}
}

export default ( GenerateBlocksTemplateLibrary );
