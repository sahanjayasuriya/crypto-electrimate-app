import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SettlePaymentPage} from './settle-payment';

@NgModule({
  declarations: [
    SettlePaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(SettlePaymentPage),
  ],
})
export class SettlePaymentPageModule {
}
