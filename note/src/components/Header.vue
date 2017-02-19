<template>
    <header class="">
        记事本 <a class="h-btn" @click="showTools"><span></span></a>
    </header>
</template>

<script type="text/babel">
	export default {
		methods: {
			showTools(){
                this.$emit('tools');
            }
		}
	}
</script>
<style lang="less">
header {
	position: relative;
	width: 100%;
	line-height: 60px;
	font-size: 24px;
	text-align: center;
	color: #fff;
	background-color: #ff4965;
	.h-btn {
		position: absolute;
		top: 17px;
		right: 10px;
		width: 30px;
		height: 26px;
	    cursor: pointer;
	}
	span,span:before,span:after  { 
		position: absolute;
		left: 0;
		width: 30px;
		height: 4px;
		content: '';
		background-color: #fff;
	}
	span {
		top: 11px;
		&:before{
	        transform: translateY(-7px);
	        transition: all .3s;
		}
		&:after{
			transform: translateY(7px);
	        transition: all .3s;
		}
	}
}

</style>
