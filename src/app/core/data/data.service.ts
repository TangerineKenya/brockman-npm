import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';

@Injectable()
export class DataService {

  db: any;
  remote: any;

  constructor() { }
  
  //initialize
  init(){
  	this.initDB();
  }

  //connector
  initDB(){
  	this.db = new PouchDB('http://localhost:5984/group-national_tablet_program_test');
    
    //window["PouchDB"] = PouchDB;

    //PouchDB.debug.enable('*');

    //console.log(this.db);

    //this.remote = new PouchDB('http://localhost:5984/group-national_tablet_program');

    return this.db;
  }

  //get
  getDocument(doc){
    return this.db.get(doc);
  }
  //put
  addDocument(doc){
    return this.db.put(doc);
  }
  //search
  search(view, key){
    return this.db.query(view, {
        startkey: key,
        endkey: key+'\uffff', 
        include_docs: true
      });
  }
  //query
  query(view, key){
    return this.db.query(view, {
        key: key,
        include_docs: true
      });
  }
  //date
  getAll(){
    return this.db.allDocs({
          include_docs: true,
          attachments: true,
          startkey: 'user',
          endkey: 'user\uffff'
        }).then(function (result) {
          return result;
        }).catch(function (err) {
          console.log(err);
      });
  }
}
