<template>
  <div>
    <el-row :gutter="12">
      <el-card shadow="always">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>设备管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/pda' }">pda管理</el-breadcrumb-item>
          <el-breadcrumb-item>pda登录日志</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row>

    <el-card>
      <!--信息表单-->
      <el-table :data="logList" border stripe>
        <el-table-column label="时间" prop="createTime"></el-table-column>
        <el-table-column label="登录人" prop="inspectorName"></el-table-column>
        <el-table-column label="所属路段" prop="roadName"></el-table-column>
      </el-table>

      <!--分页插件-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10 , 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      id: 0,
      pageNum: 1,
      pageSize: 5,
      logList: [], // 表单数据
      total: 0,
    };
  },
  methods: {
    getLogList() {
      console.log('后端没pdalog')
      // axios.get("/pdaLog/getPageById", {
      //   params: {
      //     pageNum: this.pageNum,
      //     pageSize: this.pageSize,
      //     id: this.id
      //   }
      // })
      //     .then(res => {
      //       this.total = res.data.total;
      //       this.logList = res.data.records;
      //     })
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getLogList();
    },
    handleCurrentChange(newPage) {
      this.pageNum = newPage;
      this.getLogList();
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.getLogList();
  },
};
</script>
<style lang="less" scoped>
</style>