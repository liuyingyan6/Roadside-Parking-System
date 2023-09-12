import request from '@/uilts/request'

export default {
    findPage(num, size, param) {
        return request({
            url: `/inspector/findPage/${num}/${size}`,
            method: 'post',
            data: param
        })
    },
    saveInspector(inspector) {
        return request({
            url: `/inspector/saveInspector`,
            method: 'post',
            data: inspector
        })
    },
    updateInspector(inspector) {
        return request({
            url: `/inspector/updateInspector`,
            method: 'put',
            data: inspector
        })
    },
    deleteById(id) {
        return request({
            url: `/inspector/deleteById/${id}`,
            method: 'delete'
        })
    },
    removeRoleById(inspector) {
        return request({
            url: `/inspector/updateState`,
            method: 'put',
            data: inspector
        })
    }
}