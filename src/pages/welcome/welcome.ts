import {Component} from '@angular/core';
import {Events, IonicPage, LoadingController, NavController, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {User} from "../../model/user";
import {HomePage} from "../home/home";
import {PasswordResetPage} from "../password-reset/password-reset";
import {AngularFireDatabase} from "angularfire2/database";

@IonicPage()
@Component({
    selector: 'page-welcome',
    templateUrl: 'welcome.html'
})
export class WelcomePage {

    user: User = new User();
    private loading: any;

    constructor(private angularFireAuth: AngularFireAuth,
                public navCtrl: NavController,
                public toastCtrl: ToastController,
                public events: Events,
                public loadingCtrl: LoadingController,
                private angularFireDatabase: AngularFireDatabase) {
    }

    doLogin() {
        this.presentLoading();
        this.angularFireAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password)
            .then((result) => {
                this.angularFireDatabase.database.ref('users/' + result.uid).once('value')
                    .then((data) => {
                        if(data.val().userType == 'HOUSE-OWNER'){
                            if (result.emailVerified) {
                                this.events.publish('user:logged', this.angularFireAuth.auth.currentUser, Date.now());
                                this.angularFireDatabase.database.ref().child('users/' + result.uid)
                                    .update({ firstLogin:false});
                                this.navCtrl.setRoot(HomePage);
                                this.presentToast("Logged in successfully");
                            } else {
                                this.presentToast("Email not verified. Please verify the email to continue.");
                                this.angularFireAuth.auth.signOut();
                                this.navCtrl.setRoot(WelcomePage);
                            }
                        } else {
                            this.events.publish('user:logged', this.angularFireAuth.auth.currentUser, Date.now());
                            this.navCtrl.setRoot(HomePage);
                            this.presentToast("Logged in successfully");
                        }
                        this.loading.dismiss();
                    }).catch((err) => {
                    console.log(err);
                    this.loading.dismiss();
                });

            }).catch((err) => {
            this.presentToast("Incorrect Credentials")
        })
    }

    resetPasswordClicked() {
        this.navCtrl.push(PasswordResetPage);
    }

    ionViewWillLoad() {
        this.presentLoading();
        this.angularFireAuth.authState.subscribe(data => {
            if (data && data.uid && data.emailVerified) {
                this.navCtrl.setRoot(HomePage);
                this.events.publish('user:logged', this.angularFireAuth.auth.currentUser, Date.now())
            }
            this.loading.dismiss();
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

    presentLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Logging in...'
        });
        this.loading.present();
    }
}
