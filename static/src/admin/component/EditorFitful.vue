<template>
	<div class="editorFitful">
		<h1>{{title}} <el-button type="primary" @click="add">添加</el-button></h1>

		<el-collapse>

			<el-collapse-item v-for="(item, index) in texts">
				<template slot="title">
					<el-button @click="del(index)">删除</el-button>
					<el-input placeholder="内容名称，显示在页面的小标题" v-model="item.name"></el-input>
				</template>
				<editor :content="item"></editor>
			</el-collapse-item>

		</el-collapse>
	</div>
</template>

<script>
	import Vue from 'vue'
	import {
		Collapse,
		CollapseItem,
		Form,
		FormItem,
		Input,
		Button,
		Switch
	} from 'element-ui'

	import Editor from './Editor'

	Vue.use(FormItem)
	Vue.use(Input)
	Vue.use(Button)
	Vue.use(Collapse)
	Vue.use(CollapseItem)
	Vue.use(Switch)

	export default {
		components: {
			Editor
		},
		data() {
			return {}
		},
		props: {
			texts: Array,
			title: String
		},
		methods: {
			add() {
				this.texts.push({
					name: '',
					value: ''
				})
			},
			del(index) {
				this.texts.splice(index, 1)
			}
		}
	}
</script>
<style lang="less">
.editorFitful{
	padding-bottom: 300px;
	.el-input{
		width: 40%;
	}
}
</style>