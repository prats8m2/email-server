import { Method } from 'axios';
import { exec } from 'child_process';
import axios from 'axios';
import Logger from '../../utility/logger';
class ReportService {
  //info for connection with reporting server
  ip: string;
  port: number;
  auth: string;
  account: string;

  constructor(ip: string, port: number, auth: string, account: string) {
    this.ip = ip;
    this.port = port;
    this.auth = Buffer.from(auth).toString('base64');
    this.account = account;

    // for testing
    // this.ip = "3.125.16.251";
    // this.port = 8888;
    // this.auth = "VUlfVGVzdF8xMlxhZG1pbjphZG1pbg==ss";
    // this.account = "UI_Test_7";
  }

  // Function to create folder in Reporting server
  public createFolder = async (folderName: string) => {
    return new Promise((resolve, reject) => {
      const URL = `curl -X POST "http://${this.ip}:${this.port}/jrserver/api/v1.2/nodes" -H "accept: text/plain; charset=UTF-8" -H "authorization: Basic ${this.auth}"  -H "Content-Type: multipart/form-data" -F "resourcePath=/<${this.account}>/" -F "nodeName=${folderName}" -F "type=Folder"`;
      exec(URL, (error: any, stdout: any, stderr: any) => {
        if (stdout === 'OK') {
          Logger.info(`${folderName} created in organization ${this.account}`);
          resolve(stdout);
        } else {
          Logger.error(stderr);
        }

        if (error) {
          Logger.error(`error: ${error.message}`);
          reject(error);
        }
        reject(stderr);
      });
    });
  };

