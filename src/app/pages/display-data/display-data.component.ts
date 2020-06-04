import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import 'devextreme/data/odata/store';
import {DxSelectBoxComponent} from 'devextreme-angular';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {ColumnModel} from './models/column-model.interface';
import {switchMap, tap} from 'rxjs/operators';

enum FiltersEnum {
  DEFAULT = 'Default',
  SUBJECT = 'Subject',
  EMPLOYEE = 'Employee',
  STATUS = 'Status',
  PRIORITY = 'Priority'
}

@Component({
  templateUrl: 'display-data.component.html'
})

export class DisplayDataComponent implements AfterViewInit, OnInit {

  @ViewChild('selectDisplayFilter', {static: false})
  selectDisplayFilter: DxSelectBoxComponent;

  definedDisplayFilterMap: Map<string, Observable<any>>;

  displayFilters = Object.keys(FiltersEnum).map(key => FiltersEnum[key]);

  columns$: Observable<ColumnModel[]>;

  displayFilterSubject = new BehaviorSubject<string>(FiltersEnum.DEFAULT);
  displayFilterCache$ = this.displayFilterSubject.asObservable();

  dataSource = {
    store: {
      type: 'odata',
      key: 'Task_ID',
      url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks'
    },
    expand: 'ResponsibleEmployee',
    select: [
      'Task_ID',
      'Task_Subject',
      'Task_Start_Date',
      'Task_Due_Date',
      'Task_Status',
      'Task_Priority',
      'Task_Completion',
      'ResponsibleEmployee/Employee_Full_Name'
    ]
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {

    const default$ = this.http.get('/assets/column-default.json');
    const subject$ = this.http.get('/assets/column-subject.json');
    const employee$ = this.http.get('/assets/column-employee.json');
    const status$ = this.http.get('/assets/column-status.json');
    const priority$ = this.http.get('/assets/column-priority.json');

    this.definedDisplayFilterMap = new Map<string, Observable<any>>(
      [
        [FiltersEnum.DEFAULT, default$],
        [FiltersEnum.SUBJECT, subject$],
        [FiltersEnum.EMPLOYEE, employee$],
        [FiltersEnum.STATUS, status$],
        [FiltersEnum.PRIORITY, priority$]
      ]
    );

    this.columns$ = this.displayFilterCache$.pipe(
      tap((next) => console.log('RETURNING SELECTION', next)),
      switchMap( next => this.definedDisplayFilterMap.get(next))
    );
  }

  ngAfterViewInit() {
    if (this.selectDisplayFilter) {
      this.selectDisplayFilter.valueChange.subscribe( next => {
        this.displayFilterSubject.next(next);
      });
    }
  }


}
