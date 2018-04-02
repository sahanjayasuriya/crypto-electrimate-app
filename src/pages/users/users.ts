import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LastBillPage} from "../last-bill/last-bill";
import {UserDetailsPage} from "../user-details/user-details";

@IonicPage()
@Component({
    selector: 'page-users',
    templateUrl: 'users.html',
})
export class UsersPage implements OnInit {

    moduleId: string;
    userId: string;
    sensors: Array<{ sensorId: string, pin: number }>;
    userList: Array<{ id: string, name: string; created: string; photoURL: string }> = [];
    loading: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private angularFireDatabase: AngularFireDatabase,
                public loadingCtrl: LoadingController) {
    }

    //function, on page loading
    ngOnInit() {
        this.presentLoading();
        this.userId = this.angularFireAuth.auth.currentUser.uid;
        //load modules from firebase
        this.angularFireDatabase.database.ref('users/' + this.userId + '/modules').once('value')
            .then((modules) => {
                //load sensors from firebase
                this.angularFireDatabase.database.ref('modules/' + modules.val()[0] + '/sensors/').once('value')
                    .then((sensors) => {
                        this.sensors = sensors.val();
                        for (let sensor of this.sensors) {
                            this.angularFireDatabase.database.ref('users').orderByChild('sensorId').equalTo(sensor.sensorId).once('value')
                                .then((data) => {
                                    for (var key in data.val()) {
                                        var user = data.val()[key];
                                        this.userList.push({
                                            id: key,
                                            name: user.displayName,
                                            created: user.created,
                                            photoURL: user.photoURL
                                        })
                                    }
                                }).catch((err) => {
                                console.log(err);
                            });
                        }
                        this.loading.dismiss();
                    }).catch((err) => {
                    this.loading.dismiss();
                })
            }).catch((err) => {
            this.loading.dismiss();
        })
    }

    //function, redirect to user details page
    viewUserDetails(id: string) {
        this.navCtrl.push(UserDetailsPage, {'userId': id});
    }

    //function, loading window
    presentLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Loading...'
        });
        this.loading.present();
    }

}
