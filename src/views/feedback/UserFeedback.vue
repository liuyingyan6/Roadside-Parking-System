<template>
    <div>
        <el-row :gutter="24" style="margin-bottom: 20px">
            <el-card shadow="always">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </el-row>

        <el-row>
            <el-card shadow="always">
                <el-row>
                    <el-form :inline="true" :model="param">
                        <el-form-item label="用户名">
                            <el-input v-model="param.userName" placeholder="用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码">
                            <el-input v-model="param.phone" placeholder="手机号码"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="param.state" placeholder="状态">
                                <el-option label="已处理" value="1"></el-option>
                                <el-option label="未处理" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="findPage">查询</el-button>
                        <el-button @click="replacement" type="info" icon="el-icon-refresh">重置</el-button>
                    </el-form>
                </el-row>

                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%; text-align: center;font-size: 18px"
                        @selection-change="handleSelectionChange">

                    <!-- 复选框 -->
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="feedbackOdd"
                            label="反馈单号"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="userName"
                            label="用户名"
                            width="120">
                    </el-table-column>
                    <!-- 数据列 prop属性名 label显示列名  -->
                    <el-table-column
                            prop="phone"
                            label="手机号码"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="imgCount"
                            label="图片数量"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="反馈时间"
                            width="200">
                        <template slot-scope="scope">{{ scope.row.createTime }}</template>
                    </el-table-column>

                    <el-table-column
                            prop="state"
                            label="状态"
                            width="100">
                        <template slot-scope="scope">
                            <el-tag
                                    :type="scope.row.state === 1 ? 'success' : 'primary'"
                                    disable-transitions>{{scope.row.state == 1 ? "已处理" : "未处理"}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="处理时间"
                            width="200">
                        <template slot-scope="scope">{{ scope.row.updateTime }}</template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    type="success" icon="el-icon-edit" plain v-if="scope.row.state!=1"
                                    @click="handleEdit(scope.row)">处理
                            </el-button>
                            <el-button
                                    type="primary" icon="el-icon-view" plain
                                    @click="handleView(scope.row)">详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页组件 total总条数 page-size：每页大写 current-page 当前页码 page-sizes：下拉列表 page-size：页面大小 -->
                <el-pagination style="margin-top: 15px"
                               background
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="pageNum"
                               :page-sizes="[3, 5, 10, 20]"
                               :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </el-card>
        </el-row>

        <el-dialog
                title="工单处理"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <el-form :model="form" label-width="100px"  class="demo-ruleForm">
                <el-form-item label="反馈内容" >
                    <el-input type="textarea" v-model="form.feedbackText" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="处理结果反馈">
                    <el-input type="textarea" v-model="form.result"></el-input>
                </el-form-item>
                <el-form-item style="text-align: right">
                    <el-button type="primary" @click="submitForm">确定</el-button>
                    <el-button @click="resetForm">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>


</template>
<script>
    import userFeedback from '@/api/feedback/userFeedback'

    export default {
        data() {
            return {
                //分页查询提交的参数
                param: {},
                //显示的属性
                tableData: {},
                //复选框
                multipleSelection: [],
                pageNum: 1,
                pageSize: 5,
                total: 0,
                form: {},
                dialogVisible: false
            }
        },
        methods: {
            handleView(row) {
                this.$router.push({
                    name: 'UserFeedbackDetails',
                    params: { data: row }
                });
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            //编辑
            handleEdit(row) {
                this.form = {
                    id: row.id,
                    feedbackText: row.feedbackText
                }
                this.dialogVisible = true;
            },
            //确定
            submitForm() {
                userFeedback.update(this.form).then(res => {
                    this.$message.success("处理成功")
                    this.dialogVisible = false
                    this.findPage()
                })
            },
            resetForm() {
                this.dialogVisible = false
            },
            //重置
            replacement() {
                this.param = {}
                this.findPage()
            },
            //分页查询所有业主
            findPage() {
                userFeedback.findPage(this.pageNum, this.pageSize, this.param).then(resp => {
                    this.tableData = resp.data.list;
                    this.total = resp.data.total;
                });
            },
            //分页
            handleSizeChange(val) {
                this.pageSize = val;
                this.findPage();
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.findPage();
            },
            //复选框的方法
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        },
        created() {
            this.findPage()
        }
    };
</script>
<style lang="less" scoped>

</style>
