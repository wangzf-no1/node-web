<template>
	<div class="home">
		<div class="toolBar">
			<div class="fixed">
				<el-button type="primary" @click="save">
					保存
				</el-button>
			</div>
		</div>

		<el-dialog class="imgBox" :visible.sync="imgBoxShow" size="large" title="选择图片">
			<image-manage :ship="editBox.target"></image-manage>
		</el-dialog>

		<el-dialog class="treeBox" :visible.sync="treeBox.show" title="链接到">
			<el-tree :data="treeBox.data" class="menu" :props="defaultProps" default-expand-all :expand-on-click-node="false" 
				:highlight-current="true" @node-click="treeClick">
			</el-tree>
		</el-dialog>

		<el-dialog class="editBox" :visible.sync="editBox.show" size="large">
			<el-form ref="form" :model="editBox.target" label-width="100px">

				<template v-for="(v,k) in editBox.target">
					<el-form-item label="标题" :class="k">
						<span slot="label">{{names[k]||k}}</span>

						<el-col :span="11">
							<el-input v-model="editBox.target[k]"></el-input>
						</el-col>
						<el-col class="line" :span="2">&nbsp;</el-col>
						<el-col :span="11">
							<el-color-picker v-if="k=='bg'" v-model="editBox.target[k]"></el-color-picker>
							<span v-if="k=='img'">
							<el-button @click="imgBoxShow=true">选择图片</el-button>
								<a class="imgPreview"><img :src="editBox.target.img" /></a>
							</span>
							<el-button v-if="k=='href'" @click="treeBox.show=true">选择</el-button>
							<a v-if="k=='href'" :href="typeof v=='string'?v:`/post/${v.type}/${v.page}`">
								{{v.label||v}}</a>
						</el-col>

					</el-form-item>

				</template>

			</el-form>
		</el-dialog>

		<ul v-for="(item,name) in post" class="item" :class="name">
			<h1>{{names[name]}} <el-button type="primary" @click="add(item,name)">添加</el-button></h1>
			<li v-for="(li, index) in item" class="li" :style="{backgroundColor:li.bg,backgroundImage:`url(${li.img})`}">
				<span v-for="(v,k) in li" class="key">
					{{names[k]||k}}:{{v}}<br />
				</span>
				<div class="btns">
					<el-button @click="del(item,index)">删除</el-button>
					<el-button @click="edit(item,index)" type="primary">编辑</el-button>
					<el-button @click="up(item,index)">上移</el-button>
					<el-button @click="down(item,index)">下移</el-button>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import Vue from 'vue'
	import utils from '../utils.js'
	import {
		Dialog,
		Form,
		FormItem,
		Col,
		Input,
		Button,
		Switch,
		ColorPicker,
		Message
	} from 'element-ui'

	Vue.component(Input.name, Input)
	Vue.component(Button.name, Button)
	Vue.component(Switch.name, Switch)

	Vue.use(Col)
	Vue.use(Dialog)
	Vue.use(Form)
	Vue.use(FormItem)
	Vue.use(ColorPicker)

	import ImageManage from './ImageManage'

	var basic = {
		img: '',
		bg: '',
		title: '',
		info: '',
		href: ''
	}
	var special = {
		sift: {
			fee: 0
		},
		news:{
			tag:'快报',
			day:''
		}
	}

	export default {
		name: 'Post',
		components: {
			ImageManage
		},
		data() {
			return {
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				names: {
					banner: '滚动广告',
					fastlink: '快速链接',
					sift: '精选服务',
					friend: '友情链接',
					news:'企业资讯',
					ad:'广告区（1+2格式）',
					ad2:'广告区2（通栏）',

					img: '形象图片',
					bg: '背景颜色',
					title: '标题',
					info: '简介',
					href: '链接',
					fee: '最低价',
					tag:'标签',
					day:'日期'
				},
				imgBoxShow: false,
				treeBox: {
					show: false,
					data: []
				},
				editBox: {
					show: false,
					target: {}
				},
				postId: '',
				post: {
					banner: [],
					fastlink: [],
					sift: [],
					friend: [],
					news:[],
					ad:[],
					ad2:[]
				}

			}
		},
		mounted() {

			utils.setGet(`/api/site/home`, {
				data: {
					banner: [],
					fastlink: [],
					sift: [],
					friend: [],
					ad:[],
					news:[],
					ad2:[]
				}
			}, res => {
				this.post =Object.assign({
					banner: [],
					fastlink: [],
					sift: [],
					friend: [],
					news:[],
					ad:[],
					ad2:[]
				},res.data) 
				this.postId = res._id
			})

			utils.setGet(`/api/site/menu`, {
				data: []
			}, res => {
				this.treeBox.data = res.data
			})

		},
		/*beforeRouteLeave(to, from, next) {
			// if (confirm(`确认要离开？`)) {
			//   next()
			// } else {
			//   return false
			// }
			next()
		},*/
		methods: {
			del(item, index) {
				item.splice(index, 1)
			},
			edit(item, index) {
				this.editBox.target = item[index]
				this.editBox.show = true
			},

			up(item, index) {
				if(index < 1) return;

				item.splice(index - 1, 0, item.splice(index, 1)[0])
			},
			down(item, index) {
				if(index > item.length - 2) return;
				item.splice(index, 0, item.splice(index + 1, 1)[0])
			},
			add(item, name) {
				item.push(Object.assign({}, basic, special[name]))
				this.edit(item, item.length - 1)
			},

			treeClick(value, data) {
				this.treeBox.show = false
				var obj=Object.assign({},value)
				delete obj.children
				this.editBox.target.href = obj

			},
			save() {
				const params = Object.assign({}, {
					data: this.post
				})
				this.$http.put(`/api/site/${this.postId}`, params)
					.then(res => res.body)
					.then(res => {
						Message({
							message: '保存成功！',
							type: 'success'
						})
					})
			}

		}
	}
</script>

<style lang="less">
	.home {
		height: 100%;
		overflow: auto;
		.item {
			li {
				list-style: none;
				max-width: 90%;
				width: 300px;
				margin: .5em;
				display: inline-block;
				background:no-repeat center/contain;
				border:1px solid #ccc;
				.key{ background: rgba(255,255,255,.5); word-break: break-all;}
				.btns{
					visibility: hidden;
				}
				&:hover .btns{
					visibility: visible;
				}
			}
			img {
				height: 50px;
			}
		}
	}
</style>