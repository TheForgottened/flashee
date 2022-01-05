import { Component, OnInit } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
  }

  newCard() {
    db.cards.add(new Flashcard(this.question.value,this.description.value,this.answer.value,this.tags.value))
    this.discard();
  }

  discard() {
    this.question.setValue('');
    this.description.setValue('');
    this.answer.setValue('');
    this.tags.setValue('');
  }

}
