import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, DatabaseSnapshot } from 'angularfire2/database';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LastBillPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-last-bill',
    templateUrl: 'last-bill.html',
})
export class LastBillPage implements OnInit {

    private modules: any = [];
    private module;
    private maxDate;
    private lastBillDate;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private angularFireDatabase: AngularFireDatabase) {
        const now = new Date();
        this.maxDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    }

    ngOnInit(): void {
        const userId = this.angularFireAuth.auth.currentUser.uid;
        this.angularFireDatabase.database.ref('users/' + userId + '/modules').once('value')
            .then((modulesSnapshot: DatabaseSnapshot) => {
                this.modules = [];
                modulesSnapshot.val().forEach(moduelId => {
                    this.angularFireDatabase.database.ref('modules/' + moduelId).once('value')
                        .then(moduleSnapshot => {
                            const m = moduleSnapshot.val();
                            m.key = moduleSnapshot.key;
                            this.modules.push(m)
                        });

                });
                console.log(modulesSnapshot);
                console.log(this.modules);
            })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LastBillPage');
    }

    save() {
        if (this.module && this.lastBillDate) {
            console.log(this.module.key);
            const bill = {
                from: this.lastBillDate,
                current: true
            };
            const ref = this.angularFireDatabase.database.ref('modules/' + this.module.key);
            // Add bill to module and closing last bill
            ref.child('bills').orderByChild('current').equalTo(true).limitToFirst(1)
                .once('value')
                .then((currentBillSnap: DatabaseSnapshot) => {
                    currentBillSnap.forEach((a: DatabaseSnapshot) => {
                        a.ref.update({current: false, to: this.lastBillDate});
                        return true;
                    });
                    ref.child('bills').push(bill);
                });

            // Add bill to each sensor and closing last bill
            ref.child('sensors').once('value')
                .then(sensorSnap => {
                    sensorSnap.val().forEach(sensor => {
                        console.log(sensor);
                        this.angularFireDatabase.database.ref('sensors/' + sensor + '/bills').orderByChild('current').equalTo(true).limitToFirst(1)
                            .once('value').then((currentBillSnap: DatabaseSnapshot) => {

                            currentBillSnap.forEach((a: DatabaseSnapshot) => {
                                a.ref.update({current: false, to: this.lastBillDate});
                                return true;
                            });

                            this.angularFireDatabase.database.ref('sensors/' + sensor + '/bills')
                                .push(bill);
                        });
                    })
                })
        } else {
            alert('Please select the module and the last bill date')
        }
    }
}
