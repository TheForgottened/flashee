'use strict';

import { Deck } from "./deck";
import { Tag } from "./tag";

export class Flashcard {
    id: number;

    // Content
    question: string;
    description?: string;
    answer: string;
    deck?: number;
    tagIDs?: string[];
    difficulty?: string;

    //Statistics
    attempts: number;
    sucessAttempts: number;

    // Meta
    creationDate: Date;


    constructor(question:string, answer:string, description?:string, difficulty?: string, deck?: number) {
        this.id = Date.now()
        this.question = question;
        this.answer = answer;
        this.creationDate = new Date();
        this.tagIDs = [];
        this.description = description;
        this.deck = deck;
        this.difficulty = difficulty;
        this.attempts = 0;
        this.sucessAttempts = 0;
    }
}