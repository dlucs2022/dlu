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
    },
    /* 判断邀请码是否存在 */
    check_invitationcode(code){
        return request({
            url:`/user/be_invited?code=${code}`,
            method:'post',
        })
    },
    /* 判断用户名是否已经存在 */
    check_username(userName){
        return request({
            url:`/user/check_name?name=${userName}`,
            method:'post'
        })
    },
    /* 注册 */
    register(regForm){
        delete regForm.checkPass
        return request({
            url:`/user/register`,
            method:'post',
            data:regForm,

        })
    },

    /* 获取待审核列表 */
    checkList(invite_code,pageNumber,pageSize){
        console.log(invite_code);
        return request({
            url:`/user/checkList`,
            params:{
                pageNumber:pageNumber,
                pageSize:pageSize,
                invite_code:invite_code,
            },
            method:'post'
        })
    }
}