import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service'
import * as _ from "lodash";

@Injectable()
export class CronService {

  public years = [];
  public months = [];
  public workflows = [];
  public templates = {};

  constructor(private DataService: DataService) { 
  	this.DataService = DataService;
  	this.DataService.init();
  	//set 
  	//this.years  = ['2016','2017'];
  	//this.months = ['1','2','3','4'];

  	//initialize
  	this.init();

  	//this.workflows = this.getWorkflows();
  	
  	//initializa data strucures
  	//this.templates = this.processLocations(this.templates);
  	//this.templates = this.processUsers(this.templates);

  	//process
  	//this.process(this.workflows, this.years, this.months, this.templates);
  }

  //init service
  init(){  	
  	
 
  }
  //initialized
  ngOnInit(){
  	//console.log(this.templates);
  	
  }
  //get settings
  getReportSettings()
  {
  	var settings = {};
  	this.DataService.getDocument('report-aggregate-settings')
  	.then((results) => {
  		//console.log('Settings', results);
  		settings = results;
  		return results;
    })
    .catch((error) => {
      console.log(error);
    });
    return settings;
  }
  //get workflows
  getWorkflows(){
  	var doc = [];

  	this.DataService.query('ojai/byCollection', 'workflow')
  	.then((results) => {
  		//loop & check workflows are preprocessed
       _.forEach(results.rows, function(result, key){
	  		//ensure workflow gets preprocessed
	  		if(result['doc']['reporting'] && result['doc']['reporting']['preProcess'] == true){
	  			var d = [];
	  			d[result.id]  = [];
	  			d[result.id]['doc'] = result.doc;
	  			doc.push({ "id": result.id, "doc": result.doc });
	  		}	  		
	  	});
    })
    .catch((error) => {
      console.log(error);
    });
	//console.log(doc.length, 'Workflows get pre-processed.');
  	//return
  	return doc;
  }
  //process users
  processUsers(templates){
  	//get users
  	this.DataService.getAll()
  	.then((results) => {
  		console.log('Start processing users..');
  		//console.log(results.rows);
  		_.forEach(results.rows, function(user, key){
  			//process user
  			var location = '';
  			var county   = '';
  			var zone = '';

  			if(user['doc']['location'] === undefined){
  				return;
  			}
  			//location info
  			location = user['doc']['location'];
  			
  			if(location['County'] != 'undefined'){
  				county = location['County'];
  			}
  			if(location['county'] != 'undefined'){
  				county = location['county'];
  			}
  			if(county === undefined){
  				return;
  			}
  			if(location['Zone'] != 'undefined'){
  				zone = location['Zone'];
  			}
  			if(location['zone'] != 'undefined'){
  				zone = location['zone'];
  			}
  			if(zone === undefined){
  				return;
  			}
	       	if(templates['locationByZone'][zone] == 'undefined'){
	       		return;
	       	}
	        var subCounty = templates['locationByZone'][zone]['subCountyId'];
	        var role = user['doc']['role'];

	        var username  = user['doc']['name'];
	        templates['users']['all']                       = {};
          	templates['users'][county]                      = {};
          	templates['users'][county][zone]                = {};
          	templates['users'][county][zone][username]      = true;

		    templates['users']['all'][username]                            = {};
	        templates['users']['all'][username]['data']                    = user['doc'];
	        templates['users']['all'][username]['role']                    = role

	        templates['users']['all'][username]['target']                  = {};      //container for target zone visits
	        templates['users']['all'][username]['target']['visits']        = 0;
	        templates['users']['all'][username]['target']['compensation']  = 0;

	        templates['users']['all'][username]['other']                   = {};      //container for non-target zone visits

	        templates['users']['all'][username]['total']                   = {};      //container for visit and compensation totals
	        templates['users']['all'][username]['total']['visits']         = 0;       //total visits across zones
	        templates['users']['all'][username]['total']['compensation']   = 0;       //total compensation across zones
	        templates['users']['all'][username]['flagged']                 = false;   //alert to visits outside of primary zone
 
	        //check if subcounty exists
	        if(subCounty === undefined){
	        	return;
	        }

	        if(role == 'scde'){
	        	templates['result']['visits']['scde']['national']['quota']                                   += 8;
              	templates['result']['visits']['byCounty'][county]['scde']['quota']                           += 8;
              	templates['result']['visits']['byCounty'][county]['subCounties'][subCounty]['scde']['quota'] += 8;
	        }
	        if(role == 'esqac'){
	        	templates['result']['visits']['esqac']['national']['quota']                                   += 10;
              	templates['result']['visits']['byCounty'][county]['esqac']['quota']                           += 10;
              	templates['result']['visits']['byCounty'][county]['subCounties'][subCounty]['esqac']['quota'] += 10;
	        }

  		});
  	})
  	.catch((error) => {
      console.log(error);
    });
    //console.log(templates);
  	//return
  	return templates;
  }

