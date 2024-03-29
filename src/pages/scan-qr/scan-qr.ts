import { Component } from "@angular/core";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { AngularFireDatabase } from "angularfire2/database";
import { AlertController, IonicPage, NavController, NavParams } from "ionic-angular";
import { CreateUserPage } from "../create-user/create-user";

@IonicPage()
@Component({
    selector: 'page-scan-qr',
    templateUrl: 'scan-qr.html',
})
export class ScanQrPage {
    sensorId: String;

    constructor(private angularFireDatabase: AngularFireDatabase,
                public navCtrl: NavController,
                public navParams: NavParams,
                private barcodeScanner: BarcodeScanner,
                public alertCtrl: AlertController) {
    }

    //function, scan sensor qr code
    scanCode() {
        this.barcodeScanner.scan().then(barcodeData => {
            if (!barcodeData.cancelled) {
                this.sensorId = barcodeData.text;
                this.angularFireDatabase.database.ref('/sensors/' + this.sensorId).once('value')
                    .then((data) => {
                        if (data.val()) {
                            this.showConfirm();
                        } else {
                            this.showError();
                        }
                    }, (error) => {
                        this.showError();
                    });
            }
        })
    }

    //function, show confirmation dialog
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
                        this.navCtrl.push(CreateUserPage, {'sensorId': this.sensorId});
                    }
                }
            ],
            cssClass: 'electrimateAlertCss'
        });
        confirm.present();
    }

    //function, show error dialog
    showError() {
        let alert = this.alertCtrl.create({
            title: 'Identification Failed',
            subTitle: 'Sorry, we couldn\'t identify the sensor. Please try again or contact support',
            buttons: ['OK']
        });
        alert.present();
    }
}
