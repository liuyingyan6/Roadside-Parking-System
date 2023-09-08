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
        <el-table :data="parkingList" border stripe>
          <!-- 复选框 -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="泊位编号" prop="number" width="100"></el-table-column>
          <el-table-column label="泊位名称" prop="name" width="120"></el-table-column>
          <el-table-column label="地磁编号" prop="pdaName" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
              <el-tag
                  :type="scope.row.state == 0 ? 'success': 1?'info':''"
                  disable-transitions>{{ scope.row.state == 0 ? '有车':1 ?'无车':'未激活'}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="激活时间" prop="pdaTime" width="200"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="200"></el-table-column>

          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="removepark(scope.row)">删除</el-button>
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

  </div>
</template>

<script>
import parking from "@/api/parking";

export default {
  data(){
    return{
      pageNum: 1,
      pageSize: 5,
      total: 0,
      parkingList:[],
      geomagneticList:[],
      multipleSelection: [], //保存选中的值
      addDialogVisible: false,
      editDialogVisible: false,
      addParkForm: {
        name: "",
        chargingRule: "",
        chinaName: "",
        parkingCount: "",
        parkingLimit: "",
        inspectorName: "",
        createTime: ""
      },
      editParkForm: {
        id: -1,
        timeType: "",
        freeDuration: "",
        billFreeDuration: [],
        chargeRate: "",
        maximumCharge: ""
      },
      param: {},
      formLabelWidth: '120px'
    }
  },
  methods:{
    //显示复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      this.addDialogVisible = true;
      this.$refs.addParkFormRef.resetFields(); //清空表单
    },
    //显示修改页面
    showEditDialog(row) {
      this.editDialogVisible = true;
      this.editParkForm.id = row.id;
      this.editParkForm.timeType = row.timeType;
      this.editParkForm.freeDuration = row.freeDuration;
      this.editParkForm.billFreeDuration = row.billFreeDuration;
      this.editParkForm.chargeRate = row.chargeRate;
      //根据用户id查询角色ID
      this.queryRoleByUserId(row.id);
    },
    //添加路段信息
    addPark() {
      this.$axios.post('/parking/add', this.addParkForm).then(res => {
        if (res.data.code == 200) {
          this.$message.success("添加成功");
          this.addDialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    //退出添加
    addParkFormClose() {
      this.$refs.addParkFormRef.resetFields();
      this.addParkForm.deptId = "";
      this.addParkForm.roleIds = [];
    },
    //编辑信息
    editPark() {
      this.$axios.post("/parking/update", this.editParkForm).then(res => {
        if (res.data.code == 200) {
          this.editDialogVisible = false;
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    //退出编辑
    editParkFormClose() {
      this.$refs.editParkFormRef.resetFields();
      this.editParkForm.deptId = "";
      this.editParkForm.roleIds = [];
    },
    //删除车位
    removePark(id) {

    },
    //查询车位
    searchPark() {
      parking.findByPage(this.pageNum, this.pageSize, this.param).then(res => {
        console.log({}, res)
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
  }
}
</script>

<style scoped>
</style>