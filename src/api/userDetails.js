import request from "@/uilts/request";


export default {
    accountPage(id) {
        return request({
            url: `/user/accountPage/${id}`,
            method: 'get'
        })
    },
    findPageCarCase(pageNum,pageSize,id,userDTO) {
        return request({
            url: `/user/findPage/${pageNum}/${pageSize}/${id}`,
            method: 'post',
            data: userDTO
        })
    },
}