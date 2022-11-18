<template>
	<div class="tap-apps-container tap-fw">
		<iframe class="tap-suite-apps-iframe" title="Apps" :src="appsLink" @load="iframeLoaded"/>
	</div>
</template>

<script>
import { toggleAppLoader } from "@/utils/ui-fn";
import { mapGetters } from "vuex";

export default {
	name: "Apps",
	computed: {
		...mapGetters( 'suite', [ 'getConnected' ] ),
		appsLink() {
			return `${TAPAdmin.apps_link}&body_class=tap-suite-apps-body`;
		}
	},
	mounted() {
		if ( ! this.getConnected ) {
			this.$router.push( {path: '/suite'} );
		} else {
			toggleAppLoader()
		}
	},
	methods: {
		iframeLoaded() {
			toggleAppLoader( false )
		}
	},
}
</script>
