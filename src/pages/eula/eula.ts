import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {WelcomePage} from "../welcome/welcome";
import {Storage} from '@ionic/storage';
import {SettlePaymentPage} from "../settle-payment/settle-payment";
import {EulaAgreementPage} from "../eula-agreement/eula-agreement";

@IonicPage()
@Component({
    selector: 'page-eula',
    templateUrl: 'eula.html',
})
export class EulaPage implements OnInit{
    public options;
    private loading: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private storage: Storage,
                public loadingCtrl: LoadingController,
                private modalCtrl: ModalController,
                private platform: Platform) {
        this.options = {
            showEula: false
        };
    }

    complete() {
        if (!this.options.showEula) {
            this.storage.set('showEula', 0).then(() => {

            });
        }
        this.navCtrl.setRoot(WelcomePage);
    }

    ngOnInit(){
        this.presentLoading();
        this.storage.get('showEula').then((value) => {
            if (value == 0) {
                this.navCtrl.push(WelcomePage);
                this.loading.dismiss();
            }
            else {
                this.loading.dismiss();
            }
        }, () => {
            this.loading.dismiss();
        });
    }

    presentLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Loading...'
        });
        this.loading.present();
    }

    showEula(){
        let eulaModel = this.modalCtrl.create(EulaAgreementPage);
        eulaModel.present();
    }

    exit(){
        this.platform.exitApp();
    }
}
