import {Component, TemplateRef} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {BusyIndicatorService} from '../../../@core/utils/busy-indicator.service';
import * as firebase from 'firebase';
import {NgForm} from '@angular/forms';

export interface UserInterface {
  name: string;
  id: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  createdOn: string;
  updatedOn: string;
  deleted: boolean;
}

@Component({
  selector: 'ngx-buttons',
  styleUrls: ['./manage-users.component.scss'],
  templateUrl: './manage-users.component.html',
})
export class ManageUsersComponent {
  private itemsCollection: AngularFirestoreCollection<UserInterface>;
  users$: Observable<UserInterface[]>;
  timestamp;
  UserIdToEdit = '';

  constructor(
    public firestore: AngularFirestore,
    public busyIndicatorService: BusyIndicatorService,
  ) {
    this.itemsCollection = firestore.collection<UserInterface>('users', ref => {
      this.timestamp = firebase.firestore.Timestamp.now().seconds * 1000;
      // console.log('timestamp', this.timestamp);
      return ref
        /*.orderBy('createdOn')
        .where('createdOn', '<', this.timestamp)*/
        .orderBy('name')
        .where('deleted', '==', false);
    });
    this.users$ = this.itemsCollection.valueChanges();
  }

  async addItem(newUser: NgForm, addUserModal: any) {
    const name = newUser.value.name.trim();
    const email = newUser.value.email.trim();
    const dateOfBirth = newUser.value.dateOfBirth.trim();
    const phone = newUser.value.phone.trim();
    const busyIndicatorId = this.busyIndicatorService.show();
    const id = this.firestore.createId();
    const deleted = false;
    const createdOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime(); // .toISOString();
    const updatedOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime(); // .toISOString();
    try {
      const response = await this.firestore.collection('users').doc(id).set(
        {
          name,
          email,
          dateOfBirth,
          phone,
          createdOn,
          id,
          deleted,
          updatedOn,
        },
      );
      newUser.resetForm({});
      addUserModal.hide();
      this.busyIndicatorService.hide(busyIndicatorId);
    } catch (e) {
      console.error(e);
      this.busyIndicatorService.hide(busyIndicatorId);
    }
  }

  async updateItem(updateUser: NgForm, id: string) {
    const name = updateUser.value.name.trim();
    const email = updateUser.value.email.trim();
    const dateOfBirth = updateUser.value.dateOfBirth.trim();
    const phone = updateUser.value.phone.trim();
    const busyIndicatorId = this.busyIndicatorService.show();
    const updatedOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime(); // .toISOString();
    try {
      const response = await this.itemsCollection.doc(id).update({
        name,
        email,
        dateOfBirth,
        phone,
        updatedOn,
      });
      updateUser.resetForm({});
      this.UserIdToEdit = '';
      this.busyIndicatorService.hide(busyIndicatorId);
    } catch (e) {
      console.error(e);
      this.busyIndicatorService.hide(busyIndicatorId);
    }
  }

  async deleteItem(id: string) {
    const isConfirmed = confirm('Are you sure! Do you want to delete?');
    if (isConfirmed) {
      const busyIndicatorId = this.busyIndicatorService.show();
      const updatedOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime(); // .toISOString();
      try {
        const response = await this.itemsCollection.doc(id).update({deleted: true, updatedOn});
        this.busyIndicatorService.hide(busyIndicatorId);
      } catch (e) {
        console.error(e);
        this.busyIndicatorService.hide(busyIndicatorId);
      }
    }
  }
}
