/* 导入我们自己创建的axios实例 */
import request from "@/utils/request";
export default {
    /* 1 登录 */
    login(name, password, code) {
        return request({
            /* 此处为进阶地址 （基本地址之后） */
            // url:`/testUser/login?username=${username}&password=${password}`,
            url: `/user/login?name=${name}&password=${password}&code=${code}`,
            method: "post",
        });
    },
    /* 2获取验证码 */
    getCode() {
        return request({
            url: "/code",
            method: "get",
            responseType: "blob",
        });
    },
    /* 判断邀请码是否存在 */
    check_invitationcode(code) {
        return request({
            url: `/user/be_invited?code=${code}`,
            method: "post",
        });
    },
    /* 判断用户名是否已经存在 */
    check_username(userName) {
        return request({
            url: `/user/check_name?name=${userName}`,
            method: "post",
        });
    },
    /* 注册 */
    register(regForm) {
        delete regForm.checkPass;
        return request({
            url: `/user/register`,
            method: "post",
            data: regForm,
        });
    },
    // 获取用户密码
    getPassword(userName) {
        return request({
            /* 此处为进阶地址 （基本地址之后） */
            // url:`/testUser/login?username=${username}&password=${password}`,
            url: `/user/getPassword?name=${userName}`,
            method: "post",
        });
    },
    // 修改用户密码
    updatePassword(username, userPassword) {
        return request({
            /* 此处为进阶地址 （基本地址之后） */
            // url:`/testUser/login?username=${username}&password=${password}`,
            url: `/user/updatePassword?name=${username}&password=${userPassword}`,
            method: "post",
        });
    },
    /* 获取待审核列表 */
    checkList(invite_code, pageNumber, pageSize) {
        // console.log(invite_code);
        return request({
            url: `/user/checkList`,
            params: {
                pageNumber: pageNumber,
                pageSize: pageSize,
                invite_code: invite_code,
            },
            method: "post",
        });
    },
    Pass(userList) {
        return request({
            url: `/user/multiPass`,
            // list: userList,
            method: "post",
            params: { list: userList },
        });
    },
    Refuse(userList) {
        return request({
            url: `/user/multiRefuse`,
            method: "post",
            params: { list: userList },
        });
    },
    folderComplete(userName, invite_code, folderName, file_number, size) {
        return request({
            url: `/file/folderComplete`,
            method: "post",
            params: {
                userName: userName,
                invite_code: invite_code,
                file_name: folderName,
                file_number: file_number,
                size: size,
            },
        });
    },
    queryFolderByInviteCode(invite_code) {
        return request({
            url: `/file/queryFolderByInviteCode`,
            method: "post",
            params: {
                invite_code: invite_code,
            },
        });
    },
    queryFolderByFileName(invite_code, file_name) {
        return request({
            url: `/file/queryFolderByFileName`,
            method: "post",
            params: {
                invite_code: invite_code,
                file_name: file_name,
            },
        });
    },
    fileRename(path, reName) {
        return request({
            url: `/file/fileRename`,
            method: "post",
            params: {
                path: path,
                reName: reName,
            },
        });
    },
    deleteFileByPath(path) {
        return request({
            url: `/file/deleteFileByPath`,
            method: "post",
            params: {
                path: path,
            },
        });
    },
    queryImgList(path) {
        return request({
            url: "/file/queryImgList",
            method: "post",
            params: {
                path: path,
            },
        });
    },
    getAiByRootPath(path) {
        return request({
            url: `http://127.0.0.1:80/detect_dir`,
            method: "post",
            data: JSON.stringify({ directory: path, conf: 0.5 }),
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
        });
    },
    queryPregress(task_id) {
        return request({
            url: `http://127.0.0.1:80/progress/${task_id}`,
            method: "get",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
        });
    },
    queryRes(task_id) {
        return request({
            url: `http://127.0.0.1:80/result/${task_id}`,
            method: "get",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            },
        });
    },
    cloudLabel() {
        const cloudList = [
            {
                labels_name: "LSM数据专用",
                lebels_data:
                    [
                        {
                            father: "鸟",
                            children: "星鸦",
                            keyValue: "",
                        },
                        {
                            father: "兽",
                            children: "掩面果狸",
                            keyValue: "",
                        },
                        {
                            father: "鸟",
                            children: "阿萨姆噪鹛",
                            keyValue: "",
                        },
                        {
                            father: "鸟",
                            children: "深红色玫瑰鹦鹉",
                            keyValue: "",
                        },
                        {
                            father: "鸟",
                            children: "巨笑鹛",
                            keyValue: "",
                        },
                        {
                            father: "兽",
                            children: "豹猫",
                            keyValue: "",
                        },
                        {
                            father: "鸟",
                            children: "克拉斯雉鸡",
                            keyValue: "",
                        },
                        {
                            father: "鸟",
                            children: "艾略特噪鹛",
                            keyValue: "",
                        },
                        {
                            father: "鸟",
                            children: "安氏雉",
                            keyValue: "",
                        },
                        {
                            father: "狗",
                            children: "狗",
                            keyValue: "",
                        },
                        {
                            father: "兽",
                            children: "黄喉貂",
                            keyValue: "",
                        },
                        {
                            father: "兽",
                            children: "亚洲黑熊",
                            keyValue: "",
                        },
                        {
                            father: "兽",
                            children: "云南兔",
                            keyValue: "",
                        },
                        {
                            father: "鸟",
                            children: "黑脸噪鹛",
                            keyValue: "",
                        },
                        {
                            father: "羊",
                            children: "绵羊",
                            keyValue: "",
                        },
                        {
                            father: "鸟",
                            children: "栗背鸫",
                            keyValue: "",
                        },
                        {
                            father: "兽",
                            children: "树鼩",
                            keyValue: "",
                        },
                        {
                            father: "兽",
                            children: "白鹿",
                            keyValue: "",
                        },
                        {
                            father: "兽",
                            children: "牦牛",
                            keyValue: "",
                        },
                        {
                            father: "兽",
                            children: "马鹿",
                            keyValue: "",
                        },
                        {
                            father: "兽",
                            children: "松鼠",
                            keyValue: "",
                        },
                        {
                            father: "马",
                            children: "马",
                            keyValue: "",
                        },
                        {
                            father: "兽",
                            children: "黑鼻短吻猴",
                            keyValue: "",
                        },
                        {
                            father: "人",
                            children: "人类",
                            keyValue: "",
                        },
                        {
                            father: "羊",
                            children: "山羊",
                            keyValue: "",
                        },
                        {
                            father: "羊",
                            children: "奶牛",
                            keyValue: "",
                        },
                    ]
            }
        })
    },

    upload_now_lebels(name,labels_name,labels){
        // console.log(name);
        return request({
            url:`/file/upload_now_lebels?name=${name}&labels_name=${labels_name}`,
            method:"post",
            data:{
                labels:labels
            },
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
    }

        ];
        return cloudList;
    },
};
