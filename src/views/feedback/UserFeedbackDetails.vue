<template>
    <div style="margin-top: 50px;text-align: right">
        <el-button
                type="success" icon="el-icon-edit" plain v-if="tableData.state!=1" style="margin-right: 160px"
                @click="handleEdit()">反馈处理
        </el-button>

        <el-descriptions icon="el-icon-search" title="基本信息" :column="2" border style="width: 80%;margin: auto;">
            <el-descriptions-item label="反馈单号"> {{tableData.feedbackOdd}}</el-descriptions-item>
            <el-descriptions-item label="状态">
                <el-tag
                        :type="tableData.state === 1 ? 'success' : 'primary'"
                        disable-transitions>{{tableData.state == 1 ? "已处理" : "未处理"}}
                </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="反馈用户">{{tableData.userName}}</el-descriptions-item>
            <el-descriptions-item label="手机号码">{{tableData.phone}}</el-descriptions-item>
            <el-descriptions-item label="反馈内容">{{tableData.feedbackText}}</el-descriptions-item>
            <el-descriptions-item label="反馈图片">
                <img v-for="ele in tableData.img" src="" alt="">
            </el-descriptions-item>
        </el-descriptions>


        <el-dialog
                title="工单处理"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <el-form :model="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="反馈内容" >
                    <el-input type="textarea" v-model="form.feedbackText" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="处理结果反馈">
                    <el-input type="textarea" v-model="form.result"></el-input>
                </el-form-item>
                <el-form-item style="text-align: right">
                    <el-button type="primary" @click="submitForm">确定</el-button>
                    <el-button @click="resetForm">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>

</template>

<style scoped>


</style>

<script>
    import userFeedback from "@/api/feedback/userFeedback";

    export default {
        data() {
            return {
                tableData: {},
                dialogVisible: false,
                form: {}
            }
        },
        methods: {
            //编辑
            handleEdit() {
                this.form = {
                    id: this.tableData.id
                }
                this.dialogVisible = true;
            },
            //确定
            submitForm() {
                userFeedback.update(this.form).then(res => {
                    this.$message.success("处理成功")
                    this.dialogVisible = false
                    this.tableData.state = 1
                })
            },
            resetForm() {
                this.dialogVisible = false
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
        },
        created() {
            this.tableData = this.$route.params.data;
        }
    }
</script>