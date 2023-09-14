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
            url: `/road/disableRoad`,
            method: 'put',
            data: param
        })
    },
    editRoad(road){
        return request({
            url: `/road/update`,
            method: 'put',
            data: road
        })
    }
}