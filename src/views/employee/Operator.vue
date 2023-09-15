<template>
    <div>
        <el-row :gutter="24" style="margin-bottom: 20px">
            <el-card shadow="always">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>员工管理</el-breadcrumb-item>
                    <el-breadcrumb-item>运维员管理</el-breadcrumb-item>
                </el-breadcrumb>
            </el-card>
        </el-row>

        <!--搜索框-->
        <el-row>
            <el-card>
                <el-row>
                    <el-form :inline="true" :model="param">

                        <el-form-item label="用户名">
                            <el-input v-model="param.name" placeholder="运维员名称"></el-input>
                        </el-form-item>

                        <el-form-item label="手机号码">
                            <el-input v-model="param.phone" placeholder="手机号码"></el-input>
                        </el-form-item>

                        <el-form-item label="状态">
                            <el-select v-model="param.state" placeholder="状态">
                                <el-option label="禁用" value="1"></el-option>
                                <el-option label="正常" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="findPage">查询</el-button>
                        <el-button @click="replacement" type="info" icon="el-icon-refresh">重置</el-button>
                    </el-form>
                </el-row>
            </el-card>
        </el-row>


        <el-row>
            <el-card shadow="always">

                <!--新建按钮-->
                <el-row>
                    <el-form>
                        <el-form-item>
                            <el-button type="success" @click="showAddDialog()">新建</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>

                <!-- 表格 data：要绑定的数据 -->
                <el-table
                        ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%;text-align: center;font-size: 18px"
                        @selection-change="handleSelectionChange">

                    <!-- 复选框 -->
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>

                    <el-table-column
                            prop="operatorName"
                            label="运维员名称"
                            width="150">
                    </el-table-column>

                    <el-table-column
                            prop="phone"
                            label="手机号码"
                            width="200">
                    </el-table-column>

                    <el-table-column
                            prop="names"
                            label="管辖路段"
                            width="200">
                    </el-table-column>

                    <el-table-column
                            prop="area"
                            label="所属分区"
                            width="150">
                    </el-table-column>

                    <el-table-column
                            prop="state"
                            label="状态"
                            width="150">
                        <template slot-scope="scope">
                            <el-tag
                                    :type="scope.row.state === 0 ? 'success' : 'primary'"
                                    disable-transitions>{{scope.row.state == 0 ? "正常" : "禁用"}}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button-group>
                                <!-- 只有当处理结果为未处理时才显示处理按钮 -->
                                <el-button type="success" icon="el-icon-edit" plain
                                           @click="showEditDialog(scope.row)">编辑
                                </el-button>

                                <el-button
                                        plain :type="scope.row.state === 1 ? 'danger' : 'success'"
                                        @click="disableOperator(scope.row)">{{scope.row.state == 0 ? "禁用" : "恢复" }}
                                </el-button>

                                <el-button type="danger" icon="el-icon-edit" plain
                                           @click="deleteOperator(scope.row)">删除
                                </el-button>
                            </el-button-group>
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

        <!--添加对话框-->
        <el-dialog title="新增运维人员" :visible.sync="dialogFormVisible" width="500px">
            <!--添加表单-->
            <el-form label-width="120px" :model="formData" ref="form">

                <el-form-item label="运维员名称" :label-width="formLabelWidth" prop="operatorName">
                    <el-input v-model="formData.operatorName" autocomplete="off" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="账号" :label-width="formLabelWidth" prop="account">
                    <el-input v-model="formData.account" autocomplete="off" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                    <el-input v-model="formData.password" autocomplete="off" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
                    <el-input v-model="formData.phone" autocomplete="off" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="绑定泊位" :label-width="formLabelWidth" prop="names">
                    <el-select
                            v-model="formData.nameList"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            style="width: 300px"
                            placeholder="请选择管辖路段">

                        <el-option
                                v-for="item in roadData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                        </el-option>

                    </el-select>
                </el-form-item>

                <el-form-item label="所属分区" :label-width="formLabelWidth" prop="area">
                    <el-input v-model="formData.area" autocomplete="off" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="状态" :label-width="formLabelWidth" prop="state" value-key="value">
                    <el-select v-model="formData.state" style="width: 300px">
                        <el-option label="正常" :value="0"></el-option>
                        <el-option label="禁用" :value="1"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button type="primary" @click="addOperator()">确 定</el-button>
                <el-button type="danger" @click="dialogFormVisible = false">返 回</el-button>
            </div>
        </el-dialog>


        <!--编辑对话框-->
        <el-dialog title="编辑运维人员" :visible.sync="editDialogVisible" width="500px">
            <!--添加表单-->
            <el-form label-width="120px" :model="editData" ref="form">

                <el-form-item label="运维员名称" :label-width="formLabelWidth" prop="operatorName">
                    <el-input v-model="editData.operatorName" :disabled="isOperatorNameDisabled" autocomplete="off" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
                    <el-input v-model="editData.phone" autocomplete="off" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="绑定泊位" :label-width="formLabelWidth" prop="names">
                    <el-select
                            v-model="editData.nameList"
                            multiple
                            filterable
                            allow-create
                            default-first-option
                            style="width: 300px"
                            placeholder="请选择管辖路段">

                        <el-option
                                v-for="item in roadData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                        </el-option>

                    </el-select>
                </el-form-item>

                <el-form-item label="所属分区" :label-width="formLabelWidth" prop="area">
                    <el-input v-model="editData.area" autocomplete="off" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="状态" :label-width="formLabelWidth" prop="state" value-key="value">
                    <el-select v-model="editData.state" style="width: 300px">
                        <el-option label="正常" :value="0"></el-option>
                        <el-option label="禁用" :value="1"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button type="primary" @click="addOperator()">确 定</el-button>
                <el-button type="danger" @click="editDialogVisible = false">返 回</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import operator from "@/api/employee/operator";
    import axios from "axios"
    import user from "@/api/user";

    export default {
        data() {
            return {
                isOperatorNameDisabled: true,
                roadData:[],//添加中的下拉框
                editDialogVisible: false,
                dialogFormVisible: false,
                // 新增对话框数据
                formData: {},
                editData: {},
                // 分页查询提交的参数
                param: {},
                // 显示的属性
                tableData: {},
                // 复选框
                multipleSelection: [],
                pageNum: 1,
                pageSize: 5,
                total: 0
            }
        },
        methods: {

            deleteOperator(row){
                console.log(row)
                this.$confirm(`此操作将删除${row.operatorName}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.post("/operator/delete",row)
                        .then(resp => {
                            this.$message.success('删除成功～');
                        })
                        .catch(error => {
                            this.$message.error(error);
                        })
                        .finally(() => {
                            this.findPage();
                        });
                })

            },

            disableOperator(row){
                this.$confirm('是否真的禁用该用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    axios.put("/operator/disable",row).then(res=>{
                        console.log(res)
                        if (res.data == 1) {
                            this.$message.error("禁用成功");

                        } else {
                            this.$message.success("恢复成功");

                        }
                        this.findPage();// 刷新表单数据
                    })
                });
            },

            showEditDialog(row){
                this.getroadData();
                this.editData = Object.assign({}, row); // 将当前行的数据赋给 formData 对象
                this.editDialogVisible = true
            },

            // 显示添加对话框
            showAddDialog(){
                this.getroadData();
                this.dialogFormVisible = true
            },

            // 查询添加中的下拉框
            getroadData(){
                axios.get("/road/findRoad").then(res => {
                    console.log(res)
                    this.roadData = res.data
                })
            },

            addOperator(){
                if (this.editData.operatorName) {
                    console.log("editData============",this.editData)
                    axios.put("/operator/update", this.editData)
                        .then(resp => {
                            this.$message.success('修改成功')
                        }).finally(() => {
                        this.editDialogVisible = false;
                        this.editData = {};
                        this.findPage();
                    })
                } else {
                    console.log(this.formData)
                    axios.post("/operator/add", this.formData)
                        .then(resp => {
                            this.$message.success('添加成功')
                        })
                        .catch(error => {
                            this.$message.error(error);
                        })
                        .finally(() => {
                            this.dialogFormVisible = false;
                            this.formData = {};
                            this.findPage();
                        })
                }
            },

            //分页查询所有运维员
            findPage() {
                operator.findPage(this.pageNum, this.pageSize, this.param).then(resp => {
                    console.log({}, resp.data)
                    this.tableData = resp.data.list;
                    this.total = resp.data.total;
                });
            },

            //重置
            replacement() {
                this.param = {}
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
