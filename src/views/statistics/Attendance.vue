<template>
  <div>
    <el-row :gutter="12">
      <el-card shadow="always">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>统计管理</el-breadcrumb-item>
          <el-breadcrumb-item>考勤管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row>
    <br>
    <el-row>
      <el-form :inline="true">
        <el-form-item label="时间选择">
          <el-date-picker
              v-model="param.dateTime"
              value-format="yyyy-MM-dd"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getRevenueInfo">查询</el-button>
          <el-button type="primary" icon="el-icon-search" @click="resetKeyword">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <!-- 搜索 -->
    <el-row>
      <el-col :span="4">
        <el-card shadow="always">
          <div>巡检员数量</div>
          <div>{{ inspectorCount }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-card shadow="always">
      <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
      <el-table
          ref="multipleTable"
          :data="roleList"
          tooltip-effect="dark"
          style="width: 100%;text-align: center;font-size: 18px">

        <!-- 复选框 -->

        <el-table-column
            prop="inspectorName"
            label="巡检员名称"
            >
        </el-table-column>

        <el-table-column
            prop="roadName"
            label="执勤街道"
            >
        </el-table-column>

        <el-table-column
            prop="attendanceDayCount"
            label="执勤天数"
            >
        </el-table-column>

        <el-table-column
            prop="normalWorkingCount"
            label="正常天数"
            >
        </el-table-column>

        <el-table-column
            prop="abnormalWorkCount"
            label="异常天数"
            >
        </el-table-column>

        <el-table-column label="正常率" >
          <template slot-scope="scope">{{ calculateNormalRate(scope.row) }}</template>
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
  </div>
</template>

<script>
export default {
  name: "Attendance",
  data() {
    return {
      inspectorCount: 0,
      createTime:'',
      pageNum: 1,
      pageSize: 5,
      total: 0,
      roleList:[],
      param: {}, // Assuming dateTime is used for date range selection
      pickerOptions: {
        // Define your picker options here
      },
      lineChartData: {
        inspector: [] // Assuming you will populate this with inspector data
      }
    };
  },
  computed: {
    // inspectorCount() {
    //   return this.lineChartData.inspector.length;
    // },
    //转化百分比
    normalRate() {
      // Calculate the normal rate here
      if (this.dateTime && this.dateTime.length === 2) {
        const [startDate, endDate] = this.dateTime;
        const selectedDays = (endDate - startDate) / (24 * 60 * 60 * 1000) + 1; // Calculate the number of selected days
        const totalNormalDays = this.roleList.reduce((total, item) => total + item.normalDays, 0);

        // Calculate and return the normal rate as a percentage
        return ((totalNormalDays / selectedDays) * 100).toFixed(2);
      } else {
        return 'N/A'; // Return a placeholder value if date range is not selected
      }
    }
  },
  methods: {
    // 查询巡检员数量的方法
    getInspectorCount() {
      // 假设你有一个获取巡检员列表的 API，例如 `/inspectors/list`
      this.$axios.get("/inspector/list").then((res) => {
        // 假设 API 返回一个包含巡检员信息的数组
        const inspectorList = res.data;
        // 更新巡检员数量
        this.inspectorCount = inspectorList.length;
      });
    },
    calculateNormalRate(row) {
      if (this.dateTime && this.dateTime.length === 2) {
        const [startDate, endDate] = this.dateTime;
        const selectedDays = (endDate - startDate) / (24 * 60 * 60 * 1000) + 1;
        const normalRate = ((row.normalWorkingCount / selectedDays) * 100) || 0;
        return normalRate.toFixed(2) + '%';
      } else {
        const normalRate = (row.normalWorkingCount / row.attendanceDayCount) * 100 || 0;
        return normalRate.toFixed(2) + '%';
      }
    },

    //分页查询所有业主
    findPage() {
      //分页查询，给：roleList  total 赋值
      //后端需要：pageSize pageNum 查询条件name
      // 在查询业主之前，先获取巡检员数量
      if (this.param.dateTime != null) {
        this.param.startTime = this.param.timeHorizon[0];
        this.param.endTime = this.param.timeHorizon[1];
      }
      this.getInspectorCount();
      this.$axios.post(`/clockIn/page/${this.pageNum}/${this.pageSize}`, this.param).then(res => {
        console.log("{}", res)
        this.roleList = res.data.records;
        this.total = res.data.total;
      });
    },
    getRevenueInfo() {
      // Implement your logic to fetch revenue information
    },
    resetKeyword() {
      // Implement your logic to reset keywords
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pageNum = val;
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

<style scoped>
/* Add your scoped styles here if needed */
</style>