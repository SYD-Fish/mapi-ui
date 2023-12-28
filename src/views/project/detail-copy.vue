<template>
	<router-view></router-view>
    <el-container>
        <el-header class="flex-x-space">
            <div>
                <el-text class="project-name" type="primary">{{ $route.params.projectName}}</el-text>
            </div>
            <div class="flex-center">
                <div class="header-item" style="margin-right: 20px;">
                    <el-button type="primary" icon="el-icon-upload" @click="importData">
                        导入
                    </el-button>
                </div>
                <div>
                    <el-button type="primary" icon="el-icon-refresh" @click="refreshData">
                        刷新
                    </el-button>
                </div>
                <div></div>
            </div>


        </el-header>
        <el-container>
            <el-aside class="aside">
                <el-row>
                    <el-col>
                        <el-menu
                            :default-active="activeEnvironmentId"
                            class="env-list"
                        >
                            <el-menu-item class="flex-y-center" v-for="item in envList" :key="item.environmentId" :index="item.environmentId" @click="changeEnv(item.environmentId)"> 
                                <el-row style="width: 100%;">
                                    <el-col :span="6">
                                        <el-icon v-if="activeEnvironmentId === item.environmentId"><el-icon-place color="orange"/></el-icon>
                                    </el-col>
                                    <el-col :span="18">
                                        <span>{{item.environmentName}}</span>
                                    </el-col>
                                </el-row>
                                
                            </el-menu-item>
                        </el-menu>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col class="flex-center">
                        <el-button type="primary" size="large" icon="el-icon-plus" @click="showCreateEnv">
                            {{$t('project.create')}}{{ $t('project.env') }}
                        </el-button>
                    </el-col>
                </el-row>
            </el-aside>
            <el-main>
                <el-row :gutter="15">
                    <el-col :xl="4" :lg="4" :md="6" :sm="8" :xs="12">
                        <el-card class="flex-center"  style="background-color: aqua;" shadow="hover" :body-style="{ padding: '0px',}" @click="showCreateDataSheet()">
                            <div class="code-item">
                                <div class="flex-center">
                                    <el-icon style="font-size: 36px;"><el-icon-plus color="orange"/></el-icon>
                                </div>
                                <div class="">
                                    <h2>创建数据集</h2>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="24" v-for="item in dataSheets" :key="item.dataSheetId">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }" @click="navProject(item.dataSheetId, item.dataSheetName)">
                            <div class="code-item">
                                <!-- <div class="img" :style="{background: item.color}">
                                    <el-icon :style="`background-image: -webkit-linear-gradient(top left, #fff, ${item.color} 100px)`"><component :is="item.icon" /></el-icon>
                                </div> -->
                                <div class="title">
                                    <h2>{{item.dataSheetName}}</h2>
                                    <p>
                                        <el-tag :type="item.status? '' : 'danger'">{{item.status ? '启用中' : '禁用'}}</el-tag>
                                        <el-tag :type="item.status? '' : 'danger'" style="margin-left: 10px;">普通项目</el-tag>
                                    </p>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

            </el-main>
        </el-container>
    </el-container>

    <!-- create environment -->
	<el-dialog v-model="dialogFormVisible" :title="$t('project.create')+$t('project.env')">
    <el-form :model="environment">
      <el-form-item :label="$t('project.env')+$t('project.name')" :label-width="formLabelWidth">
        <el-input v-model="environment.environmentName" size="large" />
      </el-form-item>
      <el-form-item :label="$t('project.project')+$t('project.name')" :label-width="formLabelWidth">
        <el-input v-model="environment.projectName" size="large" disabled/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="createEnv">
			{{$t('common.confirm')}}
        </el-button>
      </span>
    </template>
    </el-dialog>

    <!-- create data sheet -->
	<el-dialog v-model="showDataSheetDialog" :title="$t('project.create')+$t('project.dataSheet')">
    <el-form :model="dataSheet">
      <el-form-item :label="$t('project.dataSheet')+$t('project.name')" :label-width="formLabelWidth">
        <el-input v-model="dataSheet.dataSheetName" size="normal" />
      </el-form-item>
      <el-form-item :label="$t('project.project')+$t('project.name')" :label-width="formLabelWidth">
        <el-input v-model="environment.projectName" size="normal" disabled/>
      </el-form-item>
      <el-form-item :label="$t('project.env')+$t('project.name')" :label-width="formLabelWidth">
        <el-input v-model="activeEnvironmentName" size="normal" disabled/>
      </el-form-item>
      <el-form-item :label="$t('project.prompt')" :label-width="formLabelWidth">
        <el-input v-model="dataSheet.prompt" size="normal" type="textarea" :rows="2"/>
      </el-form-item>
      <el-form-item :label="'数据类型'"  :label-width="formLabelWidth">
        <el-radio-group v-model="dataSheet.dataType">
            <el-radio :label="1">json数据</el-radio>
            <el-radio :label="2" disabled>文档</el-radio>
            <el-radio :label="3" disabled>链接</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="'数据来源'"  :label-width="formLabelWidth">
        <el-radio-group v-model="dataSheet.dataSourceType">
            <el-radio :label="1">excel文档</el-radio>
            <el-radio :label="2">链接</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="dataSheet.dataSourceType == 1" :label="'上传文档'"  :label-width="formLabelWidth">
        
      </el-form-item>
      <el-form-item v-if="dataSheet.dataSourceType == 2" :label="'链接地址'"  :label-width="formLabelWidth">
        <el-input v-model="dataSheet.linkAddr" size="normal" />
      </el-form-item>
      
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDataSheetDialog = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="createDataSheet">
			{{$t('common.confirm')}}
        </el-button>
      </span>
    </template>
    </el-dialog>
