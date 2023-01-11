<template>
	<div>
		<div>{{ someData }}</div>
	</div>
</template>

<script>
export default {
	name: "second-component",
	data: function () {
		return {
			someData: "Just some data!",
			helloWorld: "Hello World!",
		};
	},
};
</script>
