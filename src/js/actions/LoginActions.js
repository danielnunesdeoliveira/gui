/* eslint-disable */
import { browserHistory } from 'react-router';
import loginManager from '../comms/login/LoginManager';
import toaster from '../comms/util/materialize';

const alt = require('../alt');

class LoginActions {
    authenticate(login) {
        return (dispatch) => {
            dispatch();
            loginManager.authenticate(login)
                .then((response) => {
                    browserHistory.push('/#/');
                    this.loginSuccess(response);
                })
                .catch((error) => {
                    this.loginFailed(error);
                });
        };
    }

    logout() {
        return true;
    }

    setPassword(login) {
        return (dispatch) => {
            dispatch();
            loginManager.setNewPassword(login)
                .then(() => {
                    browserHistory.push('/#/login');
                    window.location.reload();
                })
                .catch((error) => {
                    this.loginFailed(error);
                });
        };
    }

    updatePassword(data) {
        return (dispatch) => {
            dispatch();
            loginManager.updatePassword(data)
                .then(() => {
                    toaster.success('Password updated');
                })
                .catch((error) => {
                    toaster.error(error.message);
                });
        };
    }

    resetPassword(username) {
        return (dispatch) => {
            dispatch();
            loginManager.resetPassword(username);
        };
    }

    loginSuccess(token) {
        return token;
    }

    loginFailed(error) {
        // console.error('auth failed', error, error.data);
        if (error instanceof TypeError) {
            return 'No connection to server.';
        }

        toaster.error(error.message);
        const data = error.data;
        if ((data.status === 401) || (data.status === 403)) {
            return 'Authentication failed.';
        } if (data.status === 500) {
            return 'Internal error. Please try again later.';
        }
        return 'No connection to server.';
    }
}

const _login = alt.createActions(LoginActions, exports);
export default _login;
