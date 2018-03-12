import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {WelcomePage} from "../welcome/welcome";

/**
 * Generated class for the PasswordResetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordResetPage {

  email: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private angularFireAuth: AngularFireAuth, private alertCtrl: AlertController) {
  }

  ionViewWillLoad() {
    console.log("View Loaded");
  }

  resetPwd() {
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
