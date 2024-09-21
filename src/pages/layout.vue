<template>
	<Layout style="height: 100vh;">
		<Header class="bg-white px-0" style="height: 60px;line-height: 60px;">
			
			 <Menu mode="horizontal" theme="light" 
			 :active-name="topActive" @on-select="handleSelect"
			 class="d-flex align-items-center">
				<div style="width: 200px;font-size: 25px;" class="text-center">
					企业网盘
				</div>
				<MenuItem :name="index" 
				v-for="(item,index) in topMenus"
				:key="index">
					<Icon :type="item.icon" />
					{{item.title}}
				</MenuItem>
				
				<div class="ml-auto mr-5">
					 <Dropdown style="margin-left: 20px" placement="bottom-end">
						<a href="javascript:void(0)">
							<Avatar :src="user.avatar || 'https://i.loli.net/2017/08/21/599a521472424.jpg'" />
							{{ user.nickname || user.username }}
							<Icon type="ios-arrow-down"></Icon>
						</a>
						<DropdownMenu slot="list">
							<DropdownItem @click.native="logout">安全退出</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</Menu>
			
		</Header>
		<Layout>
			<Sider style="background-color: #EBF0F1;position: relative;" hide-trigger>
				
				<Menu theme="light" active-name="1" width="200px"
				style="background-color: #EBF0F1;" @on-select="handleSiderSelect">
					<MenuGroup title="全部文件">
						<MenuItem name="all">
							<Icon type="md-document" />
							全部
						</MenuItem>
						<MenuItem name="image">
							<Icon type="md-document" />
							图片
						</MenuItem>
						<MenuItem name="video">
							<Icon type="md-chatbubbles" />
							 视频
						</MenuItem>
					</MenuGroup>
				</Menu>
				
				
				<div style="width: 200px;background-color: #EBF0F1;height: 55px;position: absolute;bottom: 0;left: 0;" class="px-3">
					<Progress :percent="progress" :stroke-color="['#108ee9', '#87d068']" hide-info/>
					<div class="d-flex mt-2" style="justify-content: space-between;">
						<small>总共：{{ total_size | bytesToSize }}</small>
						<small class="text-warning">已用：{{ used_size | bytesToSize }}</small>
					</div>
				</div>
			</Sider>
			<Content class="bg-white" style="position: relative;">
				<div style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;overflow-y: auto;">
					<router-view></router-view>
				</div>
			</Content>
		</Layout>
	</Layout>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		filters: {
			bytesToSize(bytes) {
				if (bytes === 0) return '0 KB';
				var k = 1000, // or 1024
				sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
				i = Math.floor(Math.log(bytes) / Math.log(k));
			 
			   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
			}
		},
		data() {
			return {
				topActive:0,
				topMenus: [{
					icon:"ios-paper",
					title:"网盘"
				},{
					icon:"ios-people",
					title:"分享"
				}],
				total_size:0,
				used_size:0
			}
		},
		created() {
			this.getSize()
		},
		mounted() {
			console.log(this.user);
		},
		computed: {
			...mapState({
				user:state=>{
					return state.user || {}
				}
			}),
			progress(){
				if(this.total_size === 0){
					return 0
				}
				let p = (this.used_size / this.total_size) * 100
				return Math.ceil(p)
			}
		},
		methods: {
			getSize(){
				this.axios.get('/api/getsize',{
					token:true
				}).then(res=>{
					this.total_size = res.data.total_size
					this.used_size = res.data.used_size
				})
			},
			// 监听选中顶部导航
			handleSelect(e) {
				this.topActive = e
				if(e === 0){
					this.$router.push({ name:"index" })
				} else {
					this.$router.push({ name:"share" })
				}
			},
			handleSiderSelect(name){
				this.$store.dispatch('updateList',name)
			},
			logout(){
				this.axios.post('/api/logout',{},{
					token:true
				}).then(res=>{
					// 清除登录状态和本地存储
					this.$store.dispatch('logout')
					this.$Message.success('退出成功')
					this.$router.push({ name:"login" })
				}).catch(err=>{
					// 清除登录状态和本地存储
					this.$store.dispatch('logout')
					this.$Message.success('退出成功')
					this.$router.push({ name:"login" })
				})
				
			}
		},
	}
</script>

<style>
	.ivu-progress-inner{
		background-color: #FFFFFF!important;
		border:1px solid #aaaaaa!important;
	}
</style>
