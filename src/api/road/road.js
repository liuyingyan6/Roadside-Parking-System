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
    findAllByRoadName(roadName){
        return request({
            url: `/road/findAllByRoadName/${roadName}`,
            method: 'get',
        })
    }
}