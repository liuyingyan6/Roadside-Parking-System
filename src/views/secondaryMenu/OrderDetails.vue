<template>

  <div>
    <!--面包屑-->
    <el-breadcrumb separator="/" style=";margin-left: 30px;">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <br>

    <el-steps :active="JSON.parse(this.$route.query.orderData).status"
              style="width: 80%;display: flex;margin-left: 20px; ">
      &nbsp; &nbsp;<el-step title="车辆驶入" description="2017-07-19 15:43:23"></el-step>
      <el-step title="车辆驶离" description="2017-07-19 15:43:23"></el-step>
      <el-step title="订单支付" description="2017-07-19 15:43:23"></el-step>
    </el-steps>


    <!--    <div class="payment-icon">&#xf09d;</div>-->
    <br>
    <template>
      <div class="container" style="display: flex; justify-content: space-between; gap: 0px;margin-left: 20px;">
        <el-card class="box-card" style="width: 50%;">
          <!-- 第一个 el-card 组件的内容 -->
          <!-- 注意: 去除了包裹内容的 div -->


          <span>订单编号:</span> &nbsp; <span>{{ orderData.orderNumber }}</span>
          <br>
          <span>车牌号码:</span> &nbsp; <span>{{ orderData.carNumber }}</span>
          <br>
          绑定用户: 未绑定/张三丰
          <br>
          <span>所属路段:</span> &nbsp; <span>{{ orderData.roadName }}</span>
          <br>
          <span>泊位编号:</span> &nbsp; <span>{{ orderData.parkingNumber }}</span>
          <br>
          地磁编号: &nbsp;21312312
          <br>
          <span>巡检员&nbsp;&nbsp;&nbsp;:</span> &nbsp; <span>{{ orderData.inspectorName }}</span>
        </el-card>

        <el-card class="box-card" style="width: 50%;">
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
      <br>
      <br>

      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>路段规则：全天收费</span>
      <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          border
          style="width: 80%; margin-top: 20px;margin-left: 20px; ">

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
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>路段规则：分时段收费</span>
      <el-table
          :data="tableData2"
          :span-method="objectSpanMethod"
          border
          style="width: 80%; margin-top: 20px;margin-left: 20px;">
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
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>路段规则：分时段禁停收费</span>
      <el-table
          :data="tableData3"
          :span-method="objectSpanMethod"
          border
          style="width: 80%; margin-top: 20px ;margin-left: 20px;">
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
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>
费项信息</span>
      <el-table
          :data="tableData4"
          :span-method="objectSpanMethod"
          border
          style="width: 80%; margin-top: 20px ;margin-left: 20px;">
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
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <span class="texts" style="color: dimgray ">合计:</span>
              &nbsp;&nbsp; <span class="text1 bg-purple " style="color: tomato">待核算</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          </el-col>
        </el-row>
      </el-header>
    </template>

  </div>
</template>
<style scoped>
.bg-purple {

}

.text1 {
  font-size: 60px;
  text-align: right; /* 文本向右对齐 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 水平居中对齐 */
}

.texts {
  font-size: 40px;
  text-align: right; /* 文本向右对齐 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: center; /* 水平居中对齐 */
}

.container {
  display: flex; /* 使用 Flex 布局 */
  justify-content: space-between; /* 在容器中平均分配空间，让两个 el-card 并排显示 */
  width: 80%;

}

.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 900px;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 8px;
  min-height: 100px;
  min-width: 165%;
  /*以下3个属性，2以帮我们实现 文字居中对齐*/

  text-align: right;
  color: white;
}

</style>
<
<script>
import router from "@/router";

const axios = require('axios');

export default {

  data() {
    return {
      orderData: {

        status: '',
        orderNumber: '',
        carNumber: '',
        user: '',
        roadName: '',
        parkingNumber: '',
        sensorNumber: '',
        inspectorName: '',
        enterTime: '2021-04-09 02:32:04',
        parkingDuration: '1小时12分钟',
      },
      orderId: null,


      // ...other data properties
      progressPercentage: 100, // Set the initial percentage
      events: [
        {type: '车辆驶入', timestamp: '2017-07-19 15:43:23'},
        {type: '车辆驶离', timestamp: '2017-07-19 15:43:23'},
        {type: '订单支付', timestamp: '2017-07-19 15:43:23'},
        // 添加更多事件...
      ],
      form: {},
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

    // Access the 'id' parameter from route params
    const id = this.$route.params.id;

    // Access the 'orderData' query parameter and parse it if needed
    const orderData = JSON.parse(this.$route.query.orderData);

    // Now, you can use 'id' and 'orderData' in this component

    console.log('id:', id);
    console.log('orderData:', orderData);
  }, mounted() {
    // 使用JSON.parse将路由参数解析为JavaScript对象，并赋值给orderData属性
    this.orderData = JSON.parse(this.$route.query.orderData);
  }
};
</script>
<style scoped>

</style>