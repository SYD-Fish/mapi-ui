import config from "@/config"
import http from "@/utils/request"
export default {
	project: {
		create: {
			url: `${config.MANAGE_API_URL}/project/create`,
			name: "创建项目",
			post: async function(data, headers={}){
				return await http.post(this.url, data,  {headers: headers});
			}
		},
		list: {
			url: `${config.MANAGE_API_URL}/project/list`,
			name: "获取项目列表",
			post: async function(params, headers={}){
				return await http.post(this.url, params, {headers: headers});
			}
		},
		query: {
			url: `${config.MANAGE_API_URL}/project/query`,
			name: "获取项目详情",
			get: async function(projectId, headers={}){
				return await http.get(this.url + "/" + projectId, {}, {headers: headers});
			}
		},
	},
	header: {
		list: {
			url: `${config.API_URL}/header/list`,
			name: "数据列表",
			get: async function(projectId, params, headers){
				return await http.get(this.url + "/" + projectId, params, {headers: headers});
			}
		}
	},
	doc: {
		detail:{
			url: `${config.MANAGE_API_URL}/doc/query`,
			name: "获取API文档接口详情",
			get: async function(docId){
				return await http.get(this.url + "/" + docId);
			}
		},
	}

	// ,
	// env: {
	// 	create: {
	// 		url: `${config.MANAGE_API_URL}/environment/create`,
	// 		name: "创建环境",
	// 		post: async function(params, headers={}){
	// 			return await http.post(this.url, params,  {headers: headers});
	// 		}
	// 	},
	// 	list: {
	// 		url: `${config.MANAGE_API_URL}/environment/list`,
	// 		name: "获取环境列表",
	// 		post: async function(params, headers={}){
	// 			return await http.post(this.url, params, {headers: headers});
	// 		}
	// 	}
	// },
	// dataSheet: {
	// 	create: {
	// 		url: `${config.MANAGE_API_URL}/data/sheet/create`,
	// 		name: "创建数据单",
	// 		post: async function(params, headers={}){
	// 			return await http.post(this.url, params,  {headers: headers});
	// 		}
	// 	},
	// 	list: {
	// 		url: `${config.MANAGE_API_URL}/data/sheet/list`,
	// 		name: "获取数据单列表",
	// 		post: async function(params, headers={}){
	// 			return await http.post(this.url, params, {headers: headers});
	// 		}
	// 	}
	// }
}