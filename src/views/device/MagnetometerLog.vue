<template>
  <div>
    <el-row :gutter="12">
      <el-card shadow="always">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>设备管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/magnetometer' }">地磁管理</el-breadcrumb-item>
          <el-breadcrumb-item>地磁日志</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row>

    <el-card>
      <!--信息表单-->
      <el-table :data="logList" border stripe>
        <el-table-column label="时间" prop="createTime"></el-table-column>
        <el-table-column label="泊位状态">
          <template slot-scope="scope">
            <span v-if="scope.row.magnetometerStatus === 0">在线</span>
            <span v-else-if="scope.row.magnetometerStatus === 1">离线</span>
            <span v-else-if="scope.row.magnetometerStatus === 2">未激活</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column label="地磁状态">
          <template slot-scope="scope">
            <span v-if="scope.row.parkingStatus === 0">驶入</span>
            <span v-else-if="scope.row.parkingStatus === 1">驶出</span>
            <span v-else-if="scope.row.parkingStatus === 2">故障</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
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
      id: 1,
      pageNum: 1,
      pageSize: 5,
      logList: [], // 表单数据
      total: 0,
    };
  },
  methods: {
    getLogList() {
      axios.get("/magnetometer-log/getPageById", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          id: this.id
        }
      })
          .then(res => {
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
    this.id = this.$route.params.id;
    this.getLogList();
  },
};
</script>
<style lang="less" scoped>
</style>