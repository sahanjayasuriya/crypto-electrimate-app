import {Component, ViewChild} from '@angular/core';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {AlertController, Events, Nav, Platform} from 'ionic-angular';

import {HomePage} from "../pages/home/home";
import {WelcomePage} from "../pages/welcome/welcome";
import {UsersPage} from "../pages/users/users";
import {ModulesPage} from "../pages/modules/modules";
import {SettingsPage} from "../pages/settings/settings";
import {User} from "../model/user";
import {AngularFireAuth} from "angularfire2/auth";
import {EulaPage} from "../pages/eula/eula";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) nav: Nav;

    rootPage: any = EulaPage;
    activePage: any;
    currentUser: any;
    user: User = new User();

    pages: Array<{ title: string, component: any, icon: string }>;

    constructor(platform: Platform,
                private statusBar: StatusBar,
                private splashScreen: SplashScreen,
                private events: Events,
                private angularFireAuth: AngularFireAuth,
                public alertCtrl: AlertController) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });

        events.subscribe('user:logged', (user, time) => {
            this.currentUser = user;
            this.user.email = user.email;
            this.user.displayName = user.displayName;
            this.user.photoURL = user.photoURL;
            this.user.phoneNumber = user.phoneNumber;
            console.log(user);
        });

        events.subscribe('user:updated', (user, time) => {
            this.currentUser = this.angularFireAuth.auth.currentUser;
            this.user.email = this.currentUser.email;
            this.user.displayName = this.currentUser.displayName;
            this.user.photoURL = this.currentUser.photoURL;
            this.user.phoneNumber = this.currentUser.phoneNumber;
            console.log(this.currentUser);
        });

        this.pages = [
            {title: 'Home', component: HomePage, icon: 'home'},
            {title: 'Users', component: UsersPage, icon: 'contacts'},
            {title: 'Modules', component: ModulesPage, icon: 'outlet'},
            {title: 'Settings', component: SettingsPage, icon: 'settings'}
        ];

        this.activePage = this.pages[0];
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
        this.activePage = page;
    }

    checkActive(page) {
        return page == this.activePage;
    }

    logOut() {
        let confirm = this.alertCtrl.create({
            title: 'Log Out',
            message: 'Are you sure you want to log out?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log('No clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        console.log('Yes clicked');
                        this.angularFireAuth.auth.signOut();
                        this.nav.setRoot(WelcomePage);
                    }
                }
            ],
            cssClass: 'electrimateAlertCss'
        });
        confirm.present();
    }
}
