import config from "@/config"
import http from "@/utils/request"
export default {
	order: {
		quotation: {
			url: `${config.API_URL}/order/quotation`,
			name: "项目报价",
			post: async function(data={}){
				return await http.post(this.url, data);
			}
		}
	}
}