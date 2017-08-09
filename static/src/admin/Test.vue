/**
 * author wangzf_no1@163.com
 * 基于vue2 单文件组件技术
 * 功能点
 ** 数据自动预览功能，系统推荐关键词优先用户输入
 ** Suggest功能，鼠标 键盘都可以更改搜索关键词
 ** 搜索结果分页
 
 * 操作说明
 ** 热词推荐列表显示状态
 *** 显示：输入框获取焦点
 *** 隐藏：输入框失去焦点 或者触发表单提交
 ** 切换预览关键词
 *** 输入框获取焦点状态下，敲击键盘上箭头与下箭头
 *** 鼠标移入热词项
 ** 确定关键词
 *** 输入框获取焦点状态下，敲击键盘右箭头
 *** 鼠标点击热词项（同时调取数据接口）
 ** 根据关键词搜索结果
 *** 输入框获取焦点状态下，敲击键盘回车键
 *** 鼠标点击热词项
 */
<template>
	<div>
		<!--根据鼠标是否移除表单，控制输入框失去焦点是否起作用-->
		<form @submit.prevent="submit" @mouseout="canHide=true" @mouseover="canHide=false">
			<!--预览关键词实现是 通过把关键词与输入框重叠起来（输入框背景透明）-->
			<div class="preview">
				<em v-show="key" v-text="key"></em>
				<span v-html="preview.key"></span>
			</div>
			<input class="key" ref="key" v-model="key" @focus="toggle(true)" @blur="canHide&&toggle(false)" 
				@keydown.up.prevent="--may.index" @keydown.down.prevent="++may.index" @keydown.right.prevent="key=preview.val" />
			<input type="submit" value="搜索" />

			<ul class="may" v-show="may.display" @click="submit">
				<li v-for="(item,index) in may.data" @mouseover="may.index=index" :class="{hover:may.index==index}" v-html="item.key"></li>
			</ul>

		</form>
		<ul class="content">
			<!--暂时根据索引值控制显示隐藏，理论应该请求真实的数据接口-->
			<li v-if="index>=currentIndex&&index<currentIndex+content.size" v-for="(item,index) in content.data">
				<em v-text="index+1"></em>
				<span v-html="item.key"></span>
			</li>

		</ul>

		<input type="button" value="上一页" :disabled="content.index==0" @click="content.index--" /> 
		{{content.index+1}}/{{Math.ceil((content.data.length)/content.size)}} 共{{content.data.length}}条
		<input type="button" value="下一页" :disabled="(content.index+1)*content.size>content.data.length" @click="content.index++" />
	</div>
</template>

