<template>
	<div class="note-add">
        <input class="input-note" type="text" v-model="content" placeholder="待办事项" @keyup.enter="submit">
        <button class="btn-submit" @click="submit">提交</button>
    </div>
</template>
<script type="text/babel">
	export default {
		data(){
			return {
				content: ''
			}
		},

		methods: {
			submit(){
				let paramObj = {
					id: 0,
					type: 1,
					content: '',
					time: ''
				}
				if(this.content.trim()){
					paramObj.content = this.content.trim();
					// 通知存储
					this.$store.dispatch('addNote', paramObj);
					this.content = '';
				}
			}
		}	
	}
</script>
<style lang="less">
	.note-add {
		box-sizing: border-box;
		width: 100%;
        padding:30px 0 30px;
        font-size: 22px;
        .input-note {
        	box-sizing: border-box;
        	padding: 7px 10px;
        	width: 70%;
        	height: 40px;
        	line-height: 32px;
            border:1px solid #c0ccda;
            transition: border-color .2s cubic-bezier(.645,.045,.355,1);
            border-radius:4px;
            &:focus {
                outline: none;
                border-color: #20a0ff;
            }
        }
        .btn-submit {
        	float: right;
        	width: 80px;
        	height: 40px;
        	font-size: 16px;
        	color: #fff;
            border:1px solid #ff4965;
            background: #ff4965;
            transition: background .3s ease-in;
            &:hover{
                background: #ff4965;
            }
        }
	}
</style>