<template>

	<el-form ref="form" :model="post" label-width="180px" class="setting">
		<el-dialog class="treeBox" :visible.sync="treeBox.show" title="链接到">
			<el-tree :data="treeBox.data" class="menu" :props="defaultProps" default-expand-all :expand-on-click-node="false" :highlight-current="true" @node-click="treeClick">
			</el-tree>
		</el-dialog>

		<div class="toolBar">
			<div class="fixed">
				<el-button type="primary" @click="updateSite">
					保存
				</el-button>
			</div>
		</div>

		<el-dialog class="imgBox" :visible.sync="imgBox.show" size="large" title="选择图片" @close="imgBoxClose">

			<image-manage :ship="imgBox"></image-manage>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="imgBox.show= false">关闭</el-button>
			</div>
		</el-dialog>
		<el-form-item label="用户名">
			<el-input v-model="post.admin"></el-input>
		</el-form-item>

		<el-form-item label="密码">
			<el-input v-model="post.password"></el-input>
		</el-form-item>

		<el-form-item label="站点名称">
			<el-input v-model="post.sitename"></el-input>
		</el-form-item>
		<el-form-item label="联系电话">
			<el-input v-model="post.tel"></el-input>
		</el-form-item>

		<el-form-item label="营业时间">
			<el-input v-model="post.office"></el-input>
		</el-form-item>
		<el-form-item label="公众号">
			<el-button @click="openImgBox(post,'code')">选择图片</el-button>
			<a class="imgPreview"><img :src="post.code" /></a>
		</el-form-item>
		<el-form-item label="版权">
			<el-input v-model="post.copyright"></el-input>
		</el-form-item>

		<h1>快速链接 <el-button type="primary" @click="fastAdd">添加</el-button></h1>

		<div v-for="(item,index) in post.fastlink" class="fastlink clearfix">

			<div class="item">
				<el-input v-model="item.label"></el-input>
				<el-button @click="del(post.fastlink,index)">删除</el-button>
				<el-button @click="add(item.children)">添加</el-button>
			</div>
				<span v-for="(ditem,dindex) in item.children">
					<el-input v-model="ditem.label"></el-input>
					<el-button @click="del(item.children,index)">删除</el-button>
				
				</span>

		</div>

		<h1>seo</h1>

		<el-form-item label="标题">
			<el-input v-model="post.seo.title"></el-input>
		</el-form-item>
		
		<el-form-item label="关键字">
			<el-input v-model="post.seo.keyword"></el-input>
		</el-form-item>
		
		<el-form-item label="描述">
			<el-input v-model="post.seo.description"></el-input>
		</el-form-item>

	</el-form>

</template>

<script>
	import Vue from 'vue'
	import utils from '../utils.js'

	import {
		Form,
		Dialog,

		FormItem,
		Input,
		Button,
		Message
	} from 'element-ui'

	Vue.use(Input)
	Vue.use(Button)
	Vue.use(Form)
	Vue.use(FormItem)
	Vue.use(Dialog)

	import ImageManage from './ImageManage'

	export default {
		name: 'Setting',
		data() {
			return {
				treeBox: {
					show: false,
					current: [],
					data: []
				},
				imgBox: {
					show: false,
					target: {},
					name: '',
					src: ""
				},
				post: {
					tel: '',
					sitename: '',
					copyright: '',
					office: '',
					code: '',
					fastlink: [

					],
					seo: {
						title: '',
						keyword: '',
						description: ''
					}
				}
			}
		},
		mounted() {
			utils.setGet(`/api/site/menu`, {
				data: []
			}, res => {
				this.treeBox.data = res.data
			})

			this.getSite()
		},
		components: {
			ImageManage
		},
		methods: {
			treeClick(value, data) {
				this.treeBox.show = false
				var obj = Object.assign({}, value)
				delete obj.children
				this.treeBox.current.push(obj)

			},
			fastAdd() {
				this.post.fastlink.push({
					label: '',
					children: []
				})

			},
			add(item) {
				this.treeBox.show = true

				this.treeBox.current = item
			},
			del(item, index) {
				item.splice(index, 1)

			},
			imgBoxClose(file) {
				this.imgBox.target[this.imgBox.name] = this.imgBox.src
				this.imgBox.show = false
			},
			openImgBox(target, name) {
				this.imgBox.target = target
				this.imgBox.name = name
				this.imgBox.show = true
			},
			getSite() {
				this.$http.get(`/api/site/site`)
					.then(res => res.body)
					.then(res => {
						let init = Object.assign({
							tel: '',
							sitename: '',
							copyright: '',
							code: '',
							office: '',

							fastlink: [

							],

							seo: {
								title: '',
								keyword: '',
								description: ''
							}
						}, res)
						this.post = init
					})
			},
			updateSite() {
				const params = Object.assign({}, this.post)

				this.$http.put(`/api/site/${this.post._id}`, params)
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


	.setting {
		height: 100%;
		overflow: auto;
		.fastlink{
			border-bottom:1px solid #ccc;
			span{ white-space: nowrap;
			.el-input{ width: 150px;}
			button{ margin-right: 2em;}
			} 
			.item{ display: inline-block; width: 150px; float: left; margin: 1em 1em  2em ;}
		}
	}
</style>