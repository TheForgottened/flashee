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
        this.version(4).stores({
            decks: '++id, name',
            cards: '++id, question',
            tags: '++id, name'
        })

        this.on('populate',()=>this.populate());
    }

    async populate() {
        //const deck = await db.decks.add(new Deck("test"));
        //this.decks.each(deck => console.log("deck id: " + deck.id + " name: " + deck.name));
        await db.cards.bulkAdd([
            new Flashcard("Card1?","Yes","This is card 1")
        ])
    }
}


export const db = new DbManager();
