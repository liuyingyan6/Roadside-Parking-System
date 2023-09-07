<template>
    <el-form ref="form" :model="form" label-width="80px">
        <el-row style="text-align: right;margin: 20px">
            <el-button type="success" icon="el-icon-check" @click="onSubmit">保存</el-button>
        </el-row>
        <el-form-item label="平台名称" prop="name" style="width: 500px">

            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="平台logo" prop="logo" :inline="true" class="demo-form-inline">
            <el-upload
                    class="avatar-uploader"
                    action="http://localhost:8020/oss/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess">
                <img v-if="form.logo" :src="form.logo" class="avatar"
                     style="width:66px; height:66px;border-radius: 10px;">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>

        <el-form-item label="客服热线" prop="serviceTel" style="width: 500px">
            <el-input v-model="form.serviceTel"></el-input>
        </el-form-item>
        <el-form-item label="客服邮箱" prop="serviceEmail" style="width: 500px">
            <el-input v-model="form.serviceEmail">{{form.name}}</el-input>
        </el-form-item>
        <el-form-item label="版权" prop="copyright" style="width: 500px">
            <el-input v-model="form.copyright"></el-input>
        </el-form-item>
        <el-form-item label="用户协议" prop="userAgreement" style="width: 800px">
            <el-input type="textarea" v-model="form.userAgreement"></el-input>
        </el-form-item>
        <el-form-item label="关于我们" prop="introduce" style="width: 800px">
            <el-input type="textarea" v-model="form.introduce"></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
    import information from "@/api/sys/information";

    export default {
        data() {
            return {
                form: {}
            }
        },
        methods: {
            handleAvatarSuccess(res, file) {
                this.form.logo = res.data.url;
            },
            onSubmit() {
                information.update(this.form).then(res => {
                    this.$message.success("保存成功")
                })
            },
            findAll() {
                information.findAll().then(res => {
                    this.form = res.data
                })
            }
        },
        created() {
            this.findAll();
        }
    }
</script>

<style scoped>

</style>