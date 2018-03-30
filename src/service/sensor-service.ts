import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class SensorService {

    constructor(private angularFirebase: AngularFireDatabase, private angularFireAuth: AngularFireAuth) {
    }

    public sensorsAvailable() {
        const userId = this.angularFireAuth.auth.currentUser.uid;

    }
}