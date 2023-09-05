import request from '@/uilts/request'


export default {
    findPermission(id) {
        return request({
            url: `/urlPermission/findPermission/${id}`,
            method: 'get'
        })
    }
}