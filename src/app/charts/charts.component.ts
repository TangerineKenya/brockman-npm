import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { DataService } from '../core/data/data.service';
import { ReportService } from '../core/report/report.service';

import * as _ from "lodash";
import * as moment from 'moment';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
	public results = {};
	public single = {};
	public observationsPublic = [];
	public observationsApbet  = [];
  public datasetScoresEng1  = [];
  public datasetScores = [];
  


	view: any[] = [500, 500];
  year: string;
  month: string;
  monthName: string;
  source: string;

  	// options
  	showXAxis = true;
  	showYAxis = true;
  	gradient = false;
  	showLegend = false;
  	showXAxisLabel = true;
  	showYAxisLabel = true;
  	
  	yAxisLabel = 'County';
  	xAxisLabel = 'Attainment';

  	colorScheme = {
    	domain: ['#FDC381', '#FC998E', '#99C1DC']
  	};

  constructor(private ReportService: ReportService, private router: Router, private route: ActivatedRoute) {
  	
    this.month = this.route.params['value']['month'];
    this.year = this.route.params['value']['year'];
    this.source = this.route.params['value']['id'];   

    //this.monthName = moment(this.month, 'MM').format("MMM");

    this.buildChart();
  	this.initData(this.year, this.month);
  }

  ngOnInit() {

  }

  initData(year, month){
    //get top level data for current month & year
    this.ReportService.getReportData(year, month)
        .then((results) => {
          this.results = results;
          this.initChart(results);
          return results;
        })
        .catch((error) => {
          console.log(error);
      });
  }

  buildChart(){
    var trendMonths   = 3;
    var skipMonths    = [-1,0,4,8,11,12];
  }

  //observations count for last 3 months
  initChart(data){
    //init chart for single months data
  	var datasetPublic = [];
    var datasetApbet  = [];
    var dataScores    = [];
    

    var visitData = data['visits']['byCounty'];

    _.forEach(visitData, function(visit, county){
         
      var tmpCounty = visit['name'];
      var tmpVisit  = {};

      tmpVisit['value'] = _.round((visit['visits'] / visit['quota'])*100);
      
      //temp data
      var tmp = {
                  name   : tmpCounty,
                  MonthInt : '',
                  Year     : '',
                  Month    : ''
                };
      
      //separate apbet & public schools data
      if(tmpCounty.search(/apbet/i) == -1 ){ //&& tmpCounty.search(/tusome/i) == -1
        datasetPublic.push(_.merge({}, tmp, tmpVisit));  
      } else {
        //apbet.push($.extend({}, tmp, tmpVisit));
        datasetApbet.push(_.merge({}, tmp, tmpVisit)); 
      }

      //scores data
      var fluency = visit['fluency'];

      tmp['value'] = _.round(fluency['class']['1']['english_word']['sum'] / fluency['class']['1']['english_word']['size']);
      //tmp['English Score - Class 2'] = fluency['class']['2']['english_word']['sum'] / fluency['class']['2']['english_word']['size'];
      //tmp['English Score - Class 3'] = fluency['class']['3']['english_word']['sum'] / fluency['class']['3']['english_word']['size'];

      //tmp['Kiswahili Score - Class 1'] = fluency['class']['1']['word']['sum'] / fluency['class']['1']['word']['size'];
      //tmp['Kiswahili Score - Class 2'] = fluency['class']['2']['word']['sum'] / fluency['class']['2']['word']['size'];
      //tmp['Kiswahili Score - Class 3'] = fluency['class']['3']['word']['sum'] / fluency['class']['3']['word']['size'];

      //console.log(tmp);
      dataScores.push(tmp);
    });
    
    this.observationsPublic = datasetPublic;
    this.observationsApbet  = datasetApbet;
    this.datasetScoresEng1  = dataScores;

    console.log(this.datasetScoresEng1, this.observationsApbet);
  }
}
