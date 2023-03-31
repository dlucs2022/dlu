/* 导入我们自己创建的axios实例 */
import request from "@/utils/request"
export default {
    /* 1 登录 */
    login(){
        return request({
            /* 此处为进阶地址 （基本地址之后） */
            // url:`/testUser/login?username=${username}&password=${password}`,
            url:`/user/toLogin?username=test&password=123456`,
            method:'get'
        })
    },
}