// 静态路由配置
// 书写格式与动态路由格式一致，全部经由框架统一转换
// 比较动态路由在meta中多加入了role角色权限，为数组类型。一个菜单是否有权限显示，取决于它以及后代菜单是否有权限。
// routes 显示在左侧菜单中的路由(显示顺序在动态路由之前)
// 示例如下

const routes = [
	{
		name: "project",
		path: "/project",
		meta: {
			icon: "el-icon-eleme-filled",
			title: "项目合集",
			"affix": true
		},
		component: "project/list",
		children: [
			{
				name: "detail",
				path: "/project/detail/:projectId/:projectName",
				component: "project/detail",
				meta: {
					icon: "el-icon-menu",
					title: "项目详情",
					hidden: true,
					hiddenBreadcrumb: true
				}
			},
			{
				name: "doc",
				path: "/project/doc/",
				component: "project/apiDoc",
				meta: {
					icon: "el-icon-menu",
					title: "文档详情",
					hidden: true,
					hiddenBreadcrumb: true
				}
			}
		]
	}
]

// const routes = [] 

export default routes;
