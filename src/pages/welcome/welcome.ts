import {Component} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import {AlertController, Events, IonicPage, LoadingController, NavController, ToastController} from 'ionic-angular';
import {User} from "../../model/user";
import {HomePage} from "../home/home";
import {PasswordResetPage} from "../password-reset/password-reset";
import {UserProfilePage} from "../user-profile/user-profile";

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
                private angularFireDatabase: AngularFireDatabase,
                private alertCtrl: AlertController) {
    }

    //function, verify user credentials and redirect to home page
    doLogin() {
        this.presentLoading();
        //send email and password to firebase signIn API
        this.angularFireAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password)
            .then((result) => {
                //getting the user from firebase database
                this.angularFireDatabase.database.ref('users/' + result.uid).once('value')
                    .then((data) => {
                        if (data.val().userType == 'HOUSE-OWNER') { //checking the user type
                            if (result.emailVerified) { //checking if the email is verified
                                //publishing the user logged event
                                this.events.publish('user:logged', this.angularFireAuth.auth.currentUser, Date.now());
                                this.presentToast("Logged in successfully");
                                if (data.val().firstLogin) { // if the first login, show edit profile page
                                    this.showEditProfile();
                                    this.setFirstLogin();
                                } else {
                                    this.navCtrl.setRoot(HomePage); // set root page as home page
                                }
                            } else {
                                this.presentToast("Email not verified. Please verify the email to continue.");
                                this.angularFireAuth.auth.signOut();
                                this.navCtrl.setRoot(WelcomePage);
                            }
                        } else {
                            this.events.publish('user:logged', this.angularFireAuth.auth.currentUser, Date.now());
                            this.presentToast("Logged in successfully");
                            if (data.val().firstLogin) {
                                this.showEditProfile();
                                this.setFirstLogin();
                            } else {
                                this.navCtrl.setRoot(HomePage);
                            }
                        }
                        this.loading.dismiss();
                    }).catch((err) => {
                    this.loading.dismiss()
                    console.log(err);
                });

            })
            .catch((err) => {
                this.loading.dismiss()
                this.presentToast("Incorrect Credentials")
            })
    }

    //function, redirect to reset password page
    resetPasswordClicked() {
        this.navCtrl.push(PasswordResetPage);
    }

    //checking if an user session is available and logging in automatically
    ionViewWillLoad() {
        this.presentLoading();
        this.angularFireAuth.authState.subscribe(data => {
            if (data && data.uid) {
                this.navCtrl.setRoot(HomePage);
                this.events.publish('user:logged', this.angularFireAuth.auth.currentUser, Date.now())
            }
            this.loading.dismiss();
        })
    }

    //function, notification window
    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 5000,
            position: 'bottom'
        });
        toast.present();
    }

    //function, loading window
    presentLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Logging in...'
        });
        this.loading.present();
    }

    //function, setting the first logging parameter
    setFirstLogin() {
        this.angularFireDatabase.database.ref('users/' + this.angularFireAuth.auth.currentUser.uid).update({
            firstLogin: false
        }).catch((err) => {
            console.log(err);
        })
    }

    //function, show edit profile
    showEditProfile() {
        let confirm = this.alertCtrl.create({
            title: 'Hello there',
            message: 'It looks like this is your first login. Please take a minute and save your profile details',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        this.navCtrl.push(UserProfilePage);
                    }
                }
            ],
            cssClass: 'electrimateAlertCss'
        });
        confirm.present();
    }
}