</template>

<script>
import { ElCol } from 'element-plus';

    export default {
    name: 'project-detail',
    data() {
        return {
            projectId: '',
            projectName: '',
            activeEnvironmentId: '',
            activeEnvironmentName: '',
            envList: [],
            dialogFormVisible: false,
            environment: {
                environmentName: '',
                projectName: '',
                projectId: ''
            },
            formLabelWidth: '100px',
            dataSheets: [],
            showDataSheetDialog: false,
            dataSheet: {
                dataSheetName: '',
                projectId: '',
                environmentId: '',
                prompt: '',
                dataType: 1,
                dataSourceType: ''
            }
        };
    },
    mounted() {
        console.log('project-detail', this.$route);
        this.projectId = this.$route.params.projectId;
        this.projectName = this.$route.params.projectName;
        this.listEnv();
    },
    methods: {
        // 获取环境列表
        async listEnv() {
            var param = { "params": { projectId: this.$route.params.projectId } };
            var headers = {
                tenant: this.$TOOL.data.get("TENANT")
            };
            //获取project 列表
            var res = await this.$API.project.env.list.post(param, headers);
            if (res.code == 0 && res.data.length > 0) {
                this.envList = res.data;
                this.activeEnvironmentId = this.envList[0].environmentId;
                this.activeEnvironmentName = this.envList[0].environmentName;
                this.listDataSheets();
            }
        },
        // 展示创建环境
        showCreateEnv() {
            this.dialogFormVisible = true;
        },
        // 创建环境
        async createEnv() {
            console.log('createEnv', this.environment);
            if (this.environment.environmentName == '') {
                this.$message({
                    message: '请输入环境名称',
                    type: 'warning'
                });
                return;
            }
            var param = { "params": this.environment };
            var headers = {
                tenant: this.$TOOL.data.get("TENANT")
            };
            var res = await this.$API.project.env.create.post(param, headers);
            if (res.code == 0) {
                this.envList.push(res.data);
                if (this.envList.length == 1) {
                    this.activeEnvironmentId = res.data.environmentId;
                    this.activeEnvironmentName = res.data.environmentName;
                }
            }
            this.dialogFormVisible = false;
        },
        // 切换环境
        changeEnv(environmentId) {
            this.activeEnvironmentId = environmentId;
            this.activeEnvironmentName = this.envList.find(item => item.environmentId == environmentId).environmentName;
            this.listDataSheets();
        },
        // 数据集列表
        async listDataSheets() {
            var param = { "params": { projectId: this.$route.params.projectId, environmentId: this.activeEnvironmentId } };
            var headers = {
                tenant: this.$TOOL.data.get("TENANT")
            };
            var res = await this.$API.project.dataSheet.list.post(param, headers);
            if (res.code == 0 && res.data.length > 0) {
                this.dataSheets = res.data;
            }
        },
        // 展示创建数据集
        showCreateDataSheet() {
            this.showDataSheetDialog = true;
            this.dataSheet.projectId = this.$route.params.projectId;
            this.dataSheet.environmentId = this.activeEnvironmentId;
        },
        // 创建数据集
        async createDataSheet() {
            if (this.dataSheet.dataSheetName == '') {
                this.$message({
                    message: '请输入数据集名称',
                    type: 'warning'
                });
                return;
            }
            var param = { "params": this.dataSheet };
            var headers = {
                tenant: this.$TOOL.data.get("TENANT")
            };
            var res = await this.$API.project.dataSheet.create.post(param, headers);
            if (res.code == 0) {
                this.dataSheets.push(res.data);
                this.showDataSheetDialog = false;
            } else {
                this.$message({
                    message: res.msg,
                    type: 'danger'
                });
                return;
            }
            
        }
    },
    components: { ElCol }
}
</script>

<style scoped>
.header-item { margin-right: 20px;}
.aside { width:200px }
.aside .el-row {
    margin-bottom: 30px;
}
.project-name {
    font-size: 20px;
    font-weight: bold;
}
.aside .env {
    font-size: 16px;
}
.aside .env-list {
    width: 100%;
    border: 1px solid #eee;
    border-radius: 4px;
}
.code-item {padding:15px;}
</style>