import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service'
import * as _ from "lodash";

@Injectable()
export class ReportService {

  constructor(private DataService: DataService) { 
  	this.DataService = DataService;
  	this.DataService.init();

    //init data
    this.getReportSettings();
    this.getLocations();
  }

  init(){

  }

  //get report settings
  getReportSettings()
  {
    return this.DataService.getDocument('report-aggregate-settings');
  }

  //return aggregate doc for set month & year
  getReportData(year, month){
    //get top level data for current month & year
    return this.DataService.getDocument('report-aggregate-year'+year+'month'+month);
  }

  //get map data
  getMapData(year, month, countyId){
    return this.DataService.getDocument('report-aggregate-geo-year'+year+'month'+month+'-'+countyId);
  }

  //return location list
  getLocations()
  {
  	return this.DataService.getDocument('location-list');
  }

  //calculate percentage
  percentage(numerator, denominator){
     return _.round((numerator / denominator)*100);
  }

  printReportTable(){

  }

  printChart(){

  }

  getCounty(location, id)
  {
    return location.search(/id/i);
  }

}
