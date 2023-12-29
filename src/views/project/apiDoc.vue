<template>
	<el-container>
		<el-aside width="300px" v-loading="showGrouploading">
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
				<el-main>
					<el-card v-loading="showCardLoading">
						<template #header>
							<div class="doc-header">
								<div class="flex-x-space">
									<div>
										<span>{{apiDoc.summary}}</span>
									</div>
									<div>
										<el-button class="button" text>当前版本号 v {{apiDoc.version}}</el-button>
									</div>
								</div>
								<div>
									<span style="font-size: xx-small;">最新修改时间{{apiDoc.updateTime ? apiDoc.updateTime : apiDoc.createTime}}</span>
								</div>
							</div>
						</template>
						<div class="doc-item">
							<div class="doc-item-title">
								<span class="code-header">请求地址：</span>
								<el-tag style="margin-left: 10px;">{{ this.apiDoc.method }}</el-tag>
								<span style="color: blue; font-size: 16px; margin-left: 5px;">{{ this.apiDoc.url }}</span>
							</div>
							<div class="doc-item-content">
								
								
							</div>
						</div>

						<div v-if="apiDoc.requestHeaders" class="doc-item">
							<div class="doc-item-title">
								<span class="code-header">请求头</span>
							</div>
							<div class="doc-item-table">
								<el-table :data="apiDoc.requestHeaders" border stripe style="width: 100%">
									<el-table-column prop="key" label="key" />
									<el-table-column prop="value" label="值" />
									<el-table-column prop="description" label="描述" />
								</el-table>
							</div>
						</div>

						<div v-if="requestParam.length" class="doc-item">
							<div class="doc-item-title">
								<span class="code-header">请求参数</span>
							</div>
							<div class="doc-item-table">
								<el-table :data="requestParam" 
								row-key="name"
								border
								default-expand-all
								stripe 
								style="width: 100%">
									<el-table-column prop="name" label="参数" />
									<el-table-column prop="type" label="类型" />
									<el-table-column prop="required" label="是否必须" />
									<el-table-column prop="position" label="参数位置" />
									<el-table-column prop="version" label="版本" sortable />
									<el-table-column prop="operation" label="操作" sortable />
									<el-table-column prop="time" label="时间" sortable />
								</el-table>
							</div>
						</div>

						<div  v-if="requestBody.length" class="doc-item">
							<div class="doc-item-title">
								<span class="code-header">请求体: ContentType: {{ 'application/json' }}</span>
							</div>
							<div class="doc-item-table">
								<el-table
								:data="requestBody"
								style="width: 100%; margin-bottom: 20px"
								row-key="name"
								border
								default-expand-all
								>
									<el-table-column prop="name" label="名称"/>
									<el-table-column prop="type" label="类型"/>
									<el-table-column prop="description" label="描述" />
									<el-table-column prop="version" label="版本" />
									<el-table-column prop="operation" label="操作" />
									<el-table-column prop="time" label="时间" />
								</el-table>
							</div>
						</div>
						
						<div class="doc-item">
							<div class="doc-item-title code-header">响应体</div>
							<div class="doc-item-table">
								<el-table
								:data="responseBody"
								style="width: 100%; margin-bottom: 20px"
								row-key="name"
								border
								default-expand-all
								>
									<el-table-column prop="name" label="名称"  />
									<el-table-column prop="type" label="类型" />
									<el-table-column prop="description" label="描述"  />
									<el-table-column prop="version" label="版本"  />
									<el-table-column prop="operation" label="操作"  />
									<el-table-column prop="time" label="时间" />
								</el-table>
							</div>
						</div>

						<div class="doc-item">
							<div class="doc-item-title">
								<span class="code-header">错误码</span>
								<el-button style="margin-left:40px" size="small" type="primary" @click="showErrorCodeDrawer"> {{$t('project.add')}}</el-button>
							 </div>
							
							<div class="doc-item-table">
								<el-table :data="apiDoc.errorCodes" border stripe style="width: 100%">
									<el-table-column prop="date" label="码值" />
									<el-table-column prop="name" label="异常信息"/>
									<el-table-column prop="createTime" label="时间"/>
									<el-table-column prop="createUser" label="创建用户"/>
									<el-table-column prop="name" label="操作"/>
								</el-table>
							</div>
						</div>
					</el-card>
				</el-main>
		</el-container>
	</el-container>

	<el-drawer title="添加错误码" v-model="errorCodeDrawer">
		<el-container>
		<el-main>
			<el-row>
				<el-col :span="8" class="flex-center">
					<span class="code-header">码值</span>
				</el-col>
				<el-col :span="12" class="flex-center">
					<span class="code-header">码值信息</span>
				</el-col>
				<el-col :span="4" class="flex-center">
					<span class="code-header">操作</span>
				</el-col>
			</el-row>
			<el-row :gutter="10" v-for="item in addErrorCodes" :key="item.index" class="code-row">
				<el-col :span="8">
					<el-input v-model="item.code" placeholder="请输入码值"></el-input>
				</el-col>
				<el-col :span="12">
					<el-input v-model="item.message" placeholder="请输入异常信息"></el-input>
				</el-col>
				<el-col :span="4" class="flex-center">
					<el-icon size="24" class="flex-y-center">
						<el-icon-circle-plus v-if="item.index == 1" color="blue" @click="addCode"/>
						<el-icon-remove v-else color="red" @click="removeCode(item.index)"/>
					</el-icon>
		
				</el-col>
			</el-row>
		</el-main>
		<el-footer class="code-footer">
			<el-button type="danger">取消</el-button>
			<el-button type="success">保存</el-button>
		</el-footer>
	</el-container>
		

	</el-drawer>

