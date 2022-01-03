'use strict';

import { Deck } from "./deck";
import { Tag } from "./tag";

export class Flashcard {
    id?: number;

    // Contetnt
    question: string;
    description?: string;
    answer: string;
    deck?: Deck;
    tags?: Set<Tag>;

    // Meta
    creationDate: Date;


    // TODO: add atomated id generation
    constructor(question:string, answer:string, description?:string, deck?:Deck) {
        //this.id = id;
        this.question = question;
        this.answer = answer;
        this.creationDate = new Date();
        this.tags = new Set<Tag>();
        this.description = description;
        this.deck = deck;
    }
}