<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="@/assets/logo.png"/>
            </div>

            <el-form
                    ref="loginForm"
                    :model="loginForm"
                    :rules="loginFormRules"
                    label-width="0px"
                    class="login_form">
                <el-form-item prop="userCode">
                    <el-input prefix-icon="el-icon-user" placeholder="用户名" v-model="loginForm.userCode"></el-input>
                </el-form-item>
                <el-form-item prop="userPassword">
                    <el-input
                            prefix-icon="el-icon-lock"
                            placeholder="密码"
                            v-model="loginForm.userPassword"
                            type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLogin">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                loginForm: {
                    userCode: "admin",
                    userPassword: "123456"
                },
                loginFormRules: {
                    userCode: [
                        {required: true, message: "用户名必填", trigger: "blur"},
                        {min: 4, max: 8, message: "用户名在4到8个字符之间", trigger: "blur"}
                    ],
                    userPassword: [
                        {required: true, message: "密码必填", trigger: "blur"},
                        {
                            min: 4,
                            max: 8,
                            message: "用户密码在4到8个字符之间",
                            trigger: "blur"
                        }
                    ]
                }
            };
        },
        methods: {
            resetLogin() {
                this.$refs.loginForm.resetFields();
            },

            login() {
                this.$refs.loginForm.validate(valid => {

                    if (valid) {
                        // this.$axios.post("/manager/login", this.loginForm).then(res => {
                        //     if (res.code == 200) {
                        //         console.log("{}",res)
                        //         this.$message.success('登录成功');
                        //         //将后端的返回的Token令牌，存储到前端
                        //         localStorage.setItem("refreshToken", res.data.refreshToken);
                        //         localStorage.setItem("accessToken", res.data.accessToken);
                        //         localStorage.setItem("id", res.data.id);
                        //         localStorage.setItem("currentUser", res.data.currentUser);
                        //         //跳转到主页上去
                                this.$router.push("/Home")
                        //     }
                        // })
                    } else {
                        this.$message.error(res.message);
                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .avatar_box {
            height: 100px;
            width: 100px;
            border-radius: 50%;
            border: 1px solid #eee;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -30%);
            background-color: #fff;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
    }
</style>