import { Component } from '@angular/core';
import { db } from './clases/DbManager';
import { Flashcard } from './clases/flashcard';

import { GlobalDataService } from './global-data.service';

const indexExportImport = require('indexeddb-export-import')

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GlobalDataService]
})

export class AppComponent {
  title = 'flashee';

  createCard = false;
  searchCard = false;
  modCard?: Flashcard;
  

  constructor(public globalData: GlobalDataService){
   
  }
  
  newCardMenu(open:boolean):void {
    this.modCard = undefined;
    this.globalData.selectedCard = undefined;
    this.createCard = open;
  }

  searchCardMenu(): void {
    (this.searchCard == true) ? this.searchCard = false : this.searchCard = true;
  }

  importDeck($event: any): void {
    const idbDatabase = db.backendDB()
    var selectedFile = $event.target.files[0];
    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      indexExportImport.clearDatabase(idbDatabase, (err: any) => {
        if (!err) { // cleared data successfully
          indexExportImport.importFromJsonString(idbDatabase, fileReader.result, (err: any) =>{
            if (!err) {
              console.log('Imported data successfully');
              document.location.reload()
            }
          });
        }
      });
    }
    fileReader.readAsText(selectedFile);
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
    this.newCardMenu(false);
  }

  onModify(card: Flashcard) {
    //this.modCard = card;
    this.createCard = false;
    this.createCard = true;
  }
}
