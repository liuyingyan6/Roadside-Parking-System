<template xmlns:el-col="http://www.w3.org/1999/html">
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
            <el-input v-model="param.roadName" placeholder="路段名称" style="width:150px"></el-input>
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
          <el-table-column label="路段名称" prop="roadName" width="120"></el-table-column>
          <el-table-column label="路段类型" prop="chargingRule" width="200"></el-table-column>
          <el-table-column label="所属地区" prop="chinaName" width="120"></el-table-column>
          <el-table-column label="泊位数量" prop="parkingCount" width="100"></el-table-column>
          <el-table-column label="限制泊位数" prop="parkingLimit" width="100"></el-table-column>
          <el-table-column label="巡检员" prop="inspectorName" width="100"></el-table-column>
          <el-table-column label="运维人员" prop="operatorName" width="100"></el-table-column>
          <el-table-column label="创建时间" prop="createTime" width="200"></el-table-column>

          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="removeRoad(scope.row.id)">删除</el-button>
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
    <el-dialog title="新建路段信息" :visible.sync="addDialogVisible" width="700px">
      <el-form label-width="120px" :model="addRoadForm">

        <el-form-item label="路段名称" prop="roadName">
          <el-input v-model="addRoadForm.roadName" placeholder="请输入路段名称" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>

        <el-form-item label="路段类型" prop="chargingRule">
          <el-select v-model="addRoadForm.chargeId" placeholder="请选择路段类型" style="width: 300px;">
            <el-option v-for="charge in chargingRules"
                       :label="charge.chargingRule"
                       :value="charge.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属地区" prop="chinaId">
          <el-select
              v-model="addRoadForm.chinaId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入所属地区"
              :remote-method="remoteMethod"
              :loading="loading"
              style="width: 300px">
            <el-option
                v-for="item in options"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="巡检员" prop="inspectorId">
          <template>
            <el-select
                v-model="addRoadForm.inspector"
                multiple
                filterable
                remote
                collapse-tags
                reserve-keyword
                placeholder="请选择巡检员"
                :remote-method="remoteInspector"
                :loading="loading"
                style="width: 300px">
              <el-option
                  v-for="inspector in inspectors"
                  :label="inspector.name"
                  :value="inspector">
              </el-option>
            </el-select>
          </template>
        </el-form-item>

        <el-form-item label="运维员" prop="operatorId">
          <template>
            <el-select
                v-model="addRoadForm.operator"
                multiple
                filterable
                remote
                collapse-tags
                reserve-keyword
                placeholder="请选择运维员"
                :remote-method="remoteOperator"
                :loading="loading"
                style="width: 300px">
              <el-option
                  v-for="operator in operators"
                  :label="operator.operatorName"
                  :value="operator">
              </el-option>
            </el-select>
          </template>
        </el-form-item>

        <el-form-item label="泊位数量" prop="parkingCount">
          <el-input v-model="addRoadForm.parkingCount" placeholder="请输入泊位数" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>

        <el-form-item label="限制泊位数" prop="parkingLimit">
          <el-input v-model="addRoadForm.parkingLimit" placeholder="请输入限制泊位数" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>

        <template>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <el-form-item label="收费规则:" prop="status">
              <el-radio-group v-model="addRoadForm.chargeId">
                <el-radio :label="1">全天收费</el-radio>
                <el-radio :label="2">分时段收费</el-radio>
                <el-radio :label="3">分时段禁停收费</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div v-if="addRoadForm.chargeId == 1">
            <el-table
                :data="tableData"
                :span-method="objectSpanMethod"
                border
                style="width: 100%; margin-top: 20px">
              <el-table-column
                  prop="id"
                  label="时段"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="timeFrame"
                  label="时段">
              </el-table-column>
              <el-table-column
                  prop="PeriodOfFime"
                  label="时间段">
              </el-table-column>
              <el-table-column
                  prop="FreeDuration"
                  label="免费时长">
              </el-table-column>
              <el-table-column
                  prop="Billing"
                  label="计费包含免费时长">
              </el-table-column>
              <el-table-column
                  prop="Charges"
                  label="收费标准">
              </el-table-column>
              <el-table-column
                  prop="CapAmount"
                  label="封顶金额">
              </el-table-column>
            </el-table>
          </div>
          <div v-else-if="addRoadForm.chargeId == 2">
            <el-table
                :data="tableData2"
                :span-method="objectSpanMethod"
                border
                style="width: 100%; margin-top: 20px">
              <el-table-column
                  prop="id"
                  label="时段"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="timeFrame"
                  label="时段">
              </el-table-column>
              <el-table-column
                  prop="PeriodOfFime"
                  label="时间段">
              </el-table-column>
              <el-table-column
                  prop="FreeDuration"
                  label="免费时长">
              </el-table-column>
              <el-table-column
                  prop="Billing"
                  label="计费包含免费时长">
              </el-table-column>
              <el-table-column
                  prop="Charges"
                  label="收费标准">
              </el-table-column>
              <el-table-column
                  prop="CapAmount"
                  label="封顶金额">
              </el-table-column>
            </el-table>
          </div>
          <div v-else-if="addRoadForm.chargeId == 3">
            <el-table
                :data="tableData3"
                :span-method="objectSpanMethod"
                border
                style="width: 100%; margin-top: 20px">
              <el-table-column
                  prop="id"
                  label="时段"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="timeFrame"
                  label="时段">
              </el-table-column>
              <el-table-column
                  prop="PeriodOfFime"
                  label="时间段">
              </el-table-column>
              <el-table-column
                  prop="FreeDuration"
                  label="免费时长">
              </el-table-column>
              <el-table-column
                  prop="Billing"
                  label="计费包含免费时长">
              </el-table-column>
              <el-table-column
                  prop="Charges"
                  label="收费标准">
              </el-table-column>
              <el-table-column
                  prop="CapAmount"
                  label="封顶金额">
              </el-table-column>
            </el-table>
          </div>
        </template>

        <el-form-item label="路段状态:" prop="state">
          <el-radio-group v-model="addRoadForm.state">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
              v-model="addRoadForm.createTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss" style="width: 200px">
          </el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="addRoad">确定</el-button>
        <el-button type="danger" @click="addDialogVisible = false">返回</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog title="编辑路段信息" :visible.sync="editDialogVisible" width="700px">
      <el-form label-width="120px" :model="editRoadForm">

        <el-form-item label="路段名称" prop="roadName">
          <el-input v-model="editRoadForm.roadName" placeholder="请输入路段名称" autocomplete="off"
                    style="width: 300px;"></el-input>
        </el-form-item>

        <el-form-item label="路段类型" prop="chargingRule">
          <el-select v-model="editRoadForm.chargeId" placeholder="请选择路段类型" style="width: 300px;">
            <el-option v-for="charge in chargingRules"
                       :label="charge.chargingRule"
                       :value="charge.id"></el-option>
          </el-select>
        </el-form-item>

        <template>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <el-form-item label="收费规则:" prop="status">
              <el-radio-group v-model="editRoadForm.chargeId">
                <el-radio :label="1">全天收费</el-radio>
                <el-radio :label="2">分时段收费</el-radio>
                <el-radio :label="3">分时段禁停收费</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div v-if="editRoadForm.chargeId == 1">
            <el-table
                :data="tableData"
                :span-method="objectSpanMethod"
                border
                style="width: 100%; margin-top: 20px">
              <el-table-column
                  prop="id"
                  label="时段"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="timeFrame"
                  label="时段">
              </el-table-column>
              <el-table-column
                  prop="PeriodOfFime"
                  label="时间段">
              </el-table-column>
              <el-table-column
                  prop="FreeDuration"
                  label="免费时长">
              </el-table-column>
              <el-table-column
                  prop="Billing"
                  label="计费包含免费时长">
              </el-table-column>
              <el-table-column
                  prop="Charges"
                  label="收费标准">
              </el-table-column>
              <el-table-column
                  prop="CapAmount"
                  label="封顶金额">
              </el-table-column>
            </el-table>
          </div>
          <div v-else-if="editRoadForm.chargeId == 2">
            <el-table
                :data="tableData2"
                :span-method="objectSpanMethod"
                border
                style="width: 100%; margin-top: 20px">
              <el-table-column
                  prop="id"
                  label="时段"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="timeFrame"
                  label="时段">
              </el-table-column>
              <el-table-column
                  prop="PeriodOfFime"
                  label="时间段">
              </el-table-column>
              <el-table-column
                  prop="FreeDuration"
                  label="免费时长">
              </el-table-column>
              <el-table-column
                  prop="Billing"
                  label="计费包含免费时长">
              </el-table-column>
              <el-table-column
                  prop="Charges"
                  label="收费标准">
              </el-table-column>
              <el-table-column
                  prop="CapAmount"
                  label="封顶金额">
              </el-table-column>
            </el-table>
          </div>
          <div v-else-if="editRoadForm.chargeId == 3">
            <el-table
                :data="tableData3"
                :span-method="objectSpanMethod"
                border
                style="width: 100%; margin-top: 20px">
              <el-table-column
                  prop="id"
                  label="时段"
                  width="180">
              </el-table-column>
              <el-table-column
                  prop="timeFrame"
                  label="时段">
              </el-table-column>
              <el-table-column
                  prop="PeriodOfFime"
                  label="时间段">
              </el-table-column>
              <el-table-column
                  prop="FreeDuration"
                  label="免费时长">
              </el-table-column>
              <el-table-column
                  prop="Billing"
                  label="计费包含免费时长">
              </el-table-column>
              <el-table-column
                  prop="Charges"
                  label="收费标准">
              </el-table-column>
              <el-table-column
                  prop="CapAmount"
                  label="封顶金额">
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="editRoad">保存编辑</el-button>
        <el-button type="danger" @click="editDialogVisible = false">返回</el-button>
      </div>
    </el-dialog>

    <!-- 收费编辑 -->
    <!-- :visible.sync="editDialogVisible" -->
    <el-dialog title="收费设置" width="60%" class="edit-dialog">

      <el-form :model="editRoadForm"
               label-width="100px"
               class="demo-ruleForm form-left"
               style="margin: auto">

        <el-row style="margin: auto;">
          <el-form-item label="路段类型" prop="chargingRule">
            <el-select v-model="editRoadForm.chargeId" placeholder="请选择路段类型" style="width: 240px;">
              <el-option v-for="charge in chargingRules"
                         :label="charge.chargingRule"
                         :value="charge.id"></el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="11" style="margin-left: -200px;">
            <el-form-item label="繁忙时间段" prop="timePeriod">
              <el-input v-model="editRoadForm.timePeriod" style="width: 240px;"></el-input>
            </el-form-item>

            <el-form-item label="免费时长" prop="freeDuration">
              <el-input v-model="editRoadForm.freeDuration" style="width: 240px;"></el-input>
            </el-form-item>

            <el-form-item label="收费标准" prop="chargeRate">
              <el-input v-model="editRoadForm.chargeRate" style="width: 240px;"></el-input>
            </el-form-item>
            <el-form-item label="封顶金额" prop="maximumCharge">
              <el-input v-model="editRoadForm.maximumCharge" style="width: 240px"></el-input>
            </el-form-item>
          </el-col>

          <!-- 第二张表 -->
          <el-col :span="2">
            <div style="width: 1px;height: 100%;border-right: 1px dashed #ccc"></div>
          </el-col>
          <el-col :span="11" style="margin-left: 200px;">
            <el-form-item label="非繁忙时间段" prop="timePeriod">
              <el-input v-model="editRoadForm.timePeriod" style="width: 240px;"></el-input>
            </el-form-item>

            <el-form-item label="免费时长" prop="freeDuration">
              <el-input v-model="editRoadForm.freeDuration" style="width: 240px"></el-input>
            </el-form-item>

            <el-form-item label="收费标准" prop="chargeRate">
              <el-input v-model="editRoadForm.chargeRate" style="width: 240px"></el-input>
            </el-form-item>
            <el-form-item label="封顶金额" prop="maximumCharge">
              <el-input v-model="editRoadForm.maximumCharge" style="width: 240px"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
