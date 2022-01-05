import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { liveQuery } from 'dexie';
import { DbManager, db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';
import { CARDS } from '../clases/prueba-tarjetas';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {


  selectedCard?: Flashcard;
  cards = liveQuery(() => db.cards.toArray());
  @Output() modCardEvent = new EventEmitter<Flashcard>(); 
  

  constructor() { }

  onSelect(card: Flashcard): void {
    this.selectedCard = card;
  }

  onModify(card: Flashcard) {
    this.modCardEvent.emit(card);
  }

  ngOnInit(): void {
    //! RESETS THE DATABASE
    //db.delete().then (()=>db.open());
  }

}
