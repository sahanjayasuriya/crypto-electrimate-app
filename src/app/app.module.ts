import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Camera} from '@ionic-native/camera';
import {SplashScreen} from '@ionic-native/splash-screen';
import {File} from '@ionic-native/file';
import {StatusBar} from '@ionic-native/status-bar';
import {IonicStorageModule, Storage} from '@ionic/storage';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';


import {MyApp} from './app.component';
import {HomePage} from "../pages/home/home";
import {WelcomePage} from "../pages/welcome/welcome";
import {HomePageModule} from "../pages/home/home.module";
import {WelcomePageModule} from "../pages/welcome/welcome.module";
import {ScanQrPage} from "../pages/scan-qr/scan-qr";
import {ScanQrPageModule} from "../pages/scan-qr/scan-qr.module";
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {CreateUserPage} from "../pages/create-user/create-user";
import {CreateUserPageModule} from "../pages/create-user/create-user.module";
import {UsersPageModule} from "../pages/users/users.module";
import {UsersPage} from "../pages/users/users";
import {ModulesPageModule} from "../pages/modules/modules.module";
import {SensorsPageModule} from "../pages/sensors/sensors.module";
import {SettingsPageModule} from "../pages/settings/settings.module";
import {AddUserPageModule} from "../pages/add-user/add-user.module";
import {ModulesPage} from "../pages/modules/modules";
import {SensorsPage} from "../pages/sensors/sensors";
import {SettingsPage} from "../pages/settings/settings";
import {AddUserPage} from "../pages/add-user/add-user";
import {ModuleInfoPageModule} from "../pages/module-info/module-info.module";
import {ModuleInfoPage} from "../pages/module-info/module-info";
import {UserDetailsPageModule} from "../pages/user-details/user-details.module";
import {UserDetailsPage} from "../pages/user-details/user-details";
import {SettlePaymentPageModule} from "../pages/settle-payment/settle-payment.module";
import {SettlePaymentPage} from "../pages/settle-payment/settle-payment";
import {AngularFireModule} from "angularfire2";
import {FIREBASE_CONFIG} from "./app.firebase.config";
import {AngularFireAuthModule} from "angularfire2/auth";
import {UserProfilePageModule} from "../pages/user-profile/user-profile.module";
import {UserProfilePage} from "../pages/user-profile/user-profile";
import {Transfer} from "@ionic-native/transfer";
import {FilePath} from "@ionic-native/file-path";
import 'firebase/storage'
import {PasswordResetPage} from "../pages/password-reset/password-reset";
import {PasswordResetPageModule} from "../pages/password-reset/password-reset.module";
import {PasswordChangePageModule} from "../pages/password-change/password-change.module";
import {PasswordChangePage} from "../pages/password-change/password-change";
import {AngularFireDatabase} from "angularfire2/database";
// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
    /**
     * The Settings provider takes a set of default settings for your app.
     *
     * You can add new settings options at any time. Once the settings are saved,
     * these values will not overwrite the saved values (this can be done manually if desired).
     */
}

@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        AngularFireModule.initializeApp(FIREBASE_CONFIG),
        AngularFireAuthModule,
        HomePageModule,
        WelcomePageModule,
        ScanQrPageModule,
        CreateUserPageModule,
        UsersPageModule,
        ModulesPageModule,
        SensorsPageModule,
        SettingsPageModule,
        AddUserPageModule,
        ModuleInfoPageModule,
        UserDetailsPageModule,
        SettlePaymentPageModule,
        UserProfilePageModule,
        PasswordResetPageModule,
        PasswordChangePageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        WelcomePage,
        ScanQrPage,
        CreateUserPage,
        UsersPage,
        ModulesPage,
        SensorsPage,
        SettingsPage,
        AddUserPage,
        ModuleInfoPage,
        UserDetailsPage,
        SettlePaymentPage,
        UserProfilePage,
        PasswordResetPage,
        PasswordChangePage
    ],
    providers: [
        Camera,
        SplashScreen,
        StatusBar,
        BarcodeScanner,
        File,
        Transfer,
        FilePath,
        AngularFireDatabase,
        // Keep this to enable Ionic's runtime error handling during development
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
