import request from "@/uilts/request";

export default {
    findByPage(pageNum,pageSize,param){
        return request({
            url:`/parking/page/${pageNum}/${pageSize}`,
            method:'post',
            data:param
        })
    }
}