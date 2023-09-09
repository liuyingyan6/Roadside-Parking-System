<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="success" style="width: 100px; height: 70px; float: right; font-size: 16px;">
      保存
    </el-button>
    <el-form ref="form" :model="form" label-width="120px" style="width: 220%;height:0px; font-size: 0px;">
      <span style="font-size: 16px">微信配置</span>
      <br>
      <br>
      <el-form-item label="*微信支付商户" style="font-size: 100px;">
        <el-input v-model="form.vpayUserName" style="width: 20%;"></el-input>
      </el-form-item>
      <!-- 可以添加其他表单项 -->
      <el-form-item label="* 微信支付Appid">
        <el-input v-model="form.vpayId" style="width: 20%;"></el-input>
      </el-form-item>
      <el-form-item label="* 微信商户帐户">
        <el-input v-model="form.vpayAccount" style="width: 20%;"></el-input>
      </el-form-item>
      <el-form-item label="* 微信支付密匙">
        <el-input v-model="form.vpayPassword" style="width: 20%;"></el-input>
      </el-form-item>
      <el-form-item label="* 微信商户密匙">
        <el-input v-model="form.vpayUserPassword" style="width: 20%;"></el-input>
      </el-form-item>
      <br>
      <span style="font-size: 16px">支付宝配置</span>
      <br>
      <br>
      <el-form-item label="*支付宝名称">
        <el-input v-model="form.alipayName" style="width: 20%;"></el-input>
      </el-form-item>
      <!-- 可以添加其他表单项 -->
      <el-form-item label="* 合作身份者id">
        <el-input v-model="form.alipayUserId" style="width: 20%;"></el-input>
      </el-form-item>
      <el-form-item label="* md5安全检验码">
        <el-input v-model="form.alipayMdcode" style="width: 20%;"></el-input>
      </el-form-item>
      <el-form-item label="* 支付方式私有密匙">
        <el-input v-model="form.alipayPrivateCode" style="width: 20%;"></el-input>
      </el-form-item>
      <el-form-item label="* 支付方式公有密匙">
        <el-input v-model="form.alipayPublicCode" style="width: 20%;"></el-input>
      </el-form-item>
      <el-form-item label="* 格式化方式">
        <el-input v-model="form.alipayFormat" style="width: 20%;"></el-input>
      </el-form-item>
      <el-form-item label="* 字符编码">
        <el-input v-model="form.alipayCharacterCode" style="width: 20%;"></el-input>
      </el-form-item>
      <el-form-item label="* 支付方式">
        <el-input v-model="form.alipayType" style="width: 20%;"></el-input>
      </el-form-item>
      <br>
      <span style="font-size: 16px">短信参数配置</span>

      <br>
      <br>
      <el-form-item label="*模版ID">
        <el-input v-model="form.mesId" style="width: 20%;"></el-input>
      </el-form-item>
      <!-- 可以添加其他表单项 -->
      <el-form-item label="* 模版ID">
        <el-input v-model="form.mesName" style="width: 20%;"></el-input>
      </el-form-item>
      <el-form-item label="* 短信密码">
        <el-input v-model="form.mesPassword" style="width: 20%;"></el-input>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {

      form: {

        // 其他表单字段
      }
    };
  },
  methods: {
    findAll() {
      axios.get("/argument/findAll").then(res => {
        console.log("Response:", res);
        // 假设返回的数据中有一个名为 vpayUserName 的字段
        this.form = res.data[0];
        // 更新其他表单字段的值，如果有的话
      }).catch(error => {
        console.error("Error:", error);
      });
    }
  },
  created() {
    this.findAll();
  }
};
</script>

<style scoped>
/* 样式可以根据需要添加 */
.text {
  font-size: 14px;
}
</style>