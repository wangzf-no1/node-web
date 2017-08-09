<template>
	<div class="content">
		<div class="content-tree">

			<el-button type="text" @click="menu.edit=true">编辑菜单</el-button>
			<!--<el-input placeholder="输入关键字进行过滤" v-model="menuFilter"></el-input>-->
			<el-tree class="filter-tree" :data="menu.data" :props="defaultProps" default-expand-all 
				:expand-on-click-node="false" :highlight-current="true" @node-click="menuClick">
			</el-tree>
		</div>
		<el-dialog :visible.sync="menu.edit" size="large" title="编辑菜单">
			<edit-menu :ship="menu"></edit-menu>
		</el-dialog>
		<el-dialog class="imgBox" :visible.sync="imgBoxShow" size="large" title="选择图片" >
			<image-manage :ship="post"></image-manage>
		</el-dialog>

		<div class="scroll">

			<div class="toolBar">
				<div class="fixed">
					<span class="title">[{{menu.current.type}}]<b>{{menu.current.label}}</b></span>

					<el-button type="primary" @click="save">
						保存
					</el-button>
				</div>
			</div>

			<el-form ref="form" :model="post" label-width="180px">

				<el-form-item label="标题">
					<el-input v-model="post.title"></el-input>
				</el-form-item>
				<el-form-item label="简介">
					<el-input v-model="post.about" type="textarea" autosize></el-input>
				</el-form-item>
				<el-form-item label="图片形象" cla>
					<el-button @click="imgBoxShow=true">选择图片</el-button>
					<a class="imgPreview"><img :src="post.img" /></a>
				</el-form-item>

				<h1>seo</h1>
				<el-form-item label="是否继承SEO">
					<el-switch v-model="post.seo.inherit" on-text="是" off-text="否"></el-switch>
				</el-form-item>

				<el-form-item label="标题">
					<el-input v-model="post.seo.title"></el-input>
				</el-form-item>

				<el-form-item label="关键字">
					<el-input v-model="post.seo.keyword"></el-input>
				</el-form-item>
				<el-form-item label="描述">
					<el-input v-model="post.seo.description"></el-input>
				</el-form-item>

				<fitful :texts="post.price" :title="'报价'"></fitful>
				<editor-fitful :texts="post.texts" :title="'网页内容'"></editor-fitful>

			</el-form>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';

	import {
		Form,
		FormItem,
		InputNumber,
		Dialog,
		Tree,
		Row,
		Col,
		Menu,
		MenuItem,
		MenuItemGroup,
		Submenu,
		Input,
		Button,
		Switch,
		Select,
		Tag,
		Message
	} from 'element-ui'

	import Fitful from './Fitful'
	import EditorFitful from './EditorFitful'
	import ImageManage from './ImageManage'
	import EditMenu from './EditMenu'

	Vue.use(Form)
	Vue.use(FormItem)
	Vue.use(Tree)
	Vue.use(Dialog)
	Vue.use(Switch)
	Vue.use(Select)
	Vue.use(Menu)
	Vue.use(Submenu)
	Vue.use(MenuItem)
	Vue.use(MenuItemGroup)

	Vue.component(InputNumber.name, InputNumber)

	Vue.component(CollapseTransition.name, CollapseTransition)

	export default {
		name: 'Content',
		components: {
			Fitful,
			EditorFitful,
			ImageManage,
			EditMenu
		},
		watch: {
			//menuFilter(val) {
			//	this.$refs.menuTree.filter(val);
			//}
		},

		data() {
			return {
				//menuFilter: '',

				imgBoxShow: false,

				menu: {
					edit: false,
					id: '',
					data: [],
					current: {}
				},
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				post: {
					visit: true,
					img: '',
					seo: {
						inherit: true,
						title: '',
						keyword: '',
						description: ''
					},
					title: '',
					about: '',
					texts: [],
					price: []

				}

			}
		},
		methods: {
			menuClick(value, data, store) {
				this.menu.current = value;
				this.$http.get(`/api/posts/${value.page}`)
					.then(res => res.body)
					.then(res => {
						this.post = res
					})
			},
			save() {

				var post = JSON.parse(JSON.stringify(this.post))
				var i = -1
				var min = Infinity
				var t
				while(t = post.price[++i]) {
					if(t.value < min) min = t.value
				}
				post.min = min === Infinity ? 0 : min
				
				this.$http.put(`/api/posts/${this.menu.current.page}`, post)
					.then(res => res.body)
					.then(res => {
						//this.post = res
						//console.log('ok')
					})

			}
		},

		mounted() {

			this.$http.get(`/api/site/menu`)
				.then(res => res.body)
				.then(res => {
					if(res) {
						this.menu.data = res.data
						this.menu.id = res._id
					} else {
						this.$http.post(`/api/site/menu`, {
								data: []
							})
							.then(res => res.body)
							.then(res => {
								this.menu.data = res.data
								this.menu.id = res._id

							})
					}
				})

		}
	};
</script>

<style lang="less">
	.content,
	.content-tree {
		height: 100%;
	}
	
	.content {
		margin-left: 200px;
		position: relative;
		height: 100%;
		.scroll {
			height: 100%;
			overflow: auto;
		}
		.title{
			color: #444;
			float: left;
			b{ padding-left: 1em;}
		}
		.content-tree {
			position: absolute;
			overflow: auto;
			width: 200px;
			left: -201px;
			top: 0;
			border-right: 1px solid #ccc;
			background: #fafafa;
		}
		
	}
</style>