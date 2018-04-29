const firebase = window.firebase;

export const FileService = {
    uploadFile(file, uid) {
        return new Promise((resolve, reject) => {
            firebase.storage().ref(`images/${uid}/profile.jpg`).put(file).then(
            (snapshot) => {
                return resolve(snapshot.downloadURL);
            }).catch(
                (err) => {
                    console.log(err);
                    return resolve();
                }
            );
        });
    }
};