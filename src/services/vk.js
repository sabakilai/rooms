import { Config } from '../config';
const VK = window.VK;

export const VKService = {
    /**
     * This method is used to initialize and setup the SDK
     * @param params
     */
    init() {
        if (!VK || !VK.init) {
            return console.log('Vk is not defind');
        }
        VK.init({ apiId: Config.vk.id, v: "5.71" });
    },
  
      /**
       * This method lets you make calls to the Open API
       * @param
       */ 
    api(method, fields) {
          return new Promise((resolve, reject) => {
                  if (!VK || !VK.Api || !VK.Api.call) {
                      reject('Vk or her methods is not defind');
                  }
                  VK.Api.call(method, fields, (response) => {
                      if (!response) {
                          reject();
                      } else if (response.error) {
                          reject(response.error);
                      } else {
                          resolve(response);
                      }
                  });
              }
          );
      },
  
    login() {
          return new Promise(
              (resolve, reject) => {
                  if (!VK || !VK.login) {
                      reject('Vk or her methods is not defind');
                  }
                  VK.Auth.login((response) => {
                      if (response) {
                          resolve(response);
                      } else {
                          reject();
                      }
                  });
              }
          )
      },
  
    logout() {
          return new Promise(
              (resolve, reject) => {
                  if (!VK || !VK.Auth || !VK.Auth.logout) {
                      reject('Vk or her methods is not defind');
                  };
                  VK.Auth.logout((response) => {
                      if (response) {
                          resolve(response);
                      } else {
                          reject();
                      }
                  });
              }
          );
      },
  
    getLoginStatus() {
          return new Promise(
              (resolve, reject) => {
                  if (!VK || !VK.Auth || !VK.Auth.getLoginStatus) {
                      reject('Vk or her methods is not defind');
                  }
                  VK.Auth.getLoginStatus((response) => {
                      if (response) {
                          resolve(response);
                      } else {
                          reject();
                      }
                  });
              }
          );
      }
}