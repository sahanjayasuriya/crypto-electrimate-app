import { Component } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScanQrPage } from '../scan-qr/scan-qr';

@IonicPage()
@Component({
    selector: 'page-sensors',
    templateUrl: 'sensors.html',
})
export class SensorsPage {

    sensorList: Array<{ id: string, name: { sensorId: string, pin: number }, user: string }> = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private angularFireDatabase: AngularFireDatabase) {

    }

    //function, on page loading
    ionViewDidLoad() {
        this.sensorList = this.navParams.get("sensorList");
        for (let sensor of this.sensorList) {
            this.angularFireDatabase.database.ref('users').orderByChild('sensorId').equalTo(sensor.name.sensorId)
                .limitToFirst(1).once('value')
                .then((data) => {
                    console.log(data.val());
                    for (var key in data.val()) {
                        var user = data.val()[key];
                        sensor.user = user;
                    }
                }).catch((err) => {
                console.log(err);
            })
        }
    }

    //function, redirect to scan qr page
    addSensor() {
        this.navCtrl.push(ScanQrPage);
    }

}
