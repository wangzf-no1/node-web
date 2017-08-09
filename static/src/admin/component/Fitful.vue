<template>
	<div class="fitful">
		<h1>{{title}} <el-button type="primary" @click="add">添加</el-button></h1>
		<div v-for="(item, index) in texts" class="item">
			<el-button @click.prevent="del(index)">删除</el-button>
			<el-input placeholder="类型名称" v-model="item.name"></el-input>
			<el-input placeholder="类型价格" v-model="item.value"></el-input>
		</div>	</div>
</template>

<script>
	import Vue from 'vue'
	import {
		Form,
		FormItem,
		Input,
		Button
	} from 'element-ui'

	Vue.use(FormItem)
	Vue.use(Input)
	Vue.use(Button)

	export default {
		data() {
			return {
				n: ''
			}
		},
		props: {
			texts: Array,
			title:String
		},
		methods: {
			add() {
				this.texts.push({
					name: this.n,
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
	.fitful{
		.item{
			padding: .2em;
			border-bottom: 1px solid #ccc;
			&:hover{
				background: #C4C4C4;
			}
		}
		.el-input{
			display: inline-block;
			width: 30%;
			margin-left:1em;
		}
	}
	
</style>