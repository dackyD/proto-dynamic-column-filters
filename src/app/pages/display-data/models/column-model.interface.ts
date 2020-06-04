export interface ColumnModel {
  dataField: string;
  caption: string;
  dataType: string;
  width: number;
  filterValue: string;
  selectedFilterOperation: string;
  lookup?: any[];
}
