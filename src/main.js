import Vue from 'vue'
import App from './App.vue'
import router from './router'


Vue.config.productionTip = false


//引入全局的CSS
import './assets/css/global.css'

//引入axios
import axios from 'axios'
//SpringBoot运营端的访问路径
axios.defaults.baseURL = "http://localhost:9090/"

Vue.prototype.$axios = axios;


//引入ElemntUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)


new Vue({
    router,
    render: function (h) {
        return h(App)
    }
}).$mount('#app')
