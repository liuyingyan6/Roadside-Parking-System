<template>
  <div>
    <el-row :gutter="12">
      <el-card shadow="always">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>路段信息</el-breadcrumb-item>
          <el-breadcrumb-item>路段管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-card>
    </el-row>

    <el-row :gutter="12">
      <el-card>
        <el-form :inline="true" :model="param">
          <el-form-item>
            <el-input v-model="param.carNumber" placeholder="路段名称"></el-input>
            <el-input v-model="param.carNumber" placeholder="路段类型"></el-input>
            <el-input v-model="param.carNumber" placeholder="巡检员名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="findPage">查询</el-button>
            <el-button type="info" plain onclick="location.href='/index.html'">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card>
        <el-row>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="findPage">新建</el-button>
          </el-form-item>
        </el-row>

        <el-table :data="userList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="路段名称" prop="userName"></el-table-column>
          <el-table-column label="路段类型" prop="cellphone"></el-table-column>
          <el-table-column label="所属地区" prop="email"></el-table-column>
          <el-table-column label="泊位数量" prop="email"></el-table-column>
          <el-table-column label="限制泊位数" prop="email"></el-table-column>
          <el-table-column label="巡检员" prop="email"></el-table-column>
          <el-table-column label="运维人员" prop="email"></el-table-column>
          <el-table-column label="创建时间" prop="email"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="showEditDialog(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" onclick="location.href='/index.html'">泊位管理</el-button>
            </template>
          </el-table-column>

        </el-table>

        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5,10,15]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
      </el-card>
    </el-row>

    <!--修改用戶-->
    <el-dialog title="修改用戶" :visible.sync="editDialogVisible" width="50%" @close="editUserFormClose">
      <el-form :model="editUserForm"
               :rules="editUserFormRules"
               ref="editUserFormRef"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="用戶名" prop="userName">
          <el-input v-model="editUserForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="cellphone">
          <el-input v-model="editUserForm.cellphone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>

        <el-form-item label="角色">
          <el-select v-model="editUserForm.roleIds" multiple placeholder="请选择角色" style="width: 100%">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否锁定" prop="locked">
          <el-select v-model="editUserForm.locked" placeholder="请选择是否锁定账户">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editUser">确定</el-button>
        <el-button @click="editDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Road",
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      total: 0,
      userList: [],
      roleList: [], //系统中所有的角色
      addDialogVisible: false,
      editDialogVisible: false,
      userName: "",
      filterTag: "",
      addUserForm: {
        userName: "",
        userCode: "",
        userPassword: "",
        locked: "",
        roleIds: [],
        email: "",
        cellphone: "",
      },
      editUserForm: {
        id: -1,
        userCode: "",
        userName: "",
        locked: "",
        roleIds: [],
        email: "",
        cellphone: ""
      }
    };
  },
  methods: {
    //显示添加页面
    showAddDialog() {
      this.addDialogVisible = true;
      this.$refs.addUserFormRef.resetFields(); //清空表单
    },
    //显示修改页面
    showEditDialog(row) {
      this.editDialogVisible = true;
      this.editUserForm.id = row.id;
      this.editUserForm.userName = row.userName;
      this.editUserForm.cellphone = row.cellphone;
      this.editUserForm.email = row.email;
      this.editUserForm.locked = row.locked;
      //根据用户id查询角色ID
      this.queryRoleByUserId(row.id);
    },
    //查询所有角色
    queryRoleList() {
      this.$axios.get('/role/list').then(res => {
        console.log("", res);
        this.roleList = res.data.obj;
      })
    },
    //通过用户id查询角色
    queryRoleByUserId(userId) {
      this.$axios.get("/managerRole/role", {
        params: {
          userId: userId
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.editUserForm.roleIds = res.data.obj;
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    //添加用户
    addUser() {
      this.$axios.post('/manager/add', this.addUserForm).then(res => {
        if (res.data.code == 200) {
          this.$message.success("添加成功");
          this.addDialogVisible = false;
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    //退出添加
    addUserFormClose() {
      this.$refs.addUserFormRef.resetFields();
      this.addUserForm.deptId = "";
      this.addUserForm.roleIds = [];
    },
    //修改用户
    editUser() {
      this.$axios.post("/manager/updateManager", this.editUserForm).then(res => {
        if (res.data.code == 200) {
          this.editDialogVisible = false;
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    //退出修改
    editUserFormClose() {
      this.$refs.editUserFormRef.resetFields();
      this.editUserForm.deptId = "";
      this.editUserForm.roleIds = [];
    },
    async removeUserById(id) {

    },
    //查询用户
    searchUser() {
      this.$axios.get("/manager/managerList", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          mName: this.userName
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.userList = res.data.obj.records;
          this.pageNum = res.data.obj.current;
          this.pageSize = res.data.obj.size;
          this.total = res.data.obj.total;
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.searchUser();
    },
    handleCurrentChange(now) {
      this.pageNum = now;
      this.searchUser();
    },
    //把用户对象中包含的roleList其中的rolename转换为逗号分隔的字符串
    getRoleNames(arr) {
      if (!arr) return;
      let roleNameArr = new Array();
      for (let i = 0; i < arr.length; i++) {
        roleNameArr.push(arr[i].name);
      }
      return roleNameArr.join(",");
    }
  },
  created() {
    this.searchUser();
    this.queryRoleList();
  }
}
</script>

<style scoped>

</style>