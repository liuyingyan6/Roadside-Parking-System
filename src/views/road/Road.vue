<template>
  <div>
    <el-row :gutter="12">
      <el-card shadow="always">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>路段信息</el-breadcrumb-item>
          <el-breadcrumb-item>路段管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row>

    <el-row>
      <el-card>
        <el-form :inline="true" :model="param">
          <el-form-item>
            <el-input v-model="param.name" placeholder="路段名称" style="width:150px"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="param.chargingRule" placeholder="路段类型" style="width:150px"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input v-model="param.inspectorName" placeholder="巡检员名称" style="width:150px"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="searchRoad">查询</el-button>
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
        <el-table :data="roadList" border stripe>
          <!-- 复选框 -->
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="路段名称" prop="name" width="120"></el-table-column>
          <el-table-column label="路段类型" prop="chargingRule" width="120"></el-table-column>
          <el-table-column label="所属地区" prop="chinaName" width="120"></el-table-column>
          <el-table-column label="泊位数量" prop="parkingCount" width="100"></el-table-column>
          <el-table-column label="限制泊位数" prop="parkingLimit" width="120"></el-table-column>
          <el-table-column label="巡检员" prop="inspectorName" width="100"></el-table-column>
          <el-table-column label="运维人员" prop="inspectorName" width="100"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="200"></el-table-column>

          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="removeRoad(scope.row)">删除</el-button>
              <el-button size="mini"
                         :type="scope.row.state == 1 ? 'success' : 'warning'"
                         @click="Disabled(scope.row)">{{ scope.row.state == 0 ? '禁用' : '恢复' }}
              </el-button>
              <el-button type="info" size="mini" onclick="location.href='/parking'">泊位管理</el-button>
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

    <!-- 新建 -->
    <el-dialog title="新建路段信息" :visible.sync="addDialogVisible" width="50%" @close="addRoadFormClose">
      <el-form label-width="120px" :model="addRoadForm" ref="ruleForm">

        <el-form-item label="路段名称" :label-width="formLabelWidth" prop="carNumber">
          <el-input v-model="addRoadForm.name" placeholder="请输入路段名称" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>

        <el-form-item label="车辆类型" :label-width="formLabelWidth" prop="carTypeId">
          <el-select v-model="addRoadForm.chargingRule" placeholder="请选择车辆类型" style="width: 300px;">
            <el-option v-for="charge in chargingRules" :label="charge.typeName"
                       :value="charge.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属地区" :label-width="formLabelWidth" prop="frameNumber">
          <el-input v-model="addRoadForm.chinaName" placeholder="请选择所属地" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>

        <el-form-item label="泊位数量" :label-width="formLabelWidth" prop="motorNumber">
          <el-input v-model="addRoadForm.parkingCount" placeholder="请输入泊位数" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>

        <el-form-item label="限制泊位数" :label-width="formLabelWidth" prop="motorNumber">
          <el-input v-model="addRoadForm.parkingLimit" placeholder="请输入限制泊位数" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>

        <el-form-item label="巡检员" :label-width="formLabelWidth" prop="carTypeId">
          <el-select v-model="addRoadForm.inspectorName" placeholder="请选择巡检员" style="width: 300px;">
            <el-option v-for="inspector in inspectors" :label="inspector.name"
                       :value="inspector.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="运维员" :label-width="formLabelWidth" prop="carTypeId">
          <el-select v-model="addRoadForm.inspectorName" placeholder="请选择运维员" style="width: 300px;">
            <el-option v-for="admin in admins" :label="admin.name"
                       :value="admin.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建时间" :label-width="formLabelWidth" prop="dateRegistration">
          <el-date-picker
              v-model="addRoadForm.createTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              type="date"
              placeholder="年-月-日" style="width: 300px;">
          </el-date-picker>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="saveOrUpdate()">确定</el-button>
        <el-button type="danger" @click="resetForm()">返回</el-button>
      </div>
    </el-dialog>

    <!-- 收费编辑 -->
    <el-dialog title="收费设置" :visible.sync="editDialogVisible" width="50%" @close="editRoadFormClose">
      <el-form :model="editRoadForm"
               ref="editRoadFormRef"
               label-width="100px"
               class="demo-ruleForm">

        <el-form-item label="繁忙时间段" prop="timeType">
          <el-date-picker
              v-model="editRoadForm.timeType" type="date"
              placeholder="请选择上牌日期"
              value-format="yyyy-MM-dd" style="width: 300px">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="免费时长" prop="freeDuration">
          <el-input v-model="editRoadForm.freeDuration" style="width: 300px"></el-input>
        </el-form-item>

        <el-form-item label="计费(包括免费时长)" prop="billFreeDuration">
          <el-select v-model="editRoadForm.billFreeDuration" placeholder="请选择是否锁定账户" style="width: 200px">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="收费标准" prop="chargeRate">
          <el-input v-model="editRoadForm.chargeRate" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="封顶金额" prop="maximumCharge">
          <el-input v-model="editRoadForm.maximumCharge" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editRoad">保存</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import road from "@/api/road";

