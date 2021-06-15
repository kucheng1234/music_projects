<template>
    <div>
        <span class="bordertitle"><slot></slot></span>
    </div>
</template>

<style lang="less" scoped>
    .bordertitle{
        display: block;
        font-size: 2.7vh;
        font-weight: bold;
        color: #1a1a1a;
        padding: 10px 0 10px 9px;
    }
</style>