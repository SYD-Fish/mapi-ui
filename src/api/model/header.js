import config from "@/config"
import http from "@/utils/request"

export default {
	list: {
		url: `${config.API_URL}/header/list`,
		name: "数据列表",
		get: async function(projectId, params, headers){
			return await http.get(this.url + "/" + projectId, params, {headers: headers});
		}
	}
}
