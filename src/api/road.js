import Road from "@/views/road/Road"
import request from "axios";

export default {
    findByPage(pageNum,pageSize,param){
        return request({
            url:`/road/page/${pageNum}/${pageSize}`,
            method:'post',
            data:param
        })
    }
}