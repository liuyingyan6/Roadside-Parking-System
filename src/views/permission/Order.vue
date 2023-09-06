<template>
  <div>
    <el-row :gutter="12">
      <el-card shadow="always">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>基础信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>车辆信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row>
    <el-row>
      <el-card shadow="always">
        <el-row>
          <el-form :inline="true" :model="param">
            <el-form-item label="订单编号">
              <el-input v-model="param.carNumber" placeholder="请输入订单编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="findPage">查询</el-button>
            </el-form-item>
          </el-form>
          <div>
            <el-button type="primary" plain icon="el-icon-s-flag" @click="exportExcel">批量导出</el-button>
          </div>
        </el-row>

        <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
        <el-table
            ref="multipleTable"
            :data="roleList"
            tooltip-effect="dark"
            style="width: 100%;text-align: center;font-size: 18px"
            @selection-change="handleSelectionChange">

          <!-- 复选框 -->
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column
              prop="orderNumber"
              label="订单编号"
              width="120">
          </el-table-column>
          <!-- 数据列 prop属性名 label显示列名  -->
<!--          <el-table-column-->
<!--              prop="createTime"-->
<!--              label="提交时间"-->
<!--              width="200">-->
<!--            <template slot-scope="scope">{{ scope.row.dateRegistration }}</template>-->
<!--          </el-table-column>-->
          <el-table-column
              prop="createTime"
              label="提交时间"
              width="200">
          </el-table-column>
          <el-table-column
              prop="carNumber"
              label="车牌号码"
              width="120">
          </el-table-column>
          <el-table-column
              prop="roadName"
              label="所属路段"
              width="120">
          </el-table-column>
          <el-table-column
              prop="parkingNumber"
              label="泊车编号"
              width="120">
          </el-table-column>
          <el-table-column
              prop="inspectorName"
              label="巡检员"
              width="120">
          </el-table-column>
          <el-table-column
              prop="orderAmount"
              label="订单金额"
              width="120">
          </el-table-column>
          <el-table-column
              prop="status"
              label="订单状态"
              width="120"
          >
            <template slot-scope="scope">
