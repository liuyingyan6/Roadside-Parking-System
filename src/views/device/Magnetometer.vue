<template>
  <div>
    <el-row :gutter="12">
      <el-card shadow="always">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>设备管理</el-breadcrumb-item>
          <el-breadcrumb-item>地磁管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row>
    <el-row>
      <el-card shadow="always">
        <el-row>
          <el-form :inline="true">
            <el-form-item label="地磁名称">
              <el-input v-model="nameKeyword" placeholder="地磁名称"></el-input>
            </el-form-item>
            <el-form-item label="所属路段">
              <el-input v-model="roadNameKeyword" placeholder="所属路段"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getPage">查询</el-button>
            </el-form-item>
          </el-form>
          <div>
            <el-upload style="display: inline; margin-right: 10px"
                       action="/magnetometer/fileAdd"
                       :show-file-list="false"
                       :on-success="handleUploadSuccess"
                       accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
              <el-button type="primary" plain icon="el-icon-upload">批量导入</el-button>
            </el-upload>
            <el-button type="primary" plain @click="showDialog()">添加</el-button>
            <el-button type="primary" plain icon="el-icon-s-flag" @click="exportExcel">批量导出</el-button>
          </div>
        </el-row><!--搜索-->

        <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
        <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%; text-align: center; font-size: 18px"
            @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column> <!-- 复选框 -->
          <el-table-column
              prop="id"
              label="地磁编号"
              width="120">
          </el-table-column> <!-- 地磁编号 -->
          <el-table-column
              prop="magnetometerName"
              label="地磁名称"
              width="120">
          </el-table-column> <!-- 地磁名称 -->
          <el-table-column
              prop="roadName"
              label="所属路段"
              width="120">
          </el-table-column> <!-- 所属路段 -->
          <el-table-column
              prop="parkingName"
              label="绑定泊位"
              width="120">
          </el-table-column> <!-- 绑定泊位 -->
          <el-table-column
              prop="parkingStatus"
              label="泊位情况"
              width="120">
          </el-table-column> <!-- 泊位情况 -->
          <el-table-column
              prop="magnetometerStatus"
              label="地磁状态"
              width="120">
          </el-table-column> <!-- 地磁状态 -->
          <el-table-column
              prop="createTime"
              label="创建时间"
              width="120">
          </el-table-column> <!-- 创建时间 -->
          <el-table-column
              prop="updateTime"
              label="状态更新时间"
              width="120">
          </el-table-column> <!-- 状态更新时间 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                    type="success" icon="el-icon-edit" plain
                    @click="handleEdit(scope.row.id)">编辑
                </el-button>
                <el-button
                    type="danger" icon="el-icon-circle-close" plain
                    @click="handleDelete(scope.row.id)">删除
                </el-button>
                <el-button
                    type="danger" icon="el-icon-circle-close" plain
                    @click="toLogPage(scope.row.id)">地磁日志
                </el-button> <!-- 地磁日志 -->
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 total总条数 page-size：每页大写 current-page 当前页码 page-sizes：下拉列表 page-size：页面大小 -->
        <el-pagination style="margin-top: 15px"
                       background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNum"
                       :page-sizes="[3, 5, 10, 20]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </el-card>
    </el-row>

    <!-- 添加和修改的对话框 -->
    <el-dialog title="地磁管理" :visible.sync="dialogFormVisible" width="500px">
      <!--添加表单-->
      <el-form label-width="120px" :model="form" ref="ruleForm">

        <el-form-item label="车牌号" :label-width="formLabelWidth" prop="carNumber">
          <el-input v-model="form.carNumber" placeholder="请输入车牌号" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>


        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remarks" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
        <el-button type="danger" @click="resetForm()">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      nameKeyword: '',
      roadNameKeyword: '',
      ruleForm: {},
      form: {},
      dialogFormVisible: false,
      formLabelWidth: '120px',
      //分页查询提交的参数
      pageNum: 1,
      pageSize: 5,
      tableData: [],
      total: 0,
      multipleSelection: [],
    }
  },
  methods: {
    //上传成功以后的回调函数, result就是服务器返回的对象
    handleUploadSuccess(result) {
      if (result.code === 1) {
        this.$message.success(result.message);
      } else {
        this.$message.error("导入Excel失败");
      }
      this.findPage();
    },
    //复选框的方法
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //重置
    replacement() {
      this.pageNum = 1;
      this.pageSize = 5;
      this.getPage();
    },
    //导出按钮
    exportExcel() {
      const token = localStorage.getItem('accessToken');
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:9090/magnetometer/export");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.responseType = 'blob'; // 设置响应类型为blob
      xhr.onload = function() {
        if (xhr.status === 200) {
          const blob = new Blob([xhr.response]); // 创建blob对象
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob); // 创建下载链接
          link.download = '地磁信息.xlsx'; // 设置下载的文件名
          link.click(); // 模拟点击下载链接
          window.URL.revokeObjectURL(link.href); // 释放URL对象
        }
      };
      xhr.send();
    },
    //显示添加的对话框
    showDialog() {
      this.dialogFormVisible = true;
    },
    //取消显示的对话框
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.dialogFormVisible = false;
    },
    //分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getPage();
    }, // 切换页大小
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val;
      this.getPage();
    }, // 切换页数
    getPage() {
      axios.get("/magnetometer/getPageByKeyword", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          magnetometerName: this.nameKeyword,
          roadName: this.roadNameKeyword
        }
      })
          .then(resp => {
            this.tableData = resp.data.records;
            this.total = resp.data.total
          });
    }, // 分页查询
    toLogPage(id) {
      this.$router.push('/magnetometer-log/' + id);
    } // 跳转到地磁日志
  },
  created() {
    this.getPage();
  }
};
</script>
<style lang="less" scoped>

</style>
