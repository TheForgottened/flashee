import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';


@Component({
  selector: 'flashcard',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input() flashcard!: Flashcard;

  @Output() modifyEvent= new EventEmitter<Flashcard>();
  @Output() deleteEvent = new EventEmitter<Flashcard>();
  

  ngOnInit(): void {
  }

  modificationEvent() {
    this.modifyEvent.emit(this.flashcard);
  }

  deletionEvent(){
    db.cards.delete(this.flashcard.id);
    this.deleteEvent.emit(this.flashcard);
  }
}
