import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {UserDetailsPage} from "../user-details/user-details";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the UsersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-users',
    templateUrl: 'users.html',
})
export class UsersPage implements OnInit {

    moduleId: string;
    userId: string;
    sensors: Array<string>;
    userList: Array<{ id: string, name: string; created: string; photoURL: string }> = [];
    loading: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private angularFireDatabase: AngularFireDatabase,
                public loadingCtrl: LoadingController) {
    }

    ngOnInit() {
        this.presentLoading();
        this.userId = this.angularFireAuth.auth.currentUser.uid;
        this.angularFireDatabase.database.ref('users/' + this.userId + '/modules').once('value')
            .then((modules) => {
                this.angularFireDatabase.database.ref('modules/' + modules.val()[0] + '/sensors/').once('value')
                    .then((sensors) => {
                        this.sensors = sensors.val();
                        for (let sensor of this.sensors) {
                            this.angularFireDatabase.database.ref('users').orderByChild('sensorId').equalTo(sensor).once('value')
                                .then((data) => {
                                    console.log(data.val());
                                    for (var key in data.val()) {
                                        var user = data.val()[key];
                                        this.userList.push({id:key, name:user.displayName, created: user.created, photoURL: user.photoURL})
                                    }
                                    this.loading.dismiss();
                                }).catch((err) => {
                                this.loading.dismiss();
                                console.log(err);
                            });
                        }
                    }).catch((err) => {
                    this.loading.dismiss();
                })
            }).catch((err) => {
            this.loading.dismiss();
        })
    }

    viewUserDetails(id: string) {
        console.log(id);
    }

    presentLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Loading...'
        });
        this.loading.present();
    }

}