</template>

<script>

	export default {
		name: 'apiDoc',
		data() {
			return {
				enableEdit: true,
				projectId: '',
				moduleId: '',
				catalogId: '',
				nodeKey: '',
				showCardLoading: false,
				apiDoc: {},
				requestParam: [],
				requestBody: [],
				responseBody: [],
				errorCodeDrawer: false,
				addErrorCodes: [],

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
				this.showCardLoading = true
				this.$API.project.doc.detail.get(this.nodeKey).then(res => {
					if (res.code == 0) {
						this.apiDoc = res.data
						this.convertParam()

					} else{
					this.$alert(res.message, "提示", {type: 'error'})
					}
					this.showCardLoading = false
				})
			},
			convertParam(){
				if(this.apiDoc.params.parameters && this.apiDoc.params.parameters.length > 0){
					let param = {
							name: 'request-parameters',
							description: '请求参数',
							type: 'key - value',
							version: this.apiDoc.version,
							time: this.apiDoc.updateTime ? this.apiDoc.updateTime : this.apiDoc.createTime,
							operation: 'top',
							position: '',
							required: '',
							children: []
					}
					this.convertParameter(this.apiDoc.params.parameters, param)
					this.requestParam.push(param)
				}

				if (this.apiDoc.params.requestBody) {
					let reqSchema = this.apiDoc.params.requestBody.content['application/json'].schema
					let request = {
							name: 'request-body',
							description: '请求体',
							type: reqSchema.type,
							version: this.apiDoc.version,
							time: this.apiDoc.updateTime ? this.apiDoc.updateTime : this.apiDoc.createTime,
							operation: 'top'
					}
					this.convertSchema(reqSchema, request)
					this.requestBody.push(request)
				}
				

				let respSchema = this.apiDoc.params.responses['200'].content['application/json'].schema
				let response = {
						name: 'response-body',
						description: '请求出参',
						type: respSchema.type,
						version: this.apiDoc.version,
						time: this.apiDoc.updateTime ? this.apiDoc.updateTime : this.apiDoc.createTime,
						operation: 'top'
				}
				this.convertSchema(respSchema, response)
				this.responseBody.push(response)
				console.log('request-parameters', this.requestParam)
				console.log('requestBody', this.requestBody)
				console.log('responseBody', this.responseBody)

			},
			// 转换参数
			convertParameter(parameters, param) {
				let childrens = []
				for(let parameter of parameters) {
					let childParam = {
						name: parameter.name,
						description: parameter.description,
						type: parameter.schema.type,
						version: parameter.extensions? parameter.extensions.version : '',
						time: parameter.extensions? parameter.extensions.time: '',
						position: parameter.in,
						required: parameter.required,
						operation: parameter.extensions? parameter.extensions.type: '',
					}
					childrens.push(childParam)
				}
				param.children = childrens
			},
			convertSchema(schema, item){
				if (schema.type == 'object') {
					this.iteratorChildProperties(schema, item)
				} else if (schema.type == 'array') {
					this.convertSchema(schema, item)
				}
			},
			iteratorChildProperties(schema, subItem) {
				if(schema && schema.properties && Object.keys(schema.properties)){
					console.log('item keys', Object.keys(schema.properties))
					let childrens = []
					Object.keys(schema.properties).forEach(key => {
						let childItem = {
							name: key,
							description: schema.properties[key].description,
							type: schema.properties[key].type,
							version: schema.properties[key].extensions ? schema.properties[key].extensions.version : '',
							time: schema.properties[key].extensions ? schema.properties[key].extensions.time : '',
							operation: schema.properties[key].extensions ? schema.properties[key].extensions.type : ''
						}
						this.iteratorChildProperties(schema.properties[key].items, childItem)
						childrens.push(childItem)
					})
					subItem.children = childrens
				}
			},
			// 展示错误码抽屉
			showErrorCodeDrawer(){
				this.addCode()
				this.errorCodeDrawer = true
			},
			//添加
			addCode(){
				this.addErrorCodes.push({
					index: this.addErrorCodes.length + 1,
				})

				// this.$nextTick(() => {
				// 	this.$refs.saveDialog.open()
				// })
			},
			removeCode(index){
				this.addErrorCodes = this.addErrorCodes.filter(item => item.index != index)
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
					
					this.selection.forEach(item => {
						this.$refs.table.tableData.forEach((itemI, indexI) => {
							if (item.id === itemI.id) {
								this.$refs.table.tableData.splice(indexI, 1)
							}
						})
					})
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
				if (data.type == 2 && data.id != this.nodeKey) {
					this.nodeKey = data.id;
					this.requestParam = []
					this.requestBody = []
					this.responseBody= []
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
.doc-item {margin-top: 20rpx;margin-bottom: 20rpx;}
.doc-item-title {margin-bottom: 10px;}
.code-header {font-size: 16px;font-weight: bold;}
.code-row {margin-top: 5px;margin-bottom: 5px;}
.code-footer {text-align: right;}
</style>
