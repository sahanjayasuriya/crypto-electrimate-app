import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {SensorsPage} from "../sensors/sensors";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";

@IonicPage()
@Component({
    selector: 'page-module-info',
    templateUrl: 'module-info.html',
})
export class ModuleInfoPage {

    moduleId: string;
    moduleName: string;
    sensors: Array<string>;
    noOfSensors: any;
    sensorList: Array<{ id: string, name: string }> = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private angularFireDatabase: AngularFireDatabase,
                private toastCtrl: ToastController) {
    }

    //function, on page loading
    ionViewDidLoad() {
        this.moduleId = this.navParams.get("moduleId");
        this.angularFireDatabase.database.ref('/modules/' + this.moduleId).once('value')
            .then((data) => {
                if (null != data.val()) {
                    this.sensors = data.val().sensors;
                    this.moduleName = data.val().moduleName;
                    this.noOfSensors = data.val().sensors.length;
                    for (let sensor of this.sensors) {
                        this.sensorList.push({id: this.moduleId, name: sensor});
                    }
                } else {
                }
            }, (error) => {
            });

    }

    //function, redirect to sensors page
    viewSensors() {
        this.navCtrl.push(SensorsPage, {'sensorList': this.sensorList});
    }

}
