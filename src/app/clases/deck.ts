'use strict';

import { Flashcard } from "./flashcard";

// Probably a singleton, magaing the cards reading writing
export class Deck {
    id: number;
    name: string;
    creationDate: Date;

    cards: Set<Flashcard>;

    constructor(name: string) {
        // Will be only one deck for now
        this.name = name;
        this.id = Date.now();
        this.cards = new Set<Flashcard>();
        this.creationDate = new Date();
    }
}