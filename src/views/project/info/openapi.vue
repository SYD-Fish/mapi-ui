<template>
	
	<el-card shadow="never" header="OpenAPI">
		<el-form ref="form" :model="form" label-width="120px" style="margin-top:20px;">
			<el-form-item label="地址">
				<el-input v-model="form.url" disabled></el-input>
				<div class="el-form-item-msg">一键上传，配置的上传地址</div>
			</el-form-item>
			<el-form-item label="token">
				<el-input v-model="form.token" disabled></el-input>
			</el-form-item>
			<el-form-item>
				<el-popconfirm 
				width="220"
				title="确定刷新token吗？" @confirm="refreshToken">
					<template #reference>
						<el-button type="primary">刷新token</el-button>
					</template>
				</el-popconfirm>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					projectId: this.$TOOL.data.get("projectId"),
					url: "http://localhost:8080/project/upload",
					token: "",
				},
				project: {}
			}
		},
		mounted() {
			this.loadProject();
		},
		methods: {
			loadProject() {
				this.$API.project.project.query.get( this.$TOOL.data.get("projectId")).then(res => {
                    if (res.code == 0) {
                        this.form.token = res.data.token;
                    }
                })
			},
			refreshToken() {
				this.$API.project.project.refreshToken.post(this.form).then(res => {
					if (res.code == 0) {
						this.$message.success("刷新token成功");
						this.form.token = res.data.token;
					}
				})
			}
		}
	}
</script>

<style>
</style>
