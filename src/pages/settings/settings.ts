import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProfilePage} from "../user-profile/user-profile";
import {PasswordChangePage} from "../password-change/password-change";
import {LastBillPage} from "../last-bill/last-bill";

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html',
})
export class SettingsPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SettingsPage');
    }

    editProfileClicked() {
        this.navCtrl.push(UserProfilePage);
    }

    changePasswordClicked() {
        this.navCtrl.push(PasswordChangePage);
    }

    viewBillDate() {
        this.navCtrl.push(LastBillPage);
    }
}
