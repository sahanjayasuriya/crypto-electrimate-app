import {Component, OnInit} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {WelcomePage} from "../welcome/welcome";
import {Storage} from '@ionic/storage';
import {EulaAgreementPage} from "../eula-agreement/eula-agreement";

@IonicPage()
@Component({
    selector: 'page-eula',
    templateUrl: 'eula.html',
})
export class EulaPage implements OnInit {
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

    //function, when eula completes user redirects into welcome(login) page
    complete() {
        if (!this.options.showEula) {
            this.storage.set('showEula', 0).then(() => {

            });
        }
        this.navCtrl.setRoot(WelcomePage);
    }

    //function, page on loading function
    ngOnInit() {
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

    //function, display loading message
    presentLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Loading...'
        });
        this.loading.present();
    }

    //function, display eula
    showEula() {
        let eulaModel = this.modalCtrl.create(EulaAgreementPage);
        eulaModel.present();
    }

    //function, exit from app
    exit() {
        this.platform.exitApp();
    }
}
