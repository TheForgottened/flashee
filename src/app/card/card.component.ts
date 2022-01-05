import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
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
    this.deleteEvent.emit(this.flashcard);
  }
}
