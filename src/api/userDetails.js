import request from "@/uilts/request";


export default {
    accountPage(id) {
        return request({
            url: `/user/accountPage/${id}`,
            method: 'get'
        })
    },
    carConditionPage(pageNum,pageSize,userId,carConditionDTO) {
        return request({
            url: `/user/carConditionPage/${pageNum}/${pageSize}/${userId}`,
            method: 'post',
            data: carConditionDTO
        })
    },
    orderRecordPage(pageNum,pageSize,userId,OrderRecordDTO) {
        return request({
            url: `/user/orderRecordPage/${pageNum}/${pageSize}/${userId}`,
            method: 'post',
            data: OrderRecordDTO
        })
    },
}