<script>
	/////////模拟数据*开始//////////
	//服务器端的关键词
	//后续完善的话 可以历史纪录，已经搜索的关键词
	const hotwords = []
	const contents = []
	//创建50条模拟热搜关键词
	while(hotwords.length < 50) hotwords.push(Math.random().toString(32).substr(2))
	//获取随机关键词
	function getRandom() {
		// length-1 是因为数组下标为0
		return hotwords[Math.round(Math.random() * (hotwords.length - 1))]
	}
	//根据关键词创建5000条模拟数据
	while(contents.length < 5000) {
		contents.push(getRandom() + getRandom() + getRandom())
	}
	/**
	 * 数据统一处理函数，相关度排序，加粗关键词，
	 * @param {Object} origin		指定源数据
	 * @param {Object} keyword		提取数据关键词，为空则显示推荐数据
	 * @param {Object} maxlen		指定最大数据条数
	 */
	function getData(origin, keyword, maxlen) {
		//简单容错处理
		keyword = keyword || ''
		origin = origin || []
		maxlen = maxlen || Infinity

		var data = []
		//对源数据进行加工
		for(let i = 0, item, start; i < origin.length; i++) {
			//满足最大条数条件，退出循环
			if(data.length > maxlen) break;
			item = origin[i]
			//获取关键词第一次出现的位置，也就是热词相关度
			start = item.indexOf(keyword)
			//不显示与关键词相同的条目，包含关键词则添加一条数据
			if(item != keyword && start >= 0) {
				data.push({
					//用正则全局匹配关键词，并加粗显示（与 v-html指令相配合）
					key: item.replace(new RegExp(keyword, 'ig'), `<b>${keyword}</b>`),
					val: item,
					start: start
				})
			}

		}
		//相关度排序
		data.sort((a, b) => a.start - b.start)
		return data
	}

	//模拟获取关键词接口
	function getInputData(keyword, maxlen) {
		return getData(hotwords, keyword, maxlen)
	}
	//模拟获取数据接口
	function getListData(keyword) {
		return getData(contents, keyword)
	}
	/////////模拟数据*结束//////////

	//两个数据节流定时器，热词 与 数据列表 接口调用
	var timer, timer2

	export default {
		data() {
			return {
				//搜索框是否可以关闭，解决热词待选列表点击失效问题
				//* 点击会先blur后click，而blur控制关闭列表，故click无法触发
				canHide: false,
				//搜索
				key: '',
				clickCount: 0,
				//热词推荐相关
				may: {
					index: -1,
					data: [],
					display: false
				},
				//数据预览
				preview: {},
				//数据展示
				content: {
					data: [],
					index: 0,
					size: 30
				}
			};
		},
		watch: {
			'key' (val, oldValue) {
				//每次输入新字符，预览列表初始化
				this.may.index = -1
				//获取热词推荐
				this.input(val)
			},
			'may.index' (val, oldVal) {
				//保证上下箭头控制正确的预览数据，保证索引值紧邻正确范围内，避免多次触发
				//* 紧邻正确范围，是为后续submit提供判断条件，索引值未在正确范围submit会搜索key，而不是推荐关键词
				if(val < -1 || val >= this.may.data.length) {
					this.may.index = val < -1 ? -1 : this.may.data.length
					return
				}
				//推荐预览关键词，不在正确范围内（mouseover 与 up down都可以控制），则显示第一条，
				this.preview = this.may.data[this.inRange ? val : 0] || {}

			},
			'preview' (val, oldVal) {
				//无预览关键词 则按照用户输入关键词搜索预览数据
				this.getList(val.val || this.key)
			},
			'content.data' (val, oldVal) {
				//数据列表变化，起始值初始化
				this.content.index = 0
			}
		},
		computed: {
			// 数据分页功能，当前显示起始索引值
			currentIndex() {
				return this.content.index * this.content.size
			},
			// 推荐热词功能，当前预览关键词是否在正常范围
			inRange() {
				return this.may.index > -1 && this.may.index < this.may.data.length
			}
		},
		methods: {
			//切换热词推荐列表显示
			toggle(value) {
				//入参为Boolean ,使用传入参数,否则 根据自身值取反
				this.may.display = typeof value == 'boolean' ? value : !this.may.display
			},
			//业务层 根据关键词获取数据列表
			getList(keyword) {
				if(typeof keyword != 'string' || !keyword.length) return;
				let self = this
				//数据节流
				clearTimeout(timer)
				timer = setTimeout(() => {
					//TODO 理论这里应该用ajax数据接口，
					//判断当前组件是否被销毁
					if(self && !self._isDestroyed) this.content.data = getListData(keyword)
				}, 1000);
			},
			submit() {
				//TODO 确定关键词后 要不要保持焦点？
				this.$refs.key.blur()

				//使用推荐热词: 输入框值为空  或 待选索引值在正常范围区间
				//this.preview.val 值可能为undefined
				if(!this.key.length || this.inRange) this.key = this.preview.val || ''
				//* 根据关键词查询数据
				this.getList(this.key)

				//下次视图更新隐藏待选热词列表				
				this.$nextTick(function() {
					this.toggle(false)
				})

			},

			input(keyword) {
				let self = this
				//数据节流
				clearTimeout(timer2)
				timer2 = setTimeout(() => {
					//TODO 理论这里应该用ajax数据接口
					if(self && !self._isDestroyed) {
						//TODO 理论这里应该用ajax数据接口
						//根据关键字获取热词列表，默认获取前十个
						var data = getInputData(keyword, 10)
						//更新数据
						this.may.data = data
						this.preview = data[0] || {}
					}
				}, 400);

			}
		},
		//组件装载完成 ，推送默认热词搜索数据（关键词为空，则取排行第一关键词，预览数据）
		mounted() {
			this.input()
		}
	};
</script>

<style lang="less">
	@keyframes gleam {
		from {
			background-color: #ccc;
		}
		to {
			background-color: #ddd;
		}
	}
	
	ul {
		list-style: none;
		margin: 0;
	}
	
	form {
		position: relative;
		z-index: 10;
		padding: .5em 1em;
		background: #fafafa;
		.may {
			position: absolute;
			top: 100%;
			width: 90%;
			background: #f1f1f1;
			&:empty:before {
				content: '暂无建议热词';
			}
		}
		.key {
			background: transparent;
		}
		li {
			cursor: pointer;
		}
		.hover {
			animation: gleam .5s infinite alternate;
		}
	}
	
	.preview,
	input {
		border: 0;
		padding: .3em 1em;
		margin: 0;
		font-size: 14px;
		line-height: 2em;
	}
	
	input {
		border: 1px solid #ccc;
		margin: -1px;
	}
	
	.preview {
		height: 2em;
		/*重叠功能的实现*/
		margin-bottom: -2.6em;
		color: #888;
		em {
			padding-right: 1em;
			color: transparent;
		}
	}
	
	.content {
		&:empty:before {
			content: '暂无数据';
		}
		em {
			width: 2em;
			margin-right: 1em;
			display: inline-block;
			text-align: right;
		}
		b{ color: red;}
		li:hover {
			background: #fafafa;
		}
	}
</style>