import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';
import { Tag } from '../clases/tag';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateCardComponent implements OnInit {
  question = new FormControl('');
  answer = new FormControl('');
  tags = new FormControl('');
  description = new FormControl('');
  
  //private globalDataService: any;
  public cardObs?: Observable<Flashcard>;

  @Input() card?: Flashcard;
  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(public globalData: GlobalDataService) {    
  }

  ngOnInit(): void {
    console.log(this.globalData.selectedCard)
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
      //this.card.tags = this.tags.value;

      this.findTags(this.card);

      db.cards.put(this.card)
    } else {
      let card: Flashcard =  new Flashcard(this.question.value,this.answer.value,this.description.value);
      this.findTags(card);

      db.cards.add(card)
    }
    
    this.discard();
  }

  findTags(card: Flashcard) {
    let tagSet = new Set<Tag>();
    let tagArr = this.tags.value.split(',');   

    tagArr.forEach((tag: string) => {
      tagSet.add(new Tag(tag))
    });

    card.tags = tagSet;
    
    this.updateTagList(tagSet);
  }

  async updateTagList(tagSet:Set<Tag>) {
    for (let tag of tagSet) {
      let n = (await db.tags.where("name").equals(tag.name).toArray())[0]
      console.log("Encontrado")
      console.log(n)
      if (!n) {
        db.tags.put(tag);
      }
      
    }
  }

  discard() {
    this.question.setValue('');
    this.description.setValue('');
    this.answer.setValue('');
    this.tags.setValue('');
    console.log(this.globalData.getCardQuestion());
  }

  close() {
    this.globalData.selectedCard = undefined;
    this.closeEvent.emit(true);
  }

  updateValues(card:Flashcard) {
    this.question.setValue(card.question)
    this.description.setValue(card.description)
    this.answer.setValue(card.answer)
    this.tags.setValue(card.tags)
  }

}
