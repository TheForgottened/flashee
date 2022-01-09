import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GlobalDataService } from '../global-data.service';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { db } from '../clases/DbManager';
import { FormControl } from '@angular/forms';
import { Flashcard } from '../clases/flashcard';
import { Quiz } from '../clases/quiz';
import { Observable } from 'dexie';

@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  faTimes = faTimes;
  numCards = new FormControl('');
  quizQuestions: Flashcard[] = [];
  showQuiz: boolean = false;
  cards: Flashcard[] = [];
  currentQuestion?: Flashcard;
  currentQuestionIndex: number = 0;
  answer = new FormControl('');
  startQuiz: boolean = false;
  correctAnswers: number = 0;
  buttonLabel: string = "Next Question";

  @Output() closeEvent = new EventEmitter<boolean>();

  constructor(public globalData: GlobalDataService) {}

  ngOnInit(): void {
    
  }

  async randomizeQuestions() {
    this.startQuiz = true;
    this.cards = await db.cards.toArray();

    this.quizQuestions = [];

    let nCards = this.numCards.value;
    
    let totalQuestions = 0;

    for (let val of this.globalData.tagsQuiz) {
      let tagCardNum = 0;

      while (tagCardNum < nCards / this.globalData.tagsQuiz.length) {

        let randomCard = this.cards[this.getRandomInt(this.cards.length)];
        for (let cardTagID of randomCard.tagIDs!) {

          if (cardTagID === val.idString) {
      
            if (!this.repeatedQuestion(randomCard)) {
              console.log("quest " + randomCard.question);
              this.quizQuestions.push(randomCard);
              totalQuestions++;
              tagCardNum++;
            }
            
          }
        }
      }
      if (totalQuestions == nCards) break;
    }
    console.log(this.quizQuestions.length);
    this.currentQuestion = this.quizQuestions[0];

    this.showQuiz = true;
  }

  repeatedQuestion(card: Flashcard): boolean {
    for (let qq of this.quizQuestions) {
      if (qq.id == card.id) {
        return true;
      }
    }
    return false;
  }

  onSubmitAnswer() {
    
    if (this.answer.value === this.currentQuestion?.answer) {
      this.correctAnswers++;
    }

    if (this.currentQuestionIndex == this.quizQuestions.length - 1) {
      let tagIDs: string[] = [];
      this.globalData.tagsQuiz.forEach(tag => {
        tagIDs.push(tag.idString);
      });
      let q = new Quiz(this.quizQuestions.length, this.correctAnswers, tagIDs);
      db.quizzes.add(q);
      this.globalData.tagsQuiz = [];
      
      db.quizzes.each(quiz => console.log(quiz.correctAnswers));

      this.close();
    }

    this.currentQuestionIndex++;
    this.currentQuestion = this.quizQuestions[this.currentQuestionIndex];
    
    console.log("index " + this.currentQuestionIndex);
    if (this.currentQuestionIndex == this.quizQuestions.length - 1) {
      this.buttonLabel = 'Finish';
    }
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  close() {
    this.showQuiz = false;
    this.closeEvent.emit(true);
  }
}
