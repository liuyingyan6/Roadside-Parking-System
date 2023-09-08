import request from '@/uilts/request'

export default {
    findAll() {
        return request({
            url: `/information/findAll`,
            method: 'get',
        })
    },
    update(information){
        return request({
            url: `/information/update`,
            method: 'put',
            data: information
        })
    }
}
