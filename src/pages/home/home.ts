import { Component, ViewChild } from "@angular/core";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Chart } from 'chart.js';
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ScanQrPage } from "../scan-qr/scan-qr";

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    @ViewChild('doughnutCanvas') doughnutCanvas;
    doughnutChart: any;
    showChart: boolean = false;
    user1: String = "Deshani Vimukthika";
    startDate: Date;
    dueDate: Date;
    private currentUserId: string;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private angularFireDatabase: AngularFireDatabase) {

        this.currentUserId = this.angularFireAuth.auth.currentUser.uid;
    }

    ngAfterViewInit() {
        if (this.navParams.get('viewChart')) {
            this.showChart = true;
            setTimeout(() => {
                this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

                    type: 'doughnut',
                    data: {
                        labels: ["user1", "Pamodya De Seram", "Mahela Jayawardane"],
                        datasets: [{
                            label: '# of Units',
                            data: [12, 19, 3],
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56"
                            ],
                            hoverBackgroundColor: [
                                "#b43f66",
                                "#2b7ab4",
                                "#b5933d"
                            ]
                        }]
                    },
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
            }, 500);
        }


    }


    checkUsage(startDate, dueDate) {
        // this.startDate = startDate;
        // this.dueDate = dueDate;
        // this.showChart = true;
        // console.log("+++++" + dueDate);
        // this.ngAfterViewInit()
        console.log(startDate);
        console.log(dueDate);
        this.angularFireDatabase.database.ref('users/' + this.currentUserId + '/modules')
            .once('value', moduleSnapshot => {
                const modules: string[] = moduleSnapshot.val();
                modules.forEach(module => {
                    this.angularFireDatabase.database.ref('modules/' + module + '/sensors')
                        .once('value', sensorSnapshot => {
                            const sensors: string[] = sensorSnapshot.val();
                            sensors.forEach(sensor => {
                                this.angularFireDatabase.database.ref('sensors/' + sensor + '/processed/' + 2018)
                                    .orderByKey().startAt('3').endAt('4').once('value', processedSnapshot => {
                                    console.log(processedSnapshot.val());
                                })
                            })
                        })
                })

            })
    }

    scanSensor() {
        this.navCtrl.push(ScanQrPage);
    }

    showHistory() {
        alert('dfgfdfgfdf')
    }
}