<!--              <el-tag-->
<!--                  :type="stateTagMap[scope.row.state].type"-->
<!--                  disable-transitions-->
<!--              >-->
<!--                {{ stateTagMap[scope.row.state].text }}-->
<!--              </el-tag>-->
              <el-tag
                  :type="stateTagMap[scope.row.status] ? stateTagMap[scope.row.status].type : 'default'"
                  disable-transitions
              >
                {{ stateTagMap[scope.row.status] ? stateTagMap[scope.row.status].text : '未定义状态' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button-group>
                <el-button
                    type="primary"
                    @click="handleParticulars(scope.$index,scope.row)">订单详情
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 total总条数 page-size：每页大写 current-page 当前页码 page-sizes：下拉列表 page-size：页面大小 -->
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
    </el-row>

    <!-- 添加和修改的对话框 -->
    <el-dialog title="车辆类型管理" :visible.sync="dialogFormVisible" width="500px">
      <!--添加表单-->
      <el-form label-width="120px" :model="form" :rules="rules" ref="ruleForm" :disabled="disabled">

        <el-form-item label="车牌号" :label-width="formLabelWidth" prop="carNumber">
          <el-input v-model="form.carNumber" placeholder="请输入车牌号" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>

        <el-form-item label="车辆类型" :label-width="formLabelWidth" prop="carTypeId">
          <el-select v-model="form.carTypeId" placeholder="请选择车辆类型" style="width: 300px;">
            <el-option v-for="carType in carTypes" :label="carType.typeName"
                       :value="carType.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车架号" :label-width="formLabelWidth" prop="frameNumber">
          <el-input v-model="form.frameNumber" placeholder="请输入车架号" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>

        <el-form-item label="电机号" :label-width="formLabelWidth" prop="motorNumber">
          <el-input v-model="form.motorNumber" placeholder="请输入电机号" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>

        <el-form-item label="入住时间" :label-width="formLabelWidth" prop="dateRegistration">
          <el-date-picker
              v-model="form.dateRegistration" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              type="date"
              placeholder="年-月-日" style="width: 300px;">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="状态" :label-width="formLabelWidth" prop="state">
          <el-select v-model="form.state" placeholder="请选择车辆类型" style="width: 300px;">
            <el-option v-for="car in cars" :label="car.state == 1 ? '闲置' : '租赁'"
                       :value="car.state"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用途" :label-width="formLabelWidth" prop="carUse">
          <el-select v-model="form.carUse" placeholder="请选择车辆类型" style="width: 300px;">
            <el-option v-for="car in carUses" :label="car.carUse"
                       :value="car.carUse"></el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remarks" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center" v-if="!disabled">
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
        <el-button type="danger" @click="resetForm()">返回</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const axios = require('axios');
export default {
  data() {
    return {

      stateTagMap: {
        0: { type: 'success', text: '进行中' },
        1: { type: 'info', text: '待缴费' },
        2: { type: 'warning', text: '已缴费' },
        3: { type: 'danger', text: '已完成' },
        4: { type: 'primary', text: '已退款' }
      },
      param: {
        carNumber: ""
      },
      //表单验证的规则
      ruleForm: {},
      rules: {},
      //提交的表单
      form: {},
      //添加的显示
      dialogFormVisible: false,
      //查看禁用
      disabled: false,
      //添加的宽度
      formLabelWidth: '120px',

      roleList: [
        { status: 0 },
        { status: 1 },
        { status: 2 },
        { status: 3 },
        { status: 4 }
      ], // 表单数据
      //分页查询提交的参数

        pageNum: 1,
        pageSize: 5,
      total: 0,

      //显示的属性
      tableData: {},
      //显示车辆类型
      cars: [],
      //查询所有的车辆类型
      carTypes: [],
      carUses: [],
      //复选框
      multipleSelection: [],
    }
  },
  methods: {
    //复选框的方法
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //重置
    replacement() {
      this.pageNum = 1;
      this.pageSize = 5;
      this.findPage();
    },
    //删除
    handleDelete(index, row) {
      this.$confirm(`此操作将删除${row.typeName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //调用后台服务器删除
        axios.delete(`/car/${row.id}`).then(resp => {
          let result = resp.data;
          if (result.code === 1) {
            this.$message.success(result.message);
          } else {
            this.$message.error(result.message);
          }
        }).finally(() => {
          //重新加载一次表格的数据
          this.findPage();
        });
      })
    },


    //上传成功以后的回调函数, result就是服务器返回的对象
    handleUploadSuccess(result) {
      if (result.code === 1) {
        this.$message.success(result.message);
      } else {
        this.$message.error("导入Excel失败");
      }
      this.findPage();
    },
    //导出按钮
    exportExcel() {
      //后台直接访问一个地址，进行下载
      location.href = "http://localhost:9090/order/exportExcel";
    },


    //订单详情
    handleParticulars(index, row) {
      this.$router.push({ path: `/orderDetails` });
    },

    //显示添加的对话框
    showDialog() {
      this.dialogFormVisible = true;
      this.disabled = false;
    },
    //编辑
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.disabled = false;
      let obj = {};
      Object.assign(obj, row);
      this.form = obj;
    },
    //取消显示的对话框
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.dialogFormVisible = false;
    },
    //确定按钮
    saveOrUpdate() {
      if (this.form.id) {
        axios.put("/car", this.form).then(
            resp => {
              let result = resp.data;
              if (result.code === 1) {
                //显示信息框
                this.$message.success(result.message);
              } else {
                this.$message.error(result.message);
              }
            }).finally(() => {
          //隐藏对话框
          this.dialogFormVisible = false;
          //清空文本框的内容
          this.form = {};
          this.findPage();
        })
      } else {
        //没有就是添加
        axios.post("/car", this.form).then(resp => {
          //获取响应结果对象
          let result = resp.data;
          if (result.code === 1) {
            this.$message.success(result.message);
          } else {
            this.$message.error(result.message);
          }
        }).finally(() => {
          this.dialogFormVisible = false;
          this.form = {};
          this.findPage();
        });
      }
    },


    //分页
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.findPage();
    },
    handleCurrentChange(newPage) {
      this.pageNum = newPage;
      this.findPage();
    },
    //分页查询所有业主
    findPage() {
      //分页查询，给：roleList  total 赋值
      //后端需要：pageSize pageNum 查询条件name
      this.$axios.get("/order/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          carNumber: this.param.carNumber
        }
      }).then(res => {
        console.log("", res.data.records);
        this.total = res.data.total;
        this.roleList = res.data.records;
      });
    },

    //加载所有车辆状态
    findAll() {
      axios.get("/car").then(resp => {
        let result = resp.data;
        if (result.code === 1) {
          this.cars = result.data;
        }
      });
    },

    //查询所有车辆用途
    findCarUseAll() {
      axios.get("/car/carUse").then(resp => {
        let result = resp.data;
        if (result.code === 1) {
          this.carUses = result.data;
        }
      });
    },
    //加载所有车辆类型
    findAllCarType() {
      axios.get("/carType").then(resp => {
        let result = resp.data;
        if (result.code === 1) {
          this.carTypes = result.data;
        }
      });
    },
    searchRole() {
      this.pageNum = 1;
      this.pageSize = 5;
      this.findPage();
    },

  },
  created() {
    this.searchRole();
  }
};
</script>
<style lang="less" scoped>

</style>
