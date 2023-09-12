import request from "@/uilts/request";

export default {
    orderStatusCount(inspectorId) {
        return request({
            url: `/order/orderStatusCount/${inspectorId}`,
            method: 'get'
        })
    },
    findAllByInspectorId(inspectorId,pageNum,pageSize,orderDTO) {
        return request({
            url: `/order/findAllByInspectorId/${pageNum}/${pageSize}/${inspectorId}`,
            method: 'post',
            data: orderDTO
        })
    },
    findAll2ByInspectorId(inspectorId,pageNum,pageSize,orderDTO) {
        return request({
            url: `/order/findAll2ByInspectorId/${pageNum}/${pageSize}/${inspectorId}`,
            method: 'post',
            data: orderDTO
        })
    },
}