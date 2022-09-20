import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import MainPanel from './components/MainPanel.tsx';

const isSidebarOpened = wp.data
	.select( 'core/edit-post' )
	.isEditorSidebarOpened();

if ( ! isSidebarOpened ) {
	wp.data
		.dispatch( 'core/edit-post' )
		.openGeneralSidebar( 'edit-post/block' );
}
registerPlugin( 'neve-cl-sidebar-panel', {
	icon: false,
	render: () => {
		return (
			<PluginDocumentSettingPanel
				name="neve-custom-layout-panel"
				title={ __( 'Custom Layout Settings', 'neve' ) }
				className="neve-cl-sidebar-panel"
			>
				<MainPanel />
			</PluginDocumentSettingPanel>
		);
	},
} );
