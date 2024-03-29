import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from "firebase/app";
import {WelcomePage} from "../welcome/welcome";

@IonicPage()
@Component({
    selector: 'page-password-change',
    templateUrl: 'password-change.html',
})
export class PasswordChangePage {

    currentPassword: string;
    newPassword: string;
    repeatNewPassword: string;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private toastCtrl: ToastController,
                private alertCtrl: AlertController) {
    }

    //function, on page loading
    ionViewDidLoad() {
        console.log('ionViewDidLoad PasswordChangePage');
    }

    //function, change password
    changePasswordClicked() {
        if (this.newPassword === this.repeatNewPassword) {
            //authenticating current password
            this.angularFireAuth.auth.currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(this.angularFireAuth.auth.currentUser.email, this.currentPassword))
                .then((data) => {
                    //update password with firebase
                    this.angularFireAuth.auth.currentUser.updatePassword(this.newPassword)
                    let success = this.alertCtrl.create({
                        title: 'Password Changed',
                        message: 'Your password was updated successfully. You can now log in with your new password',
                        buttons: [
                            {
                                text: 'OK',
                                handler: () => {
                                    this.angularFireAuth.auth.signOut();
                                    this.navCtrl.setRoot(WelcomePage);
                                }
                            }
                        ],
                        cssClass: 'electrimateAlertCss'
                    });
                    success.present();
                }).catch((err) => {
                this.presentToast("Current password is incorrect");
            })
        } else {
            this.presentToast("New passwords do not match");
        }

    }

    //function,display loading
    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

}
