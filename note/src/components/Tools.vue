<template>
    <div class="event-tools" :class="{'show-event-tools':isShow}">
        <ul class="tools-sidebar">
            <li>
                <button class="tools-btn" @click="backupData">打印数据</button>
            </li>
            <li>
                <button class="tools-btn" @click="openTable">编辑数据</button>
            </li>
            <li>
                <button class="tools-btn" @click="showDialog">清空数据</button>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        data () {
            return {

            }
        },
        props:['isShow'],
        methods: {
            showDialog(){
                this.$emit('cleardialog');
            },
            backupData () {
                console.log(localStorage.getItem('lx_notepad'));
            },
            openTable(){
                this.$emit('opentable');
            }
        }
    }
</script>
<style lang="less">
    
</style>