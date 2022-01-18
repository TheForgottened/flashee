import { Component, OnInit } from '@angular/core';
import { liveQuery } from 'dexie';
import { db } from './clases/DbManager';
import { Flashcard } from './clases/flashcard';
import { GlobalDataService } from './global-data.service';

const indexExportImport = require('indexeddb-export-import');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [GlobalDataService],
})
export class AppComponent implements OnInit {
    title = 'Flashee';
  
  createCard = false;
  searchCard = false;
  overlayDiv = false;
  statistics = false;
  modCard?: Flashcard;

    constructor(public globalData: GlobalDataService) {}

  ngOnInit(): void {
      //this.globalData.searchCards('', '');
    this.globalData.getTags();
  }

    newCardMenu(open: boolean): void {
        this.modCard = undefined;
        this.globalData.selectedCard = undefined;
        this.globalData.createCard = open;
        this.overlayDiv = open;
    }

    async newQuiz() {
        await this.globalData.getTags();
        await this.globalData.getCards();

        if (this.globalData.cards.length == 0) {
            alert("You can't create a Quiz with no Cards");
            return;
        } else if (this.globalData.tags.length == 0) {
            alert("You can't create a Quiz with no Tags/Topics");
            return;
        }
        this.globalData.createQuiz = true;
    }

    importDeck($event: any): void {
        const idbDatabase = db.backendDB();
        var selectedFile = $event.target.files[0];
        let fileReader = new FileReader();

        fileReader.onload = (e) => {
            indexExportImport.clearDatabase(idbDatabase, (err: any) => {
                if (!err) {
                    // cleared data successfully
                    indexExportImport.importFromJsonString(
                        idbDatabase,
                        fileReader.result,
                        (err: any) => {
                            if (!err) {
                                console.log('Imported data successfully');
                                document.location.reload();
                            }
                        }
                    );
                }
            });
        };
        fileReader.readAsText(selectedFile);
    }

    exportDeck(): void {
        const idbDatabase = db.backendDB();
        indexExportImport.exportToJsonString(
            idbDatabase,
            (err: any, jsonString: any) => {
                if (err) {
                    console.log(err);
                }
                var jString = JSON.stringify(JSON.parse(jsonString), null, 2);
                var element = document.createElement('a');
                element.setAttribute(
                    'href',
                    'data:text/json;charset=UTF-8,' +
                        encodeURIComponent(jString)
                );
                element.setAttribute('download', 'export.json');
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click(); // simulate click
                document.body.removeChild(element);
            }
        );
    }

  closeStatisticsEventHandler(event: boolean) {
    this.statistics = false;
  }

  onModify(card: Flashcard) {
    //this.modCard = card;
    this.createCard = false;
    this.createCard = true;
  }

}
