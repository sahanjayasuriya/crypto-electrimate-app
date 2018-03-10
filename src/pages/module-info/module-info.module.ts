import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ModuleInfoPage} from './module-info';

@NgModule({
  declarations: [
    ModuleInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModuleInfoPage),
  ],
})
export class ModuleInfoPageModule {
}
