<template>
	<div class="header" >
		{{ test }}
	</div>
</template>
<script>
	export default {
		data(){
			return {
				test: '22222'
			}
		},
		stores: {
			test: 'state.globe.msg'
		},
	}
</script>
<style>
	.header{
		width: 100px;
		height: 200px;
		background-color: red;
	}
</style>