<template>
	<el-container>
		<el-header>
			<div class="left-panel">
				<el-button type="primary" icon="el-icon-plus">新建</el-button>
				<el-button type="danger" plain icon="el-icon-delete">删除</el-button>
			</div>
			<div class="right-panel">
				<div class="right-panel-search">
					<el-input v-model="search.keyword" placeholder="关键词" clearable></el-input>
					<el-button type="primary" icon="el-icon-search" @click="upsearch"></el-button>
				</div>
			</div>
		</el-header>
		<el-main class="nopadding">
			<scTable ref="table" :data="headerDics" row-key="id" hidePagination>
				<el-table-column type="selection" width="50"></el-table-column>
				<el-table-column label="header_key" prop="headerKey" width="200"></el-table-column>
				<el-table-column label="header_value" prop="headerValue" width="200"></el-table-column>
				<el-table-column label="备注" prop="remark" width="200"></el-table-column>
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
	import scSelectFilter from '@/components/scSelectFilter'

	export default {
		name: 'listTab',
		components: {
			scSelectFilter
		},
		data() {
			return {
				headerDics: [],
				search: {
					keyword: ""
				}
			}
		},
        mounted() {
			this.loadHeaders();
		},
		methods: {
            loadHeaders() {
                this.$API.project.header.list.get( this.$TOOL.data.get("projectId")).then(res => {
                    if (res.code == 0) {
                        this.headerDics = res.data;
                    }
                })
            },
			//搜索
			upsearch(){
				this.$refs.table.upData(this.search)
			},
			//标签切换
			tabChange(name){
				var params = {
					groupId: name
				}
				this.$refs.table.reload(params)
			},
			filterChange(data){
				this.$refs.table.upData(data)
			}
		}
	}
</script>

<style>
</style>
