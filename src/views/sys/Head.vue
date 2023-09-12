<template>
    <el-container class="home-container">
        <el-header>
            <el-row>
                <el-col :span="2">
                    <a href="/home" style="font-size: 22px; line-height: 60px; text-align: center; color: #FFFFFF; text-decoration: none;">后台管理系统</a>
                </el-col>
                <el-col :span="21" style="margin-left: 20px">
                    <div>
                        <el-button icon="el-icon-menu" size="mini" @click="toggleClapse"></el-button>
                    </div>
                </el-col>
                <el-col :span="1">
                    <!--   头像下拉菜单 -->
                    <el-dropdown trigger="click">
                        <div class="circle">
                            <el-avatar>
                                <img src="../../assets/aa.png" alt="">
                            </el-avatar>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-plus">我的</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-circle-plus-outline">消息</el-dropdown-item>
                            <el-dropdown-item icon="el-icon-check">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-header>



        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#ffd04b"
                        router
                        unique-opened
                        :collapse="isCollapse"
                        :collapse-transition="false">

                    <el-submenu :index="p.id + ''" v-for="p in menuList" :key="p.id">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{p.name}}</span>
                        </template>
                        <el-menu-item
                                :index="children.url+''"
                                v-for="children in p.children"
                                :key="children.id">

                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{children.name}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>
            <el-main>
                <router-view v-if="isRouterAlive"/>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import urlPermission from '@/api/urlPermission'

    export default {
        data() {
            return {
                menuList: [],
                isCollapse: false,
                isRouterAlive: true,
                currentAccount: ''
            };
        },
        methods: {
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(function () {
                    this.isRouterAlive = true;
                });
            },
            toggleClapse() {
                this.isCollapse = !this.isCollapse;
            },
            logout() {
                window.sessionStorage.clear();
                this.$router.push("/Login");
            },
            loadMenus() {


                let managerId = localStorage.getItem("id")
                urlPermission.findPermission(managerId).then(res => {
                    this.menuList = res.data;
                })
            }
        },
        created() {
            this.loadMenus();
            this.currentAccount = localStorage.getItem("currentUser");
        }
    };
</script>
<style lang="less" scoped>
    .el-header {
        background-color: #373d41;
        /*position:fixed;*/

        > div {
            display: flex;
            align-items: center;

            span {
                margin-left: 14px;
            }
        }
    }

    .el-aside {
        background-color: #333744;
        height: 94vh;
        /*position:fixed;*/
        .el-menu {
            border-right: 0;
        }
    }

</style>