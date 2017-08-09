<template>
	<div class="admin">
		<el-menu theme="dark" :default-active="activeRouter" class="admin-menu">
			<router-link :to="{ name: 'content'}">
				<el-menu-item index="content">
					<i class="el-icon-document"></i>内容管理
				</el-menu-item>
			</router-link>
			<router-link :to="{ name: 'home'}">
				<el-menu-item index="home">
					<i class="el-icon-menu"></i>首页管理
				</el-menu-item>
			</router-link>
			<router-link :to="{ name: 'common'}">
				<el-menu-item index="common">
					<i class="el-icon-menu"></i>公共信息
				</el-menu-item>
			</router-link>

			<router-link :to="{ name: 'setting' }">
				<el-menu-item index="setting">
					<i class="el-icon-setting"></i>站点设置
				</el-menu-item>
			</router-link>
			<a href="/admin/logout" class="logout-btn">
				<el-menu-item index="logout">
					<i class="el-icon-close"></i>退出登录
				</el-menu-item>
			</a>
		</el-menu>
		<router-view></router-view>
	</div>
</template>

<script>
	import Vue from 'vue'
	import {
		Menu,
		MenuItem,
	} from 'element-ui'

	Vue.component(Menu.name, Menu)
	Vue.component(MenuItem.name, MenuItem)

	export default {
		name: 'Admin',
		data() {
			return {
				activeRouter: this.$router.currentRoute.name
			}
		}
	}
</script>

<style lang="less">
		.clearfix::after {
    display: block;
    content: '';
    clear: both;
}
	html,
	body,
	#root,
	.admin,
	.admin-menu {
		height: 100%;
	}	
	.admin {
		position: relative;
		margin-left: 150px;
		.admin-menu {
			width: 150px;
			left: -150px;
			top:0;
			z-index: 10;
			position: absolute;
		}
	}
	.toolBar{
		height:4em;
		.fixed{
			padding: .5em 1em;
			box-sizing: border-box;
			position: absolute;
			text-align: right;
			z-index: 9999999999999;
			width: 100%;
			background: #ccc;
			box-shadow: 0 0 0 #000;
		}
	}
	.imgPreview {
			position: relative;
			display: inline-block;
			width: 100px;
			height: 100px;
			vertical-align: top;
			margin-left: 1em;
			background: #ccc;
			border: 1px solid #ddd;
			img {
				max-width: 100%;
				max-height: 100%;
			}
			&:hover img {
				position: fixed;
				left: 0;
				top: 0;
			}
		}
	
	.logout-btn {
		position: absolute;
		bottom: 0;
	}
	
	.clearfix::after {
		display: block;
		content: '';
		clear: both;
	}
</style>