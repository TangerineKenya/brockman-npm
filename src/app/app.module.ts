import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Router, Routes } from '@angular/router';

import * as d3 from "d3";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';

import { DataService } from './core/data/data.service';
import { CronService } from './core/cron/cron.service';
import { ReportService } from './core/report/report.service';

import { AppComponent } from './app.component';
import { ChartsComponent } from './charts/charts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewComponent } from './view/view.component';
import { DataPipe } from './data.pipe';


const appRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'view/:year/:month/:id', component: ViewComponent },
  { path: 'trends/:id/:year/:month', component: ChartsComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent,
    DashboardComponent,
    ViewComponent,
    DataPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    NgxDatatableModule,
    LeafletModule,
    NgxChartsModule,
    FlexLayoutModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ DataService, CronService, ReportService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
