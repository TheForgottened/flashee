'use strict';

import { Injectable } from "@angular/core";
import Dexie, { Table } from 'dexie';
import { Deck } from "./deck";
import { Flashcard } from "./flashcard";
import { Tag } from "./tag";



//@Injectable()
export class DbManager extends Dexie{
    cards!: Table<Flashcard,number>;
    decks!: Table<Deck,number>;
    tags!: Table<Tag, number>;

    constructor() {        

        super('flashee');
        this.version(1).stores({
            decks: '++id',
            cards: '++id, question',
            tags: '++id'
        })

        this.on('populate',()=>this.populate());
    }

    async populate() {
        const deck = await db.decks.add(new Deck());
        const idDeck = (await db.decks.where('id').equals(deck).toArray())[0]

        await db.cards.bulkAdd([
            new Flashcard("Card1?","Yes","This is card 1", idDeck),
            new Flashcard("Card2?","Yes","This is card 2", idDeck),
            new Flashcard("Card3?","Yes","This is card 3", idDeck),
        ])
    }
}


export const db = new DbManager();
