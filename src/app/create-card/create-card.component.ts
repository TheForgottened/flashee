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

  /// Form controls
  question = new FormControl('');
  answer = new FormControl('');
  tags = new FormControl('');
  description = new FormControl('');
  difficulty = new FormControl('');
  newTag: boolean = false;
  ///

  public cardObs?: Observable<Flashcard>;

  @Input() card?: Flashcard;
  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(public globalData: GlobalDataService) {

  }

  ngOnInit(): void {
    // If the operation is a update the card is loaded
    if (this.card) {
      this.question.setValue(this.card.question);
      this.description.setValue(this.card.description);
      this.answer.setValue(this.card.answer);
      this.difficulty.setValue(this.card.difficulty)
      this.tags.setValue(this.card.tagIDs?.toString());
    }
  }

  /*
  * Main function for the creation of cards
  */
  async newCard() {
    if (this.card) {
      // Intro of data
      this.card.question = this.question.value;
      this.card.answer = this.answer.value;
      this.card.description = this.description.value;
      this.card.difficulty = this.difficulty.value;

      let oldTags = this.card.tagIDs;
      let newTags = this.getTagArr(this.tags.value)

      //Delete updated tags
      console.log("TGAS",oldTags,newTags );
      

      // Update the tag list
      this.findTags(this.card)

      // Insert the card into the db
      await db.cards.put(this.card).finally(()=>{
        /// Update the deleted tags
        this.deleteTags(oldTags, newTags);
      });

      //this.globalData.filterCards.push(this.card);
      this.globalData.searchCards('', '');
      this.close()
    } else {
      let card: Flashcard = new Flashcard(
        this.question.value,
        this.answer.value,
        this.description.value,
        this.difficulty.value,
      );

      if (!this.findTags(card)) {
        return;
      }

      console.log(card);
      await db.cards.add(card);
      this.globalData.filterCards.push(card);
      this.discard();

      this.globalData.searchCards('', '');

    }

    this.globalData.getTags();

  }

  /*
  * Find the unique tags in a card
  * @Params card on creation to search
  */
  public findTags(card: Flashcard): number {

    //Load all the individual tags
    let tagSet = new Set<Tag>();
    this.tags.setValue(this.tags.value.replace(/\s/g, ''));

    //Card string to array can contain repeated tas
    let tagArr = this.tags.value.split(',');

    for (let tag of tagArr) {
      if (tag == '') continue;
      tagSet.add(new Tag(tag));
    }

    card.tagIDs = [];

    tagSet.forEach((tag) => {
      card.tagIDs!.push(tag.id);
    });

    this.updateTagList(tagSet);

    return 1;
  }

  /*
  * update the database of tags
  */
  public updateTagList(tagSet: Set<Tag>) {
    let exists = false;
    tagSet.forEach((tag) => {
      db.tags.each((dbtag) => {
        //console.log(dbtag.name);
        if (tag.name == dbtag.name) {
          exists = true;
        }
      })

      if (!exists) {
        this.newTag = true;
        db.tags.put(tag);
      } else {
        exists = false;
      }
    });

  }

  discard() {
    this.question.setValue('');
    this.description.setValue('');
    this.answer.setValue('');
    this.tags.setValue('');
    this.difficulty.setValue('');
    //console.log(this.globalData.getCardQuestion());
  }

  close() {
    this.globalData.selectedCard = undefined;
    this.globalData.createCard = false;
    this.closeEvent.emit(true);
  }

  updateValues(card: Flashcard) {
    this.question.setValue(card.question);
    this.description.setValue(card.description);
    this.answer.setValue(card.answer);
    this.difficulty.setValue(card.difficulty);
    this.tags.setValue(this.getTagsString(card.tagIDs));
  }

  /*
  * Delete tags no longer in use
  */
  async deleteTags(oldTags: string[] | undefined, newTags: string[] | undefined): Promise<number> {
    if (oldTags == undefined || oldTags?.length == 0) return 0;

    // tags being deleted from the db 
    let delTags: string[] = [];

    // Difference between arrays
    if (newTags == undefined) {
      delTags = oldTags;
    } else {
      oldTags.forEach(tag => {
        if (!newTags.includes(tag)) delTags.push(tag);
      })
    }

    console.log("Delete tags:",delTags,oldTags)
    // chech if any other card contains the tag
    delTags.forEach(tag => {
      let exists = false;
      db.cards.each(card => {
        if (card.tagIDs?.includes(tag)) exists = true;
        console.log("Actual card", card, tag, !exists);
        return;
      }).finally(() => {
        // If there are no instances of the card
        if (!exists) {
          console.log("Deleting", tag, !exists);
          db.tags.where("id").equals(tag).delete();
          this.globalData.getTags()
        }
      })
    })

    return 1;
  }


  /*
  * !DEPRECATED
  * Deletes a tag
  * Updates the tag list when
  */
  async deleteTag(): Promise<number> {
    // If we are not updating a card close
    if (!this.card) return 0;

    // All the avaible tags
    let tags = await db.tags.toArray();
    let found = false;
    var tagsToDelete: string[] = [];
    let tag = '';

    let cards = await db.cards.toArray();

    //!TODO: WTF is going on here
    for (let tag of tags!) {
      for (let card of cards) {
        for (let cardTagID of card.tagIDs!) {
          if (tag.idString === cardTagID) {
            found = true;
            break;
          }
        }
        if (found) break;
      }

      if (!found) {
        console.log
        tagsToDelete.push(tag.id);
      } else {
        found = false;
      }
    }

    tagsToDelete.forEach((tag) => {
      //!db.tags.delete(tag);
    });

    return 1;
  }

  /*
  * Turns a coma separated list into a array
  */
  getTagArr(tags: string): string[] {
    return tags.split(',');
  }

  /*
  * Turns a list of tags into a string to display
  */
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
