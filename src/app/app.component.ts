import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { AlertController, Events, Nav, Platform } from 'ionic-angular';
import { User } from "../model/user";
import { EulaPage } from "../pages/eula/eula";

import { HomePage } from "../pages/home/home";
import { ModulesPage } from "../pages/modules/modules";
import { SettingsPage } from "../pages/settings/settings";
import { UsersPage } from "../pages/users/users";
import { WelcomePage } from "../pages/welcome/welcome";

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

    constructor(private platform: Platform,
                private statusBar: StatusBar,
                private splashScreen: SplashScreen,
                private events: Events,
                private angularFireAuth: AngularFireAuth,
                private angularFireDatabase: AngularFireDatabase,
                private alertCtrl: AlertController) {
        platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });

        //Setting the current user in sidemenu when the user:logged event fires from the welcome.ts file
        events.subscribe('user:logged', (user, time) => {
            this.currentUser = user; //Setting the current user object

            //Setting the values of the user object from the user object got from the fired event
            this.user.email = user.email;
            this.user.displayName = user.displayName;
            this.user.photoURL = user.photoURL;
            this.user.phoneNumber = user.phoneNumber;

            //Getting the user type of the logged in user from firebase
            //Path /users/userId/userType
            this.angularFireDatabase.database.ref('users/' + user.uid + '/userType').once('value')
                .then((userType) => {
                    console.log(userType.val());
                    if ('HOUSE-OWNER' == userType.val()) { //Setting the sidemenu items for House Owners
                        this.pages = [
                            {title: 'Home', component: HomePage, icon: 'home'},
                            {title: 'Users', component: UsersPage, icon: 'contacts'},
                            {title: 'Modules', component: ModulesPage, icon: 'outlet'},
                            {title: 'Settings', component: SettingsPage, icon: 'settings'}
                        ];
                    } else if ('ELECTRICITY-USER' == userType.val()) { //Setting the sidemenu items for Electricity Users
                        this.pages = [
                            {title: 'Home', component: HomePage, icon: 'home'},
                            {title: 'Settings', component: SettingsPage, icon: 'settings'}
                        ];
                    } else {
                        this.pages = [];
                    }
                    this.activePage = this.pages[0]; //Setting the active page as the first object in the pages array
                }).catch((err) => {
                console.log(err); //Logging if any error occurred
            });
        });

        //Updating the current user in sidemenu when the user:updated event fires from the user-profile.ts file
        events.subscribe('user:updated', (user, time) => {
            //Updating the values
            this.currentUser = this.angularFireAuth.auth.currentUser;
            this.user.email = this.currentUser.email;
            this.user.displayName = this.currentUser.displayName;
            this.user.photoURL = this.currentUser.photoURL;
            this.user.phoneNumber = this.currentUser.phoneNumber;
        });

    }

    //Function to open the specific page when a menu item is touched
    openPage(page) {
        this.nav.setRoot(page.component);
        this.activePage = page;
    }

    //Function to check if the provided page is the active page
    checkActive(page) {
        return page == this.activePage;
    }

    //Logout function
    logOut() {
        let confirm = this.alertCtrl.create({   //Displaying a confirm alert
            title: 'Log Out',
            message: 'Are you sure you want to log out?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                    }   //Code should be written here if the app needs to do anything when No is touched
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.angularFireAuth.auth.signOut(); //Signing out from firebase
                        this.nav.setRoot(WelcomePage);      //Setting the root to the login (welcome) page
                    }
                }
            ],
            cssClass: 'electrimateAlertCss'
        });
        confirm.present(); //Presenting the alert
    }
}
