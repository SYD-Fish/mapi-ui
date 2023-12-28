import config from "@/config"
import http from "@/utils/request"
export default {
	module: {
		list: {
			url: `${config.MANAGE_API_URL}/module/list`,
			name: "获取模块列表",
			post: async function(params, headers={}){
				return await http.post(this.url, params, {headers: headers});
			}
		},
        detail: {
			url: `${config.MANAGE_API_URL}/module/query`,
			name: "获取模块详情",
			post: async function(param, headers={}){
				return await http.post(this.url, param, {headers: headers});
			}
		}
	}
}