<template>
    <div>

        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>


        <el-card>

            <!--搜索框&添加按钮-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输角色名称" clearable v-model="name" @clear="searchRole">
                        <el-button slot="append" icon="el-icon-search" @click="searchRole"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
                </el-col>
            </el-row>

            <!--信息表单-->
            <el-table :data="roleList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" @click="showAuthorizationDialog(scope.row)">分配权限</el-button>
                        <el-button type="primary" size="mini" @click="showEditDialog(scope.row)">修改</el-button>
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
                    :model="addRoleForm"
                    ref="addRoleFormRef"
                    :label-width="formLableWidth"
                    class="demo-ruleForm"
            >
                <el-form-item label="角色名称">
                    <el-input v-model="addRoleForm.name"></el-input>
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

        <!--角色授权-->
        <el-dialog title="角色授权" :visible.sync="authorizationDialogVisible" width="30%">
            <el-form
                    :model="authorizationForm"
                    :label-width="formLableWidth"
                    class="demo-ruleForm"
            >

                <el-form-item label="角色名称">
                    <el-input v-model="authorizationForm.name" disabled></el-input>
                </el-form-item>

                <el-form-item label="权限数据">
                    <el-tree
                            :data="permissionData"
                            show-checkbox
                            ref="permissionTree"
                            node-key="id"
                            default-expand-all
                            :default-checked-keys="defaultPermissionCheck"
                            :props="defaultProps">
                    </el-tree>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="roleAuthorization()">确 定</el-button>
                <el-button @click="authorizationDialogVisible = false">取 消</el-button>
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
                name: "", // 搜索框&表单角色名称
                roleList: [], // 表单数据
                total: 0,
                //新增弹框数据
                addRoleForm: {
                    name: "",
                    code: ""
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
                permissionData:[],
                defaultPermissionCheck:[],//默认权限选中
            };
        },
        methods: {

            // 分页加载表单数据&查询
            getRoleList() {
                //分页查询，给：roleList  total 赋值
                //后端需要：pageSize pageNum 查询条件name
                this.$axios.get("/role/findAll2Page", {
                    params: {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        name: this.name
                    }
                }).then(res => {
                    console.log("", res);
                    this.total = res.data.total;
                    this.roleList = res.data.records;
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
                            this.getRoleList();// 刷新表单数据
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                }).catch(() => {
                    this.$message.info("已取消删除");
                });
            },

            //新增弹框
            showAddDialog(row) {
                this.addDialogVisible = true;
                this.addRoleForm = false;
            },
            //修改弹框
            showEditDialog(row) {
                this.editDialogVisible = true;//显示弹窗
                let str = JSON.stringify(row);
                this.editRoleForm = JSON.parse(str);//将信息赋给editRoleForm
            },
            //授权弹框
            async showAuthorizationDialog(row){
                this.authorizationDialogVisible = true;//显示角色授权的弹出框
                let str = JSON.stringify(row);
                this.authorizationForm = JSON.parse(str);
                await this.searchPermissionData();//查询所有的权限数据
                await this.searchDefaultPermissionCheck(row.id);//根据角色ID查询已有的权限
            },
            //查询所有的权限数据
            async searchPermissionData(){
                await new Promise((resolve,reject)=>{
                    this.$axios.get('/urlPermission/all').then(res=>{
                        if(res.code == 200){
                            this.permissionData = res.data;
                        }else{
                            this.$message.error(res.msg);
                        }
                        resolve(true);//表示异步方法执行完成
                    })
                })
            },
            //根据角色ID查询默认的权限
            async searchDefaultPermissionCheck(id){
                await new Promise((resolve,reject)=>{
                    this.$axios.get('/roleUrlPermission/default/'+id).then(res=>{
                        if(res.code == 200){
                            this.defaultPermissionCheck = res.data;
                        }else{
                            this.$message.error(res.msg);
                        }
                        resolve(true);//表示异步方法执行完成
                    })
                })
            },

            //提交授权
            roleAuthorization(){
                //permissionData代表已有权限，默认选中
                this.authorizationForm.permissionData = this.$refs.permissionTree.getCheckedKeys();
                this.$axios.post('/roleUrlPermission/roleAuthorization',this.authorizationForm).then(res=>{
                    if(res.code == 200){
                        this.$message.success("权限分配成功");
                        this.authorizationDialogVisible = false;//关闭弹窗
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //提交修改
            editRole() {
                this.$axios.post('/role/update', this.editRoleForm).then(res => {
                    if (res.code == 200) {
                        this.$message.success("修改成功");
                        this.editDialogVisible = false;
                        this.getRoleList();//重新请求数据，刷新数据列表
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
                        this.getRoleList();//重新请求数据，刷新数据列表
                    } else {
                        this.$message.error(res.msg);
                    }
                })
            },

            searchRole() {
                this.pageNum = 1;
                this.pageSize = 5;
                this.getRoleList();
            },
            handleSizeChange(newSize) {
                this.pageSize = newSize;
                this.getRoleList();
            },
            handleCurrentChange(newPage) {
                this.pageNum = newPage;
                this.getRoleList();
            }


        },
        created() {
            this.searchRole();
        }
    };
</script>
<style lang="less" scoped>
</style>