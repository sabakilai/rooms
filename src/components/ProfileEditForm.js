import React from 'react';
import Formsy from 'formsy-react';
import { Button } from 'react-bootstrap';

import FormComponent from './FormComponent';
import TextInput from './Input/TextInput';

// config
// import { Config } from '../config';

// services
import { LocalStorageService } from '../services/localStorage';
import { AuthService } from '../services/auth';
import { FileService } from '../services/file';

const firebase = window.firebase;

class ProfileEditForm extends FormComponent {
    constructor(props) {
        super(props);
        AuthService.isCheckAuthRedirectToLogin();
        this.state = LocalStorageService.getUser() || {displayName: '', email: '', password: '', avatar: ''};

        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange = e => {
        let file = e.target.files[0];
        this.setState({avatar: file});
    };

    handleForm(model) {
        const profile = {...this.state, ...model};
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                user.updateProfile({
                    displayName: profile.displayName,
                    email: profile.email
                }).then(() => {
                    if (!profile.password) {
                        this.updatePublicProfile(profile);
                        return;
                    }
                    user.updatePassword(profile.password).then(() => {
                        // Update successful.
                        this.updatePublicProfile(profile);
                    }).catch((error) => {
                        console.log(error);
                        // An error happened.
                    });
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                console.log('User not logged in.');
                window.location = '/login';
            }
        })
    }

    updatePublicProfile(user) {
        const profileRef = firebase.database().ref('profiles/' + user.uid);
        if (!user.avatar) {
            profileRef.update({
                displayName: user.displayName,
            }).then(() => {
                console.log('Public profile has been updated.');
                LocalStorageService.setUser(user);
                window.location = '/';
            }).catch((err) => {
                console.error(err);
            });
        }

        FileService.uploadFile(user.avatar, user.uid).then(
            (avatarUrl) => {
                // user.password = this.state.password;
                user.avatar = avatarUrl;
                profileRef.update({
                    displayName: user.displayName,
                    photoUrl: avatarUrl
                }).then(() => {
                    console.log('Public profile has been updated');
                    LocalStorageService.setUser(user);
                    window.location = '/';
                }).catch((err) => {
                    console.error(err);
                });
            }
        ).catch((err) => {
            console.log(err);
        });
    }

    render() {
        const {avatar, displayName, email, provider, password} = this.state;
        return (
            <Formsy onSubmit={this.handleForm} onValid={this.enableButton} onInvalid={this.disableButton} >
                <fieldset style={{width: 500}}>
                    <legend>Профиль</legend>
                    <TextInput type="text" name="displayName" label="Имя"
                               defaultValue={displayName}
                               validations={{maxLength: 50}}
                               validationErrors={{maxLength: 'Your name longer than 50 symbols'}} required />
                    <TextInput type="email" name="email" label="Email"
                               defaultValue={email}
                               validations={{isEmail: true}}
                               validationErrors={{isEmail: 'Your must type valid email'}} required />
                    { provider ?
                        '' :
                        <TextInput type="password" name="password" label="Пароль"
                                   defaultValue={password}
                                   validations={{minLength: 8}}
                                   validationErrors={{minLength: 'Your password must be longer than 8 symbols'}} />
                    }
                    { avatar ? <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <a href="#" className="thumbnail">
                                <img src={avatar}/>
                            </a>
                        </div>
                    </div> : ''}
                    <div className="form-group">
                        <label>Выбрать другой Аватар</label>

                        <input type="file" className="form-control-file" onChange={this.onInputChange} />
                    </div>
                    <Button type="submit" className="btn btn-primary" disabled={!this.state.canSubmit}>Обновить</Button>
                </fieldset>
            </Formsy>
        )
    }
}


export default ProfileEditForm;