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
    // this.globalData.cardChanged.subscribe((card) => {
    //   this.updateValues(card);
    // });
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
      //this.card.tagIDs = this.tags.value;
      console.log('Modifying');
      this.findTags(this.card);
      if (!this.findTags(this.card)) {
        return;
      }

      db.cards.put(this.card);

      db.tags.each(tag => {
        console.log("adfasd " + tag.name);
      })

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

    this.discard();
    this.globalData.searchCards('', '');
    this.globalData.getTags();
  }

  findTags(card: Flashcard): number {
    let tagSet = new Set<Tag>();
    this.tags.setValue(this.tags.value.replace(/\s/g, ''));
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
    card.tagIDs! = [];
    
    tagSet.forEach((tag) => { card.tagIDs!.push(tag.idString); });
    this.updateTagList(tagSet);

    return 1;
  }

  updateTagList(tagSet: Set<Tag>) {
    let exists = false;
    tagSet.forEach((tag) => {
      db.tags.each((dbtag) => {
        if (tag.name === dbtag.name) {
          exists = true;
        }
      })

      if (!exists) {
        db.tags.add(tag);
      } else {
        exists = false;
      }
    });
    this.deleteTag();
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
  }

  async deleteTag() {
    if (!this.card) return;
    let tags = this.card!.tagIDs;
    let found = false;
    var tagsToDelete: number[] = [];
    let tag = '';

    let cards = await db.cards.toArray();

    for (let tagIDString of tags!) {
      tag = tagIDString;
      for (let card of cards) {
        for (let cardTagID of card.tagIDs!) {
          if (tagIDString === cardTagID) {
            found = true;
          }
        }
      }

      if (!found) {
        let tagName = tag
        .split(' ')
        .map((bin) => String.fromCharCode(parseInt(bin, 2)))
        .join('');
        console.log("asdasdsadsadad " + tagName);
        tag = tag.replace(/\s/g, '');
        let tagID = +tag;
        tagsToDelete.push(tagID);
      } else {
        found = false;
      }
    }
    tagsToDelete.forEach((tag) => {
      db.tags.delete(tag);
    });
  }

  getTagsString(tags: string[] | undefined): string {
    let result: string = '';

    for (let tag of tags!) {
      let tagName = tag
        .split(' ')
        .map((bin) => String.fromCharCode(parseInt(bin, 2)))
        .join('');
      result += tagName;
      result += ',';
    }

    result = result.slice(0, result.length - 1);

    return result;
  }
}
