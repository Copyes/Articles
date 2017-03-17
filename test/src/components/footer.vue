<template>
	<div class="fotter" @click="change">
		{{ msg }} {{ test }}
	</div>
</template>
<script>
	export default {
		data(){
			return {

			}
		},
		stores: {
			test: 'state.globe.msg'
		},
		computed: {
			'msg': function(){
				return '1111'
			}
		},
		methods: {
			change(){
				this.test = 2222;
			}
		}
	}
</script>
<style>
	
</style>