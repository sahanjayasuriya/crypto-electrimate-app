import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";

@IonicPage()
@Component({
    selector: 'page-sensors',
    templateUrl: 'sensors.html',
})
export class SensorsPage {

    sensorList: Array<{ id: string, name: string, user: string }> = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private angularFireDatabase: AngularFireDatabase) {

    }

    ionViewDidLoad() {
        this.sensorList = this.navParams.get("sensorList");
        for (let sensor of this.sensorList) {
            this.angularFireDatabase.database.ref('users').orderByChild('sensorId').equalTo(sensor.name).once('value')
                .then((data) => {
                    for (var key in data.val()) {
                        var user = data.val()[key];
                        sensor.user = user.displayName == null ? 'Name not provided' : user.displayName;
                    }
                }).catch((err) => {
                console.log(err);
            })
        }
    }

}
