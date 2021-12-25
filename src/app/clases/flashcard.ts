'use strict';

import { Tag } from "./tag";

export class Flashcard {
    id: number;

    // Contetnt
    question: string;
    description?: string;
    answer: string;

    tags?: Set<Tag>;

    // Meta
    creationDate: Date;


    // TODO: add atomated id generation
    constructor(id:number,question:string,answer:string) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.creationDate = new Date();
        this.tags = new Set<Tag>();
    }
}