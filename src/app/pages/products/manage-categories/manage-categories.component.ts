import {Component} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {BusyIndicatorService} from '../../../@core/utils/busy-indicator.service';
import * as firebase from 'firebase';

export interface ProductCategoryInterface {
  name: string;
  id: string;
  createdOn: string;
  updatedOn: string;
  deleted: boolean;
}

@Component({
  selector: 'ngx-form-inputs',
  styleUrls: ['./manage-categories.component.scss'],
  templateUrl: './manage-categories.component.html',
})
export class ManageCategoriesComponent {

  private itemsCollection: AngularFirestoreCollection<ProductCategoryInterface>;
  productCategories$: Observable<ProductCategoryInterface[]>;
  timestamp;
  productCategoryIdToEdit = '';

  constructor(
    public firestore: AngularFirestore,
    public busyIndicatorService: BusyIndicatorService,
  ) {
    this.itemsCollection = firestore.collection<ProductCategoryInterface>('product-categories', ref => {
      this.timestamp = firebase.firestore.Timestamp.now().seconds * 1000;
      // console.log('timestamp', this.timestamp);
      return ref
        /*.orderBy('createdOn')
        .where('createdOn', '<', this.timestamp)*/
        .orderBy('name')
        .where('deleted', '==', false);
    });
    this.productCategories$ = this.itemsCollection.valueChanges();
  }

  async addItem(newProductCategory: HTMLInputElement) {
    if (newProductCategory.value.trim().length > 0) {
      const name = newProductCategory.value.trim();
      const busyIndicatorId = this.busyIndicatorService.show();
      const id = this.firestore.createId();
      const deleted = false;
      const createdOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime(); // .toISOString();
      const updatedOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime(); // .toISOString();
      try {
        const response = await this.firestore.collection('product-categories').doc(id).set(
          {name, createdOn, id, deleted, updatedOn},
        );
        newProductCategory.value = '';
        this.busyIndicatorService.hide(busyIndicatorId);
      } catch (e) {
        console.error(e);
        this.busyIndicatorService.hide(busyIndicatorId);
      }
    }
  }

  async updateItem(updateProductCategory: HTMLInputElement, id: string) {
    if (updateProductCategory.value.trim().length > 0) {
      const name = updateProductCategory.value.trim();
      const busyIndicatorId = this.busyIndicatorService.show();
      const updatedOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime(); // .toISOString();
      try {
        const response = await this.itemsCollection.doc(id).update({name, updatedOn});
        updateProductCategory.value = '';
        this.productCategoryIdToEdit = '';
        this.busyIndicatorService.hide(busyIndicatorId);
      } catch (e) {
        console.error(e);
        this.busyIndicatorService.hide(busyIndicatorId);
      }
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
