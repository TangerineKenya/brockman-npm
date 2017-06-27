import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from '../core/data/data.service';
import { ReportService } from '../core/report/report.service';

import * as _ from "lodash";
import * as moment from 'moment';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  
  columns = [];
  rows = [];
  locationList = [];
  public keyArray;
  selectedValue: string;
  countyName: string;
  year: string;
  month: string;
  monthName: string;
  county: string;
  options: any;
  layers: any;
  baseLayer: any;
  layersControl: any;
  source: string;

  constructor(private ReportService: ReportService, private router: Router, private route: ActivatedRoute) { 
    //console.log('param', this.route);
    this.ngOnInit();

    //init
    this.countyName = _.startCase(this.route.params['value']['id']);
    this.month = this.route.params['value']['month'];
    this.year = this.route.params['value']['year'];
    this.monthName = moment(this.month, 'MM').format("MMM");
    //columns
  	this.columns = [
                       { prop: 'zone'},
                       { name: 'Visits'},
                       { name: 'English1'},
                       { name: 'English2'},
                       { name: 'English3'},
                       { name: 'Kiswahili1'},
                       { name: 'Kiswahili2'},
                       { name: 'Kiswahili3'}
                    ];
  
    //load locationn data
    this.getLocations();


    //this.locationList

    //load aggregated data
    this.county = 'xBsDv434';

  	this.initData(this.year, this.month, this.county);

    this.getMapData();

    this.buildMap();
  	//console.log('id', );
  }

  ngOnInit() {
 
    
  }

  initData(year, month, countyId){
    //get top level data for current month & year
    this.ReportService.getReportData(this.year, this.month)
        .then((results) => {
          //console.log(results);
          var rows = [];
          this.rows = [];
          var visitData = results['visits']['byCounty'][countyId]['zones'];
          //console.log('csodata', csoData);
          _.forEach(visitData, function(cso, key){
             	//var per = _.round((cso['visits'] / cso['quota'])*100);
             	//var cl1Average = _.round(cso['fluency']['class']['1']['english_word']['sum'] / cso['fluency']['class']['1']['english_word']['size']);
            	rows.push({ zone: cso['name'], visits: cso['visits'] , english1: 0, english2: 0 , english3: 0, kiswahili1: 1, kiswahili2: 0, kiswahili3: 0 }); 
          });
          this.rows = rows;
          return results;
        })
        .catch((error) => {
          console.log(error);
      });
  }
  //map data
  getMapData(){
    this.ReportService.getMapData(this.year, this.month, this.county)
        .then((results) => {
            console.log('Map Data',results);
        })
        .catch((error) => {
          console.log(error);
    });
  }
  buildMap()
  {
    /*this.baseLayer= {
                      id: 'openstreetmap',
                      name: 'Open Street Map',
                      enabled: false,
                      layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 10,
                        attribution: 'Open Street Map'
                      })
                    };*/


    this.options = {
                      layers: [
                          L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Map data © OpenStreetMap contributors' })
                      ],
                      zoom: 5,
                      center: L.latLng({ lat: 0, lng: 35 })
                  };

    this.layersControl = {
                          baseLayers: {
                            'Open Street Map': ''
                          },
                          overlays: {
                            Marker: ''
                          }
                        };
  }
  //get locations - counties
  getLocations()
  {
  	this.ReportService.getLocations()
        .then((results) => {
          this.locationList = results['locations'];
          this.keyArray = Object.keys(results['locations']);
          //console.log('Array', this.locationList);
          return results;
        })
        .catch((error) => {
          console.log(error);
    });
  }
  //get county name 
  getCountyName(countyId){
    var location = _.get(this.locationList, countyId);
    //console.log(location['label']);
    return location['label'];
  }

  //change county
  onSelect(event){
    //this.initData('2017', '3', 'xBsDv434');§    §  
    this.county = event['value'];
    this.countyName = this.getCountyName(this.county);
    this.initData(this.year, this.month, this.county);
    this.router.navigate(['/view', this.year, this.month, this.county]);
    //this.initData(this.year, this.month, this.county);console.log('Key', );
  }
  //year change
  onChangeYear(event){
    this.year = event['value'];
    //this.monthName = moment(this.month).format("MMM");
    this.initData(this.year, this.month, this.county);
    this.router.navigate(['/view', this.year, this.month, this.county]);
    //this.initData(this.year, this.month, this.county);
    //console.log(this.year, this.month, this.monthName );
  }
  //change month
  onChangeMonth(event){
    this.month = event['value'];
    this.monthName = moment(this.month,'MM').format("MMM");
    //this.monthName = moment(this.month).format("MMM");
    this.initData(this.year, this.month, this.county);
    this.router.navigate(['/view', this.year, this.month, this.county]);
    //this.initData(this.year, this.month, this.county);
    //console.log(this.month, this.monthName);
  }
  //print county report
  onPrint(){

  }

  //email report
  onSend(){

  }

}
