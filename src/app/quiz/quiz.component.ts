import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalDataService } from '../global-data.service';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { db } from '../clases/DbManager';
import { FormControl } from '@angular/forms';
import { Flashcard } from '../clases/flashcard';
import { Quiz } from '../clases/quiz';
import { Observable } from 'dexie';
import { Tag } from '../clases/tag';

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

    currentQuestionIndex: number = 0;
    answer = new FormControl('');
    startQuiz: boolean = false;
    correctAnswers: number = 0;
    buttonLabel: string = 'Next Question';
    tags: Tag[] = [];

    time!: number;

    @Input() currentQuestion!: Flashcard;
    @Output() closeEvent = new EventEmitter<boolean>();

    constructor(public globalData: GlobalDataService) {}

    ngOnInit(): void {
        this.tags = this.globalData.tags;
    }

    async randomizeQuestions() {
        //this.startQuiz = true;
        this.cards = await db.cards.toArray();
        let nCards = this.numCards.value;

        if (this.cards.length < 1) {
            alert("You can't start a Quiz with 0 cards!");
            return;
        } else if (nCards < 1) {
            alert('You must have at least 1 card in the Quiz!');
            return;
        } else if (nCards > this.cards.length) {
            alert("You can't have more cards than you own in the Quiz!, the number of cards will be: "+this.cards.length);
            nCards = this.cards.length;;
        } else if (this.globalData.tagsQuiz.length == 0) {
            alert('You must pick at least 1 tag for the Quiz!');
            return;
        } else if (this.globalData.tagsQuiz.length > nCards) {
            alert("You can't pick more tags than the number of cards.");
            return;
        }

        this.quizQuestions = [];

        if (this.globalData.tagsQuiz.length == 0) this.quizRandom();
        else {
            if(!this.quizWithTags()) this.close();
        }

        this.currentQuestion = this.quizQuestions[0];

        this.time = Date.now()
        this.showQuiz = true;
    }

    quizRandom() {
        let nCards = this.numCards.value;

        let totalQuestions = 0;

        while (totalQuestions < nCards) {
            let randomCard = this.cards[this.getRandomInt(this.cards.length)];

            if (!this.repeatedQuestion(randomCard)) {
                this.quizQuestions.push(randomCard);
                totalQuestions++;
            }
        }
    }

    quizWithTags(): number{
        let nCards = this.numCards.value;

        let tagCards = 0;

        // Do a query
        for (let tag of this.globalData.tagsQuiz) {
            for (let card of this.cards) {
                for (let cardTagID of card.tagIDs!) {
                    if (cardTagID == tag.idString) {
                        tagCards++;
                    }
                }
            }
        }
        console.log("asdasd " + nCards + " asdgtth " + tagCards);
        if (tagCards < nCards) {
            alert('Not enough cards for the chosen tags');
            return 0;
        }

        let nextTag = false;

        let totalQuestions = 0;
        while (totalQuestions < nCards) {
            for (let val of this.globalData.tagsQuiz) {
                nextTag = false;
               // while (!nextTag) {
                    let randomCard =
                        this.cards[this.getRandomInt(this.cards.length)];

                    for (let cardTagID of randomCard.tagIDs!) {
                        if (cardTagID == val.idString) {
                            if (!this.repeatedQuestion(randomCard)) {
                                this.quizQuestions.push(randomCard);
                                totalQuestions++;
                                nextTag = true;
                                break;
                            }
                        }
                    }
               // }
                if (totalQuestions == nCards) break;
            }
        }
        return 1;
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
        if (this.answer.value.toLowerCase().trim() === this.currentQuestion?.answer.toLowerCase().trim()) {
            this.correctAnswers++;
        }

        this.answer.setValue('');

        if (this.currentQuestionIndex == this.quizQuestions.length - 1) {
            let tagIDs: string[] = [];

            this.globalData.tagsQuiz.forEach((tag) => {
                tagIDs.push(tag.idString);
            });

            this.time = Date.now() - this.time;

            let q = new Quiz(
                this.quizQuestions.length,
                this.correctAnswers,
                tagIDs,
                this.time,
            );

            db.quizzes.add(q);
            this.globalData.tagsQuiz = [];

            this.close();
        }

        this.currentQuestionIndex++;
        this.currentQuestion = this.quizQuestions[this.currentQuestionIndex];

        console.log('index ' + this.currentQuestionIndex);
        if (this.currentQuestionIndex == this.quizQuestions.length - 1) {
            this.buttonLabel = 'Finish';
        }
    }

    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    removeTag(tag: Tag) {
        console.log('toremove ' + tag.name);
        this.tags.splice(this.tags.indexOf(tag), 1);
        this.globalData.getTags();
    }

    close() {
        this.showQuiz = false;
        this.globalData.createQuiz = false;
        this.closeEvent.emit(true);
    }
}
