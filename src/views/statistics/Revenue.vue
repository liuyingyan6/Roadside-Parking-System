<script>
import axios from 'axios';
import * as echarts from 'echarts';

export default {
  name: "statistics.Revenue",
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      total: 0,
      formLabelWidth: '120px',
      roadId: '',
      roads: [],
      dateTime: [],
      pickerOptions: {
        shortcuts: [{
          text: '本周',
          onClick(picker) {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);
            const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '本月',
          onClick(picker) {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '上月',
          onClick(picker) {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const end = new Date(now.getFullYear(), now.getMonth(), 0);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      orderStatus: '营收',
      tableData: [],
      lineChart: {},
      lineChartOption: {},
      pieChart: {},
      pieChartOption: {},
      funnelChart: {},
      funnelChartOption: {},
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPage();
    }, // 切换页大小
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getPage();
    }, // 切换页数
    getPage() {
      axios.get("/order/getRevenueInfo", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        }
      }).then(resp => {
        this.tableData = resp.data.records;
        this.total = resp.data.total;
      }).catch(error => {
        console.log(error);
      })
    },
    getRoads() {

    },
    resetKeyword() {
      this.nameKeyword = '';
      this.roadNameKeyword = '';
    },
    initLineChart() {
      // 基于准备好的dom，初始化echarts实例
      this.lineChart = echarts.init(document.getElementById('lineChart'));

      // 指定图表的配置项和数据
      this.lineChartOption = {
        title: {
          text: 'Stacked Line'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Direct',
            type: 'line',
            stack: 'Total',
            data: [320, 332, 301, 334, 390, 330, 320]
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      this.lineChart.setOption(this.lineChartOption);
    },
    initPieChart() {
      // 基于准备好的dom，初始化echarts实例
      this.pieChart = echarts.init(document.getElementById('pieChart'));

      // 指定图表的配置项和数据
      this.pieChartOption = {
        title: {
          text: 'Referer of a Website',
          subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              {value: 1048, name: 'Search Engine'},
              {value: 735, name: 'Direct'},
              {value: 580, name: 'Email'},
              {value: 484, name: 'Union Ads'},
              {value: 300, name: 'Video Ads'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      this.pieChart.setOption(this.pieChartOption);
    },
    initFunnelChart() {
      // 基于准备好的dom，初始化echarts实例
      this.funnelChart = echarts.init(document.getElementById('funnelChart'));

      // 指定图表的配置项和数据
      this.funnelChartOption = {
        title: {
          text: 'Funnel',
          left: 'left',
          top: 'bottom'
        },
        toolbox: {
          orient: 'vertical',
          top: 'center',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order']
        },
        series: [
          {
            name: 'Funnel',
            type: 'funnel',
            width: '50%',
            height: '60%',
            left: 'center',
            top: 'center',
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}%'
            },
            labelLine: {
              show: true
            },
            data: [
              {value: 100, name: 'Show'},
              {value: 70, name: 'Click'},
              {value: 60, name: 'Visit'},
              {value: 20, name: 'Inquiry'},
              {value: 10, name: 'Order'},
            ]
          },
        ]
      };


      // 使用刚指定的配置项和数据显示图表。
      this.funnelChart.setOption(this.funnelChartOption);
    },
  },
  created() {
    this.getPage();
    this.getRoads();
  },
  mounted() {
    this.initLineChart();
    this.initPieChart();
    this.initFunnelChart();
  }
}
</script>

<template>
  <div>
    <el-row :gutter="12">
      <el-card shadow="always">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>统计管理</el-breadcrumb-item>
          <el-breadcrumb-item>营收管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row> <!--面包屑-->
    <el-row>
      <el-form :inline="true">
        <el-form-item label="路段选择" :label-width="formLabelWidth" prop="parkingId">
          <el-select v-model="roadId" style="width: 300px">
            <el-option v-for="road in roads" :label="road.name"
                       :value="road.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
              v-model="dateTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getPage">查询</el-button>
          <el-button type="primary" icon="el-icon-search" @click="resetKeyword">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row> <!--搜索-->
    <el-row>
      <el-col :span="4">
        <el-card shadow="always">
          <div>订单数量（单）</div>
          <div>1232</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div>营收额（元）</div>
          <div>1232</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div>退款订单（单）</div>
          <div>21</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div>退款金额（单）</div>
          <div>23.12</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div>异常订单（单）</div>
          <div>23</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="always">
          <div>异常金额（元）</div>
          <div>232.12</div>
        </el-card>
      </el-col>
    </el-row> <!--卡片展示订单&金额-->
    <el-row>
      <div id="lineChart" style="width: 100%;height:400px;"></div>
    </el-row> <!--数据统计图：折线图-->
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <el-card shadow="always" style="width: 50%;height:100px;">
            <div>营收额（元）</div>
            <div>1232</div>
          </el-card>
        </div>
        <div id="pieChart" style="width: 600px;height:400px;"></div>
      </el-col>
      <el-col :span="12">
        <div id="funnelChart" style="width: 600px;height:500px;"></div>
      </el-col>
    </el-row> <!--订单转化率：饼状图&漏斗图-->
    <el-row>
      <el-table
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%; text-align: center; font-size: 18px">
        <el-table-column
            prop="date"
            label="日期"
            width="120">
        </el-table-column> <!-- 日期 -->
        <el-table-column
            prop="orderCount"
            label="订单数量"
            width="120">
        </el-table-column> <!-- 订单数量 -->
        <el-table-column
            prop="revenue"
            label="营收额"
            width="120">
        </el-table-column> <!-- 营收额 -->
        <el-table-column
            prop="refundOrderCount"
            label="退款订单"
            width="120">
        </el-table-column> <!-- 退款订单-->
        <el-table-column
            prop="refundAmount"
            label="退款金额"
            width="120">
        </el-table-column> <!-- 退款金额-->
        <el-table-column
            prop="userIncreaseCount"
            label="用户增长"
            width="120">
        </el-table-column> <!-- 用户增长-->
      </el-table> <!--表格展示订单信息-->
      <el-pagination style="margin-top: 15px"
                     background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageNum"
                     :page-sizes="[3, 5, 10, 20]"
                     :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination> <!--分页组件-->
    </el-row>
  </div>
</template>

<style scoped lang="less">

</style>