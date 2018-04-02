import {Component, OnInit, ViewChild} from "@angular/core";
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, DatabaseSnapshot} from 'angularfire2/database';
import {Chart} from 'chart.js';
import {IonicPage, LoadingController, NavController, NavParams} from "ionic-angular";
import {LastBillPage} from "../last-bill/last-bill";
import {ScanQrPage} from "../scan-qr/scan-qr";

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage implements OnInit {

    @ViewChild('doughnutCanvas') doughnutCanvas;
    doughnutChart: any;
    sensorsAvailable = true;
    module;
    bills = [];
    bill: any;
    private modules: any[];
    private moduleBill: any;
    private colors = [
        "#3498db",
        "#f1c40f",
        "#e74c3c",
        "#2ecc71"

    ];
    private hoverColors = [
        "#2980b9",
        "#f39c12",
        "#c0392b",
        "#27ae60"
    ];
    doughnutData = {
        labels: [],
        datasets: [
            {
                label: '# of Units',
                data: [],
                backgroundColor: this.colors,
                hoverBackgroundColor: this.hoverColors
            }
        ]
    }
    private userType: string;
    private houseOwner: boolean;
    private loading: boolean = true;
    private loadingIndicator;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private angularFireDatabase: AngularFireDatabase,
                private loadingCtrl: LoadingController) {
    }

    //page on loading function
    ngOnInit() {
        this.presentLoading();
        const userId = this.angularFireAuth.auth.currentUser.uid;
        this.angularFireDatabase.database.ref('users/' + userId).once('value')
            .then((userSnapshot: DatabaseSnapshot) => {
                const user = userSnapshot.val();
                this.userType = user.userType;
                this.modules = [];
                if (this.isHouseOwner()) {
                    var firstSelected = false;
                    user.modules.forEach(moduleId => {
                        this.angularFireDatabase.database.ref('modules/' + moduleId).once('value')
                            .then(moduleSnapshot => {
                                const m = moduleSnapshot.val();
                                m.key = moduleSnapshot.key;
                                this.modules.push(m);
                                if (!firstSelected) {
                                    this.module = m;
                                    firstSelected = true;
                                    this.loadData();
                                }
                            });

                    });
                } else {
                    this.loadData();
                }

            });
    }

    //function redirect to scan qr page
    scanSensor() {
        this.navCtrl.push(ScanQrPage);
    }

    showHistory() {

    }

    //function redirect to last bill page
    viewBillDate() {
        this.navCtrl.push(LastBillPage);
    }

    //function, load data on refresh and page loading
    loadData(refresher?) {
        if (this.isHouseOwner()) {
            this.loadHouseOwnerView(refresher)
        } else {
            this.loadTenantView(refresher);
        }
    }

    //function,getting the date object
    getDate(date) {
        if (!date || date instanceof String) date = new Date(date || '');
        return

    }

    //function,number formatting
    precisionRound(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }

    //function, drawing doughnut chart
    private drawDoughnutChart() {
        console.log(this.doughnutData);
        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
            type: 'doughnut',
            data: this.doughnutData,
            options: {
                'responsive': true,
                'maintainAspectRatio': true,
                'transparencyEffects': true,
                'dataSetBorderWidth': 2,
                'legend': {
                    'display': false
                }
            }

        });
    }

    //function, check user type
    private isHouseOwner() {
        this.houseOwner = this.userType === 'HOUSE-OWNER';
        return this.houseOwner;
    }

    //function, display loading window
    presentLoading() {
        this.loadingIndicator = this.loadingCtrl.create({
            content: 'Loading...'
        });
        this.loadingIndicator.present();
    }

    //function, load house owner view
    private loadHouseOwnerView(refresher?) {
        this.loading = true;
        let colorI = 0;
        this.bills = [];
        this.doughnutData.labels = [];
        this.doughnutData.datasets[0].data = [];
        //get modules from firebase
        this.angularFireDatabase.database.ref('modules/' + this.module.key + '/bills').orderByChild('current')
            .equalTo(true).limitToFirst(1)
            .once('value')
            .then((moduleBillSnapshot: DatabaseSnapshot) => {
                moduleBillSnapshot.forEach((moduleBill: DatabaseSnapshot) => {
                    this.moduleBill = moduleBill.val();
                    return true;
                });
            });
        //get sensors from firebase
        this.angularFireDatabase.database.ref('modules/' + this.module.key + '/sensors')
            .once('value')
            .then((sensorsSnapshot: DatabaseSnapshot) => {
                if (sensorsSnapshot.hasChildren()) {
                    this.sensorsAvailable = true;
                    console.log(sensorsSnapshot.numChildren());

                    console.log(sensorsSnapshot.val());
                    sensorsSnapshot.val().forEach((sensor) => {
                        console.log(sensor);
                        this.angularFireDatabase.database.ref('sensors/' + sensor.sensorId + '/bills')
                            .orderByChild('current').equalTo(true).limitToFirst(1)
                            .once('value')
                            .then((billSnapshot: DatabaseSnapshot) => {
                                if (billSnapshot.hasChildren()) {
                                    billSnapshot.forEach(e => {
                                        this.angularFireDatabase.database.ref('users').orderByChild('sensorId')
                                            .equalTo(sensor.sensorId)
                                            .limitToFirst(1)
                                            .once('value')
                                            .then((usersSensor: DatabaseSnapshot) => {
                                                const bill = e.val();
                                                usersSensor.forEach((userSnapshot: DatabaseSnapshot) => {
                                                    bill.user = userSnapshot.val();
                                                    this.doughnutData.labels.push(bill.user.displayName == undefined ? 'No Name' : bill.user.displayName);
                                                    this.doughnutData.datasets[0].data.push(this.precisionRound(bill.wattHours / 1000, 3));
                                                    return true;
                                                });
                                                bill.color = this.colors[colorI++];
                                                this.bills.push(bill);
                                                this.loadingIndicator.dismiss();
                                                this.drawDoughnutChart();
                                                if (refresher) {
                                                    refresher.complete()
                                                }
                                            })
                                            .catch(() => {
                                                this.loadingIndicator.dismiss();
                                                if (refresher) {
                                                    refresher.complete()
                                                }
                                            });
                                        this.loading = false;
                                        return true;
                                    });
                                } else {
                                    this.loadingIndicator.dismiss();
                                    if (refresher) {
                                        refresher.complete()
                                    }
                                }
                            });
                        return true;
                    })
                } else {
                    this.loadingIndicator.dismiss();
                    this.sensorsAvailable = false;
                }
            })
    }

    //function, load tenantive view
    private loadTenantView(refresher?) {
        this.loading = false;
        this.loadingIndicator.dismiss();

        this.angularFireDatabase.database.ref('users/' + this.angularFireAuth.auth.currentUser.uid + '/sensorId').once('value')
            .then((sensor) => {
                this.angularFireDatabase.database.ref('sensors/' + sensor.val() + '/bills').orderByChild('current').equalTo(true).limitToFirst(1).once('value')
                    .then((billSnapshot) => {
                        let bill = billSnapshot.val();
                        let key = Object.keys(bill);
                        this.bill = bill[key[0]];
                        if (refresher) {
                            refresher.complete()
                        }
                    })
            }).catch((err) => {
                console.log(err);
                if (refresher) {
                    refresher.complete()
                }
            }
        )
    }
}
