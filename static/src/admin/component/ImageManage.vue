<template>
	<div class="imageManage">
		<!--:crop="true"
        :crop-ratio="auto"-->
		<vue-core-image-upload class="el-button el-button--primary crop-btn" url="/api/posts/upload-img" extensions="png,jpeg,jpg" v-on:imageuploaded="uploadImgSuccess">
		</vue-core-image-upload>
		<el-button @click="changeImg('')">清除选定</el-button>
		点击选定 <img :src="ship[keyname]" class="checkedImg" />
		<el-collapse v-model="openYear">
			<el-collapse-item :title="year.dir" :name="year.dir" :key="year.dir" v-for="year in images">
				<div class="month-section" :key="month.dir" v-for="month in year.children">
					<div>{{month.dir}}</div>
					<div class="clearfix">
						<div class="img-box" :key="img" v-for="img in month.children" @click="changeImg(`/static/${year.dir}/${month.dir}/${img}`)">
							<img :src="`/static/${year.dir}/${month.dir}/${img}`" alt="">
							<div class="tool-box">
								<i class="el-icon-delete2" @click="deleteImg(`${year.dir}/${month.dir}/${img}`)"></i>
							</div>
						</div>
					</div>
				</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script>
	import Vue from 'vue'
	import VueCoreImageUpload from 'vue-core-image-upload'
	import {
		Button,
		Dialog,
		Collapse,
		CollapseItem
	} from 'element-ui'
	Vue.use(Button)
	Vue.use(Collapse)
	Vue.use(CollapseItem)
	Vue.use(Dialog)

	export default {
		name: 'ImageManage',
		components: {
			VueCoreImageUpload
		},
		data() {
			return {
				keyname:'src',
				images: [],
				openYear: '1'
			}
		},
		props: {
			ship: Object
		},
		created() {
			/*this.$on('toggleShow', function() {
				this.obj.show = !this.obj.show
			})*/
			
			this.getUploadedImage()
		},
		mounted(){
				if('img' in this.ship)this.keyname='img'

		},
		methods: {
			getUploadedImage() {
				this.$http.get('/api/posts/upload-img/list')
					.then(res => res.body)
					.then(res => {
						this.images = res
						if(this.images[0]) {
							this.openYear = this.images[0].dir
						}

					})
			},
			uploadImgSuccess(res) {
				// 把返回的图片 url 直接插到 markdown 中
				// 默认加到后面，想放在其他地方需要手动移，后面查一下 textarea 光标位置
				// this.post.content += `![test img](${res})`
				this.getUploadedImage()
			},
			deleteImg(file) {
				this.$http.delete(`/api/posts/upload-img/${file}`)
					.then(res => res.body)
					.then(res => {
						this.getUploadedImage()
					})
			},
			changeImg(file) {
				this.ship[this.keyname] = file
			}
		}
	}
</script>

<style lang="less">
	.imageManage {
		.checkedImg {
			height: 2em;
		}
		.img-box {
			float: left;
			position: relative;
			width: 100px;
			height: 100px;
			margin: 0 10px 10px 0;
			img {
				width: 100%;
				height: 100%;
			}
			&:hover {
				.tool-box {
					display: block;
				}
			}
			.tool-box {
				display: none;
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 30px;
				padding: 5px 10px;
				box-sizing: border-box;
				background-color: rgba(0, 0, 0, .4);
				i {
					cursor: pointer;
					font-size: 1.5em;
					color: #fff;
					&:hover {
						color: #20a0ff;
					}
				}
			}
		}
	}
</style>