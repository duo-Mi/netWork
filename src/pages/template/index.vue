<template>
	<div>
		<div class="border-bottom px-3" style="position: absolute;top: 0;left: 0;right: 0;" :style="'height: '+ ((dirs.length > 0) ? 130 : 90) +'px;'">
			<div class="d-flex align-items-center" style="height: 50px;">
				<Button type="primary" icon="ios-search" class="mr-2" @click="uploadModal = true">上传</Button>
				<Button icon="ios-search" class="mr-2" @click="createDir">新建文件夹</Button>
				<Button icon="ios-search" class="mr-2" v-if="checkedCount" @click="downloadAll">下载</Button>
				<Button icon="ios-search" class="mr-2" v-if="checkedCount === 1" @click="share(checkList[0].id)">分享</Button>
				<Button icon="ios-search" class="mr-2" v-if="checkedCount === 1" @click="rename(false)">重命名</Button>
				<Button icon="ios-search" class="mr-2" v-if="checkedCount" @click="deleteItem(0)">删除</Button>
				
				
				<Input class="ml-auto" style="width: 200px;" search enter-button placeholder="请输入关键词..." @on-search="search"/>
			</div>
			
			<div v-if="dirs.length" style="height: 40px;margin: 0 -20px;">
				<nav aria-label="breadcrumb">
				  <ol class="breadcrumb">
				    <li class="breadcrumb-item"><a href="#" @click="handleBreadcrumb({ id:0 })">根目录</a></li>
				    <li v-for="(item,index) in dirs" :key="index" class="breadcrumb-item active" aria-current="page">
						<a href="#" @click="handleBreadcrumb(item)">{{ item.name }}</a>
					</li>
				  </ol>
				</nav>
			</div>
			
			<div style="height: 40px;" 
			class="d-flex align-items-center">
				<Checkbox size="small" :value="checkAllStatus" @on-change="checkAllChange"><span class="ml-3">全选</span></Checkbox>
			</div>
		</div>
		
		<div style="position: absolute;overflow-y: auto;left: 0;right: 0;bottom: 0;" :style="'top: '+ ((dirs.length > 0) ? 130 : 90) +'px;'">
			
			<media-list v-for="(item,index) in list" :key="index" :item="item" :index="index" @on-event="handleEvent"></media-list>
			
			<div v-if="list.length === 0 && !loading" style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;overflow-y: auto;">
				<div class="text-center text-secondary pt-5 mt-5">暂无数据</div>
			</div>
			
			<div v-if="loading" style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;overflow-y: auto;">
				<div class="text-center text-secondary pt-5 mt-5">加载中...</div>
			</div>
			
		</div>
		
		<div class="d-none images" v-viewer>
		    <img v-for="(src,index) in images" :src="src" :key="index">
		</div>
		
		
		<!-- 上传文件 -->
		<Modal
			v-model="uploadModal"
			title="上传文件"
			fullscreen
			footer-hide
			@on-cancel="getData">
			<Upload
				:headers="{
					token
				}"
				multiple
				type="drag"
				:action="'/api/upload?file_id=' + file_id">
				<div style="padding: 20px 0">
					<Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
					<p>单击或拖动文件上传</p>
				</div>
			</Upload>
		</Modal>
		
		
	</div>
</template>

