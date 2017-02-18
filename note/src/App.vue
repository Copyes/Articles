<template>
  <div id="app">
    <n-header @tools="changePages"></n-header>
  </div>
</template>

<script type="text/babel">
import nHeader from './components/Header.vue';
import nTools from './components/Tools.vue';
export default {
  name: 'app',
  data(){
    return {
        tools: false,
        showTable: false
    }
  },
  methods: {
    changePages(){
        if(this.showTable){
            this.showTable = !this.showTable;
        }else{
            this.tools = !this.tools
        }
    }
  },
  components: {
      nHeader
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
</style>
