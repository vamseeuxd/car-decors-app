import {Component} from '@angular/core';
import {NbComponentShape, NbComponentSize, NbComponentStatus} from '@nebular/theme';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {ProductCategoryInterface} from '../manage-categories/manage-categories.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {BusyIndicatorService} from '../../../@core/utils/busy-indicator.service';
import * as firebase from 'firebase';
import {NgForm} from '@angular/forms';
import {ProductSubcategoryInterface} from '../manage-subcategories/manage-subcategories.component';
import {shareReplay, switchMap, tap} from 'rxjs/operators';
import {BrandInterface} from '../manage-brand/manage-brand.component';

export interface ProductInterface {
  name: string;
  id: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  subcategory: string;
  createdOn: string;
  updatedOn: string;
  deleted: boolean;
}

@Component({
  selector: 'ngx-buttons',
  styleUrls: ['./manage-product.component.scss'],
  templateUrl: './manage-product.component.html',
})
export class ManageProductComponent {
  /**
   * productCategories
   * */
  private productCategoriesCollection: AngularFirestoreCollection<ProductCategoryInterface>;
  productCategories$: Observable<ProductCategoryInterface[]>;
  selectedProductCategory$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedProductCategory = '';
  selectedProductCategoryBusyIndicatorId = null;
  /**
   * brands
   * */
  private brandsCollection: AngularFirestoreCollection<BrandInterface>;
  brands$: Observable<BrandInterface[]>;
  selectedBrand$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedBrand = '';
  selectedBrandBusyIndicatorId = null;
  /**
   * productSubcategories
   * */
  productSubcategories$: Observable<ProductSubcategoryInterface[]>;
  selectedProductSubcategory$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedProductSubcategory = '';
  selectedProductSubcategoryBusyIndicatorId = null;
  /**
   * productSubcategories
   * */
  productSubcategoriesForUpdate$: Observable<ProductSubcategoryInterface[]>;
  selectedProductSubcategoryForUpdate$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedProductCategoryForUpdate$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  selectedProductSubcategoryForUpdate = '';
  selectedProductSubcategoryBusyIndicatorIdForUpdate = null;
  /**
   * productSubcategories
   * */
  private itemsCollection: AngularFirestoreCollection<ProductInterface>;
  products$: Observable<ProductInterface[]>;

  timestamp;
  productIdToEdit = '';

  constructor(
    public firestore: AngularFirestore,
    public busyIndicatorService: BusyIndicatorService,
  ) {
    this.timestamp = firebase.firestore.Timestamp.now().seconds * 1000;
    this.getProductCategories();
    this.getProductSubcategories();
    this.getProducts();
    this.getProductSubcategoriesForUpdate();
    this.getBrands();

  }

  getProducts() {
    this.itemsCollection = this.firestore.collection<ProductInterface>('products');
    this.products$ = this.selectedProductSubcategory$.pipe(
      switchMap(
        selectedProductSubcategory => {
          return this.firestore.collection<ProductInterface>(
            'products',
            ref => {
              return ref.orderBy('name')
                .where('deleted', '==', false)
                .where('subcategory', '==', selectedProductSubcategory);
            }).valueChanges()
            .pipe(shareReplay())
            .pipe(
              tap(x => {
                this.busyIndicatorService.hide(this.selectedProductSubcategoryBusyIndicatorId);
              }),
            );
        },
      ),
    );
  }

  getProductSubcategories() {
    this.productSubcategories$ = this.selectedProductCategory$.pipe(
      switchMap(
        selectedProductCategory => {
          return this.firestore.collection<ProductSubcategoryInterface>(
            'product-subcategories',
            ref => {
              return ref.orderBy('name').where('deleted', '==', false).where('category', '==', selectedProductCategory);
            }).valueChanges()
            .pipe(shareReplay())
            .pipe(
              tap(x => {
                this.busyIndicatorService.hide(this.selectedProductCategoryBusyIndicatorId);
              }),
            );
        },
      ),
    );
  }

