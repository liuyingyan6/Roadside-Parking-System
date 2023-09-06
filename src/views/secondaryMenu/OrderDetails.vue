<template>

  <div>
    <!--面包屑-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <el-steps :active="1">
      <el-step title="车辆驶入" description="2017-07-19 15:43:23"></el-step>
      <el-step title="车辆驶离" description="2017-07-19 15:43:23"></el-step>
      <el-step title="订单支付" description="2017-07-19 15:43:23"></el-step>
    </el-steps>

    <!--    <div class="payment-icon">&#xf09d;</div>-->
    <hr>
    <template>
      <div class="container">
        <el-card class="box-card">
          <!-- 第一个 el-card 组件的内容 -->
          <!-- 注意: 去除了包裹内容的 div -->
          订单编号: &nbsp; 2020
          <br>
          车牌号码 &nbsp; &nbsp; 粤S·8D3N2
          <br>
          绑定用户: 未绑定/张三丰
          <br>
          所属路段: &nbsp;天安1路
          <br>
          泊位编号: &nbsp;A-123
          <br>
          地磁编号: &nbsp;21312312
          <br>
          巡检员: &nbsp;A巡检员
        </el-card>

        <el-card class="box-card">
          <!-- 第二个 el-card 组件的内容 -->
          <!-- 注意: 去除了包裹内容的 div -->
          驶入时间: &nbsp; 2021-04-09 02:32:04
          <br>
          停车时长: &nbsp; &nbsp; 1小时12分钟
          <br>
          驶入图片:
        </el-card>
      </div>
    </template>

    <template>
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
      <br>
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
      <br>
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
      <br>
      <hr>
      <el-table
          :data="tableData4"
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
            label="停车时段">
        </el-table-column>
        <el-table-column
            prop="FreeDuration"
            label="停车时长">
        </el-table-column>
        <el-table-column
            prop="Billing"
            label="收费单价">
        </el-table-column>
        <el-table-column
            prop="Charges"
            label="是否封顶">
        </el-table-column>
        <el-table-column
            prop="CapAmount"
            label="小计">
        </el-table-column>
      </el-table>
      <el-header>
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark"> <el-link :underline="false">合计: 待核算</el-link></div>
          </el-col>
        </el-row>
      </el-header>
    </template>

  </div>
</template>
<style scoped>
.container {
  display: flex; /* 使用 Flex 布局 */
  justify-content: space-between; /* 在容器中平均分配空间，让两个 el-card 并排显示 */
  width: 100%;
}

.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}
.box-card{
  width: 900px;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.grid-content {
  border-radius: 8px;
  min-height: 36px;
  /*以下3个属性，可以帮我们实现 文字居中对齐*/

  text-align: right;
  color: white;
}

</style>
<
<script>
const axios = require('axios');
export default {
  data() {
    return {
      // ...other data properties
      progressPercentage: 100, // Set the initial percentage
      events: [
        {type: '车辆驶入', timestamp: '2017-07-19 15:43:23'},
        {type: '车辆驶离', timestamp: '2017-07-19 15:43:23'},
        {type: '订单支付', timestamp: '2017-07-19 15:43:23'},
        // 添加更多事件...
      ],
      param: {
        carNumber: ""
      },
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
      }],
      tableData4: [{
        id: '工作日',
        timeFrame: '繁忙时段/收费时段',
        PeriodOfFime: '9:00-19:00',
        FreeDuration: '待驶离',
        Billing: '',
        Charges: '',
        CapAmount: ''

      }, {
        id: '非工作日',
        timeFrame: '非繁忙时段/免费时段/禁停时段',
        PeriodOfFime: '19:00-次日',
        FreeDuration: '待驶离',
        Billing: '',
        Charges: '',
        CapAmount: ''
      }, {
        id: '非工作日',
        timeFrame: '繁忙时段/收费时段',
        PeriodOfFime: '9:00-19:00',
        FreeDuration: '待驶离',
        Billing: '',
        Charges: '',
        CapAmount: ''
      }, {
        id: '非工作日',
        timeFrame: '非繁忙时段/免费时段/禁停时段',
        PeriodOfFime: '19:00-次日',
        FreeDuration: '待驶离',
        Billing: '',
        Charges: '',
        CapAmount: ''
      }]

    };
  },


  methods: {
    completePayment() {
      // Perform your payment logic here
      // Set the progress percentage to 100 when payment is completed
      this.progressPercentage = 100;
    },
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }

  },
  created() {

  }
};
</script>
<style scoped>

</style>