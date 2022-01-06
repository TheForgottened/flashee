import { Component } from '@angular/core';
import { Flashcard } from './clases/flashcard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'flashee';
  createCard = false;
  modCard?: Flashcard;

  newCardMenu():void {
    this.modCard = undefined;
    (this.createCard == true)?this.createCard=false:this.createCard=true;    
  }

  closeEventHandler(event: any) {
    this.newCardMenu();
  }

  onModify(card: Flashcard) {
    console.log(card);
    this.modCard = card;
    this.createCard = false;
    this.createCard = true;
  }
}
