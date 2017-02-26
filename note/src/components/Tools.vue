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
                console.log(localStorage.getItem('fc_notes'));
            },
            openTable(){
                this.$emit('opentable');
            }
        }
    }
</script>
<style lang="less">
    .event-tools {
        box-sizing: border-box;
        position: fixed;
        top: 60px;
        left: 0;
        bottom: 0;
        padding: 30px 20px;
        width: 250px;
        font-size: 16px;
        text-align: center;
        background-color: rgba(0, 0, 0, .5);
        transform: translateX(-250px);
        transition: transform .3s;
        &.show-event-tools {
            transform: translateX(0);
        }
        .tools-sidebar {
            & > li {
                line-height: 60px;
            }
        }
        .tools-btn {
            width: 100px;
            height: 40px;
            font-size: 16px;
            color: #fff;
            border: 1px solid #ff4965;
            background: #ff4965;
            transition: background .3s ease-in;
            &:hover {
                background: #ff4999;
            }
        }
    }
</style>