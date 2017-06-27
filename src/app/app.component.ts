import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';

import { DataService } from './core/data/data.service'
import { CronService } from './core/cron/cron.service';

import { ChartsComponent } from './charts/charts.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  

  constructor() { 
  	
  }

  ngOnInit(){
    
  }
}
