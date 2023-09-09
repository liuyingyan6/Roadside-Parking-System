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
                        <el-form-item label="车牌号">
                            <el-input v-model="param.name" placeholder="请输入巡检员名称"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码">
                            <el-input v-model="param.phone" placeholder="手机号码"></el-input>
                        </el-form-item>
                        <el-form-item label="管理路段">
                            <el-input v-model="param.roadName" placeholder="管理路段"></el-input>
                        </el-form-item>
                        <el-button type="primary" icon="el-icon-search" plain @click="findPage">查询</el-button>
                        <el-button type="primary" icon="el-icon-plus" plain @click="showDialog()">添加</el-button>
                        <el-button @click="replacement()" type="info" plain icon="el-icon-refresh">重置</el-button>
                    </el-form>

                </el-row>

                <!-- 表格 data：要绑定的数据  handleSelectionChange 多选的方法 -->
                <el-table
                        ref="multipleTable"
                        :data="tableData.list"
                        tooltip-effect="dark"
                        style="width: 100%;text-align: center;font-size: 18px"
                        @selection-change="handleSelectionChange">

                    <!-- 复选框 -->
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="巡检员名称"
                            width="120">
                    </el-table-column>
                    <!-- 数据列 prop属性名 label显示列名  -->
                    <el-table-column
                            prop="phone"
                            label="手机号码"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="inspectorRoadVO"
                            label="管理路段"
                            width="120">
                        <template slot-scope="scope">
                           <span v-for="(road, index) in scope.row.inspectorRoadVO" :key="index">
                                {{ road.roadName }}
                               <span v-if="index !== scope.row.inspectorRoadVO.length - 1">,</span>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="timePeriod"
                            label="执勤时间"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="orderPercentage"
                            label="订单完成率"
                            width="120">
                    </el-table-column>

                    <el-table-column
                            prop="state"
                            label="状态"
                            width="100">
                        <template slot-scope="scope">
                            <el-tag
                                    :type="scope.row.state === 1 ? 'success' : 'primary'"
                                    disable-transitions>{{scope.row.state == 1 ? "正常" : "禁用"}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="创建时间"
                            width="200">
                        <template slot-scope="scope">{{ scope.row.createTime }}</template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button-group>
                                <el-button
                                        type="primary" icon="el-icon-view" plain
                                        @click="handleView(scope.$index,scope.row)">详情
                                </el-button>
                                <el-button
                                        type="success" icon="el-icon-edit" plain
                                        @click="handleEdit(scope.$index,scope.row)">编辑
                                </el-button>
                                <el-button
                                        type="danger" icon="el-icon-circle-close" plain
                                        @click="handleDelete(scope.$index, scope.row)">删除
                                </el-button>
                                <el-button
                                        plain :type="scope.row.state === 1 ? 'danger' : 'success'"
                                        @click="removeRoleById(scope.row)">{{scope.row.state == 1 ? "禁用" : "恢复" }}
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
                               :total="tableData.total">
                </el-pagination>
            </el-card>
        </el-row>

        <!-- 添加和修改的对话框 -->
        <el-dialog title="巡检员管理" :visible.sync="dialogFormVisible" width="500px">
            <!--添加表单-->
            <el-form label-width="120px" :model="form">

                <el-form-item label="巡检员名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                    <el-input v-model="form.phone" autocomplete="off" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" :label-width="formLabelWidth" prop="phone">
                    <el-input v-model="form.password" autocomplete="off" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="管辖区域" :label-width="formLabelWidth" prop="inspectorRoadVO">
                    <template v-for="road in form.inspectorRoadVO">
                        <el-tag :key="road.tag" closable @close="handleClose(road.tag)">
                            {{ road.roadName }}
                        </el-tag>
                    </template>
                    <el-autocomplete
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="roadName"
                            ref="saveRoadName"
                            :suggestions="roads"
                            :fetch-suggestions="querySearchAsync"
                            :value-key="'name'"
                            @keyup.enter.native="handleInputConfirm">
                    </el-autocomplete>
                    <el-button
                            v-if="roadNames.length < 2"
                            size="small"
                            @click="showInput">+
                    </el-button>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth" prop="state">
                    <el-switch
                            style=""
                            v-model="form.state"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="正常"
                            inactive-text="禁用"
                            :active-value=1
                            :inactive-value=0>
                    </el-switch>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
                <el-button type="danger" @click="resetForm()">返回</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import inspector from '@/api/staffSys/inspector'
    import user from "@/api/user";
    import road from "@/api/road/road";

    export default {
        data() {
            return {
                roadName: '',
                roads: [],
                roadNames: [],
                inputVisible: false,
                //提交的表单
                form: {},
                //添加的显示
                dialogFormVisible: false,
                //添加的宽度
                formLabelWidth: '120px',
                //分页查询提交的参数
                param: {},
                //显示的属性
                tableData: {},
                //复选框
                multipleSelection: [],
                pageNum: 1,
                pageSize: 5
            }
        },
        methods: {
            querySearchAsync(roadName, cb) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.findRoadAll(roadName);
                    cb(this.roads);
                }, 500); // 调整延迟时间
            },
            //添加路段
            showInput() {
                this.inputVisible = true;
                this.$nextTick(() => {
                    this.$refs.saveRoadName.$refs.reference.$refs.input.focus();
                });
            },
            //添加路段
            handleInputConfirm() {
                // 将选中的路段添加到 inspectorRoadVO 数组中
                debugger
                //const selectedRoad = this.roads.find(r => {r.name == this.roadName});
                for (const r of this.roads) {
                    if(r.name = this.roadName) {
                        alert(this.form.inspectorRoadVO);
                        this.form.inspectorRoadVO.push(r);
                    }
                }
                console.log("selectedRoad:",selectedRoad);
                if (selectedRoad) {
                    this.form.inspectorRoadVO.push(selectedRoad);
                }
                // 清空输入框和搜索结果
                this.roadName = '';
                this.roads = [];
                this.inputVisible = false;
            },
            //删除管理路段
            handleClose(tag) {
                this.roadNames.splice(this.roadNames.indexOf(tag), 1);
            },
            //禁用
            removeRoleById(row) {
                this.$confirm('是否真的禁用该用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    user.removeRoleById(row).then(res => {
                        console.log(res)
                        if (res.data == 0) {
                            this.$message.error("禁用成功");

                        } else {
                            this.$message.success("恢复成功");

                        }
                        this.findPage();// 刷新表单数据
                    })
                });
            },
            //重置
            replacement() {
                this.pageNum = 1;
                this.pageSize = 5;
                this.findPage();
            },
            //分页查询所有业主
            findPage() {
                inspector.findPage(this.pageNum, this.pageSize, this.param).then(resp => {
                    this.tableData = resp.data;
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
            },
            //删除
            handleDelete(index, row) {
                this.$confirm(`此操作将删除${row.typeName}, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //调用后台服务器删除
                    axios.delete(`/car/${row.id}`).then(resp => {
                        let result = resp.data;
                        if (result.code === 1) {
                            this.$message.success(result.message);
                        } else {
                            this.$message.error(result.message);
                        }
                    }).finally(() => {
                        //重新加载一次表格的数据
                        this.findPage();
                    });
                })
            },
            //查看显示的对话框
            handleView(index, row) {
                this.dialogFormVisible = true;
                this.form = row;
            },
            //显示添加的对话框
            showDialog() {
                this.form = {
                    state: 1,
                    inspectorRoadVO:[]
                }
                this.dialogFormVisible = true;
            },
            //编辑
            handleEdit(index, row) {
                this.dialogFormVisible = true;
                let str = JSON.stringify(row);
                this.form = JSON.parse(str);
                this.roadNames = this.form.inspectorRoadVO
            },
            //取消显示的对话框
            resetForm() {
                this.dialogFormVisible = false;
            },
            //确定按钮
            saveOrUpdate() {
            },
            findRoadAll(roadName) {
                if(roadName) {
                    road.findAllByRoadName(roadName).then(res => {
                        this.roads = res.data
                    })
                }
            },
        },
        created() {
            this.findPage()
        }
    };
</script>
<style lang="less" scoped>

</style>