<script>
	import mediaList from '@/components/media-list.vue';
	import { mapState } from 'vuex'
	export default {
		components: {
			mediaList
		},
		data() {
			return {
				loading:false,
				dirs:[],
				list:[],
				uploadModal:false,
				fileType:"all"
			}
		},
		computed: {
			...mapState({
				token:state=>{
					return state.user ? state.user.token : null
				}
			}),
			images(){
				let urls = []
				this.list.forEach(item=>{
					if(item.type === 'image'){
						urls.push(item.url)
					}
				})
				return urls
			},
			checkList() {
				return this.list.filter(item=>item.checked)
			},
			checkAllStatus(){
				return this.checkList.length === this.list.length
			},
			checkedCount(){
				return this.checkList.length
			},
			file_id(){
				let l = this.dirs.length
				if(l === 0){
					return 0
				}
				return this.dirs[l-1].id
			}
		},
		created() {
			let dirs = window.localStorage.getItem('dirs')
			this.dirs = dirs ? JSON.parse(dirs) : []
			this.getData()
			
			this.$store.dispatch('onUpdateList',(type)=>{
				this.fileType = type
				this.getData()
			})
		},
		methods: {
			handleBreadcrumb(item){
				if(item.id === 0){
					this.dirs = []
					this.getData()
				} else {
					let i = this.dirs.findIndex(v=>v.id === item.id)
					if(i !== -1){
						this.dirs = this.dirs.filter((v,index)=>{
							return index <= i
						})
						this.getData()
					}
				}
				window.localStorage.setItem('dirs',JSON.stringify(this.dirs))
			},
			// 删除
			deleteItem(id = 0){
				this.$Modal.confirm({
					title:"提示",
					content:"是否删除选中文件？",
					onOk:()=>{
						let ids = []
						ids = id > 0 ? id : this.checkList.map(item=>item.id).join(',')
						
						this.axios.post('/api/file/delete',{
							ids
						},{
							token:true
						}).then(res=>{
							this.$Message.success('删除成功')
							this.getData()
						})
					}
				})
			},
			// 新建文件夹
			createDir(){
				let value = ''
				this.$Modal.confirm({
					title:"新建文件夹",
					render: (h) => {
						return h('Input', {
							props: {
								value: "",
								autofocus: true,
								placeholder: '请输入文件夹名称...'
							},
							on: {
								input: (val) => {
									value = val
								}
							}
						})
					},
					onOk:()=>{
						this.axios.post('/api/file/createdir',{
							file_id:this.file_id,
							name:value
						},{
							token:true
						}).then(res=>{
							this.getData()
							this.$Message.success('创建成功')
						})
					}
				})
			},
			formatList(data){
				return data.map(item=>{
					item.type = item.ext === '' ? 'dir' : item.ext.substring(0,item.ext.lastIndexOf('/'))
					item.checked = false
					return item
				})
			},
			// 加载数据
			getData(){
				this.loading = true
				this.list = []
				this.axios.get(`/api/file?file_id=${this.file_id}&type=${this.fileType}`,{ 
					token:true,
				}).then(res=>{
					let list = this.formatList(res.data)
					this.list = list
					this.loading = false
				}).catch(err=>{
					this.loading = false
				})
			},
			rename(index){
				let item = index !== false ? this.list[index] : this.checkList[0]
				let value = item.name
				this.$Modal.confirm({
					render: (h) => {
						return h('Input', {
							props: {
								value: value,
								autofocus: true,
								placeholder: '请填写新名称...'
							},
							on: {
								input: (val) => {
									value = val;
								}
							}
						})
					},
					onOk:()=>{
						this.axios.post('/api/file/rename',{
							id:item.id,
							name:value
						},{
							token:true
						}).then(res=>{
							this.getData()
							this.$Message.success('修改成功')
							this.checkAllChange(false)
						})
					}
				})
			},
			handleEvent(e) {
				switch (e.type){
					case 'delete':
					this.deleteItem(e.item.id)
						break;
					case 'checked':
					this.list[e.index].checked = e.value
						break;
					case 'rename':
					this.rename(e.index)
						break;
					case 'image':
					const viewer = this.$el.querySelector('.images').$viewer

					let index = this.images.findIndex(url=>url === e.url)
					viewer.view(index)
					viewer.show()
					
					
						break;
					case 'dir':
					this.dirs.push({
						id:e.item.id,
						name:e.item.name
					})
					this.getData()
					window.localStorage.setItem('dirs',JSON.stringify(this.dirs))
						break;
					case 'download':
					this.download(e.item.url,e.item.name)
						break;
					case 'share':
					this.share(e.id)
						break;
					default:
						break;
				}
			},
			share(id){
				this.$Modal.confirm({
					title:"分享",
					content:"是否要创建分享链接？",
					onOk:()=>{
						this.axios.post('/api/share/create',{
							file_id:id
						},{
							token:true
						}).then(res=>{
							setTimeout(()=>{
								this.$Modal.success({
									title:"创建成功",
									content:res.data,
									okText:"复制链接",
									onOk:()=>{
										this.$clipboard(res.data.replace('分享链接：',''))
										this.$Message.success('复制成功')
									}
								})
							},300)
						})
					}
				})
			},
			downloadAll(){
				this.checkList.forEach(item=>{
					if(!item.isdir){
						this.download(item.url,item.name)
					}
				})
			},
			// 下载
			download(url,name){
				url = url.replace('http://demo-mp3.oss-cn-shenzhen.aliyuncs.com','/oss')
				this.axios.get(url,{
					responseType:"blob"
				}).then(data=>{
					if(!data){
						return
					}
					let url = window.URL.createObjectURL(new Blob([data]))
					
					let link = document.createElement('a')
					link.style.display = 'none'
					link.href = url
					link.setAttribute('download',name)
					
					document.body.appendChild(link)
					
					link.click()
				})
			},
			checkAllChange(e){
				this.list.map(item=>{
					item.checked = e
				})
			},
			search(e){
				if(e == ''){
					return this.getData()
				}
				
				this.axios.get('/api/file/search?keyword=' + e,{
					token:true
				}).then(res=>{
					let list = this.formatList(res.data.rows)
					this.list = list
				})
			}
		},
	}
</script>

<style>
</style>
