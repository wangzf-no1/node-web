import Vue from 'vue'

var utils = {
	//先get url,	如无相关数据，则post 默认数据
	setGet(url, data, callback) {
		Vue.http.get(url)
			.then(res => res.body)
			.then(res => {
				if(res) {
					callback(res)
				} else {
					Vue.http.post(url, data)
						.then(res => res.body)
						.then(callback)
				}
			})

	}

}

export default utils
