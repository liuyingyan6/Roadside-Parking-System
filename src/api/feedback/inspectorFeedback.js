import request from '@/uilts/request'

export default {
    findPage(num,size,param) {
        return request({
            url: `/inspectorFeedback/findPage/${num}/${size}`,
            method: 'post',
            data: param
        })
    },

    saveFeedback(fId,information) {
        return request({
            url: `/inspectorFeedback/handleFeedback/${fId}/${information}`,
            method: 'post',
            // data: information
        })
    }
}
