<template>
	<div class="d-flex justify-content-center" style="height: 100vh;background-color: #515a6e;">
		
		<div class="bg-white rounded px-3 pt-3" style="width: 380px;margin-top: 50px;height: max-content;">
			<div class="d-flex flex-column align-items-center justify-content-center mb-4">
				<div class="d-flex align-items-center">
					<Icon type="md-briefcase" size="55" color="#2db7f5"/>
					<h3 class="text-muted ml-2">企业网盘</h3>
				</div>
				<span class="text-muted small mt-3">企业级网盘解决方案</span>
			</div>
			<Form ref="form" :label-width="0" :model="formItem" :rules="rules">
				<FormItem prop="username">
					<Input v-model="formItem.username" placeholder="请输入用户名..."></Input>
				</FormItem>
				<FormItem prop="password">
					<Input v-model="formItem.password" placeholder="请输入密码..." type="password"></Input>
				</FormItem>
				<FormItem prop="repassword" v-if="type === 'reg'">
					<Input v-model="formItem.repassword" placeholder="请输入确认密码..." type="password"></Input>
				</FormItem>
				<div class="d-flex align-items-center mb-2">
					<!-- <Checkbox v-model="formItem.remember">自动登录</Checkbox> -->
					<a href="#" class="small ml-auto" @click="changeType">{{ type === 'login' ? '注册账户' : '登录账户' }}</a>
				</div>
				<FormItem>
					<Button :loading="loading" type="primary" long @click="sumbit">{{ type === 'login' ? '登 录' : '注 册' }}</Button>
				</FormItem>
			</Form>
		</div>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading:false,
				type:"login",
				formItem:{
					username:"",
					password:"",
					repassword:""
				},
				rules:{
					username:[{
						required: true, 
						message: '请输入用户名...', 
						trigger: 'blur'
					}],
					password:[{
						required: true,
						message: '请输入密码...', 
						trigger: 'blur'
					}],
					repassword:[{
						required: true,
						message: '请输入确认密码...', 
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			changeType(){
				this.type = this.type === 'login' ? 'reg' : 'login'
			},
			sumbit() {
				this.$refs.form.validate((valid)=>{
					if(!valid) return
					let text = this.type === 'login' ? '登录' : '注册'
					this.loading = true
					this.axios.post('/api/'+this.type,this.formItem).then(res=>{
						this.loading = false
						this.$Message.success(text + '成功')
						if(this.type === 'reg'){
							this.type = 'login'
						} else {
							// 存储登录状态
							this.$store.dispatch('login',res.data)
							// 跳转到首页
							this.$router.push({ name:"index" })
						}
					}).catch(err=>{
						this.loading = false
					})
					
				})
			}
		},
	}
</script>

<style>
</style>
