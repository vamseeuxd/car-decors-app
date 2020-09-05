import {Component} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {BusyIndicatorService} from '../../../@core/utils/busy-indicator.service';
import * as firebase from 'firebase';
import {ProductCategoryInterface} from '../manage-categories/manage-categories.component';
import {NgForm} from '@angular/forms';

export interface ProductSubcategoryInterface {
  name: string;
  id: string;
  category: string;
  createdOn: string;
  updatedOn: string;
  deleted: boolean;
}

@Component({
  selector: 'ngx-form-layouts',
  styleUrls: ['./manage-subcategories.component.scss'],
  templateUrl: './manage-subcategories.component.html',
})
export class ManageSubcategoriesComponent {
  private itemsCollection: AngularFirestoreCollection<ProductSubcategoryInterface>;
  private productCategoriesCollection: AngularFirestoreCollection<ProductCategoryInterface>;
  productCategories$: Observable<ProductCategoryInterface[]>;
  productSubcategories$: Observable<ProductSubcategoryInterface[]>;
  timestamp;
  productCategoryIdToEdit = '';

  constructor(
    public firestore: AngularFirestore,
    public busyIndicatorService: BusyIndicatorService,
  ) {
    this.timestamp = firebase.firestore.Timestamp.now().seconds * 1000;
    this.itemsCollection = firestore.collection<ProductSubcategoryInterface>('product-subcategories', ref => {
      return ref.orderBy('name').where('deleted', '==', false);
    });
    this.productSubcategories$ = this.itemsCollection.valueChanges();

    this.productCategoriesCollection = firestore.collection<ProductCategoryInterface>('product-categories', ref => {
      return ref.orderBy('name').where('deleted', '==', false);
    });
    this.productCategories$ = this.productCategoriesCollection.valueChanges();
  }

  async addItem(newProductCategory: NgForm) {
    const name = newProductCategory.value.name;
    const category = newProductCategory.value.category;
    const busyIndicatorId = this.busyIndicatorService.show();
    const id = this.firestore.createId();
    const deleted = false;
    const createdOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime();
    const updatedOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime();
    try {
      const response = await this.firestore.collection('product-subcategories').doc(id).set(
        {name, category, createdOn, id, deleted, updatedOn},
      );
      newProductCategory.resetForm({});
      this.busyIndicatorService.hide(busyIndicatorId);
    } catch (e) {
      console.error(e);
      this.busyIndicatorService.hide(busyIndicatorId);
    }
  }

  async updateItem(updateProductCategory: NgForm, id: string) {
    const name = updateProductCategory.value.name;
    const category = updateProductCategory.value.category;
    const busyIndicatorId = this.busyIndicatorService.show();
    const updatedOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime();
    try {
      const response = await this.itemsCollection.doc(id).update({name, category, updatedOn});
      this.busyIndicatorService.hide(busyIndicatorId);
      this.productCategoryIdToEdit = '';
      updateProductCategory.resetForm({});
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
