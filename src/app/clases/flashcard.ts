'use strict';

import { Deck } from "./deck";
import { Tag } from "./tag";

export class Flashcard {
    id: number;

    // Contetnt
    question: string;
    description?: string;
    answer: string;
    deck?: number;
    tagIDs?: string[];

    //Statistics
    attempts: number;
    sucessAttempts: number;

    // Meta
    creationDate: Date;


    constructor(question:string, answer:string, description?:string, deck?: number) {
        this.id = Date.now()
        this.question = question;
        this.answer = answer;
        this.creationDate = new Date();
        this.tagIDs = [];
        this.description = description;
        this.deck = deck;
        this.attempts = 0;
        this.sucessAttempts = 0;
    }
}