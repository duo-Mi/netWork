<template>
	<div class="border-bottom px-3 py-2 file-list">
		<Row>
			<Col span="12" class="d-flex align-items-center">
				<i class="iconfont mr-3" :class="icon" style="font-size: 28px;"></i>
				<small>{{item.name}}</small>
				
				<div class="ml-auto text-primary">
					<Tooltip content="保存" 
					placement="bottom">
					    <Icon type="md-share" size="18" class="mx-2" style="cursor: pointer;" @click="save"/>
					</Tooltip>
				</div>
			</Col>
			<Col span="6" style="height: 42px;" class="d-flex align-items-center">-</Col>
			<Col span="6" style="height: 42px;" class="d-flex align-items-center"><small class="text-secondary">{{item.created_time}}</small></Col>
		</Row>
	</div>
</template>

<script>
	const icons = {
		dir:{
			icon:"icon-file-b-2",
			color:"text-warning"
		},
		image:{
			icon:"icon-file-b-6",
			color:"text-success"
		},
		video:{
			icon:"icon-file-b-9",
			color:"text-primary"
		},
		text:{
			icon:"icon-file-s-7",
			color:"text-info"
		},
		none:{
			icon:"icon-file-b-8",
			color:"text-muted"
		},
	};
	export default {
		props: {
			item: Object,
			index:[Number,String]
		},
		data() {
			return {
				value: ""
			}
		},
		computed: {
			icon() {
				let o = icons[this.item.type]
				return `${o.icon} ${o.color}`
			}
		},
		methods:{
			save(){
				this.$emit('on-event',{
					type:"save",
					id:this.item.id,
				})
			}
		}
	}
</script>

<style>
	.file-list:hover{
		background-color: rgba(45,140,240,0.1)!important;
	}
	.file-list .hide{
		display: none;
	}
	.file-list:hover .hide{
		display: flex;
	}
</style>
