import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the SensorsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sensors',
  templateUrl: 'sensors.html',
})
export class SensorsPage {

    sensorList: Array<{ id: string, name: string }> = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private angularFireDatabase: AngularFireDatabase,
                private toastCtrl: ToastController) {

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SensorsPage');
      this.sensorList = this.navParams.get("sensorList");
      console.log(this.sensorList.length);
  }

}
