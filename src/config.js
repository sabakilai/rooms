const authServerUrl = 'http://localhost:3003';
export const Config = {
    vk: {
        id: 6345873,
        secretKey: 'W1GyrjrxyfMCHRvCsrB7',
        key: '864165e6864165e6864165e6a98621b17788641864165e6dc28c21eabe1724ad70064fb',
        auth_url: 'https://oauth.vk.com/authorize',
        scope: 'email,friends,photos', // permission добавлять новые через запятую -
        // https://vk.com/pages?oid=-1&p=%D0%9F%D1%80%D0%B0%D0%B2%D0%B0_%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%B0_%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B9
        redirect_uri: 'https://roomskg-c9b1c.firebaseapp.com/login/vk', //'http://localhost:3000/login/vk',
        fields: 'first_name,last_name,mail,city,bdate,sex,country,education,status,interests,schools,photo,has_photo,photo_100,photo_id',
        // добавлять новые через запятую
        method: {
            userGet: 'users.get',
            photosGetAll: 'photos.getAll'
        },
        version: '5.71'
    },
    ok: {
        params: {
            appId: '1261885440',
            appKey: 'CBAJNHDMEBABABABA'

        },
        scope: 'VALUABLE_ACCESS;LONG_ACCESS_TOKEN;GET_EMAIL;PHOTO_CONTENT', // https://apiok.ru/ext/oauth/permissions
        redirect_uri: 'https://roomskg-c9b1c.firebaseapp.com/login/ok',
        methods: {
            users: {
                getCurrentUser: 'users.getCurrentUser'
            },
            photos: {
                getPhotos: 'photos.getPhotos'
            }
        },
        authUrl: 'https://connect.ok.ru/oauth/authorize',
        apiUrl: 'https://api.ok.ru/fb.do',
        access_token: 'tkn10X3wQshDvuCfJGyFkY4waCVC0QVZFQRj9sT5TTKnZmv9I810gXVVngTXNwOOu7x2B',
        secret_session_key: '54ebeccdb0beef4cfc2b960b40ad494e'
    },
    authServer: {
        url: authServerUrl,
        getCustomToken: {
            url: 'https://us-central1-roomskg-c9b1c.cloudfunctions.net/api/getCustomToken',
            method: 'POST',
            fields: 'uid-string,'
        }
    },
    chatUrl: 'https://loco.namba1.co/minivid2.html'
}