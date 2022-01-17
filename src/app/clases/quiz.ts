'use strict';

export class Quiz {
  id: number;
  date: Date;
  nQuestions: number;
  correctAnswers: number;
  time: number;
  selectedTags: string[];
  
  constructor(nq: number, ca: number, st: string[], time: number) {
    this.id = Date.now();
    this.date = new Date();
    this.time = time;
    this.nQuestions = nq;
    this.correctAnswers = ca;
    this.selectedTags = st;
  }
}
