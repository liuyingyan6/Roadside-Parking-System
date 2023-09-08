import request from "@/uilts/request";

export default {
    findByPage(pageNum,pageSize,param){
        return request({
            url:`/road/page/${pageNum}/${pageSize}`,
            method:'post',
            data:param
        })
    },
    Disabled(param) {
        return request({
            url: `/road/update`,
            method: 'put',
            data: param
        })
    },
    parkingCount(id){
        return request({
            url:`/parking/count/${pageNum}/${pageSize}`,
            method:'get',
            data:param
        })
    }
}