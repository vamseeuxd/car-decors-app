import {Component} from '@angular/core';

@Component({
  selector: 'ngx-form-inputs',
  styleUrls: ['./manage-categories.component.scss'],
  templateUrl: './manage-categories.component.html',
})
export class ManageCategoriesComponent {

  starRate = 2;
  heartRate = 4;
  radioGroupValue = 'This is value 2';
  productCategoriesList: string[] = [
    'Lemons',
    'Raspberries',
    'Strawberries',
    'Blackberries',
    'Kiwis',
    'Grapefruit',
    'Avocado',
    'Watermelon',
    'Cantaloupe',
    'Oranges',
    'Peaches',
  ];

}