export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      total: 0,
      roadList: [], //所有路段
      chargingRules: [], //路段收费类型
      inspectors: [], //巡检员
      admins: [], //运维员
      multipleSelection: [], //保存选中的值
      addDialogVisible: false,
      editDialogVisible: false,
      freeDuration: "",

      addRoadForm: {
        name: "",
        chargingRule: "",
        chinaName: "",
        parkingCount: "",
        parkingLimit: "",
        inspectorName: "",
        createTime: ""
      },
      editRoadForm: {
        id: -1,
        timeType: "",
        freeDuration: "",
        billFreeDuration: [],
        chargeRate: "",
        maximumCharge: ""
      },
      param: {},
      formLabelWidth: '120px'
    };
  },
  methods: {
    //显示复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //重置
    clear() {
      this.param.pageNum = 1;
      this.param.pageSize = 5;
      this.param = {};
      this.searchRoad();
    },
    //禁用、恢复功能
    Disabled(param) {
      this.$confirm('是否真的禁用该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        road.Disabled(param).then(res => {
          console.log(res)
          if (res.data == 0) {
            this.$message.success("恢复成功");
          } else {
            this.$message.error("禁用成功");
          }
          this.searchRoad();// 刷新表单数据
        })
      });
    },
    //车位数统计
    parkingCount() {

    },
    //显示添加页面
    showAddDialog() {
      this.addDialogVisible = true;
      this.$refs.addRoadFormRef.resetFields(); //清空表单
    },
    //显示修改页面
    showEditDialog(row) {
      this.editDialogVisible = true;
      this.editRoadForm.id = row.id;
      this.editRoadForm.timeType = row.timeType;
      this.editRoadForm.freeDuration = row.freeDuration;
      this.editRoadForm.billFreeDuration = row.billFreeDuration;
      this.editRoadForm.chargeRate = row.chargeRate;
      //根据用户id查询角色ID
      this.queryRoleByUserId(row.id);
    },
    //添加路段信息
    addRoad() {
      this.$axios.post('/road/add', this.addRoadForm).then(res => {
        if (res.data.code == 200) {
          this.$message.success("添加成功");
          this.addDialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    //退出添加
    addRoadFormClose() {
      this.$refs.addRoadFormRef.resetFields();
      this.addRoadForm.deptId = "";
      this.addRoadForm.roleIds = [];
    },
    //编辑信息
    editRoad() {
      this.$axios.post("/road/updateManager", this.editRoadForm).then(res => {
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
    editRoadFormClose() {
      this.$refs.editRoadFormRef.resetFields();
      this.editRoadForm.deptId = "";
      this.editRoadForm.roleIds = [];
    },
    //删除
    removeRoad(id) {

    },
    //查询路段
    searchRoad() {
      road.findByPage(this.pageNum, this.pageSize, this.param).then(res => {
        console.log({}, res)
        this.roadList = res.data.records
        this.total = res.data.total
      })
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.searchRoad();
    },
    handleCurrentChange(now) {
      this.pageNum = now;
      this.searchRoad();
    }
  },
  created() {
    this.searchRoad();
  }
}
</script>

<style scoped>
</style>