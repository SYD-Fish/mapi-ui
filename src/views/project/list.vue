<template>
	<router-view></router-view>
	<el-main v-loading="loading">
		<el-row :gutter="15">	
			<el-col><el-text class="mx-3" size="large"><h1>项目列表</h1></el-text></el-col>
		</el-row>
		<el-row>
			<el-col><el-button type="primary" size="large" icon="el-icon-plus" @click="showCreateProject">{{$t('project.create')}}{{$t('project.project')}}</el-button></el-col>
		</el-row>
		<el-row :gutter="15">
			<el-col :xl="4" :lg="4" :md="6" :sm="8" :xs="12" v-for="item in list" :key="item.id">
				<el-card shadow="hover" :body-style="{ padding: '0px' }" @click="navProject(item.id, item.showName)">
					<div class="code-item">
						<!-- <div class="img" :style="{background: item.color}">
							<el-icon :style="`background-image: -webkit-linear-gradient(top left, #fff, ${item.color} 100px)`"><component :is="item.icon" /></el-icon>
						</div> -->
						<div class="title">
							<h2>{{item.showName}}</h2>
							<p>
                                {{ item.description }}
                                <el-tag v-if="!item.description" size="mini" type="primary">无描述</el-tag>
                            </p>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</el-main>
	<!-- create project -->
	<el-dialog v-model="dialogFormVisible" :title="$t('project.create')+$t('project.project')">
    <el-form :model="project">
      <el-form-item :label="$t('project.project')+$t('project.name')" :label-width="formLabelWidth">
        <el-input v-model="project.name" size="normal" />
      </el-form-item>
      <el-form-item :label="$t('project.description')" :label-width="formLabelWidth">
        <el-input v-model="project.description" size="normal" type="textarea" :rows="2"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="createProject">
			{{$t('common.confirm')}}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ElButton } from 'element-plus';

	export default {
    name: 'project-list',
    data() {
        return {
            loading: true,
            dialogFormVisible: false,
            formLabelWidth: '120px',
            project: {
                name: '',
                description: ''
            },
            list: []
        };
    },
    mounted() {
        setTimeout(() => {
            this.loading = false;
        }, 1000);
        this.listProject();
    },
    methods: {
        // 获取项目列表
        async listProject() {
            console.log('listProject tenant', this.$TOOL.data.get("ACCESS_TOKEN"));
            var param = { "params": {} };
            var headers = {
                'access_token': this.$TOOL.data.get("ACCESS_TOKEN")
            };
            //获取project 列表
            var res = await this.$API.project.project.list.post(param, headers);
            if (res.code == 0) {
                this.list = res.data;
            }
        },
        navProject(projectId, projectName) {
            const url = '/project/detail/' + projectId + "/" + projectName;
            console.log('url', url);
            this.$router.push({
                path: url,
            });
        },
        // show create project
        showCreateProject() {
            console.log('show create Project');
            this.dialogFormVisible = true;
        },
        closeCreateProject() {
            this.dialogFormVisible = false;
        },
        // 创建项目
        async createProject() {
            console.log('createProject', this.project);
            var param = { 
                    showName: this.project.name,
                    description: this.project.description,
                };
            var headers = {
                access_token: this.$TOOL.data.get("ACCESS_TOKEN"),
            };
            //创建项目
            var res = await this.$API.project.project.create.post(param, headers);
            console.log('res', res);
            if (res.code == 0) {
                this.$message.success(res.data.showName + '项目创建成功');
                this.list.push(res.data);
                this.closeCreateProject();
            }
            else {
                this.$message.error('项目创建失败:' + res.msg);
            }
        }
    },
    components: { ElButton }
}
</script>

<style scoped>
	.el-row {margin-bottom: 20px;}
	.el-card {margin-bottom: 15px;}
	.code-item {cursor: pointer;}
	.code-item .img {width: 100%;height: 150px;background: #09f;display:flex;align-items: center;justify-content: center;}
	.code-item .img i {font-size: 100px;color: #fff;background-image: -webkit-linear-gradient(top left, #fff, #09f 100px);-webkit-background-clip: text;-webkit-text-fill-color: transparent;}
	.code-item .title {padding:15px; height: 100px;}
	.code-item .title h2 {font-size: 16px;}
	.code-item .title h4 {font-size: 12px;color: #999;font-weight: normal;margin-top: 5px;}
	.code-item .title p {margin-top: 15px;}
</style>
