import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { db } from '../clases/DbManager';
import { Deck } from '../clases/deck';
import { Flashcard } from '../clases/flashcard';
import { GlobalDataService } from '../global-data.service';


@Component({
  selector: 'flashcard',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() flashcard!: Flashcard;

  @Output() modifyEvent= new EventEmitter<Flashcard>();
  @Output() deleteEvent = new EventEmitter<Flashcard>();
  @Output() addToDeckEvent = new EventEmitter<Flashcard>();
   
  constructor(public globalData: GlobalDataService) {

  }

  ngOnInit(): void {
  }

  modificationEvent() {
    console.log("Emitiendo tarjeta");
    this.globalData.setCard(this.flashcard);
    //this.modifyEvent.emit(this.flashcard);
  }

  deletionEvent(){
    //TODO: add confirmation
    db.cards.delete(this.flashcard.id);
    this.deleteEvent.emit(this.flashcard);
  }

  onSelect() {
    if (this.globalData.selectedCard! == this.flashcard) {
      this.globalData.setCard(undefined);
    } else {
      this.globalData.setCard(this.flashcard);
    }
  }
}
