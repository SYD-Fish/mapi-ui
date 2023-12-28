<template>
	<el-container>
        <el-menu
                :default-active="moduleId"
                class="el-menu-header"
                mode="horizontal"
                @select="handleSelectModule"
            >
            <el-menu-item v-for="item in modules" :key="item.id" :index="item.id">
                {{item.name}}
                <el-divider direction="vertical" />
            </el-menu-item>
            <el-button text type="warning" size="small" icon="el-icon-edit" @click="editModule">编辑选中模块</el-button>
        </el-menu>
        <!-- <el-divider>
            <el-icon><el-icon-star-filled /></el-icon>
        </el-divider> -->
        
        <!-- <el-header>
            <el-menu
                :default-active="moduleId"
                class="el-menu-header"
                mode="horizontal"
                @select="handleSelectModule"
            >
                <el-menu-item index="1">module1</el-menu-item>
                <el-divider direction="vertical" />
                <el-menu-item index="3">module2</el-menu-item>
                <el-divider direction="vertical" />
                <el-menu-item index="4">module3</el-menu-item>
            </el-menu>
            
        </el-header> -->

        <el-header>
			<div class="left-panel">
				<el-button type="primary" size="mini" icon="el-icon-plus" @click="add">新建</el-button>
				<el-button type="danger" size="mini" plain icon="el-icon-delete" :disabled="selection.length==0" @click="batch_del">删除</el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="search.keyword" placeholder="部门名称" clearable></el-input>
					<el-button type="primary" size="mini" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div>
		</el-header>

        <el-main class="nopadding">

        <scTable ref="table" :data="apiDocs" row-key="id" @selection-change="selectionChange" hidePagination>
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column label="API文档" prop="label" width="250"></el-table-column>
            <el-table-column label="URL" prop="path" width="250">
                <template #default="scope">
                    <div v-if="scope.row.path" >
                        <!-- <el-tag type="success">{{scope.row.path[0]}}</el-tag> -->
                        <el-link type="success"  @click="navigatorApiDoc(scope.row)">{{ scope.row.path[0] }}</el-link>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="版本" prop="version" width="80"></el-table-column>
            <el-table-column label="状态" prop="enable" width="80">
                <template #default="scope">
                    <el-tag v-if="scope.row.enable==1" type="success">启用</el-tag>
                    <el-tag v-if="scope.row.enable==0" type="danger">停用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="160"></el-table-column>
            <el-table-column label="修改时间" prop="updateTime" width="160"></el-table-column>
            <el-table-column label="操作" fixed="right" align="center">
                <template #default="scope">
                    <el-button-group>
                        <el-button text type="primary" size="small" @click="table_show(scope.row, scope.$index)">查看</el-button>
                        <el-button text type="primary" size="small" @click="table_edit(scope.row, scope.$index)">编辑</el-button>
                        <el-popconfirm title="确定删除吗？" @confirm="table_del(scope.row, scope.$index)">
                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </el-button-group>
                </template>
            </el-table-column>

        </scTable>
    </el-main>


		
	</el-container>
    
</template>

<script>
	export default {
		data() {
			return {
                projectId: null,
                moduleId: null,
                modules: [],
                apiDocs: [],
				selection: [],
				search: {
					keyword: null
				}
			}
		},
        mounted() {
            console.log('mounted module')
			this.loadModules();
		},
        methods: {
            loadModules() {
                this.projectId = this.$TOOL.data.get('projectId');
                let param = {
                    "projectId": this.projectId
                }
                this.$API.module.module.list.post(param).then(res => {
                    if (res.code == 0) {
                        this.modules = res.data;
                        this.moduleId = this.modules[0].id;
                        this.loadApiDocs();
                    }
                })

            },
            loadApiDocs() {
                let param = {
                    "moduleId": this.moduleId
                }
                this.$API.module.module.detail.post(param).then(res => {
                    if (res.code == 0) {
                        this.apiDocs = res.data;
                    }
                })
            },
            handleSelectModule(index) {
                console.log('handleSelectModule', index)
                this.moduleId = index;
                this.loadApiDocs();
            },
            //添加
			add(){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open()
				})
			},
			//编辑
			table_edit(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('edit').setData(row)
				})
			},
			//查看
			table_show(row){
				this.dialog.save = true
				this.$nextTick(() => {
					this.$refs.saveDialog.open('show').setData(row)
				})
			},
			//删除
			async table_del(row){
				var reqData = {id: row.id}
				var res = await this.$API.demo.post.post(reqData);
				if(res.code == 200){
					this.$refs.table.refresh()
					this.$message.success("删除成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？如果删除项中含有子集将会被一并删除`, '提示', {
					type: 'warning'
				}).then(() => {
					const loading = this.$loading();
					this.$refs.table.refresh()
					loading.close();
					this.$message.success("操作成功")
				}).catch(() => {

				})
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//搜索
			upsearch(){

			},
			//根据ID获取树结构
			filterTree(id){
				var target = null;
				function filter(tree){
					tree.forEach(item => {
						if(item.id == id){
							target = item
						}
						if(item.children){
							filter(item.children)
						}
					})
				}
				filter(this.$refs.table.tableData)
				return target
			},
			//本地更新数据
			handleSaveSuccess(data, mode){
				if(mode=='add'){
					this.$refs.table.refresh()
				}else if(mode=='edit'){
					this.$refs.table.refresh()
				}
			},
            navigatorApiDoc(row) {
                console.log('navigatorApiDoc', row)
                this.$router.push({
                    path: '/project/doc',
                    query: {
                        projectId: this.projectId,
                        moduleId: this.moduleId,
                        catalogId: row.catalogId,
                        apiDocId: row.id
                    }
                })
            }
        }
	}
</script>

<style>
.el-menu-header {}
</style>
