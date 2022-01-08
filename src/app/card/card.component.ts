import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';
import { GlobalDataService } from '../global-data.service';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'flashcard',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  faTrash = faTrash;
  faEdit = faEdit;

  @Input() flashcard!: Flashcard;

  @Output() modifyEvent= new EventEmitter<Flashcard>();
  @Output() deleteEvent = new EventEmitter<Flashcard>();

  constructor(public globalData: GlobalDataService) {

  }

  ngOnInit(): void {
  }

  modificationEvent() {
    console.log("Emitiendo tarjeta");
    this.globalData.setCard(this.flashcard);
    this.globalData.searchCards("", "");
    //this.modifyEvent.emit(this.flashcard);
  }

  deletionEvent(){
    //TODO: add confirmation
    db.cards.delete(this.flashcard.id);
    this.deleteEvent.emit(this.flashcard);
    this.globalData.searchCards("", "");
    this.globalData.getTags();
  }
}
