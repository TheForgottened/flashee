import { Component } from '@angular/core';
import { db } from './clases/DbManager';
import { Flashcard } from './clases/flashcard';
const indexExportImport = require('indexeddb-export-import')

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'flashee';
  createCard = false;
  modCard?: Flashcard;

  newCardMenu():void {
    this.modCard = undefined;
    (this.createCard == true)?this.createCard=false:this.createCard=true;    
  }

  exportDeck(): void{
    const idbDatabase = db.backendDB()
    indexExportImport.exportToJsonString(idbDatabase, (err: any, jsonString: any) =>{
      if(err){
        console.log(err)
      }
      var jString = JSON.stringify(JSON.parse(jsonString),null,2);  
      var element = document.createElement('a');
      element.setAttribute('href', "data:text/json;charset=UTF-8," + encodeURIComponent(jString));
      element.setAttribute('download', "export.json");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click(); // simulate click
      document.body.removeChild(element);
    })
  }

  closeEventHandler(event: any) {
    this.newCardMenu();
  }

  onModify(card: Flashcard) {
    console.log(card);
    this.modCard = card;
    this.createCard = false;
    this.createCard = true;
  }
}