  //Function to create role in Reporting server
  public createRole = async (roleName: string) => {
    try {
      return new Promise((resolve, reject) => {
        const method: Method = 'POST';
        const data = JSON.stringify({
          clazz: 'Role',
          name: roleName,
          organization: this.account,
          displayName: roleName,
        });
        const config = {
          method,
          url: `http://${this.ip}:${this.port}/jrserver/api/v1.2/roles`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.auth}`,
          },
          timeout: 1000 * 60, // Wait for 5 seconds
          data,
        };

        axios(config)
          .then(() => {
            Logger.info(`${roleName} created in organization ${this.account}`);
            resolve(true);
          })
          .catch(error => {
            if (JSON.parse(JSON.stringify(error)).status === 400) {
              resolve(
                `${roleName} already exist in organization ${this.account}`
              );
            } else {
              // console.log("~ error", error);
              reject(error);
            }
          });
      });
    } catch (_e) {
      Logger.error('~ _e', _e);
      return _e;
    }
  };

  //Function to assign roles on folders
  public assignRoleToFolder = async (
    roleName: string,
    folderName: string,
    permissions: string
  ) => {
    return new Promise((resolve, reject) => {
      try {
        let oldRoles: any = [];
        axios({
          method: 'GET',
          url: `http://${this.ip}:${this.port}/jrserver/api/v1.2/node/permissions?path=/<${this.account}>/${folderName}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.auth}`,
          },
          timeout: 1000 * 60, // Wait for 5 seconds
        })
          .then(response => {
            console.log(
              `Permission fetched from folder ${folderName}`,
              response.data
            );
            if (response.data.forRoles) oldRoles = response.data.forRoles;

            for (let index = 0; index < oldRoles.length; index++) {
              const oldRole = oldRoles[index];
              if (oldRole.name === `${this.account}\\${roleName}`) {
                oldRoles.splice(index, 1);
              }
            }

            const method: Method = 'PUT';
            const data = JSON.stringify({
              forUsers: [],
              forRoles: [
                ...oldRoles,
                {
                  name: `${this.account}\\${roleName}`,
                  permissions,
                },
              ],
              forGroups: [],
            });
            const config = {
              method,
              url: `http://${this.ip}:${this.port}/jrserver/api/v1.2/node/permissions?path=/<${this.account}>/${folderName}`,
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${this.auth}`,
              },
              data,
              timeout: 1000 * 60, // Wait for 5 seconds
            };

            axios(config)
              .then(response => {
                resolve(response.status);
              })
              .catch(error => {
                console.error('~ error1', JSON.parse(JSON.stringify(error)));
                reject(error);
              });
          })
          .catch((error: any) => {
            // console.log(error);
            reject(error);
          });
      } catch (_e) {
        Logger.error('~ _e', _e);
        reject();
        // return _e;
      }
    });
  };

  //Function to assign roles on folders
  public removeAllRolesFromFolder = async (folderName: string) => {
    return new Promise((resolve, reject) => {
      try {
        const method: Method = 'PUT';
        const data = JSON.stringify({
          forUsers: [],
          forRoles: [],
          forGroups: [],
        });
        const config = {
          method,
          url: `http://${this.ip}:${this.port}/jrserver/api/v1.2/node/permissions?path=/<${this.account}>/${folderName}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.auth}`,
          },
          data,
          timeout: 1000 * 60, // Wait for 5 seconds
        };

        axios(config)
          .then(response => {
            resolve(response.status);
          })
          .catch(error => {
            console.error('~ error1', JSON.parse(JSON.stringify(error)));
            reject(error);
          });
      } catch (_e) {
        Logger.error('~ _e', _e);
        reject();
        // return _e;
      }
    });
  };

  //Function to create users
  public createUser = async (
    username: string,
    email: string,
    password: string,
    fullName: string
  ) => {
    return new Promise((resolve, reject) => {
      try {
        const method: Method = 'POST';
        const data = JSON.stringify({
          clazz: 'User',
          name: username,
          email,
          password,
          confirmPassword: password,
          fullName: fullName,
          organization: this.account,
          displayName: fullName,
        });
        const config = {
          method,
          url: `http://${this.ip}:${this.port}/jrserver/api/v1.2/users`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.auth}`,
          },
          data,
          timeout: 1000 * 60, // Wait for 5 seconds
        };

        axios(config)
          .then(response => {
            console.log(`${username} added in ${this.account}`, response.data);
            resolve(response.status);
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      } catch (_e) {
        console.error('~ _e', _e);
        reject(_e);
      }
    });
  };

  //Function to create users
  public editUser = async (
    username: string,
    email: string,
    fullName: string,
    status: number
  ) => {
    return new Promise((resolve, reject) => {
      try {
        const method: Method = 'PUT';
        const data = JSON.stringify({
          fullName: fullName,
          description: '',
          email: email,
          passwordExpireDays: 0,
          passwordMinLength: 0,
          accountDisabled: status ? false : true,
          enableNullPassword: false,
          AskUserToChangePasswordAfterExpired: false,
          AskUserToChangePasswordAfterResetByAdministrator: false,
        });
        const config = {
          method,
          url: `http://${this.ip}:${this.port}/jrserver/api/v1.2/user?userName=${this.account}\\${username}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.auth}`,
          },
          data,
          timeout: 1000 * 60, // Wait for 5 seconds
        };

        axios
          .put(config.url, data, { headers: config.headers })
          .then(response => {
            console.log(
              `${username} updated on ${this.account}`,
              response.data
            );
            resolve(response.status);
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      } catch (_e) {
        console.error('~ _e', _e);
        reject(_e);
      }
    });
  };

  //Function to assign roles on users
  public assignRoleToUser = async (roleName: string, userName: string) => {
    return new Promise((resolve, reject) => {
      try {
        const method: Method = 'POST';
        const data = JSON.stringify([
          {
            clazz: 'User',
            name: userName,
            organization: this.account,
          },
        ]);
        const config = {
          method,
          url: `http://${this.ip}:${this.port}/jrserver/api/v1.2/role/members?roleName=${this.account}\\${roleName}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.auth}`,
          },
          data,
          timeout: 1000 * 60, // Wait for 5 seconds
        };

        axios(config)
          .then(response => {
            console.log(
              `${userName} assigned to ${roleName} on ${this.account}`,
              response.data
            );
            resolve(response.status);
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      } catch (_e) {
        console.error('~ _e', _e);
        reject(_e);
      }
    });
  };

  //Function to assign roles on users
  public removeRoleFromUser = async (roleName: string, userName: string) => {
    return new Promise((resolve, reject) => {
      try {
        const method: Method = 'DELETE';
        const data = JSON.stringify([
          {
            clazz: 'User',
            name: userName,
            organization: this.account,
          },
        ]);
        const config = {
          method,
          url: `http://${this.ip}:${this.port}/jrserver/api/v1.2/role/members?roleName=${this.account}\\${roleName}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.auth}`,
          },
          data,
          timeout: 1000 * 60, // Wait for 5 seconds
        };

        axios(config)
          .then(response => {
            console.log(
              `${userName} removed from ${roleName} on ${this.account}`,
              response.data
            );
            resolve(response.status);
          })
          .catch(error => {
            console.error(error);
            reject(error);
          });
      } catch (_e) {
        console.error('~ _e', _e);
        reject(_e);
      }
    });
  };

  //Function to delete a user
  public deleteUser = async (userName: string) => {
    try {
      const method: Method = 'DELETE';
      const config = {
        method,
        url: `http://${this.ip}:${this.port}/jrserver/api/v1.2/user?userName=${this.account}\\${userName}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.auth}`,
        },
        timeout: 1000 * 60, // Wait for 5 seconds
      };

      await axios(config)
        .then(response => {
          console.log(
            `${userName} deleted from ${this.account}`,
            response.data
          );
          return response;
        })
        .catch(error => {
          //console.error(error);
          return error;
        });
    } catch (_e) {
      //console.error("~ _e", _e);
      return _e;
    }
  };

  //Function to get the list of all users
  public getUser = async () => {
    try {
      const method: Method = 'GET';
      let userData: any = [];
      const config = {
        method,
        url: `http://${this.ip}:${this.port}/jrserver/api/v1.2/users`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.auth}`,
        },
        timeout: 1000 * 60, // Wait for 5 seconds
      };

      await axios(config)
        .then(response => {
          console.log(
            `${response?.data?.length} user fetched from reporting server`
          );
          userData = response.data;
          return true;
        })
        .catch(error => {
          console.error('~ error', error);
          return error;
        });

      return userData;
    } catch (_e) {
      console.error('~ _e', _e);
      return _e;
    }
  };

  //Function to delete User
  public deleteRole = async (roleName: string) => {
    try {
      const method: Method = 'DELETE';
      const data = JSON.stringify({
        clazz: 'Role',
        name: roleName,
        organization: this.account,
        displayName: roleName,
      });
      const config = {
        method,
        url: `http://${this.ip}:${this.port}/jrserver/api/v1.2/role?roleName=${this.account}\\${roleName}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${this.auth}`,
        },
        data,
        timeout: 1000 * 60, // Wait for 5 seconds
      };

      await axios(config)
        .then(response => {
          console.log(
            `${roleName} deleted from ${this.account}`,
            response.data
          );
          return response;
        })
        .catch(error => {
          console.error('~ error', error);
          return error;
        });
    } catch (_e) {
      console.error('~ _e', _e);
      return _e;
    }
  };
}

export default ReportService;
