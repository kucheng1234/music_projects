<template>
    <div class="searchs">
        <form class="search" @submit.prevent.stop="search">
            <div class="inp">
                <b class="iconfont icon-search"></b>
                <input type="text" placeholder="搜索你想听的歌曲" @input="inputFun" v-model="keywords">
                <span @click="empty" v-show="!emptys">x</span>
            </div>
        <span class="span" @click="back">取消</span>
        </form>
        <component :is="showcomponent" @search="search" :keywords="keywords" :histrory="history" @play="$emit('play',$event)"></component>
    </div>
</template>

<script>
import SearchHotComponent from '../components/SearchHotComponent'
import SearchSuggest from '../components/SearchSuggest'
import SearchResult from '../components/SearchResult'
export default {
    data() {
        return {
            showcomponent:SearchHotComponent,
            keywords:'',
            emptys:true,
            history:[],
        }
    },
    created(){

    },
    methods:{
        back(){
            this.keywords = ''
            this.emptys=true
            this.$router.go(-1)
            this.showcomponent = SearchHotComponent
        },
        empty(){
            this.keywords =''
            this.showcomponent = SearchHotComponent
            this.emptys=true
        },
        inputFun(){
            if (this.keywords =='' || this.keywords.length<=0) {
                this.emptys =true
                this.showcomponent = SearchHotComponent
            }else{
                this.emptys =false
                this.showcomponent = SearchSuggest
            }
        },
        search(event){
            if(event.keywords){
                this.keywords = event.keywords
                this.emptys=event.emptys
            }else if(this.keywords == ''){
                return
            }
            this.history.push(this.keywords);
            this.history = [...new Set(this.history)]
            this.showcomponent = SearchResult
        },
    }
}
</script>

<style lang="less" scoped>
.search{
    width:90%;
    display: flex;
        color: #a1a4b3;
        margin: 10px 5%;
        .inp{
            flex: 1;
            position: relative;
            b{
                position: absolute;
                top: 8.4px;
                left: 10px;
            }
            input{
                height: 100%;
                width: 100%;
                color: #777980;
                border: transparent;
                background: #ccc;
                border-radius: 20px;
                outline: none;
                padding-left: 30px;
            }
            span{
                display: block;
                width: 20px;
                height: 20px;
                text-align: center;
                line-height: 16px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                position: absolute;
                top: 8px;
                right: 10px;

            }
        }
    .span{
        display: block;
        text-align: right;
        flex: 0 0 40px;
        line-height: 36px;
        font-size: 14px;
    }
}
</style>