import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UsersPage} from "../users/users";
import {ScanQrPage} from "../scan-qr/scan-qr";

/**
 * Generated class for the AddUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-user',
  templateUrl: 'add-user.html',
})
export class AddUserPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddUserPage');
  }

  showUserList() {
    this.navCtrl.push(UsersPage);
  }

  showScanQr() {
    this.navCtrl.push(ScanQrPage);
  }


}
