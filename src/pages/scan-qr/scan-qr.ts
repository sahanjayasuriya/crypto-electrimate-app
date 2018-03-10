import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {Component} from "@angular/core";
import {AlertController, IonicPage, NavController, NavParams} from "ionic-angular";
import {CreateUserPage} from "../create-user/create-user";

/**
 * Generated class for the ScanQrPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scan-qr',
  templateUrl: 'scan-qr.html',
})
export class ScanQrPage {

  scannedCode = null;

  sensorCodes: Array<string> = ['electrimate-sensor-0001', 'electrimate-sensor-0002', 'electrimate-sensor-0003'];

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, public alertCtrl: AlertController) {
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      if (this.sensorCodes.some(code => code === barcodeData.text)) {
        this.showConfirm();
      } else {
        this.showError();
      }
    })
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Sensor Identified',
      message: 'Sensor identified successfully. Do you want to proceed with this sensor?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            this.navCtrl.push(CreateUserPage);
          }
        }
      ],
      cssClass: 'electrimateAlertCss'
    });
    confirm.present();
  }

  showError() {
    let alert = this.alertCtrl.create({
      title: 'Identification Failed',
      subTitle: 'Sorry, we couldn\'t identify the sensor. Please try again or contact support',
      buttons: ['OK']
    });
    alert.present();
  }
}
