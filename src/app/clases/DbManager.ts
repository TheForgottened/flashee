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
        super('ngdexieliveQuery');
        this.version(1).stores({
            decks: '++id',
            cards: '++id,question',
            tags: '++id'
        })

        this.on('populate',()=>this.populate());
    }

    async populate() {
        const deck = await db.decks.add(new Deck());
        await db.cards.bulkAdd([
            new Flashcard("Hola??","!!","desc"),
            new Flashcard("Que haces??","!!","desc"),
            new Flashcard("asdas??","!!","desc"),
            new Flashcard("gfdgf??","!!","desc"),
        ])
    }
}

export const db = new DbManager();