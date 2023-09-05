import request from 'axios'

// 添加请求拦截器
request.interceptors.request.use(config => {

    // 获取本地存储的token
    const token = localStorage.getItem('accessToken')
    // 如果token存在，将其添加到请求头中
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(response => {//200响应码  HTTP状态码
    return response.data
}, async error => {//非200响应码
    //保存当前请求
    const originalRequest = error.config;
    // 如果返回状态码为401且请求未重试过，则表示令牌已过期
    if (error.response && error.response.status === 401) {
        originalRequest._retry = true;
        let refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            // 发送请求获取新的令牌
            const response = await request.post('token/refresh', {
                refreshToken: refreshToken
            })
            // 更新本地存储的令牌信息
            localStorage.setItem('accessToken', response.data.accessToken);
            // 将新令牌添加到请求头中
            request.defaults.headers.common['Authorization'] = response.data.accessToken;
            // 重新发起请求
            return request(originalRequest);
        } else {
            localStorage.clear();
            return Promise.reject('ReLogin');//抛出错误提醒，需要登录
        }
    } else if (error.response && error.response.status === 403) {
        // 重新登录
        localStorage.clear();
        return Promise.reject('ReLogin');//抛出错误提醒，需要登录
    }
    // 其他错误处理
    return Promise.reject(error)
})

export default request