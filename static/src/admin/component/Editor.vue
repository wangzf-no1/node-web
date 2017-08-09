<template>
	<!-- dblclick 控制是否全屏 -->
	<div class="editorInput" :class="{full:full%2}" @dblclick="++full"></div>
</template>

<script>
	import E from 'wangeditor'

	export default {
		name: 'editor',
		data() {
			return {
				full: 0
			}
		},

		props: {
			content: Object
		},
		mounted() {
			this.$watch('content', (n, o) => {
				editor.txt.html(n.value)

			})
			var editor = new E(this.$el)
			editor.customConfig.onchange = (html) => {
				this.content.value = html
			}
			editor.customConfig.uploadImgServer = '/api/posts/upload-img'
			editor.customConfig.uploadImgParams = {}
			editor.customConfig.uploadFileName = 'files'
			editor.create()
			editor.txt.html(this.content.value)
			let last = this.$el.lastChild
			//去掉 原版编辑器 默认300高度的行内样式
			if(last.className.indexOf('w-e-text-container') >= 0) {
				last.style.height = ''
			}
		}
	}
</script>
<style>
	.editorInput.full {
		position: fixed;
		height: 100%;
		width: 100%;
		z-index: 999999;
		left: 0;
		top: 0;
		background: #fff;
	}
	
	.w-e-text-container {
		height: 300px;
	}
	
	.editorInput.full .w-e-text-container {
		height: 90%;
	}
</style>