import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';
import { ManageSubcategoriesComponent } from './manage-subcategories/manage-subcategories.component';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { FormsModule as ngFormsModule } from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {ManageBrandComponent} from './manage-brand/manage-brand.component';

@NgModule({
  imports: [
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    ProductsRoutingModule,
    NbSelectModule,
    NbIconModule,
    ngFormsModule,
    AngularFireModule,
  ],
  declarations: [
    ProductsComponent,
    ManageProductComponent,
    ManageCategoriesComponent,
    ManageSubcategoriesComponent,
    ManageBrandComponent,
  ],
})
export class ProductsModule { }