  updateProductSubcategoryForUpdate(productSubcategoryForUpdate: string) {
    this.selectedProductSubcategoryForUpdate = productSubcategoryForUpdate;
  }

  onUpdateCategoryChange(selectedProductCategoryForUpdate: string) {
    this.selectedProductSubcategoryBusyIndicatorIdForUpdate = this.busyIndicatorService.show();
    this.selectedProductCategoryForUpdate$.next(selectedProductCategoryForUpdate);
  }

  getProductSubcategoriesForUpdate() {
    this.productSubcategoriesForUpdate$ = this.selectedProductCategoryForUpdate$.pipe(
      switchMap(
        selectedProductCategory => {
          return this.firestore.collection<ProductSubcategoryInterface>(
            'product-subcategories',
            ref => {
              return ref.orderBy('name').where('deleted', '==', false).where('category', '==', selectedProductCategory);
            }).valueChanges()
            .pipe(shareReplay())
            .pipe(
              tap(x => {
                this.busyIndicatorService.hide(this.selectedProductSubcategoryBusyIndicatorIdForUpdate);
              }),
            );
        },
      ),
    );
  }

  getProductCategories() {
    this.productCategoriesCollection = this.firestore.collection<ProductCategoryInterface>(
      'product-categories',
      ref => {
        return ref.orderBy('name').where('deleted', '==', false);
      });
    this.productCategories$ = this.productCategoriesCollection.valueChanges();
  }

  getBrands() {
    this.brandsCollection = this.firestore.collection<BrandInterface>(
      'brands',
      ref => {
        return ref.orderBy('name').where('deleted', '==', false);
      });
    this.brands$ = this.brandsCollection.valueChanges();
  }

  async addItem(newProductCategory: NgForm) {
    const name = newProductCategory.value.name;
    const category = newProductCategory.value.category;
    const subcategory = newProductCategory.value.subcategory;
    const description = newProductCategory.value.description;
    const price = newProductCategory.value.price;
    const code = newProductCategory.value.code;
    const brand = newProductCategory.value.brand;
    const busyIndicatorId = this.busyIndicatorService.show();
    const id = this.firestore.createId();
    const deleted = false;
    const createdOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime();
    const updatedOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime();
    try {
      const response = await this.firestore.collection('products').doc(id).set(
        {
          name,
          category,
          subcategory,
          description,
          price,
          code,
          brand,
          createdOn,
          id,
          deleted,
          updatedOn,
        },
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
    const subcategory = updateProductCategory.value.subcategory;
    const description = updateProductCategory.value.description;
    const price = updateProductCategory.value.price;
    const code = updateProductCategory.value.code;
    const brand = updateProductCategory.value.brand;
    const busyIndicatorId = this.busyIndicatorService.show();
    const updatedOn = new Date(firebase.firestore.Timestamp.now().seconds * 1000).getTime();
    try {
      const response = await this.itemsCollection.doc(id).update(
        {
          name,
          category,
          subcategory,
          description,
          price,
          code,
          brand,
          updatedOn,
        },
      );
      this.busyIndicatorService.hide(busyIndicatorId);
      this.productIdToEdit = '';
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

  onSelectedProductCategory(selectedProductCategory: string) {
    if (this.selectedProductCategory !== selectedProductCategory) {
      this.selectedProductCategoryBusyIndicatorId = this.busyIndicatorService.show();
      this.selectedProductCategory$.next(selectedProductCategory);
      this.selectedProductCategory = selectedProductCategory;
      this.selectedProductSubcategory$.next('');
      this.selectedProductSubcategory = '';
    }
  }

  onSelectedProductSubcategory(selectedProductSubcategory: string) {
    if (this.selectedProductSubcategory !== selectedProductSubcategory) {
      this.selectedProductSubcategoryBusyIndicatorId = this.busyIndicatorService.show();
      this.selectedProductSubcategory$.next(selectedProductSubcategory);
      this.selectedProductSubcategory = selectedProductSubcategory;
    }
  }
}
