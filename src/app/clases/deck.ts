'use strict';

import { Flashcard } from "./flashcard";

export interface Deck {
    id: number;
    creationDate: Date;

    cards: Flashcard[];
}