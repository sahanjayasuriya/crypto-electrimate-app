import { Component, OnInit, ViewChild } from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, DatabaseSnapshot } from 'angularfire2/database';
import { Chart } from 'chart.js';
import { IonicPage, LoadingController, NavController, NavParams } from "ionic-angular";
import { LastBillPage } from "../last-bill/last-bill";
import { ScanQrPage } from "../scan-qr/scan-qr";

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage implements OnInit {

    @ViewChild('doughnutCanvas') doughnutCanvas;
    doughnutChart: any;
    showChart: boolean = false;
    user1: String = "Deshani Vimukthika";
    startDate: Date;
    dueDate: Date;
    sensorsAvailable = true;
    module;
    bills = [];
    private modules: any[];
    private moduleBill: any;
    private colors = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#CEFF56"
    ];
    doughnutData = {
        labels: [],
        datasets: [
            {
                label: '# of Units',
                data: [],
                backgroundColor: this.colors,
                hoverBackgroundColor: [
                    "#b43f66",
                    "#2b7ab4",
                    "#b5933d",
                    "#93b53d"
                ]
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
                }

            });
    }

    ngAfterViewInit() {

    }


    checkUsage(startDate, dueDate) {
        this.startDate = startDate;
        this.dueDate = dueDate;
        this.showChart = true;
        console.log("+++++" + dueDate);
        this.ngAfterViewInit()
    }

    scanSensor() {
        this.navCtrl.push(ScanQrPage);
    }

    showHistory() {

    }

    viewBillDate() {
        this.navCtrl.push(LastBillPage);
    }

    loadData(refresher?) {
        if (this.isHouseOwner()) {
            this.loadHouseOwnerView(refresher)
        } else {
            this.loadTenantView(refresher);
        }
    }

    getDate(date) {
        if (!date || date instanceof String) date = new Date(date || '');
        return

    }

    precisionRound(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }

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

    private isHouseOwner() {
        this.houseOwner = this.userType === 'HOUSE-OWNER'
        return this.houseOwner;
    }

    presentLoading() {
        this.loadingIndicator = this.loadingCtrl.create({
            content: 'Loading...'
        });
        this.loadingIndicator.present();
    }

    private loadHouseOwnerView(refresher?) {
        this.loading = true;
        let colorI = 0;
        this.bills = [];
        this.doughnutData.labels = []
        this.doughnutData.datasets[0].data = []
        this.angularFireDatabase.database.ref('modules/' + this.module.key + '/bills').orderByChild('current')
            .equalTo(true).limitToFirst(1)
            .once('value')
            .then((moduleBillSnapshot: DatabaseSnapshot) => {
                moduleBillSnapshot.forEach((moduleBill: DatabaseSnapshot) => {
                    this.moduleBill = moduleBill.val();
                    return true;
                });
            });
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
                                                    this.doughnutData.labels.push(bill.user.displayName);
                                                    this.doughnutData.datasets[0].data.push(this.precisionRound(bill.wattHours / 1000, 3));
                                                    return true;
                                                });
                                                bill.color = this.colors[colorI++];
                                                this.bills.push(bill);
                                                this.loadingIndicator.dismiss()
                                                this.drawDoughnutChart();
                                                if (refresher) {
                                                    refresher.complete()
                                                }
                                            })
                                            .catch(() => {
                                                this.loadingIndicator.dismiss()
                                                if (refresher) {
                                                    refresher.complete()
                                                }
                                            });
                                        this.loading = false;
                                        return true;
                                    });
                                } else {
                                    this.loadingIndicator.dismiss()
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

    private loadTenantView(refresher?) {
    }
}
