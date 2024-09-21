module.exports = {
	lintOnSave: false,
	devServer:{
		host:"localhost",
		port:8080,
		https:false,
		open:true,
		proxy:{
			'/api':{
				target:"http://127.0.0.1:7001",
				changeOrigin:true, // 是否跨域
				pathRewrite:{
					'^/api':''
				}
			},
			'/oss':{
				target:"http://demo-mp3.oss-cn-shenzhen.aliyuncs.com",
				changeOrigin:true, // 是否跨域
				pathRewrite:{
					'^/oss':''
				}
			}
		}
	}
}