<template>
	<el-container>
		<el-aside width="200px" v-loading="showGrouploading">
			<el-container>
				<el-header>
					<el-input placeholder="输入路径进行过滤" v-model="groupFilterText" clearable></el-input>
				</el-header>
				<el-main class="nopadding">
					<el-tree ref="group" class="menu" 
					node-key="id" 
					:data="group" 
					:current-node-key="nodeKey" 
					:default-expanded-keys="[nodeKey]"
					:highlight-current="true"
					:expand-on-click-node="false" 
					:filter-node-method="groupFilterNode"
					@node-click="groupClick"></el-tree>
				</el-main>
			</el-container>
		</el-aside>
		<el-container>
				<el-header>
					<h1>{{ this.apiDoc.summary }}</h1>
				</el-header>
				<el-main class="nopadding">
					<h2>{{ this.apiDoc.url }}</h2>
					<h2>{{ this.apiDoc.method }}</h2>
					<h2>header</h2>
					<h2>入参</h2>
					<h2>出参</h2>
					<h2>错误码</h2>
					
				</el-main>
		</el-container>
	</el-container>

	<save-dialog v-if="dialog.save" ref="saveDialog" @success="handleSuccess" @closed="dialog.save=false"></save-dialog>

</template>

<script>
	import saveDialog from './info/save'

	export default {
		name: 'user',
		components: {
			saveDialog
		},
		data() {
			return {
				projectId: '',
				moduleId: '',
				catalogId: '',
				nodeKey: '',
				apiDoc: {},

				dialog: {
					save: false
				},
				showGrouploading: false,
				groupFilterText: '',
				group: [],
				apiObj: this.$API.system.user.list,
				selection: [],
				search: {
					name: null
				}
			}
		},
		watch: {
			groupFilterText(val) {
				this.$refs.group.filter(val);
			}
		},
		created() {
			this.projectId = this.$route.query.projectId;
			this.moduleId = this.$route.query.moduleId;
			this.catalogId = this.$route.query.catalogId;
			this.nodeKey = this.$route.query.apiDocId;
			console.log('created node key is ' + this.nodeKey)
			this.queryApiDocDetail();

			// 根据需要进行后续操作
		},
		mounted() {
			
			this.getDocGroup()
			
		},
		methods: {
			// 查详情
			queryApiDocDetail() {
				this.$API.project.doc.detail.get(this.nodeKey).then(res => {
					if (res.code == 0) {
						this.apiDoc = res.data
					} else{
					this.$alert(res.message, "提示", {type: 'error'})
					}
				})
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
			async table_del(row, index){
				var reqData = {id: row.id}
				var res = await this.$API.demo.post.post(reqData);
				if(res.code == 200){
					//这里选择刷新整个表格 OR 插入/编辑现有表格数据
					this.$refs.table.tableData.splice(index, 1);
					this.$message.success("删除成功")
				}else{
					this.$alert(res.message, "提示", {type: 'error'})
				}
			},
			//批量删除
			async batch_del(){
				this.$confirm(`确定删除选中的 ${this.selection.length} 项吗？`, '提示', {
					type: 'warning'
				}).then(() => {
					const loading = this.$loading();
					this.selection.forEach(item => {
						this.$refs.table.tableData.forEach((itemI, indexI) => {
							if (item.id === itemI.id) {
								this.$refs.table.tableData.splice(indexI, 1)
							}
						})
					})
					loading.close();
					this.$message.success("操作成功")
				}).catch(() => {

				})
			},
			//表格选择后回调事件
			selectionChange(selection){
				this.selection = selection;
			},
			//加载树数据
			async getDocGroup(){
				this.showGrouploading = true;
				let param = {
                    "moduleId": this.moduleId
                }
                var res = await this.$API.module.module.detail.post(param)
				this.showGrouploading = false;
				var allNode ={id: '', label: '所有'}
				res.data.unshift(allNode);
				this.group = res.data;
			},
			//树过滤
			groupFilterNode(value, data){
				if (!value) return true;
				return data.label.indexOf(value) !== -1;
			},
			//树点击事件
			groupClick(data){
				console.log('groupClick', data)
				if (data.type == 2) {
					this.nodeKey = data.id
					this.queryApiDocDetail();
				}
				
			},
			//搜索
			upsearch(){
				this.$refs.table.upData(this.search)
			},
			//本地更新数据
			handleSuccess(data, mode){
				if(mode=='add'){
					data.id = new Date().getTime()
					this.$refs.table.tableData.unshift(data)
				}else if(mode=='edit'){
					this.$refs.table.tableData.filter(item => item.id===data.id ).forEach(item => {
						Object.assign(item, data)
					})
				}
			}
		}
	}
</script>

<style>
</style>
