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
                    <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
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
                        <el-button type="danger" size="mini" @click="removeRoleById(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页插件-->
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

        <!--添加角色-->
        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="30%">
            <el-form
                    :model="addManagerForm"
                    ref="addManagerFormRef"
                    :rules="addFormRules"
                    :label-width="formLableWidth"
                    class="demo-ruleForm"
            >
                <el-form-item label="账号">
                    <el-input v-model="addManagerForm.account"></el-input>
                </el-form-item>

                <el-form-item label="密码">
                    <el-input v-model="addManagerForm.password"></el-input>
                </el-form-item>

                <el-form-item label="确认密码">
                    <el-input v-model="addManagerForm.repassword"></el-input>
                </el-form-item>

                <el-form-item label="手机号码">
                    <el-input v-model="addManagerForm.telephone"></el-input>
                </el-form-item>


                <el-select v-model="addManagerForm.roleData" placeholder="角色配置">
                    <el-option
                            v-for="item in roleData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                    ></el-option>
                </el-select>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addRole">确 定</el-button>
                <el-button @click="addDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!--修改角色-->
        <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="30%">
            <el-form
                    :model="editRoleForm"
                    ref="editRoleFormRef"
                    :label-width="formLableWidth"
                    class="demo-ruleForm"
            >
                <el-form-item label="角色名称">
                    <el-input v-model="editRoleForm.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editRole">确 定</el-button>
                <el-button @click="editDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                formLableWidth:"",
                addDialogVisible: false,//新增弹出框
                editDialogVisible: false,//修改弹出框
                authorizationDialogVisible: false,//授权弹出框
                pageNum: 1,
                pageSize: 5,
                account: "", // 搜索框&表单角色名称
                managerList: [], // 表单数据
                total: 0,
                roleData:[],
                //新增弹框数据
                addManagerForm: {
                    account: "",
                    password: "",
                    telephone: "",
                    roleData:[]
                },
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
                    repassword: [
                        { required: true, message: "请确认密码", trigger: "blur" },
                        { validator: this.validatePassword, trigger: "blur" }
                    ],
                    telephone: [
                        {required: true, message: "手机号码必填", trigger: "blur"}
                    ]
                },
                //修改弹框数据
                editRoleForm: {
                    id: -1,
                    name: ""
                },
                //授权弹框数据
                authorizationForm: {
                    id: "",
                    name: "",
                    permissionData: [] //选择的权限数据
                },
                //授权弹框
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                defaultPermissionCheck:[],//默认权限选中
            };
        },
        methods: {

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
                this.$axios.get("/manager/all", {
                    params: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        name: this.account
                    }
                }).then(res => {
                    console.log("", res);
                    this.total = res.data.total;
                    this.managerList = res.data.records;
                })
            },

            // 删除角色信息
            removeRoleById(id) {
                this.$confirm('是否真的删除这条数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete('/role/delete/' + id).then(res => {
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

            //新增弹框
            async showAddDialog(row) {
                this.addDialogVisible = true;
                this.addRoleForm = false;
                await this.searchRoleData();//查询所有的角色数据
            },
            //查询所有的角色数据
            async searchRoleData(){
                await new Promise((resolve,reject)=>{
                    this.$axios.get('/role/all').then(res=>{
                        if(res.code == 200){
                            this.roleData = res.data;
                        }else{
                            this.$message.error(res.msg);
                        }
                        resolve(true);//表示异步方法执行完成
                    })
                })
            },
            //修改弹框
            showEditDialog(row) {
                this.editDialogVisible = true;//显示弹窗
                let str = JSON.stringify(row);
                this.editRoleForm = JSON.parse(str);//将信息赋给editRoleForm
            },

            //提交修改
            editRole() {
                this.$axios.post('/role/update', this.editRoleForm).then(res => {
                    if (res.code == 200) {
                        this.$message.success("修改成功");
                        this.editDialogVisible = false;
                        this.getManagerList();//重新请求数据，刷新数据列表
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },
            //提交新增
            addRole() {
                this.$axios.post('/role/add', this.addRoleForm).then(res => {
                    if (res.code == 200) {
                        this.$message.success("新增成功");
                        this.addDialogVisible = false;
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
            this.searchRole();
        }
    };
</script>
<style lang="less" scoped>
</style>