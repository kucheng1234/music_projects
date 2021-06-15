<template>
    <div class="hotSearch">
        热门搜索
        <ul>
            <li v-for="(item,index) in lists" :key="index" @click.stop="$emit('search',{keywords:item.first,emptys:false})">{{item.first}}</li>
        </ul>
        <div v-show="histrory.length > 0">
            搜索历史
            <ul>
                <li v-for="(item,index) in histrory" :key="index" @click.stop="$emit('search',{keywords:item,emptys:false})">{{item}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props:['histrory'],
    data() {
        return {
            lists:[]
        }
    },
    created(){
        this.$axios.get("/search/hot").then(d=>{
            this.lists = d.data.result.hots;
        })
    }
}
</script>

<style lang="less" scoped>
    .hotSearch{
        margin-left: 5%;
        font-size: 12px;
        ul{
            overflow: hidden;
            margin-top: 10px;
            li{
                border: 1px solid #ccc;
                line-height: 32px;
                padding: 0 14px;
                margin: 0 8px 8px 0;
                float: left;
                border-radius: 20px;
            }
        }
    }
</style>