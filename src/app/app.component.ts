import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'flashee';
  createCard = false;

  newCardMenu():void {
    (this.createCard == true)?this.createCard=false:this.createCard=true;
  }

  closeEventHandler(event: any) {
    this.newCardMenu();
  }
}
