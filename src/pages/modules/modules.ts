import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";
import {ModuleInfoPage} from "../module-info/module-info";
import {LastBillPage} from "../last-bill/last-bill";

@IonicPage()
@Component({
    selector: 'page-modules',
    templateUrl: 'modules.html',
})
export class ModulesPage {

    moduleId: string;
    userId: string;
    modules: Array<string>;
    moduleList: Array<{ id: string, name: string }> = [];
    loading: any;

    constructor(private angularFireDatabase: AngularFireDatabase,
                private angularFireAuth: AngularFireAuth,
                public navCtrl: NavController,
                public navParams: NavParams,
                public alertController: AlertController,
                public loadingCtrl: LoadingController) {
    }

    //function, call on page loading
    ionViewDidLoad() {
        this.presentLoading();
        this.userId = this.angularFireAuth.auth.currentUser.uid;
        this.angularFireDatabase.database.ref('/users/' + this.userId + '/modules/').once('value')
            .then((data) => {
                this.modules = data.val();
                for (let module of this.modules) {
                    this.moduleId = module;
                    this.angularFireDatabase.database.ref('/modules/' + this.moduleId).once('value')
                        .then((data) => {
                            this.moduleList.push({id: this.moduleId, name: data.val().moduleName});
                        })
                }
                this.loading.dismiss();
            }, (error) => {
                this.loading.dismiss();
            });
    }

    //function, redirect into module detail page
    viewModule(moduleId: string) {
        this.navCtrl.push(ModuleInfoPage, {'moduleId': this.moduleId});
    }

    //function, display loading
    presentLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Loading...'
        });
        this.loading.present();
    }

}
