import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase';

/**
 * Generated class for the VerifyOtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verify-otp',
  templateUrl: 'verify-otp.html',
})
export class VerifyOtpPage {
  confirmationResult: any;
  otpCode: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private angularFireAuth: AngularFireAuth,
              private viewCtrl: ViewController,
              private toastCtrl: ToastController) {
    this.confirmationResult = this.navParams.get('confirmationResult');
  }

  ionViewDidLoad() {
  }

  verifyCode() {
    const credential = firebase.auth.PhoneAuthProvider.credential(this.confirmationResult.verificationId, this.otpCode);
    this.viewCtrl.dismiss(credential);
  }

  closeModal() {
    this.navCtrl.pop();
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