  //process locations
  processLocations(templates){  	
  	//instantiate
  	templates['result']['visits']                              = {};
    templates['result']['visits']['byCounty']                  = {};
    templates['result']['visits']['national']                  = {};
    templates['result']['visits']['national']['visits']        = 0;
    templates['result']['visits']['national']['quota']         = 0;
    templates['result']['visits']['national']['numTeachers']   = 0;
    templates['result']['visits']['national']['compensation']  = 0;
    templates['result']['visits']['national']['fluency']                   = {};
    templates['result']['visits']['national']['fluency']['class']          = {};
    templates['result']['visits']['national']['fluency']['class'][1]       = {};
    templates['result']['visits']['national']['fluency']['class'][2]       = {};
    templates['result']['visits']['national']['fluency']['class'][3]       = {};

    templates['result']['visits']['scde']                              = {};
    templates['result']['visits']['scde']['national']                  = {};
    templates['result']['visits']['scde']['national']['visits']        = 0;
    templates['result']['visits']['scde']['national']['quota']         = 0;
    templates['result']['visits']['scde']['national']['numTeachers']   = 0;
    templates['result']['visits']['scde']['national']['compensation']  = 0;

    templates['result']['visits']['esqac']                              = {};
    templates['result']['visits']['esqac']['byCounty']                  = {};
    templates['result']['visits']['esqac']['national']                  = {};
    templates['result']['visits']['esqac']['national']['visits']        = 0;
    templates['result']['visits']['esqac']['national']['quota']         = 0;
    templates['result']['visits']['esqac']['national']['numTeachers']   = 0;
    templates['result']['visits']['esqac']['national']['compensation']  = 0;
    templates['result']['visits']['esqac']['national']['fluency']       = {};

    //Maths observations
    templates['result']['visits']['maths']                              = {};
    templates['result']['visits']['maths']['byCounty']                  = {};
    templates['result']['visits']['maths']['national']                  = {};
    templates['result']['visits']['maths']['national']['visits']        = 0;
    templates['result']['visits']['maths']['national']['quota']         = 0;
    templates['result']['visits']['maths']['national']['numTeachers']   = 0;
    templates['result']['visits']['maths']['national']['compensation']  = 0;
    templates['result']['visits']['maths']['national']['fluency']       = {};

    templates['result']['users']           = {};  //stores list of all users and zone associations
    templates['result']['users']['all']    = {};  ///stores list of all users

    templates['result']['compensation']               = {};
    templates['result']['compensation']['byCounty']   = {};
    templates['result']['compensation']['national']   = 0;

    //define scope or the geoJSON files
    templates['geoJSON']               = {};
    templates['geoJSON']['byCounty']   = {};
	
    this.DataService.getDocument('location-list')
  	.then((results) => {
  		console.log('Start processing locations..');
  		//initialize data structures based on location list
	  	_.forEach(results.locations, function(county, key){
	  		//county based structures
	  		var countyId = county['id'];
	  		templates['result']['visits']['byCounty'][countyId]                  = {};
		    templates['result']['visits']['byCounty'][countyId]['name']          = county['label'];
		    templates['result']['visits']['byCounty'][countyId]['subCounties']   = {};
		    templates['result']['visits']['byCounty'][countyId]['zones']         = {};
		    templates['result']['visits']['byCounty'][countyId]['visits']        = 0;
		    templates['result']['visits']['byCounty'][countyId]['quota']         = 0;
		    templates['result']['visits']['byCounty'][countyId]['numTeachers']   = 0;
		    templates['result']['visits']['byCounty'][countyId]['compensation']  = 0;
		    templates['result']['visits']['byCounty'][countyId]['fluency']       = {};
		    templates['result']['visits']['byCounty'][countyId]['fluency']['class']          = {};
		    templates['result']['visits']['byCounty'][countyId]['fluency']['class'][1]       = {};
		    templates['result']['visits']['byCounty'][countyId]['fluency']['class'][2]       = {};
		    templates['result']['visits']['byCounty'][countyId]['fluency']['class'][3]       = {};


		    templates['result']['visits']['byCounty'][countyId]['esqac']               = {};
		    templates['result']['visits']['byCounty'][countyId]['esqac']['visits']     = 0;
		    templates['result']['visits']['byCounty'][countyId]['esqac']['quota']      = 0;
		      

		    templates['result']['visits']['byCounty'][countyId]['scde']               = {};
		    templates['result']['visits']['byCounty'][countyId]['scde']['visits']     = 0;
		    templates['result']['visits']['byCounty'][countyId]['scde']['quota']      = 0;
		      

		    templates['result']['visits']['byCounty'][countyId]['quota']    = county['quota'];
		      
		    //maths
		    templates['result']['visits']['maths']['byCounty'][countyId]                              = {};
		    templates['result']['visits']['maths']['byCounty'][countyId]['name']                      = county['label'];
		    templates['result']['visits']['maths']['byCounty'][countyId]['subCounties']               = {};
		    templates['result']['visits']['maths']['byCounty'][countyId]['zones']                     = {};
		    templates['result']['visits']['maths']['byCounty'][countyId]['visits']                    = 0;
		    templates['result']['visits']['maths']['byCounty'][countyId]['quota']                     = 0;
		    templates['result']['visits']['maths']['byCounty'][countyId]['numTeachers']               = 0;
		    templates['result']['visits']['maths']['byCounty'][countyId]['compensation']              = 0;
		    templates['result']['visits']['maths']['byCounty'][countyId]['fluency']                   = {};
		    templates['result']['visits']['maths']['byCounty'][countyId]['fluency']['class']          = {};
		    templates['result']['visits']['maths']['byCounty'][countyId]['fluency']['class'][1]       = {};
		    templates['result']['visits']['maths']['byCounty'][countyId]['fluency']['class'][2]       = {};
		    templates['result']['visits']['maths']['byCounty'][countyId]['fluency']['class'][3]       = {};

		    templates['result']['visits']['maths']['byCounty'][countyId]['quota']    = county['quota']
	  		
	  		_.forEach(county.children, function(subCounty, key){
	  			var subCountyId = subCounty['id'];
	  			//loop sub county
	  			templates['result']['visits']['byCounty'][countyId]['subCounties'][subCountyId]             = {};
		        templates['result']['visits']['byCounty'][countyId]['subCounties'][subCountyId]['name']     = subCounty['label'];
		        templates['result']['visits']['byCounty'][countyId]['subCounties'][subCountyId]['zones']    = [];

		        templates['result']['visits']['byCounty'][countyId]['subCounties'][subCountyId]['scde']             = {};
		        templates['result']['visits']['byCounty'][countyId]['subCounties'][subCountyId]['scde']['trips']    = [];
		        templates['result']['visits']['byCounty'][countyId]['subCounties'][subCountyId]['scde']['visits']   = 0;
		        templates['result']['visits']['byCounty'][countyId]['subCounties'][subCountyId]['scde']['quota']    = 0;
		        

		        templates['result']['visits']['byCounty'][countyId]['subCounties'][subCountyId]['esqac']             = {};
		        templates['result']['visits']['byCounty'][countyId]['subCounties'][subCountyId]['esqac']['trips']    = [];
		        templates['result']['visits']['byCounty'][countyId]['subCounties'][subCountyId]['esqac']['visits']   = 0;
		        templates['result']['visits']['byCounty'][countyId]['subCounties'][subCountyId]['esqac']['quota']    = 0;
		        
		        templates['result']['visits']['maths']['byCounty'][countyId]['subCounties'][subCountyId]             = {};
		        templates['result']['visits']['maths']['byCounty'][countyId]['subCounties'][subCountyId]['name']     = subCounty['label'];
		        templates['result']['visits']['maths']['byCounty'][countyId]['subCounties'][subCountyId]['zones']    = [];

	  			_.forEach(subCounty.children, function(zone, key){
	  				//loop zone
			  		var zoneId = zone['id'];
			  		//zone
			  		templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]                   = {};
			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['name']           = zone['label'];
			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['trips']          = [];
			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['visits']         = 0;
			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['quota']          = 0;
			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['numTeachers']    = 0;
			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['compensation']   = 0;
			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['fluency']        = {};
			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['fluency']['class']          = {};
			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['fluency']['class'][1]       = {};
			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['fluency']['class'][2]       = {};
			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['fluency']['class'][3]       = {};

			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['quota']  += zone['quota'];
			        templates['result']['visits']['national']['quota']                             += zone['quota'];

			        templates['result']['visits']['byCounty'][countyId]['zones'][zoneId]['numTeachers']  += zone['numTeachers'];
			        templates['result']['visits']['byCounty'][countyId]['numTeachers']                   += zone['numTeachers'];
			        templates['result']['visits']['national']['numTeachers']                             += zone['numTeachers'];
			      
			        templates['result']['visits']['byCounty'][countyId]['subCounties'][subCountyId]['zones'].push(zoneId);

			        //maths
			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]                   = {};
			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['name']           = zone['label'];
			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['trips']          = [];
			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['visits']         = 0;
			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['quota']          = 0;
			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['numTeachers']    = 0;
			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['compensation']   = 0;
			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['fluency']        = {};
			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['fluency']['class']          = {};
			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['fluency']['class'][1]       = {};
			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['fluency']['class'][2]       = {};
			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['fluency']['class'][3]       = {};

			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['quota']  += zone['quota'];
			        templates['result']['visits']['maths']['national']['quota']                             += zone['quota'];

			        templates['result']['visits']['maths']['byCounty'][countyId]['zones'][zoneId]['numTeachers']  += zone['numTeachers'];
			        templates['result']['visits']['maths']['byCounty'][countyId]['numTeachers']                   += zone['numTeachers'];
			        templates['result']['visits']['maths']['national']['numTeachers']                             += zone['numTeachers'];
			      
			        templates['result']['visits']['maths']['byCounty'][countyId]['subCounties'][subCountyId]['zones'].push(zoneId)

			  		//init container for users
		          	templates['result']['users'][countyId]             = {};
		          	templates['result']['users'][countyId][zoneId]     = {};

		          	//init geoJSON Containers
		          	templates['geoJSON']['byCounty'][countyId]         = {};
		          	templates['geoJSON']['byCounty'][countyId]['data'] = [];

		          	templates['locationByZone'][zoneId]                  = {};
		          	templates['locationByZone'][zoneId]['countyId']      = countyId;
		          	templates['locationByZone'][zoneId]['subCountyId']   = subCountyId;
			  		//school
			  		_.forEach(zone.children, function(school, key){
			  			var schoolId = school['id'];
			  			templates['locationBySchool'][schoolId]                  = {};
			            templates['locationBySchool'][schoolId]['countyId']      = countyId;
			            templates['locationBySchool'][schoolId]['subCountyId']   = subCountyId;
			            templates['locationBySchool'][schoolId]['zoneId']        = zoneId;
			  		});
			  	});
	  		});
	  	});
  	})
  	.catch((error) => {
	    console.log(error);
	});
	
  	//return
  	return templates;
  }
  //serach for aggregate doc
  getAggregateDoc(docId){
  	this.DataService.getDocument(docId)
		  	.then((results) => {
		  		return results;
		  	})
		  	.catch((error) => {
			    console.log(error);
			});
  }
  //process data
  process(workflows, years, months, templates){
  	var doc  = {};
  	
  	//loop year
  	_.forEach(years, function(year, k1){
  		_.forEach(months, function(month, k2){
  			
  			var docId = 'report-aggregate-year'+year+'month'+month;
  			doc['_id'] =  docId;

	  		//get doc & check if doc exists
	  		var aggDoc = {};

	  		if(aggDoc['_rev']){
	  			doc['_rev'] = aggDoc['_rev'];
	  		}
	  	
  			_.forEach(workflows, function(workflow, k3){
  				
  				//get trips	
  				/*var trips = this.getTrips(workflow.id, year, month);
  				console.log(trips);
  				//process trip
  				_.forEach(trips, function(trip, key){
  				 	//process
			  		//this.processTrip(trip, workflows, templates);
			  	});*/
			  	//post process
			  	//this.postProcess();
  			});
  			//put object back
  			doc = _.merge(doc, templates); 
  			//console.log(doc);
  			/*this.DataService.put(doc).then((results) => {
		  	
		  	})
		  	.catch((error) => {
			    console.log(error);
			});*/
  		});
  	});	
  }
  
  //process trips
  processTrip(trip, workflows, templates){
  	console.log('Process trip');
  	/*var username   = '';
  	username = trip['value']['user'];

  	var workflowId = trip['value']['workflowId'];

  	//check workflow is complete
  	if (workflows[workflowId] === 'undefined') {
  		//next
  		continue;
  	}
  	//check workflow gets preprocessed
  	if(workflows[workflowId]['reporting']['preProcess'] === 'undefined' ){
  		//next
  		continue;
  	}
  	//check user exists
  	if(templates['users']['all'][username] === 'undefined'){
  		//next
  		continue;
  	}
  	//get user role
  	var userRole = templates['users']['all'][username]['role'];

  	//check if role matches allowed role

  	//validate
  	if (this.validateTrip(trip, workflows[workflowId]) == false) {
  		//next
  		continue;
  	}
  	//check trip exists
  	if(trip['value']['school'] === 'undefined'){
  		//next
  		continue;
  	}
  	var schoolId  = trip['value']['school'];
  	if(templates['locationBySchool'][schoolId] === 'undefined'){
  		//next
  		continue;
  	}
  	//ensure county, subcounty, zone exist
  	var zoneId        = templates['locationBySchool'][schoolId]['zoneId'];        
    var subCountyId   = templates['locationBySchool'][schoolId]['subCountyId'];  
    var countyId      = templates['locationBySchool'][schoolId]['countyId'] ;    

  	//process by role
  	if(userRole == 'tac-tutor' || userRole == 'coach' || userRole == 'Coach' || userRole == 'CSO'){
  		if(trip['value']['subject'] === 'undefined'){
  			//next
  			continue;
  		}
  		if(trip['value']['class'] === 'undefined'){
  			//next
  			continue;
  		}

  	}
  	if(userRole == 'esqac' || userRole == 'ESQAC'){

  	}
  	if(userRole == 'scde' || userRole == 'SCDE'){

  	}*/
  }
  //get trips
  getTrips(workflow, year, month){
  	var keys = 'year'+year+'month'+month+'workflowId'+workflow;
  	var tripKeys = [];
  	var trips = {};
  	this.DataService.query('ojai/tutorTrips', keys)
  		.then((results) => {
  			console.log('t', results);
  			//loop trips
		  	/*_.forEach(results.rows, function(trip, key){
		  		tripKeys.push(trip.id);
		  		console.log('Keys', tripKeys);
		  	});
		  	tripKeys = _.uniq(tripKeys);
		  	//get the real trip data
		  	this.DataService.query('ojai/spritRotut', tripKeys)
		  		.then((r) => {
		  			trips = r;
		  		})
		  		.catch((error) => {
			      console.log(error);
			    });
		  	//logger
		  	console.log('tripKeys', tripKeys);*/
  		})
  		.catch((error) => {
	      console.log(error);
	    });
  	return trips;
  }
  //validate trip
  validateTrip(trip, workflow){
  	var valid =  false;

  	return valid;
  }

  //post processs
  postProcess(){

  }
}
