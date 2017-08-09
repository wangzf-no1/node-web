<template>
	<div class="editMenu">
		<el-tree :data="cache" class="menu" :props="defaultProps" default-expand-all :expand-on-click-node="false" :highlight-current="true" @node-click="click">
		</el-tree>

		<el-form class="edit" label-width="100px">
			删除按钮会立刻删除所对应页面数据，谨慎操作(停用开关代替)<br />上移下移按钮操作后要想再编辑菜单，请重新点击树节点<br /><br />
			<el-form-item label="">
				<el-button type="primary" @click="edit">同步</el-button>
				<el-button type="primary" @click="save">保存</el-button>
				<el-button @click="clearn" v-if="!main">选择主目录</el-button>
			</el-form-item>
			<el-form-item label="当前编辑">
				<b>{{main?'主目录':value.label}}</b>
				<el-switch v-model="value.disable" on-text="启用" v-if="!main" off-text="停用"></el-switch>
				<el-button @click="add">添加</el-button>
			</el-form-item>
			<el-form-item label="菜单名称" v-if="!main">
				<el-input placeholder="用于在菜单显示，并非对应页面标题" v-if="!main" v-model="value.label"></el-input>
			</el-form-item>
			<el-form-item label="页面类型" v-if="!main">
				<el-select v-model="value.type" placeholder="请选择">
					<el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<!--
<el-form-item label="父级" v-if="!main">
		<el-input v-if="!main" v-model="value.parent" disabled></el-input>
	</el-form-item>
	<el-form-item label="当前" v-if="!main">
		<el-input v-if="!main" v-model="value.page" disabled></el-input>
	</el-form-item>
-->
			<el-form-item label="">
				<el-button @click="del" v-if="!main">删除</el-button>
				<el-button @click="up" v-if="!main">上移</el-button>
				<el-button @click="down" v-if="!main">下移</el-button>
				</h1>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import Vue from 'vue'
	import {
		Form,
		FormItem,
		Input,
		Button,
		Tree,
		Select,
		Option
	} from 'element-ui'

	Vue.use(Form)
	Vue.use(FormItem)
	Vue.use(Input)
	Vue.use(Button)
	Vue.use(Tree)
	Vue.use(Select)
	Vue.use(Option)

	export default {
		data() {
			return {
				types: [{
					value: 'productlist',
					label: '产品列表'
				}, {
					value: 'product',
					label: '产品'
				}, {
					value: 'newslist',
					label: '新闻列表'
				}, {
					value: 'news',
					label: '新闻'
				}, {
					value: 'textlist',
					label: '文字列表'
				}, {
					value: 'text',
					label: '文字'
				}],
				main: true,
				value: {},
				data: {},
				cache: [],
				index: -1,
				parent: {},
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			}
		},
		props: {
			ship: Object
		},
		methods: {
			edit() {
				this.cache = [{
					label: '',
					page: 'root',
					parent: [],
					children: JSON.parse(JSON.stringify(this.ship.data))
				}]
				this.clearn()
			},
			save() {
				var self = this

				function p(obj, parent) {
					parent = parent || {
						type: 'productlist',
						parent: [],
						page: ''
					}
					//子级组合
					var c = obj.children

					//类型
					obj.type = obj.type || parent.type.replace('list', c.length == 0 ? '' : 'list')
					//父级 parent
					obj.parent = parent.page ? parent.parent.concat(parent.page) : parent.parent

					if(obj.page && obj.page !== 'root') {
						var obj2 = Object.assign({}, obj)
						delete obj2.children

						self.$http.put(`/api/posts/${obj2.page}`, {
								menu: obj2,
								only: true
							})
							.then(res => res.body)
							.then(res => {
								//this.post = res
							})

					}

					for(var i = 0; i < c.length; i++) {
						p(c[i], obj)
					}

				}
				p(this.cache[0])
				var data = JSON.parse(JSON.stringify(this.cache[0].children))

				this.$http.put(`/api/site/${this.ship.id}`, {
						data
					})
					.then(res => res.body)
					.then(res => {
						this.ship.data = data
					})

			},
			click(value, data) {
				this.parent = data.parent.data
				this.index = data.parent.childNodes.indexOf(data)
				this.value = value
				this.main = false

			},
			clearn() {
				this.parent = this.cache
				this.index = 0
				this.value = this.cache[0]
				this.main = true
			},

			add() {
				this.$http.post('/api/posts')
					.then(res => res.body)
					.then(res => {
						//this.post = res
						this.value.children.push({
							label: 'new',
							type: '',
							disable: true,
							page: res,
							children: []
						})
					})

			},
			del() {

				this.$http.delete(`/api/posts/${this.value.page}`)
					.then(res => res.body)
					.then(res => {

						if(res.ok) {
							this.parent.children.splice(this.index, 1)
							this.main = true
						}
					})
			},
			up() {
				if(this.index > 0) {
					var o = this.parent.children
					var e1 = JSON.parse(JSON.stringify(o[this.index - 1]))
					var e2 = JSON.parse(JSON.stringify(o[this.index]))
					o.splice(this.index - 1, 2, e2, e1)
					this.index--

				}
			},
			down() {
				if(this.index < this.parent.children.length - 1) {
					var o = this.parent.children
					var e1 = JSON.parse(JSON.stringify(o[this.index + 1]))
					var e2 = JSON.parse(JSON.stringify(o[this.index]))
					o.splice(this.index, 2, e1, e2)
					this.index++
				}
			}
		}
	}
</script>
<style lang="less">
	.editMenu .el-tree>.el-tree-node>.el-tree-node__content {
		display: none;
	}
	
	.editMenu {
		height: 400px;
		.menu {
			height: 100%;
			overflow: auto;
			width: 40%;
			margin-left: -3px;
			float: left;
			b {
				color: red;
			}
		}
		.edit {
			height: 100%;
			overflow: auto;
			width: 60%;
			float: right
		}
	}
</style>