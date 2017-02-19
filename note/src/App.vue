<template>
  <div id="app">
    <n-header @tools="changePages"></n-header>
    <section class="container">
        <add-form></add-form>
        <div class="event-content">
            <div class="event-tab" @click="changeCollapse(0, $event)">
                未完成
                <span :class="{'close': !collapse[0].show}"></span>
            </div>
            <ul class="event-list" :style="{'height':'auto','display':'block'}">
                <li class="event-item" v-for="item in getTodoEvents">
                    <input type="checkbox" @click="moveToDone(item.id, $event)">
                    <div class="item-content">{{ item.content }}</div>
                    <button @click="moveToCancel(item.id, $event)" class="btn-cancel">取消</button>
                </li>
            </ul>
            <div class="event-tab"  @click="changeCollapse(1, $event)">
                已完成
                <span :class="{'close': !collapse[1].show}"></span>
            </div>
            <ul class="event-list" :style="{'height':'auto','display':'block'}">
                <li class="event-item" v-for="item in getDoneEvents">
                    <input type="checkbox">
                    <div class="item-content">{{ item.content }}</div>
                    <button class="btn-cancel">取消</button>
                </li>
            </ul>
            <div class="event-tab" @click="changeCollapse(2, $event)">
                已取消
                <span :class="{'close': !collapse[2].show}"></span>
            </div>
            <ul class="event-list">
                <li class="event-item" v-for="item in getCancelEvents">
                    <input type="checkbox">
                    <div class="item-content">{{ item.content }}</div>
                    <button class="btn-cancel">取消</button>
                </li>
            </ul>
        </div>
    </section>
  </div>
</template>

<script type="text/babel">
import nHeader from './components/Header.vue';
import nTools from './components/Tools.vue';
import addForm from './components/Add.vue';
export default {
  name: 'app',
  data(){
    return {
        collapse: [
            {
                show: true,
                contentHeight: 'auto'
            },
            {
                show: true,
                contentHeight: 'auto'
            },
            {
                show: true,
                contentHeight: 'auto'
            }
        ],
        tools: false,
        showTable: false
    }
  },
  computed: {
    // 获取待办事情
    getTodoEvents(){
        return this.$store.state.events.filter((item) =>{
            if(item.type === 1){
                return item;
            }
        });
    },
    // 获取已经完成的事情
    getDoneEvents(){
        return this.$store.state.events.filter((item) => {
            if(item.type === 2){
                return item;
            }
        })
    },
    // 获取不用做的事了。
    getCancelEvents(){
        return this.$store.state.events.filter((item) => {
            if(item.type === 3){
                return item;
            }
        });
    }
  },
  methods: {
    // 移动到已取消去
    moveToCancel(id, event){
        this.$store.dispatch('eventCancel', id);
            //event.target.checked = false;
    },
    // 移动到已经做过了
    moveToDone(id, event){
        if(event.target.checked){
            this.$store.dispatch('eventDone', id);
            event.target.checked = false;
        }
    },
    changeCollapse(index, event){
        if(this.collapse[index].show){
            this.closeCollapse(index, event);
            this.collapse[index].show = false;
        } else {
            this.openCollapse(index, event);
            this.collapse[index].show = true;
        }
    },
    // 打开折叠
    openCollapse(index, event){
        const ulElement = event.currentTarget.nextElementSibling;
        this.collapse[index].contentHeight = ulElement.offsetHeight;
        ulElement.style.display = 'block';
        setTimeout(() => {
            ulElement.style.height = this.collapse[index].contentHeight + 'px';
            setTimeout(() => {
                ulElement.style.height = 'auto';
            },300);
        },10);
    },
    // 关闭折叠
    closeCollapse(index, event){
        const ulElement = event.currentTarget.nextElementSibling;
        ulElement.style.height = ulElement.offsetHeight + 'px';
        this.collapse[index].contentHeight = ulElement.offsetHeight;
        setTimeout(() => {
            ulElement.style.height = '0px';
            setTimeout(() => {
                ulElement.style.display = 'none';
            },300);
        },10);
        console.log(ulElement);
    },
    changePages(){
        if(this.showTable){
            this.showTable = !this.showTable;
        }else{
            this.tools = !this.tools
        }
    }
  },
  components: {
      nHeader,
      addForm
  }
}
</script>

<style lang="less">
    html,body,ul,li,input{
        margin:0;
        padding:0;
    }
    body{
        font-size: 16px;
    }
    input,button{
        -webkit-tap-highlight-color: transparent;
    }
    input[type=text]{
        -webkit-appearance: none;
    }
    button{
        padding:7px 0;
        outline: none;
        text-align: center;
        border-radius: 4px;
        box-sizing: border-box;
        cursor: pointer;
    }
    body,#app{
        width:100%;
        overflow-x: hidden;
    }
    ul{
        list-style: none;
    }
    .container {
        width:100%;
        padding: 0 10px;
        max-width:800px;
        margin:auto;
        box-sizing: border-box;
        &.hide{
            display: none;
        }
    }
    .event-content {
        .event-tab {
            position: relative;
            box-sizing: border-box;
            padding-left: 20px;
            line-height: 44px;
            color: #fff;
            border-bottom: 1px solid #fff;
            background-color: #ff4965;
            cursor: pointer;
            span {
                position: absolute;
                right: 20px;
                top: 13px;
                width: 10px;
                height: 10px;
                content: '';
                border-top: 3px solid #fff;
                border-right: 3px solid #fff;
                transform: rotate(135deg);
                transition: transform .3s;
            }
            .close {
                transform: rotate(45deg);
            }
        }
        .event-list {
            list-style: none;
            overflow: hidden;
            border-right: 1px solid #eee;
            border-left: 1px solid #eee;
            transition: height .3s;
            .event-item {
                box-sizing: border-box;
                position: relative;
                min-height: 44px;
                line-height: 30px;
                padding: 10px 60px 10px 40px;
            }
            input[type=checkbox] {
                position: absolute;
                top: 15px;
                left: 10px;
                width: 20px;
                height: 20px;
            }
            .btn-cancel {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 50px;
                height: 30px;
                font-size: 12px;
                background-color: #fff;
                border: 1px solid #eee;
            }

        }
    }
</style>
