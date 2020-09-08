import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from './products.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageSubcategoriesComponent } from './manage-subcategories/manage-subcategories.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import {ManageBrandComponent} from './manage-brand/manage-brand.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {
        path: 'manage-categories',
        component: ManageCategoriesComponent,
      },
      {
        path: 'manage-subcategories',
        component: ManageSubcategoriesComponent,
      },
      {
        path: 'manage-product',
        component: ManageProductComponent,
      },
      {
        path: 'manage-brand',
        component: ManageBrandComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class ProductsRoutingModule {
}

