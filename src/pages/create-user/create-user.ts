import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {HomePage} from "../home/home";
import {ElectricityUser} from "../../model/electricity-user";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the CreateUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-create-user',
    templateUrl: 'create-user.html',
})
export class CreateUserPage implements OnInit{

    user: ElectricityUser;
    currentUserId: string;
    modules: Array<{value:string, label:string}>;
    defaultPassword: string = '123456';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private angularFireDatabase: AngularFireDatabase,
                private toastCtrl: ToastController) {
    }

    ngOnInit(){
        this.user = new ElectricityUser();
        this.user.sensorId = this.navParams.get('sensorId');
        this.currentUserId = this.angularFireAuth.auth.currentUser.uid;
        this.angularFireDatabase.database.ref('users/' + this.currentUserId + '/modules').once('value')
            .then((data) => {
                const list: Array<{value:string, label:string}> = [];
                data.val().forEach((module) => {
                    this.angularFireDatabase.database.ref('modules/' + module).once('value')
                        .then((data) => {
                            list.push({value: module, label: data.val().moduleName})
                        }, (err) => {
                            console.log(err);
                        }).catch((err) => {
                        console.log(err);
                    });
                });
                this.modules = list;
            }, (err) => {
                console.log(err);
            }).catch((err) =>{
            console.log(err);
        })
    }

    saveUser() {
        var sensors = [];
        let date: any = new Date();
        this.angularFireAuth.auth.createUserWithEmailAndPassword(this.user.email, this.defaultPassword)
            .then((data) => {
                console.log(data);
                this.angularFireDatabase.database.ref('users/' + data.uid).set({
                    email: data.email,
                    displayName: data.displayName,
                    userType: 'ELECTRICITY_USER',
                    firstLogin: true,
                    sensorId: this.user.sensorId,
                    created: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
                }).then((userData) => {
                    this.angularFireDatabase.database.ref('sensors/' + this.user.sensorId).update({
                        pin: this.user.connectedPin
                    }).catch((err) => {
                        this.presentToast("Error occured while saving");
                    });

                    this.angularFireDatabase.database.ref('modules/' + this.user.moduleId + '/sensors')
                        .once('value').then((data) => {
                            if(data.val() != null){
                                sensors = data.val();
                            }
                            sensors.push(this.user.sensorId);
                            this.angularFireDatabase.database.ref('modules/' + this.user.moduleId + '/sensors').set(
                                sensors
                            ).then(() => {
                                this.presentToast("User saved successfully");
                                this.navCtrl.push(HomePage);
                            }).catch((err) => {
                                this.presentToast("Error occurred while saving");
                            });
                    })
                })
            }).catch((err) => {
            this.presentToast("Error occured while saving");
        })
    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }

}
