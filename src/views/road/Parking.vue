<template>
  <div>
    <el-row :gutter="12">
      <el-card shadow="always">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>路段信息</el-breadcrumb-item>
          <el-breadcrumb-item>泊位管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row>

    <!-- 搜索框 -->
    <el-row>
      <el-card>
        <el-form :inline="true" :model="param">
          <el-form-item>
            <el-input v-model="param.name" placeholder="泊位名称" style="width:150px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchPark">查询</el-button>
            <el-button type="info" plain @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card>
        <el-row>
          <el-form>
            <el-form-item>
              <el-button type="success" @click="showAddDialog()">新建</el-button>
            </el-form-item>
          </el-form>
        </el-row>

        <!-- 表格 -->
        <el-table :data="parkingList" border stripe style="width: 78%;">
          <!-- 复选框 -->
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column label="泊位编号" prop="number" width="100"></el-table-column>
          <el-table-column label="泊位名称" prop="name" width="120"></el-table-column>
          <el-table-column label="地磁编号" prop="magnetometerName" width="120"></el-table-column>
          <el-table-column label="泊位状态" prop="status" width="110">
            <template slot-scope="scope">
              <el-tag
                  :type="scope.row.status == 0 ? 'success':scope.row.status == 1 ?'info':'info'"
                  disable-transitions>{{ scope.row.status == 0 ? '有车' : scope.row.status == 1 ? '无车' : '未激活' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="激活时间" prop="magnetometerTime" width="220"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="220"></el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="removePark(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[3,5,10,15]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
      </el-card>
    </el-row>

    <!-- 添加对话框 -->
    <el-dialog title="信息添加" :visible.sync="dialogFormVisible" width="500px">
      <el-form label-width="120px" :model="form">

        <el-form-item label="泊位编号" prop="number">
          <el-input v-model="form.number" placeholder="请输入泊位号" autocomplete="off"
                    style="width: 300px"></el-input>
        </el-form-item>

        <el-form-item label="泊位名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入泊位名称" autocomplete="off"
                    style="width: 300px"></el-input>
        </el-form-item>

        <el-form-item label="地磁编号" prop="magnetometerName">
          <el-input v-model="form.magnetometerName" placeholder="请输入地磁编号" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>

        <!-- filterable(是否可搜索)、remote(是否为远程搜索)、reserve-keyword(多选时，是否保留关键词) -->
        <el-form-item label="路段名称:" prop="roadId">
          <el-select
              v-model="form.roadId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入路段名称"
              :remote-method="remoteRoad"
              :loading="loading"
              style="width: 300px">
            <template slot="empty">无匹配数据</template>
            <el-option
                v-for="item in optionsRoad"
                :label="item.roadName"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="泊位状态:" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">有车</el-radio>
            <el-radio :label="1">无车</el-radio>
            <el-radio :label="2">未激活</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="创建时间:" prop="createTime">
          <el-date-picker
              v-model="form.createTime" type="datetime"
              placeholder="请选择激活时间"
              value-format="yyyy-MM-dd HH:mm:ss" style="width: 200px">
          </el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click=" saveOrUpdate" :style="{display:visibleDisplay}">确定</el-button>
        <el-button type="primary" @click="editPark" :style="{display:visibleConceal}">保存编辑</el-button>
        <el-button type="danger" @click="dialogFormVisible = false">返回</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import parking from "@/api/parking";
import axios from "axios";

export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      total: 0,
      parkingList: [],
      multipleSelection: [], //保存选中的值
      optionsRoad: [], //远程表(路段)
      dialogFormVisible: false,
      loading: false, //是否正在从远程获取数据
      form: {}, //信息表
      param: {},
      visibleDisplay: '', //显示按钮
      visibleConceal: 'none' //隐藏按钮
    }
  },
  methods: {
    //显示复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //远程加载(路段)
    remoteRoad(roadName) {
      this.loading = true;
      axios.get(`/road/findByRoadName?roadName=${roadName}`).then(res => {
        console.log('路段:', res);
        this.loading = false;
        this.optionsRoad = res;
      });
    },
    //重置
    clear() {
      this.param.pageNum = 1;
      this.param.pageSize = 5;
      this.param = {};
      this.searchPark();
    },
    //显示添加页面
    showAddDialog() {
      this.form = {}
      this.dialogFormVisible = true;
      this.visibleDisplay = ''
      this.visibleConceal = 'none'
    },
    //显示修改页面
    showEditDialog(row) {
      this.dialogFormVisible = true;
      this.visibleDisplay = 'none'
      this.visibleConceal = ''
      let obj = {};
      Object.assign(obj, row);
      this.form = obj;
    },
    //添加(保存按钮)
    saveOrUpdate() {
      if (this.form.id) {
        axios.put("/parking/saveOrUpdate", this.form)
            .then(res => {
              this.$message.success('修改成功')
            }).finally(() => {
          this.dialogFormVisible = false;
          this.form = {};
          this.searchPark();
        })
      } else {
        axios.put("/parking/saveOrUpdate", this.form)
            .then(res => {
              this.$message.success('添加成功')
            })
            .catch(error => {
              this.$message.error(error);
            })
            .finally(() => {
              this.dialogFormVisible = false;
              this.form = {};
              this.searchPark();
            })
      }
    },
    //编辑信息
    editPark() {
      console.log(this.form)
      this.$axios.put("/parking/update", this.form)
          .then(res => {
            if (res.code == 200) {
              this.$message.success('修改成功')
              this.dialogFormVisible = false;
              this.searchPark();
            } else {
              this.$message.error(res.msg);
            }
          })
    },
    //删除车位
    removePark(id) {
      this.$confirm(`是否确定删除这条数据?`, '确认？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //调用后台服务器删除
        axios.delete('/parking/delete/' + id).then(res => {
          if (res.code == 200) {
            this.$message.success('成功删除');
            this.pageNum = 1;
            this.searchPark();
          } else {
            this.$message.error('已取消删除');
          }
        })
      });
    },
    //查询车位
    searchPark() {
      parking.findByPage(this.pageNum, this.pageSize, this.param).then(res => {
        console.log('分页:', res)
        this.parkingList = res.data.records
        this.total = res.data.total
      })
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.searchPark();
    },
    handleCurrentChange(now) {
      this.pageNum = now;
      this.searchPark();
    }
  },
  created() {
    this.searchPark();
    //this.axios=axios;
  }
}
</script>

<style scoped>
</style>