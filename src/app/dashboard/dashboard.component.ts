import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { ReportService } from '../core/report/report.service';

import * as _ from "lodash";
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public result = {};
  public rows = [];
  public columns = [];
  public scdeRows = [];
  public scdeCols = [];
  public esqacRows = [];
  public esqacCols = [];
  public mathRows = [];
  public mathCols = [];
  public settings = [];
  public selected = [];
  public months = [];
  public years = [];
  public year = moment().format('YYYY');
  public month = moment().format('M');
  public monthName = moment().format('MMM');
  options: any;

  constructor(private router: Router,  private route: ActivatedRoute, public ReportService: ReportService) { 

    this.ReportService = ReportService;
  	
    this.ngOnInit();
    this.monthName = moment(this.month, 'MM').format("MMM");
   
    this.initData(this.year, this.month);
  }

  ngOnInit() {
    this.columns = [
                       { prop: 'county'},
                       { name: 'Visits'},
                       { name: 'English1'},
                       { name: 'English2'},
                       { name: 'English3'},
                       { name: 'Kiswahili1'},
                       { name: 'Kiswahili2'},
                       { name: 'Kiswahili3'}
                    ];
    this.scdeCols = [
                      { prop: 'county'},
                      { name: 'Visits'}
                    ];
    this.esqacCols = [
                      { prop: 'county'},
                      { name: 'Visits'}
                    ];
    this.mathCols = [
                      { prop: 'county'},
                      { name: 'Visits'},
                      { name: 'Maths1'},
                      { name: 'Maths2'},
                    ];
    //get month name
    //this.monthName = moment(event['value']).format("MMM");
  }

  //get report data for current month & year
  initData(year, month){
    //get top level data for current month & year
    this.result = this.ReportService.getReportData(year, month)
                    .then((results) => {
                      this.result = results;

                      var rows  = [];
                      this.rows = [];
                      this.mathRows = [];
                      
                      var csoData  = results['visits']['byCounty'];
                      var mathData = results['visits']['maths']['byCounty'];

                      //console.log('maths', mathData);
                      //add national tallies
                      var allVisits = results['visits']['national']['visits'];
                      rows.push({ county: 'All', visits: allVisits+' ( '+0+'% )' , english1: 0, english2: 0 , english3: 0, kiswahili1: 1, kiswahili2: 0, kiswahili3: 0 });
                      _.forEach(csoData, function(cso, key){
                          //console.log('cso', cso);
                          var per = _.round((cso['visits'] / cso['quota'])*100);
                          var cl1Average = 0;
                          //cl1Average = _.round(cso['fluency']['class']['1']['english_word']['sum'] / cso['fluency']['class']['1']['english_word']['size']);
                          //row = { county: cso['name'], visits: cso['visits'] , english1: 0, english2: 0 , english3: 0, kiswahili1: 1, kiswahili2: 0, kiswahili3: 0 }
                          rows.push({ county: cso['name'], visits: cso['visits']+' ( '+per+'% )' , english1: 0, english2: 0 , english3: 0, kiswahili1: 1, kiswahili2: 0, kiswahili3: 0 }); 
                      });

                      this.rows = rows;
                      rows = [];
                      //maths data
                      rows.push({ county: 'All', visits: 0+' ( '+0+'% )' , maths1: 0, maths2: 0 }); 
                      _.forEach(mathData, function(cso, key){
                          //console.log('cso', cso);
                          var per = _.round((cso['visits'] / cso['quota'])*100);
                          var cl1Average = 0;
                          //row = { county: cso['name'], visits: cso['visits'] , english1: 0, english2: 0 , english3: 0, kiswahili1: 1, kiswahili2: 0, kiswahili3: 0 }
                          rows.push({ county: cso['name'], visits: cso['visits']+' ( '+per+'% )' , maths1: 0, maths2: 0 }); 
                      });
                      this.mathRows = rows;
                      //esqac
                      rows = [];

                      //scde
                      //rows = [];


                      //console.log();
                      return results;
                    })
                    .catch((error) => {
                      console.log(error);
                  });
  }

  //load county drill-down view
  onSelect({ selected }) {
  	var param = _.lowerCase(this.selected[0]['county']);

    //tmpCounty.search(/apbet/i)

    this.router.navigate(['/view', this.year, this.month, param]);
    //console.log('Select Event', this.selected);
  }

  //load trend charts - default to curent month & previous 2 months
  loadCharts(source) {
    this.router.navigate(['/trends', source, this.year, this.month]);
    //console.log('Select Event', );
  }

  //reload on chnage of year
  onChangeYear(event){
    //year
    this.year = event['value'];
    //this.monthName = moment(this.month).format("MMM");
    this.ngOnInit();
    this.initData(this.year, this.month);
    //console.log(this.year, this.month, this.monthName );
  }

  //on change month reload reports
  onChangeMonth(event){
    //month
    this.month = event['value'];
    this.monthName = moment(event['value'], 'MM').format("MMM");
    this.ngOnInit();
    this.initData(this.year, this.month);
    //console.log(this.year, this.month, this.monthName );
  }

  // print pdf or word or csv ??
  onPrint(){

  }
}
