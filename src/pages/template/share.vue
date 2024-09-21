<template>
	<div>
		<share-list v-for="(item,index) in list" :key="index" :index="index" :item="item"></share-list>
		
		<div v-if="list.length === 0 && !loading" style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;overflow-y: auto;">
			<div class="text-center text-secondary pt-5 mt-5">暂无数据</div>
		</div>
		
		<div v-if="loading" style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;overflow-y: auto;">
			<div class="text-center text-secondary pt-5 mt-5">加载中...</div>
		</div>
	</div>
</template>

<script>
	import shareList from '@/components/share-list.vue';
	export default {
		components: {
			shareList
		},
		data() {
			return {
				list: [],
				loading:false,
			}
		},
		created() {
			this.getData()
		},
		methods: {
			getData() {
				this.loading = true
				this.axios.get('/api/share/list',{
					token:true
				}).then(res=>{
					this.list = this.formatList(res.data)
					this.loading = false
				}).catch(err=>{
					this.loading = false
				})
			},
			formatList(data){
				return data.map(item=>{
					item.file.type = item.file.ext === '' ? 'dir' : item.file.ext.substring(0,item.file.ext.lastIndexOf('/'))
					return item
				})
			}
		},
	}
</script>

<style>
</style>
