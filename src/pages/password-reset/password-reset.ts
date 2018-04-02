import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {WelcomePage} from "../welcome/welcome";


@IonicPage()
@Component({
    selector: 'page-password-reset',
    templateUrl: 'password-reset.html',
})
export class PasswordResetPage {

    email: string = '';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private alertCtrl: AlertController) {
    }

    //function, on page loading
    ionViewWillLoad() {
        console.log("View Loaded");
    }

    //function, reset password
    resetPwd() {
        //send verification mail to user
        this.angularFireAuth.auth.sendPasswordResetEmail(this.email)
            .then((data) => {
                let success = this.alertCtrl.create({
                    title: 'Email Sent',
                    message: 'A password reset link has been emailed to your email address. Follow the link to reset the password',
                    buttons: [
                        {
                            text: 'OK',
                            handler: () => {
                                this.navCtrl.setRoot(WelcomePage);
                            }
                        }
                    ],
                    cssClass: 'electrimateAlertCss'
                });
                success.present();
            }).catch((err) => {
            console.log(err);
            let error = this.alertCtrl.create({
                title: 'No Account Found',
                message: 'No Account was found for the email address you entered.',
                buttons: [
                    {
                        text: 'OK'
                    }
                ],
                cssClass: 'electrimateAlertCss'
            });
            error.present();
        })
    }

}
