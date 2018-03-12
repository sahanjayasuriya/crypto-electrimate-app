import {Component} from '@angular/core';
import {Events, IonicPage, NavController, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {User} from "../../model/user";
import {HomePage} from "../home/home";
import {PasswordResetPage} from "../password-reset/password-reset";

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  user: User = new User();

  constructor(private angularFireAuth: AngularFireAuth,
              public navCtrl: NavController,
              public toastCtrl: ToastController,
              public events: Events) {
  }

  doLogin() {
    this.angularFireAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password)
      .then((result) => {
        if(result.emailVerified){
            console.log(result);
            this.events.publish('user:logged', this.angularFireAuth.auth.currentUser, Date.now());
            this.navCtrl.setRoot(HomePage);
            this.presentToast("Logged in successfully");
        } else {
          this.presentToast("Email not verified. Please verify the email to continue.");
          this.angularFireAuth.auth.signOut();
          this.navCtrl.setRoot(WelcomePage);
        }
      }).catch((err) => {
      this.presentToast("Incorrect Credentials")
    })
  }

  resetPasswordClicked() {
    this.navCtrl.push(PasswordResetPage);
  }

  ionViewWillLoad() {
    this.angularFireAuth.authState.subscribe(data => {
      if (data && data.uid && data.emailVerified) {
        this.navCtrl.setRoot(HomePage);
        this.events.publish('user:logged', this.angularFireAuth.auth.currentUser, Date.now())
      }
    })
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }
}