import axios from "axios";

export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      total: 0,
      roadList: [], //所有路段
      chargingRules: [], //路段收费类型
      inspectors: [], //巡检员
      operators: [], //运维员
      multipleSelection: [], //保存选中的值
      options: [], //远程表
      loading: false, //是否正在从远程获取数据
      addDialogVisible: false,
      editDialogVisible: false,

      param: {},
      addRoadForm: {},
      editRoadForm: {},

      tableData: [{
        id: '工作日',
        timeFrame: '繁忙时段',
        FreeDuration: '30分钟',
        Billing: '是',
        Charges: '5元/30分钟',
        CapAmount: '50元'
      }, {
        id: '非工作日',
        timeFrame: '非繁忙时段',
        PeriodOfFime: '19:00-次日',
        FreeDuration: '60分钟',
        Billing: '否',
        Charges: '2元/小时',
        CapAmount: '10元'
      }, {
        id: '非工作日',
        timeFrame: '繁忙时段',
        PeriodOfFime: '9:00-19:00',
        FreeDuration: '30分钟',
        Billing: '是',
        Charges: '5元/30分钟',
        CapAmount: '50元'
      }, {
        id: '非工作日',
        timeFrame: '非繁忙时段',
        PeriodOfFime: '19:00-次日',
        FreeDuration: '60分钟',
        Billing: '否',
        Charges: '2元/小时',
        CapAmount: '10元'
      }],
      tableData2: [{
        id: '工作日',
        timeFrame: '收费时间段',
        FreeDuration: '30分钟',
        Billing: '是',
        Charges: '5元/30分钟',
        CapAmount: '50元'
      }, {
        id: '非工作日',
        timeFrame: '免费时间段',
        PeriodOfFime: '19:00-次日',
        FreeDuration: '60分钟',
        Billing: '',
        Charges: '',
        CapAmount: ''
      }, {
        id: '非工作日',
        timeFrame: '收费时间段',
        PeriodOfFime: '9:00-19:00',
        FreeDuration: '30分钟',
        Billing: '是',
        Charges: '5元/30分钟',
        CapAmount: '50元'
      }, {
        id: '非工作日',
        timeFrame: '免费时间段',
        PeriodOfFime: '19:00-次日',
        FreeDuration: '60分钟',
        Billing: '',
        Charges: '',
        CapAmount: ''
      }],
      tableData3: [{
        id: '工作日',
        timeFrame: '收费时间段',
        FreeDuration: '30分钟',
        Billing: '是',
        Charges: '5元/30分钟',
        CapAmount: '50元'
      }, {
        id: '非工作日',
        timeFrame: '禁停时间段',
        PeriodOfFime: '19:00-次日',
        FreeDuration: '60分钟',
        Billing: '',
        Charges: '',
        CapAmount: ''
      }, {
        id: '非工作日',
        timeFrame: '收费时间段',
        PeriodOfFime: '9:00-19:00',
        FreeDuration: '30分钟',
        Billing: '是',
        Charges: '5元/30分钟',
        CapAmount: '50元'
      }, {
        id: '非工作日',
        timeFrame: '禁停时间段',
        PeriodOfFime: '19:00-次日',
        FreeDuration: '60分钟',
        Billing: '',
        Charges: '',
        CapAmount: ''
      }]
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
          if (res.data == 0) {
            this.$message.success("恢复成功");
          } else {
            this.$message.error("禁用成功");
          }
          this.searchRoad();
        })
      });
    },
    //显示添加页面
    showAddDialog() {
      this.addRoadForm = {};
      this.addDialogVisible = true;
    },
    //显示修改页面
    showEditDialog(row) {
      this.editDialogVisible = true;
      //this.findByChargeId(row);
      let obj = {};
      Object.assign(obj, row);
      this.editRoadForm = obj;
    },
    //添加路段信息
    addRoad() {
      for (const inspector of this.addRoadForm.inspector) {
        this.addRoadForm.inspectorId = inspector.id
      }
      for (const operator of this.addRoadForm.operator) {
        this.addRoadForm.operatorId = operator.id
      }
      this.$axios.post('/road/add', this.addRoadForm).then(res => {
        if (res.code == 200) {
          this.$message.success("添加成功");
          this.addDialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    //编辑路段信息
    editRoad() {
      road.editRoad(this.editRoadForm).then(res=>{
        this.$message({message: '修改成功', type: 'success'});
        this.editDialogVisible = false;
        this.searchRoad();
      })
    },
    //删除
    removeRoad(id) {
      this.$confirm(`是否确定删除这条数据?`, '确认?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //调用后台服务器删除
        axios.delete('/road/delete/' + id).then(res => {
          this.$message.success("删除成功");
          this.searchRoad();
        })
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    //分页查询路段
    searchRoad() {
      road.findByPage(this.pageNum, this.pageSize, this.param).then(res => {
        console.log('分页:', res)
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
    },
    //远程加载(地区)
    remoteMethod(name) {
      this.loading = true;
      axios.get(`/china/findsByName?name=${name}`).then(res => {
        //停止加载
        this.loading = false;
        this.options = res;
      });
    },
    //远程加载(巡检员)
    remoteInspector(inspectorName) {
      this.loading = true;
      axios.get(`/inspector/findByInspectorName?inspectorName=${inspectorName}`)
          .then(res => {
            console.log('巡检员:', res);
            //停止加载
            this.loading = false;
            this.inspectors = res;
          });
    },
    //远程加载(运维员)
    remoteOperator(operatorName) {
      this.loading = true;
      axios.get(`/operator/findByOperatorName?operatorName=${operatorName}`)
          .then(res => {
            //停止加载
            this.loading = false;
            this.operators = res;
          });
    },
    //查询收费规则
    selectCharge() {
      axios.get("/charge/findByCid").then(res => {
        this.chargingRules = res.data;
      })
    },
    //通过id查询规则
    findByChargeId(row) {
      axios.get(`/charge/findByChargeId/${row.chargeId}`).then(res => {
        console.log("查询结果：", res);
        this.editRoadForm = res.data[0];
        this.editRoadForm2 = res.data[1];
      })
    }
  },
  created() {
    this.searchRoad();
    this.selectCharge();
  }
}
</script>

<style scoped>

.edit-dialog {
  border-radius: 8px;
}

.form-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.form-left,
.form-right {
  width: 45%;
  padding: 0 10px;
}

.dialog-footer {
  text-align: right;
}

</style>