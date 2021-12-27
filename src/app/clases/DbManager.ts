'use strict';

import { Injectable } from "@angular/core";
import Dexie, { Table } from 'dexie';
import { Deck } from "./deck";
import { Flashcard } from "./flashcard";

@Injectable()
export class DbManager extends Dexie{
    cards!: Table<Flashcard,number>;
    deck!: Table<Deck,number>;

    constructor() {
        super('ngdexieliveQuery');
        this.version(3).stores({
            deck: '++id',
            cards: '++id, deck'
        })
    }
}