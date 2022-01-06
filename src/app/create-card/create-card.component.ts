import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';
import { Tag } from '../clases/tag';

@Component({
  selector: 'create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.css']
})
export class CreateCardComponent implements OnInit {
  question = new FormControl('');
  answer = new FormControl('');
  tags = new FormControl('');
  description = new FormControl('');
  

  @Input() card?: Flashcard;
  @Output() closeEvent = new EventEmitter<boolean>();


  ngOnInit(): void {
    if (this.card) {
      this.question.setValue(this.card.question)
      this.description.setValue(this.card.description)
      this.answer.setValue(this.card.answer)
      this.tags.setValue(this.card.tags)
    }
  }

  newCard() {
    if (this.card) {
      this.card.question = this.question.value;
      this.card.answer = this.answer.value;
      this.card.description = this.description.value;
      this.card.tags = this.tags.value;
      db.cards.put(this.card)
    } else {      
      db.cards.add(new Flashcard(this.question.value,this.description.value,this.answer.value,this.tags.value))
    }
    
    this.discard();
  }

  discard() {
    this.question.setValue('');
    this.description.setValue('');
    this.answer.setValue('');
    this.tags.setValue('');
  }

  close() {
    this.closeEvent.emit(true);
  }

}
