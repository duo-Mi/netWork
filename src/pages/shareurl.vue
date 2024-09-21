<template>
	<div class="container pt-5">
		<shareurl-list v-for="(item,index) in list" :key="index" :item="item" :index="index" @on-event="handleEvent"></shareurl-list>
		
		<div v-if="list.length === 0 && !loading" style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;overflow-y: auto;">
			<div class="text-center text-secondary pt-5 mt-5">暂无数据</div>
		</div>
		
		<div v-if="loading" style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;overflow-y: auto;">
			<div class="text-center text-secondary pt-5 mt-5">加载中...</div>
		</div>
		
		
		<Modal
			v-model="modal"
			:title="'当前选中：' + (dir ? dir.name : '根目录')"
			@on-ok="ok"
			>
			<div v-if="dirs.length" style="height: 40px;">
				<nav aria-label="breadcrumb">
				  <ol class="breadcrumb">
				    <li class="breadcrumb-item"><a href="#" @click="handleBreadcrumb({ id:0 })">根目录</a></li>
				    <li v-for="(item,index) in dirs" :key="index" class="breadcrumb-item active" aria-current="page">
						<a href="#" @click="handleBreadcrumb(item)">{{ item.name }}</a>
					</li>
				  </ol>
				</nav>
			</div>
			<Table height="200" highlight-row @on-current-change="onCurrentChange" :columns="columns" :data="data">
				<template slot-scope="{ row }" slot="name">
					<div @dblclick="handleDblclick(row)">
						<i class="iconfont mr-3 icon-file-b-2 text-warning" style="font-size: 28px;"></i>
						<strong>{{ row.name }}</strong>
					</div>
				</template>
			</Table>
		</Modal>
		
		
	</div>
</template>

<script>
	let key = ''
	import shareurlList from '../components/shareurl-list.vue';
	export default {
		beforeRouteEnter(to,from,next) {
			key = to.query.key
			next()
		},
		components:{
			shareurlList
		},
		data(){
			return {
				list:[],
				loading:false,
				modal:false,
				dir:false,
				dirs:[],
				columns: [{
					title: '目录',
					slot: 'name'
				}],
				data: []
			}
		},
		created(){
			this.getData()
		},
		computed:{
			file_id(){
				let l = this.dirs.length
				if(l === 0){
					return 0
				}
				return this.dirs[l-1].id
			}
		},
		methods:{
			handleBreadcrumb(item){
				if(item.id === 0){
					this.dirs = []
					this.getFileList()
					this.dir = false
				} else {
					let i = this.dirs.findIndex(v=>v.id === item.id)
					if(i !== -1){
						this.dir = {
							id:this.dirs[i].id,
							name:this.dirs[i].name,
						}
						this.dirs = this.dirs.filter((v,index)=>{
							return index <= i
						})
						this.getFileList()
					}
				}
			},
			handleDblclick(row){
				this.dirs.push({
					id:row.id,
					name:row.name
				})
				this.getFileList()
			},
			getFileList(){
				this.axios.get(`/api/file?file_id=${this.file_id}&isdir=1`,{
					token:true
				}).then(res=>{
					this.data = res.data
				})
			},
			onCurrentChange(e){
				this.dir = {
					id:e.id,
					name:e.name
				}
			},
			formatList(data){
				return data.map(item=>{
					item.type = item.ext === '' ? 'dir' : item.ext.substring(0,item.ext.lastIndexOf('/'))
					return item
				})
			},
			getData(){
				this.loading = true
				this.axios.get('/api/share/'+key,{
					token:true
				}).then(res=>{
					this.list = this.formatList(res.data)
					this.loading = false
				}).catch(err=>{
					this.loading = false
				})
			},
			handleEvent(e) {
				switch (e.type){
					case "save":
					this.dir = false
					this.getFileList()
					this.modal = true
						break;
					default:
						break;
				}
			},
			ok(){
				let dir_id = this.dir ? this.dir.id : 0
				this.axios.post('/api/share/save_to_self',{
					dir_id,
					sharedurl:key
				},{
					token:true
				}).then(res=>{
					this.$Message.success('保存成功')
				})
			}
		}
	}
</script>

<style>
</style>
