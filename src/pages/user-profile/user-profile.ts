import {AngularFireAuth} from "angularfire2/auth";
import {
    ActionSheetController, Events,
    IonicPage,
    ModalController,
    NavController,
    NavParams,
    ToastController
} from "ionic-angular";
import {Component} from "@angular/core";
import {Camera} from "@ionic-native/camera";
import {FirebaseApp} from 'angularfire2';
import {User} from "../../model/user";
import * as firebase from "firebase/app";
import AuthCredential = firebase.auth.AuthCredential;

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-user-profile',
    templateUrl: 'user-profile.html',
})
export class UserProfilePage {
    user: User = new User();
    credential: AuthCredential;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private camera: Camera,
                public actionSheetCtrl: ActionSheetController,
                private angularFireAuth: AngularFireAuth,
                private toastCtrl: ToastController,
                private firebaseApp: FirebaseApp,
                public events: Events) {
    }

    ionViewWillLoad() {
        const currentUser = this.angularFireAuth.auth.currentUser;
        this.user.email = currentUser.email;
        this.user.displayName = currentUser.displayName;
        this.user.phoneNumber = currentUser.phoneNumber;
        this.user.photoURL = currentUser.photoURL;
    }

    public presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select an Image',
            buttons: [
                {
                    text: 'Select from Gallery',
                    icon: 'image',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Take from Camera',
                    icon: 'camera',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancel',
                    icon: 'close-circle',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }


    public takePicture(sourceType) {
        var options = {
            quality: 90,
            sourceType: sourceType,
            destinationType: this.camera.DestinationType.DATA_URL,
            allowEdit: true,
            encodingType: this.camera.EncodingType.PNG,
            targetWidth: 500,
            targetHeight: 500,
            saveToPhotoAlbum: true,
            correctOrientation: true
        };

        this.camera.getPicture(options)
            .then((profileImage) => {
                const profilePic = this.firebaseApp.storage().ref('profileImages/' + this.angularFireAuth.auth.currentUser.uid + '.png');
                profilePic.putString(profileImage, 'base64', {contentType: 'image/png'})
                    .then((savedImage) => {
                        debugger;
                        this.presentToast("Photo Successfully Updated");
                        this.user.photoURL = savedImage.downloadURL;
                    });
            }, (err) => {
                this.presentToast("Error uploading photo");
            });
    }

    updateDetails() {
        this.angularFireAuth.auth.currentUser.updateProfile(
            {
                displayName: this.user.displayName,
                photoURL: this.user.photoURL
            }
        ).then((data) => {
            this.presentToast("User details updated successfully");
            this.events.publish('user:updated', this.angularFireAuth.auth.currentUser, Date.now())
        }).catch((err) => {
            this.presentToast("Error updating user details. " + err.message);
        })

    }

    private presentToast(text) {
        let toast = this.toastCtrl.create({
            message: text,
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    }

}
