import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {SettlePaymentPage} from "../settle-payment/settle-payment";

@IonicPage()
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  }

  name: string;
  image: string;
  settle: string;
  joined: string;

  ionViewDidLoad() {
    this.name = this.navParams.get('name');
    this.image = this.navParams.get('image');
    this.settle = this.navParams.get('settle');
    this.joined = this.navParams.get('joined');
  }

  openSettleModal() {
    let modal = this.modalCtrl.create(SettlePaymentPage);
    modal.present();
  }

}
