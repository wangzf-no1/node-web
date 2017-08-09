<template>
	<div class="common">
		<div class="toolBar">
			<div class="fixed">
			<el-button type="primary" @click="save">
				保存
			</el-button>
			</div>
		</div>

		<h1>产品页面关于我们</h1>
		<editor :content="post.aboutToPost"></editor>

	</div>
</template>

<script>
	import Editor from './Editor'

	import Vue from 'vue'
	import {
		Row,
		Col,
		Menu,
		MenuItem,
		MenuItemGroup,
		Submenu,
		Input,
		Button,
		Switch,
		Tag,
		Message
	} from 'element-ui'

	Vue.component(Input.name, Input)
	Vue.component(Button.name, Button)
	Vue.component(Switch.name, Switch)
	Vue.component(Tag.name, Tag)

	Vue.use(Menu)
	Vue.use(MenuItem)
	Vue.use(MenuItemGroup)
	Vue.use(Submenu)

	export default {
		name: 'Post',
		components: {
			Editor
		},
		data() {
			return {
				postId: '',
				post: {
					aboutToPost: {
						name: '关于我们',
						value: ''
					}
				}
			}
		},
		mounted() {
			this.$http.get(`/api/site/common`)
				.then(res => res.body)
				.then(res => {
					if(res) {
						this.post = res.data
						this.postId = res._id
					} else {
						this.$http.post(`/api/site/common`, {
								data: {
									aboutToPost: {
										name: '关于我们',
										value: ''
									}
								}
							})
							.then(res => res.body)
							.then(res => {
								this.post = res.data
								this.postId = res._id

							})
					}
				})
		},
		beforeRouteLeave(to, from, next) {
			// if (confirm(`确认要离开？`)) {
			//   next()
			// } else {
			//   return false
			// }
			next()
		},
		methods: {
			
			save() {
				console.log(this.post)
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
		.bannerItem {
			height: 100px;
			img {
				height: 100%;
				float: left;
			}
		}
	}
</style>