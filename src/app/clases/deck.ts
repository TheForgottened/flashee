'use strict';

import { Flashcard } from "./flashcard";

// Probably a singleton, magaing the cards reading writing
export class Deck {
    id: number;
    creationDate: Date;

    cards: Set<Flashcard>;

    constructor() {
        // Will be only one deck for now
        this.id = 0;
        this.cards = new Set<Flashcard>();
        this.creationDate = new Date();
    }
}