import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ModuleInfoPage} from "../module-info/module-info";
import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";

/**
 * Generated class for the ModulesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modules',
  templateUrl: 'modules.html',
})
export class ModulesPage {


    moduleId: string;
    userId: string;
    modules:Array<string>;
    moduleList:Array<{id:string,name:string}> = [];

    constructor(private angularFireDatabase: AngularFireDatabase,
              private angularFireAuth: AngularFireAuth,
              public navCtrl: NavController,
              public navParams: NavParams,
              public alertController: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModulesPage');
      this.userId = this.angularFireAuth.auth.currentUser.uid;
      console.log(this.userId);
      this.angularFireDatabase.database.ref('/users/' + this.userId +'/modules/').once('value')
          .then((data) => {
              this.modules = data.val();
              for(let module of this.modules){
                this.moduleId = module;
                console.log(this.moduleId);
                this.angularFireDatabase.database.ref('/modules/'+this.moduleId).once('value')
                    .then((data) =>{
                            console.log(data.val().batchNumber);
                            console.log(data.val().moduleName);
                            this.moduleList.push({id:this.moduleId,name:data.val().moduleName});
                        })
              }
          }, (error) => {
              let alert = this.alertController.create({
                  title: 'No Modules to Show',
                  subTitle: 'Sorry, we couldn\'t identify the sensor. Please try again or contact support',
                  buttons: ['OK']
              });
              alert.present();
          });
  }

  viewModule(moduleId : string) {
    // this.navCtrl.push(ModuleInfoPage);
      console.log(moduleId);
  }

}
