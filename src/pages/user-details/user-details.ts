import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import {SettlePaymentPage} from "../settle-payment/settle-payment";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import {errorHandler} from "@angular/platform-browser/src/browser";
import {User} from "../../model/user";

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
                private toastCtrl: ToastController,
                public modalCtrl: ModalController) {
    }

    name: string;
    image: string;
    settle: string;
    joined: string;

    userId:string;
    user:User = new User();

    ionViewDidLoad() {
        this.name = this.navParams.get('name');
        this.image = this.navParams.get('image');
        this.settle = this.navParams.get('settle');
        this.joined = this.navParams.get('joined');
        this.userId = this.navParams.get('userId');

        this.angularFireDatabase.database.ref('/users/' + this.userId).once('value')
            .then((data)=>{
                this.user.displayName = data.val().displayName;
                this.user.email = data.val().email;
                this.user.phoneNumber = data.val().phoneNumber;
                this.user.photoURL = data.val().photoURL;
        }, (error)=>{

        });



    }

    openSettleModal() {
        let modal = this.modalCtrl.create(SettlePaymentPage);
        modal.present();
    }

}
