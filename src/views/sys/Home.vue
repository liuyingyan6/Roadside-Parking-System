<template>
    <el-row>
        <el-col :span="8">
            <!-- user卡片 -->
            <el-card>
                <div class="user">
                    <img src="../../assets/aa.png" alt="">
                    <div class="userInfo">
                        <p div class="name">Admin</p>
                        <p div class="access">超级管理员</p>
                    </div>
                </div>
                <div class="loginInfo">
                    <p>上次登录时间：<span>2023-9-12</span></p>
                    <p>上次登陆地点：<span>广州</span></p>
                </div>
            </el-card>
        </el-col>

    </el-row>

</template>

<script>
    import axios from 'axios';
    import * as echarts from 'echarts';
    import moment from 'moment';

    export default {
        name: "Payment",
        data() {
            return {

            }
        },

        methods: {

        },

        mounted() {

        },

        created() {

        }
    }
</script>

<style scoped lang="less">

    .user {
        // 垂直居中
        display: flex;
        align-items: center;

        // 外边距:分割线距离loginInfo的距离
        margin-bottom: 20px;
        // 内边距:分割线距离User的距离
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;

        img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            margin-right: 40px;
        }

        .userInfo {
            .name {
                font-size: 32px;
                margin-bottom: 10px;
            }

            .access {
                color: #999999;
            }
        }
    }

</style>