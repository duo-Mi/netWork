import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

Vue.use(ViewUI);

import Clipboard from 'v-clipboard'
Vue.use(Clipboard)

// import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'

Vue.use(Viewer);

import router from './router.js';
import store from './store'

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
