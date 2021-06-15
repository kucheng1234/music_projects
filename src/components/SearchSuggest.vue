<template>
    <div class="suggest">
        搜索提示
        <ul>
            <li v-for="s in suggestList" :key="s.id" @click.stop="$emit('search',{keywords:s.name})"><span class="iconfont icon-search"></span>{{s.name}}</li>
            <li v-show="suggestList.length<=0">暂无结果</li>
        </ul>
    </div>
</template>

<script>
export default {
    props:{
        keywords:String
    },
    data() {
        return {
            suggestList:[]
        }
    },
    created(){
        this.suggest(this.keywords)
    },
    watch:{
        keywords(newValue){
            this.suggest(newValue)
        }
    },
    methods:{
        suggest(keywords){
            this.$axios.get("/search/suggest?keywords=" + keywords).then(d=>{
            if (d.data.result&&d.data.result.songs) {
                this.suggestList = d.data.result.songs
            }
        })
        }
    }
}
</script>

<style lang="less" scoped>
    .suggest{
        margin-left: 5%;
        font-size: 12px;
        ul{
            li{
                padding: 10px 0;
                span{
                    margin-right: 5px;
                }
            }
        }
    }
</style>