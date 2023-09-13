import request from '@/uilts/request'

export default {
    findPage(pageNum,pageSize,userDTO) {
        return request({
            url: `/user/findPage/${pageNum}/${pageSize}`,
            method: 'post',
            data: userDTO
        })
    },
    removeRoleById(user) {
        return request({
            url: `/user/update`,
            method: 'put',
            data: user
        })
    }
}
