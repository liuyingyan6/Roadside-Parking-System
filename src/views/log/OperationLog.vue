<template>
  <div>
    <el-row :gutter="12">
      <el-card shadow="always">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>日志管理</el-breadcrumb-item>
          <el-breadcrumb-item>操作日志</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row>

    <el-card>
      <!--信息表单-->
      <el-table :data="logList" border stripe>
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="操作者" prop="userId"></el-table-column>
        <el-table-column label="操作日期" prop="createTime"></el-table-column>
        <el-table-column label="IP" prop="ip"></el-table-column>
        <el-table-column label="操作记录" prop="record"></el-table-column>
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
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      logList: [], // 表单数据
      total: 0,
    };
  },
  methods: {
    getLogList() {
      this.$axios.get("/operationLog/getPage", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      }).then(res => {
        console.log("", res);
        this.total = res.data.total;
        this.logList = res.data.records;
      })
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
    this.getLogList();
  }
};
</script>
<style lang="less" scoped>
</style>