import { Component, OnInit } from '@angular/core';
import { ClimatDataQuery } from '../common/models/climat-data-query';

@Component({
  selector: 'app-historical-data',
  templateUrl: './historical-data.component.html',
  styleUrls: ['./historical-data.component.scss']
})
export class HistoricalDataComponent implements OnInit {

  query : ClimatDataQuery
  constructor() { }

  ngOnInit(): void {
  }

  queryData() {

  }
}
