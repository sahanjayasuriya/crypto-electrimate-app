import { NgModule } from '@angular/core';
import { IonicPageModule, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LastBillComponent } from './last-bill.component';

@NgModule({
    declarations: [
        LastBillComponent
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
    ]
})
export class LastBillModule {


    constructor(public navCtrl: NavController,
                public navParams: NavParams) {
    }
}