<template>
	<div class="border-bottom px-3 py-2 file-list" @dblclick.stop="clickEvent">
		<Row>
			<Col span="12" class="d-flex align-items-center">
				<Checkbox size="small" class="mb-0 mr-3" :value="item.checked" @on-change="onChange"></Checkbox>
				<i class="iconfont mr-3" :class="icon" style="font-size: 28px;"></i>
				<small>{{item.name}}</small>
				
				<div class="ml-auto text-primary hide">
					<Tooltip content="分享" 
					placement="bottom">
					    <Icon type="md-share" size="18" class="mx-2" style="cursor: pointer;" @click="share"/>
					</Tooltip>
					<Tooltip v-if="!item.isdir" content="下载"
					placement="bottom">
					    <Icon type="md-cloud-download" size="18" class="mx-2" style="cursor: pointer;" @click="download"/>
					</Tooltip>
					 <Dropdown>
						<Icon type="ios-more" size="18" class="mx-2" style="cursor: pointer;"/>
						<DropdownMenu slot="list">
							<DropdownItem @click.native="rename">重命名</DropdownItem>
							<DropdownItem @click.native="deleteItem">删除</DropdownItem>
						</DropdownMenu>
					</Dropdown>
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
			clickEvent(){
				console.log(this.item);
				if(this.item.type === 'image'){
					this.$emit('on-event',{
						type:"image",
						url:this.item.url
					})
				} else {
					this.$emit('on-event',{
						type:this.item.type,
						item:this.item
					})
				}
			},
			deleteItem(){
				this.$emit('on-event',{
					type:"delete",
					item:this.item,
					index:this.index
				})
			},
			onChange(e){
				this.$emit('on-event',{
					type:"checked",
					index:this.index,
					value:e
				})
			},
			download(){
				this.$emit('on-event',{
					type:"download",
					item:this.item,
				})
			},
			rename(){
				this.$emit('on-event',{
					type:"rename",
					index:this.index,
				})
			},
			share(){
				this.$emit('on-event',{
					type:"share",
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
