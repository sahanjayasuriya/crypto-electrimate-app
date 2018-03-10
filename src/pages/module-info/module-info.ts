import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SensorsPage} from "../sensors/sensors";

/**
 * Generated class for the ModuleInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-module-info',
  templateUrl: 'module-info.html',
})
export class ModuleInfoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModuleInfoPage');
  }

  viewSensors() {
    this.navCtrl.push(SensorsPage);
  }

}
