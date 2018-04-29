export const LocalStorageService = {
    setUser: function (user) {
        window.localStorage.setItem('user', JSON.stringify(user));
    },
    getUser: function () {
        let userString = window.localStorage.getItem('user');
        console.log(userString);
        if (!userString) {
            return;
        }
        return JSON.parse(userString);
    },
    setRedirectUrl: function (redirectUrl) {
        window.localStorage.setItem('redirectUrl', redirectUrl);
    },
    getRedirectUrl: function () {
        return window.localStorage.getItem('redirectUrl');
    },
    clearStorage() {
        window.localStorage.clear();
    }
}