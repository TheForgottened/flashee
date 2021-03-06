'use strict';

import { Injectable } from "@angular/core";
import Dexie, { Table } from 'dexie';
import { Deck } from "./deck";
import { Flashcard } from "./flashcard";
import { Quiz } from "./quiz";
import { Tag } from "./tag";



//@Injectable()
export class DbManager extends Dexie{
    cards!: Table<Flashcard,number>;
    decks!: Table<Deck,number>;
    tags!: Table<Tag, number>;
    quizzes!: Table<Quiz, number>;

    constructor() { 
        super('flashee');
        this.version(8).stores({
            decks: '++id',
            cards: '++id, question, *tagIDs',
            tags: 'id,name',
            quizzes: '++id'
        })

        this.on('populate',()=>this.populate());
    }

    async populate() {
        //const deck = await db.decks.add(new Deck());

        // await db.cards.bulkAdd([
        //     new Flashcard("Card1?","Yes","This is card 1", deck)
        // ])
    }
}


export const db = new DbManager();
