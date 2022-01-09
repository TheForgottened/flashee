import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';
import { Tag } from '../clases/tag';
import { GlobalDataService } from '../global-data.service';

import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'create-card',
  templateUrl: './create-card.component.html',
  styleUrls: ['./create-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCardComponent implements OnInit {
  faTimes = faTimes;

  question = new FormControl('');
  answer = new FormControl('');
  tags = new FormControl('');
  description = new FormControl('');

  //private globalDataService: any;
  public cardObs?: Observable<Flashcard>;

  @Input() card?: Flashcard;
  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(public globalData: GlobalDataService) {
    this.globalData.cardChanged.subscribe((card) => {
      this.updateValues(card);
    });
  }

  ngOnInit(): void {
    console.log(this.globalData.selectedCard);
    if (this.card) {
      this.question.setValue(this.card.question);
      this.description.setValue(this.card.description);
      this.answer.setValue(this.card.answer);
      this.tags.setValue(this.getTagsString(this.card.tagIDs));
    }
  }

  newCard() {
    if (this.card) {
      this.card.question = this.question.value;
      this.card.answer = this.answer.value;
      this.card.description = this.description.value;
      //this.card.tags = this.tags.value;

      this.findTags(this.card);
      if (!this.findTags(this.card)) {
        return;
      }

      db.cards.put(this.card);
    } else {
      let card: Flashcard = new Flashcard(
        this.question.value,
        this.answer.value,
        this.description.value
      );
      if (!this.findTags(card)) {
        return;
      }

      db.cards.add(card);
    }

    this.globalData.searchCards('', '');
    this.discard();
  }

  findTags(card: Flashcard): number {
    let tagSet = new Set<Tag>();
    this.tags.setValue(this.tags.value.replace(/\s/g, ""))
    let tagArr = this.tags.value.split(',');

    tagArr.forEach((tag: string) => {
      tagSet.add(new Tag(tag));
    });

    for (let i = 0; i < tagArr.length; i++) {
      for (let j = i + 1; j < tagArr.length; j++) {
        if (tagArr[i] === tagArr[j]) {
          alert("You can't use the same tag twice.");
          return 0;
        }
      }
    }
    tagSet.forEach(tag => card.tagIDs!.push(tag.idString));
    this.updateTagList(tagSet);

    

    return 1;
  }

  async updateTagList(tagSet: Set<Tag>) {
    let exists = false;
    tagSet.forEach((tag) => {
      db.tags.each((dbtag) => {
        console.log('tag name');
        console.log(dbtag.name);
        if (tag.name === dbtag.name) {
          exists = true;
        }
      });

      if (!exists) {
        db.tags.put(tag);
      } else {
        exists = false;
      }
    });

    this.globalData.getTags();
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

  updateValues(card: Flashcard) {
    this.question.setValue(card.question);
    this.description.setValue(card.description);
    this.answer.setValue(card.answer);
    this.tags.setValue(this.getTagsString(card.tagIDs));
    this.globalData.getTags();
  }

  getTagsString(tags: string[] | undefined): string {
    let result: string = '';

    for (let tag of tags!) {
      
      db.tags.each((tag) => {
        result += tag.name;
        result += ',';
      });
    }

    result = result.slice(0, result.length - 1);

    return result;
  }
}
