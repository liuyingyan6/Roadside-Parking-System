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
                <el-row>
                    <el-form :inline="true">
                        <el-form-item>
                            <el-button type="success" class="align-right" @click="find">反馈处理</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>

                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
                <el-table :data="inspectorFeedbackList" border stripe>
                    <el-table-column label="反馈单号" prop="feedbackId"></el-table-column>
                    <el-table-column label="反馈巡检员" prop="inspectorName"></el-table-column>
                    <el-table-column label="地磁编号" prop="magnetometerId"></el-table-column>
                    <el-table-column label="反馈内容" prop="information"></el-table-column>
                    <el-table-column label="状态" prop="state">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status==1" type="danger">待处理</el-tag>
                            <el-tag v-else type="success">已处理</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="手机号码" prop="inspectorPhone"></el-table-column>
                    <el-table-column label="所属泊位" prop="parkingName"></el-table-column>
                    <el-table-column label="反馈图片" prop="imgUrls"></el-table-column>
                    <el-table-column label="反馈处理" prop="resultInformation"></el-table-column>
                </el-table>

            </el-card>
        </el-row>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                inspectorFeedbackList: {}
            }
        },
        methods: {
            getInspectorFeedbackList(){
                const feedbackId = this.$route.query.feedbackId;
                this.$axios.get("/inspectorFeedback/inspectorFeedbackList",{
                    params:{
                        feedbackId:feedbackId
                    }
                }).then(resp=>{
                    console.log(resp.data)
                    this.inspectorFeedbackList = resp.data;
                    console.log(this.inspectorFeedbackList)
                })
            },
            find(){
            }
        },
        created() {
            this.getInspectorFeedbackList();
        }
    }
</script>

<style scoped>

    .align-right {
        margin-left: 1500px; /* 将左边距设为 auto，使按钮靠右对齐 */
    }

</style>