import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {SettlePaymentPage} from "../settle-payment/settle-payment";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import {User} from "../../model/user";
import {SMS} from "@ionic-native/sms";
import {CallNumber} from "@ionic-native/call-number";

@IonicPage()
@Component({
    selector: 'page-user-details',
    templateUrl: 'user-details.html',
})
export class UserDetailsPage {

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private angularFireAuth: AngularFireAuth,
                private angularFireDatabase: AngularFireDatabase,
                public modalCtrl: ModalController,
                private call: CallNumber,
                private sms: SMS) {
    }

    userId: string;
    user: User = new User();

    //function, on page loading
    ionViewDidLoad() {
        this.userId = this.navParams.get('userId');
        this.angularFireDatabase.database.ref('/users/' + this.userId).once('value')
            .then((data) => {
                this.user = data.val();
            }, (error) => {
                console.log(error);
            });
    }

    //function, call user
    callUser() {
        this.call.callNumber(this.user.phoneNumber, false);
    }

    //function, send message to user
    smsUser() {
        this.sms.send(this.user.phoneNumber, '\n - Sent from Electrimate App', {
            replaceLineBreaks: true,
            android: {intent: 'INTENT'}
        });
    }

}
