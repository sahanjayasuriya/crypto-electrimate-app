import {ScanQrPage} from "../scan-qr/scan-qr";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {Component, ViewChild} from "@angular/core";
import {Chart} from 'chart.js';
import { Calendar } from '@ionic-native/calendar';
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

    constructor(public navCtrl: NavController, public navParams: NavParams) {
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


// createCalendar() {
//     this.calendar.createCalendar('MyCalendar').then(
//         (msg) => {
//             console.log(msg);
//         },
//         (err) => {
//             console.log(err);
//         }
//     );
//}
    scanSensor() {
        this.navCtrl.push(ScanQrPage);
    }

    showHistory() {

    }
}