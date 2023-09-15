<template>
    <div>
        <el-row :gutter="12">
            <el-card shadow="always">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/inspectorFeedback' }">巡检员反馈</el-breadcrumb-item>
                    <el-breadcrumb-item>反馈详情</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </el-row>

        <el-row>
            <el-card shadow="always">

<!--                <el-row>-->
<!--                    <el-form :inline="true">-->
<!--                        <el-form-item>-->
<!--                            <el-button type="success" class="align-right" @click="find">反馈处理</el-button>-->
<!--                        </el-form-item>-->
<!--                    </el-form>-->
<!--                </el-row>-->


                <el-descriptions icon="el-icon-search" title="基本信息" :column="2" border style="width: 80%;margin: auto;">
                    <el-descriptions-item label="反馈单号"> {{this.inspectorFeedbackList.feedbackId}}</el-descriptions-item>
                    <el-descriptions-item label="反馈巡检员"> {{this.inspectorFeedbackList.inspectorName}}</el-descriptions-item>
                    <el-descriptions-item label="地磁编号"> {{this.inspectorFeedbackList.magnetometerId}}</el-descriptions-item>
                    <el-descriptions-item label="反馈内容"> {{this.inspectorFeedbackList.information}}</el-descriptions-item>
                    <el-descriptions-item label="状态">
                        <el-tag
                                :type="this.inspectorFeedbackList.state === 1 ? 'success' : 'primary'"
                                disable-transitions>{{this.inspectorFeedbackList.state == 1 ? "已处理" : "待处理"}}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="手机号码">{{this.inspectorFeedbackList.inspectorPhone}}</el-descriptions-item>
                    <el-descriptions-item label="所属泊位">{{this.inspectorFeedbackList.parkingName}}</el-descriptions-item>
                    <el-descriptions-item label="反馈图片">{{this.inspectorFeedbackList.imgUrls}}</el-descriptions-item>
<!--                    <el-descriptions-item label="反馈处理">{{this.inspectorFeedbackList.resultInformation}}</el-descriptions-item>-->


<!--                    <el-descriptions-item label="反馈图片">-->
<!--                        <img v-for="ele in tableData.img" src="" alt="">-->
<!--                    </el-descriptions-item>-->
                </el-descriptions>

            </el-card>
        </el-row>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                inspectorFeedbackList: {},
                feedbackId:''
            }
        },
        methods: {
            getInspectorFeedbackList(){

                this.$axios.get("/inspectorFeedback/inspectorFeedbackList",{
                    params:{
                        feedbackId:this.feedbackId
                    }
                }).then(resp=>{
                    console.log(resp)
                    console.log(resp.data.list)
                    this.inspectorFeedbackList = resp.data;
                    console.log(this.inspectorFeedbackList)
                    console.log(this.inspectorFeedbackList.inspectorName)
                })
            },
            find(){
            }
        },
        created() {
            this.feedbackId = this.$route.query.feedbackId;
            this.getInspectorFeedbackList();
        }
    }
</script>

<style scoped>

    .align-right {
        margin-left: 1500px; /* 将左边距设为 auto，使按钮靠右对齐 */
    }

</style>