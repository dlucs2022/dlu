
export default {
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