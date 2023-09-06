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
                    <el-form :inline="true">
                        <el-form-item label="车牌号">
                            <el-input v-model="key" placeholder="请输入车牌号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="getCarList">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                                <el-button type="primary" @click="exportCarList" >批量导出</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>

                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
                <el-table :data="CarList" border stripe>
                    <el-table-column label="车牌号" prop="carNumber"></el-table-column>
                    <el-table-column label="车辆类型" prop="carTypeName"></el-table-column>
                    <el-table-column label="所属用户" prop="userName"></el-table-column>
                    <el-table-column label="订单数量" prop="orderCount"></el-table-column>
                    <el-table-column label="未缴费订单" prop="notPayCount"></el-table-column>
                    <el-table-column label="消费金额" prop="orderAmount"></el-table-column>
                    <el-table-column label="待缴费金额" prop="notPayAmount"></el-table-column>
                    <el-table-column label="创建时间" prop="creatTime"></el-table-column>
                    <el-table-column label="操作"  width="180px">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="">订单记录</el-button>
                            <el-dropdown>
                                <el-button type="primary" plain size="mini">
                                    ...<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>解绑</el-dropdown-item>
                                    <el-dropdown-item>禁用</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>

<!--                 分页组件 total总条数 page-size：每页大写 current-page 当前页码 page-sizes：下拉列表 page-size：页面大小 -->
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageNumber"
                        :page-sizes="[3, 6, 9, 12]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </el-card>
        </el-row>


    </div>
</template>
<script>
    export default {
        data() {
            return {
                pageNumber: 1,//自定义默认显示第1页
                pageSize: 3, //自定义默认每页显示3条数据
                total: 0,
                key:'',
               CarList: [],

            }
        },
        methods: {
            //导出按钮
            exportCarList() {
                const token = localStorage.getItem('accessToken');
                const xhr = new XMLHttpRequest();
                xhr.open("GET", "http://localhost:9090/car/exportExcel");
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
            // //分页
            handleCurrentChange(val) {
                this.pageNumber = val;
                this.getCarList();
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getCarList();
            },
            getCarList(){
                this.$axios.get("/car/carList",{
                    params:{
                        pageSize: this.pageSize,
                        pageNum : this.pageNumber,
                        key:this.key
                    }
                }).then(resp=>{
                    console.log(resp)
                    this.CarList=resp.data.list;
                    this.total=resp.data.total;
                })

            }


        },
        created() {
            this.getCarList();
        }
    };
</script>
<style lang="less" scoped>

</style>
