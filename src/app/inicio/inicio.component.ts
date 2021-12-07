import { Component, OnInit } from '@angular/core';
import { Flashcard } from '../flashcard';

import { CARDS } from '../prueba-tarjetas';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent implements OnInit {

  card: Flashcard = {
    id: 1,
    name: 'Tarjeta'
  }

  selectedCard?: Flashcard;
  cards = CARDS;

  constructor() { }

  onSelect(card: Flashcard): void {
    this.selectedCard = card;
  }

  ngOnInit(): void {
  }

}
