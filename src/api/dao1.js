
export default {
    checkList() {
        const list =
        {
            "code": 200,
            "message": "success",
            "data": [
                {
                    "name": "test3",
                    "password": "",
                    "invite_code": "555a",
                    "create_time": "2023-03-31 19:23:50",
                    "status": "待审核"
                },
                {
                    "name": "test4",
                    "password": "",
                    "invite_code": "555a",
                    "create_time": "2023-03-31 19:23:50",
                    "status": "已通过"
                },
                {
                    "name": "test5",
                    "password": "",
                    "invite_code": "555a",
                    "create_time": "2023-03-31 19:23:50",
                    "status": "已拒绝"
                },
                {
                    "name": "testw",
                    "password": "",
                    "invite_code": "555a",
                    "create_time": "2023-03-31 19:23:50",
                    "status": "待审核"
                }
            ]
        }
        return list

    },
    login() {
        const person = {
            name: "John",
            age: 30,
            city: "New York"
        };

        const json = JSON.stringify(person);
        const str = JSON.parse(json);
        return str
    },
    check_username(username) {
        const user = {
            code: 200,
            message: "success",
            data: `Welcome, ${username}!`
        };
        return user
    },

    check_invitationcode(invitationcode) {

        const success = {
            code: 200,
            message: "success",
            data: `${invitationcode}!`
        };

        const failed = {
            code: 200,
            message: "failed",
            data: "failed"
        };

        return success
    }
}