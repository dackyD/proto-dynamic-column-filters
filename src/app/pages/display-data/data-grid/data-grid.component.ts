import {Component, Input, OnInit} from '@angular/core';
import 'devextreme/data/odata/store';
import {ColumnModel} from '../models/column-model.interface';

@Component({
  templateUrl: 'data-grid.component.html',
  selector: 'app-data-grid'
})

export class DataGridComponent implements OnInit {


  @Input()
  columns: ColumnModel[];

  @Input()
  dataSource: any;

  priority: any[];

  constructor() {

    this.priority = [
      {name: 'High', value: 4},
      {name: 'Urgent', value: 3},
      {name: 'Normal', value: 2},
      {name: 'Low', value: 1}
    ];
  }

  ngOnInit() {
    console.log('columns', this.columns);
  }
}
