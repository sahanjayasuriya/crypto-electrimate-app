import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProfilePage} from "../user-profile/user-profile";
import {PasswordChangePage} from "../password-change/password-change";

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    //function, on page loading
    ionViewDidLoad() {
        console.log('ionViewDidLoad SettingsPage');
    }

    //function, redirect to user profile page
    editProfileClicked() {
        this.navCtrl.push(UserProfilePage);
    }

    //function, redirect to change password page
    changePasswordClicked() {
        this.navCtrl.push(PasswordChangePage);
    }
}
