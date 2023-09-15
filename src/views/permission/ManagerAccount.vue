<template>
    <div>

        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理员账号</el-breadcrumb-item>
        </el-breadcrumb>


        <el-card>

            <!--搜索框&添加按钮-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="输入账号" clearable v-model="account" @clear="searchRole">
                        <el-button slot="append" icon="el-icon-search" @click="searchRole"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="showAddDialog()">添加角色</el-button>
                </el-col>
            </el-row>

            <!--信息表单-->
            <el-table :data="managerList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="账号" prop="account"></el-table-column>
                <el-table-column label="所属部门" prop="departmentName"></el-table-column>
                <el-table-column label="手机号码" prop="telephone"></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        {{ scope.row.status === 0 ? '正常' : scope.row.status === 1 ? '停用' : '' }}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="removeManagerByAccount(scope.row.account)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>

        <!--添加角色-->
        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="25%">
            <el-form
                    :model="addManagerForm"
                    ref="addManagerFormRef"
                    :rules="addFormRules"
                    :label-width="formLableWidth"
                    class="demo-ruleForm"
            >

                <el-form-item label="名字">
                    <el-input v-model="addManagerForm.name"></el-input>
                </el-form-item>

                <el-form-item label="账号">
                    <el-input v-model="addManagerForm.account"></el-input>
                </el-form-item>

                <el-form-item label="密码">
                    <el-input v-model="addManagerForm.password"></el-input>
                </el-form-item>

                <el-form-item label="手机号码">
                    <el-input v-model="addManagerForm.telephone"></el-input>
                </el-form-item>

                <el-form-item label="所属部门"><br>
                    <el-select v-model="addManagerForm.departmentId" placeholder="请选择部门">
                        <el-option
                                v-for="item in departmentData"
                                :key="item.id"
                                :label="item.departmentName"
                                :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="角色配置"><br>
                <el-select v-model="addManagerForm.roleId" placeholder="请选择角色">
                    <el-option
                            v-for="item in roleData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                    ></el-option>
                </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addRole">确 定</el-button>
                <el-button @click="addDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>


        <!--修改角色-->
        <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="30%">
            <el-form
                    :model="editManagerForm"
                    ref="editManagerFormRef"
                    :label-width="formLableWidth"
                    class="demo-ruleForm"
            >
                <el-form-item label="账号">
                    <el-input disabled v-model="editManagerForm.account"></el-input>
                </el-form-item>

                <el-form-item label="密码">
                    <el-input v-model="editManagerForm.password"></el-input>
                </el-form-item>

                <el-form-item label="手机号码">
                    <el-input v-model="editManagerForm.telephone"></el-input>
                </el-form-item>

                <el-form-item label="所属部门"><br>
                    <el-select v-model="editManagerForm.departmentId" placeholder="请选择部门">
                        <el-option
                                v-for="item in departmentData"
                                :key="item.id"
                                :label="item.departmentName"
                                :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="角色配置"><br>
                    <el-select v-model="editManagerForm.roleId" placeholder="请选择角色">
                        <el-option
                                v-for="item in roleData"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editManager">确 定</el-button>
                <el-button @click="editDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>


        <!--分页插件-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
        ></el-pagination>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                addFormRules: {
                    account: [
                        {required: true, message: "用户名必填", trigger: "blur"},
                        {min: 4, max: 8, message: "用户名在4到8个字符之间", trigger: "blur"}
                    ],
                    password: [
                        {required: true, message: "密码必填", trigger: "blur"},
                        {
                            min: 4,
                            max: 8,
                            message: "用户密码在4到8个字符之间",
                            trigger: "blur"
                        }
                    ],
                    // repassword: [
                    //     { required: true, message: "请确认密码", trigger: "blur" },
                    //     { validator: this.validatePassword, trigger: "blur" }
                    // ],
                    telephone: [
                        {required: true, message: "手机号码必填", trigger: "blur"}
                    ]
                },

                formLableWidth:"",
                addDialogVisible: false,//新增弹出框
                editDialogVisible: false,//修改弹出框
                pageNum: 1,
                pageSize: 5,
                total: 0,
                account: "", // 搜索框&表单角色名称
                managerList: [], // 表单数据
                roleData:[],
                departmentData:[],
                //新增弹框数据
                addManagerForm: {
                    name:"",
                    account: "",
                    password: "",
                    telephone: "",
                    roleId: '',
                    departmentId: ''
                },
                //修改弹框数据
                editManagerForm: {
                    account: "",
                    password: "",
                    telephone: "",
                    roleId: '',
                    departmentId: ''
                },
            };
        },
        methods: {

            removeManagerByAccount(account) {
                console.log({},account)
                this.$confirm('是否真的删除这条数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete('/manager/delete/' + account).then(res => {
                        if (res.code == 200) {
                            this.$message.success("删除成功");
                            this.pageNum = 1;
                            this.getManagerList();// 刷新表单数据
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                }).catch(() => {
                    this.$message.info("已取消删除");
                });
            },

            async showEditDialog(row){
                console.log(row)
                this.editManagerForm = row
                this.editDialogVisible = true
                await this.searchRoleData();//查询所有的角色数据
                await this.searchDepartmentData()
            },

            validatePassword(rule, value, callback) {
                if (value !== this.addManagerForm.password) {
                    callback(new Error("两次输入的密码不一致"));
                } else {
                    callback();
                }
            },

            // 分页加载表单数据&查询
            getManagerList() {
                //分页查询，给：managerList  total 赋值
                //后端需要：pageSize pageNum 查询条件name
                console.log("输入框的值======",this.account)
                this.$axios.get("/manager/all", {
                    params: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        account: this.account
                    }
                }).then(res => {
                    console.log("", res);
                    this.managerList = res.data.list;
                    this.total = res.data.total;
                })
            },

            //新增弹框
            async showAddDialog() {
                this.addDialogVisible = true;
                this.addRoleForm = false;
                await this.searchRoleData();//查询所有的角色数据
                await this.searchDepartmentData();//查询所有的角色数据
            },
            //查询所有部门
            async searchDepartmentData(){
                await new Promise((resolve,reject)=>{
                    this.$axios.get('/department/all').then(res=>{
                        if(res.code == 200){
                            console.log({},res.data)
                            this.departmentData = res.data;
                        }else{
                            this.$message.error(res.msg);
                        }
                        resolve(true);//表示异步方法执行完成
                    })
                })
            },
            //查询所有的角色数据
            async searchRoleData(){
                await new Promise((resolve,reject)=>{
                    this.$axios.get('/role/all').then(res=>{
                        if(res.code == 200){
                            console.log({},res.data)
                            this.roleData = res.data;
                        }else{
                            this.$message.error(res.msg);
                        }
                        resolve(true);//表示异步方法执行完成
                    })
                })
            },

            editManager() {
                console.log({},this.editManagerForm)
                this.$axios.post('/manager/update', this.editManagerForm).then(res => {
                    if (res.code == 200) {
                        this.$message.success("修改成功");
                        this.editDialogVisible = false;
                        this.editManagerForm = {};
                        this.getManagerList();//重新请求数据，刷新数据列表
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },

            //提交新增
            addRole() {
                console.log({},this.addManagerForm)
                this.$axios.post('/manager/add', this.addManagerForm).then(res => {
                    if (res.code == 200) {
                        this.$message.success("新增成功");
                        this.addDialogVisible = false;
                        this.addManagerForm = {};
                        this.getManagerList();//重新请求数据，刷新数据列表
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },

            searchRole() {
                this.pageNum = 1;
                this.pageSize = 5;
                this.getManagerList();
            },
            handleSizeChange(newSize) {
                this.pageSize = newSize;
                this.getManagerList();
            },
            handleCurrentChange(newPage) {
                this.pageNum = newPage;
                this.getManagerList();
            }


        },
        created() {
            this.getManagerList();
        }
    };
</script>
<style lang="less" scoped>

    .el-form-item {
        width: 100%;
        max-width: 400px; /* 设置最大宽度 */
    }
    .el-input,
    .el-select {
        width: 100%;
    }
</style>