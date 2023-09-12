import request from "@/uilts/request";

export default {
    findByInspectorId(inspectorId,month){
        return request({
            url:`/clockIn/findByInspectorId/${inspectorId}/${month}`,
            method:'get'
        })
    },
    findByInspectorIdCount(inspectorId,month){
        return request({
            url:`/clockIn/findByInspectorIdCount/${inspectorId}/${month}`,
            method:'get'
        })
    }
}