import request from '@/uilts/request'

export default {
    findPage(num,size,param) {
        return request({
            url: `/userFeedback/findPage/${num}/${size}`,
            method: 'post',
            data: param
        })
    },
    update(userFeedback){
        return request({
            url: `/userFeedback/update`,
            method: 'put',
            data: userFeedback
        })
    }
}
