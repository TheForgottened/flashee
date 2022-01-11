import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { liveQuery } from 'dexie';
import { DbManager, db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';
import { CARDS } from '../clases/prueba-tarjetas';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {


  selectedCard?: Flashcard;
  //cards = liveQuery(() => db.cards.toArray());
  cards:Flashcard[] = [];
  @Output() modCardEvent = new EventEmitter<Flashcard>(); 
  

  constructor(private globalData: GlobalDataService) { 
    this.globalData.filterCardsObs.subscribe(c=>{
      this.cards = c;
    });
  }

  onSelect(card: Flashcard): void {
    //this.selectedCard = card;
    this.globalData.setCard(card);
  }

  onModify(card: Flashcard) {
    this.modCardEvent.emit(card);
  }

  ngOnInit(): void {
    var cards = document.getElementById('flashcards');
    if (this.globalData.createCard) {
      //cards?.classList.toggle('card-animation');
      
    } else {
      cards?.animate([
        {
          opacity: 0
        },
        {
          opacity: 1
        }
      ], {
        duration: 1000,
      });
    }
    //db.delete().then (()=>db.open());
    //db.tags.clear();
  }
}
