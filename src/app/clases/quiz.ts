'use strict';

export class Quiz {
  id: number;
  date: Date;
  nQuestions: number;
  correctAnswers: number;
  selectedTags: string[];
  
  constructor(nq: number, ca: number, st: string[]) {
    this.id = Date.now();
    this.date = new Date();
    this.nQuestions = nq;
    this.correctAnswers = ca;
    this.selectedTags = st;
  }
}
