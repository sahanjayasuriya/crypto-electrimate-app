import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-eula-agreement',
    templateUrl: 'eula-agreement.html',
})
export class EulaAgreementPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    }

    //function, redirect back to welcome(login) page
    dismiss() {
        this.viewCtrl.dismiss();
    }

}
