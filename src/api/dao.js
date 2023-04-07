/* 导入我们自己创建的axios实例 */
import request from "@/utils/request"
export default {
    /* 1 登录 */
    login(name,password,code){
        return request({
            /* 此处为进阶地址 （基本地址之后） */
            // url:`/testUser/login?username=${username}&password=${password}`,
            url:`/user/login?name=${name}&password=${password}&code=${code}`,
            method:'post'
        })
    },
    /* 2获取验证码 */
    getCode(){
        return request({
            url:'/code',
            method:'get',
            responseType:'blob'
        })
    }
}