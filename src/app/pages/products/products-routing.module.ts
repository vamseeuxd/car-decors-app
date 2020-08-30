import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from './products.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageSubcategoriesComponent } from './manage-subcategories/manage-subcategories.component';
import { ManageProductComponent } from './manage-product/manage-product.component';

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

