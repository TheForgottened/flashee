import { Component, OnInit } from '@angular/core';
import { Flashcard } from '../clases/flashcard';
import { CARDS } from '../clases/prueba-tarjetas';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {


  selectedCard?: Flashcard;
  cards = CARDS;

  constructor() { }

  onSelect(card: Flashcard): void {
    this.selectedCard = card;
  }

  ngOnInit(): void {
  }

}
