import request from '@/uilts/request'

export default {
    findPage(num,size,param) {
        return request({
            url: `/userFeedback/findPage/${num}/${size}`,
            method: 'post',
            data: param
        })
    }
}
