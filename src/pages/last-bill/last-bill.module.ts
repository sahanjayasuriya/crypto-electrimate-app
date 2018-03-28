import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LastBillPage } from './last-bill';

@NgModule({
  declarations: [
    LastBillPage,
  ],
  imports: [
    IonicPageModule.forChild(LastBillPage),
  ],
})
export class LastBillPageModule {}
