import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalDataService } from '../global-data.service';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { db } from '../clases/DbManager';
import { FormControl } from '@angular/forms';
import { Flashcard } from '../clases/flashcard';
import { Quiz } from '../clases/quiz';
import Dexie, { Observable } from 'dexie';
import { Tag } from '../clases/tag';
import { range, timeInterval } from 'rxjs';

@Component({
    selector: 'quiz',
    templateUrl: './quiz.component.html',
    styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
    faTimes = faTimes;
    numCards = new FormControl('');

    showQuiz: boolean = false;
    cards: Flashcard[] = [];

    currentQuestionIndex: number = 0;
    answer = new FormControl('');
    public startQuiz: boolean = false;
    correctAnswers: number = 0;
    buttonLabel: string = 'Next Question';

    public showResult: boolean = false;

    // Questions for the quiz
    public quizQuestions: Flashcard[] = [];

    // All the avaible tags
    public tags: Tag[] = [];

    // SelectedTagas
    public selectedTags: Tag[] = [];

    quizCreated: boolean = false;
    time!: number;

    @Input() currentQuestion!: Flashcard;
    @Output() closeEvent = new EventEmitter<boolean>();

    constructor(public globalData: GlobalDataService) { }

    ngOnInit(): void {
        db.tags.toArray(t => this.tags = t);
    }

    ngOnChange(): void{
        console.log("answer",this.answer.value)
    }

    /*
    * Action on selecting a tag
    */
    public selectTag(tag: Tag) {
        this.selectedTags.push(tag);
        this.tags.splice(this.tags.indexOf(tag), 1);
    }

    /*
    * Action on unselecting a tag
    */
    public unselectTag(tag: Tag) {
        this.selectedTags.splice(this.selectedTags.indexOf(tag), 1)
        this.tags.push(tag)
    }

    /*
    * Starts the test
    */
    public async startNewQuiz(): Promise<number> {
        // Validate user data
        if (!this.validateFields()) return 0;
        // Generate the question pool
        let pool = await this.quizRandom();

        // If we got a card pool get arandom number
        let questions: Flashcard[] = [];
        if (pool != undefined) {
            this.quizQuestions = this.randomizeQuestions(pool);
        } else {
            console.log("Pool is undefined");
            return 0;
        }

        console.log("Questions", this.quizQuestions)
        // Start of the quiz
        this.showQuiz = true;
        this.time = Date.now();


        return 1;
    }

    /*
    *   Checks if the user have used a valid input
    */
    public validateFields(): number {
        let nCards = this.numCards.value;

        if (this.numCards.value < 1) {
            alert("You can't start a Quiz with 0 cards!");
            return 0;
        } else if (nCards > this.cards.length) {
            nCards = this.cards.length;
            return 1;
        }
        return 1;
    }

    /*
    * Random list of questions from pool
    */
    randomizeQuestions(pool: Flashcard[]): Flashcard[] {
        // Number of cards we want to get
        let nCards: number = this.numCards.value;
        let questions: Flashcard[] = [];

        for (let i = 0; i < nCards || pool.length > 0; i++) {
            let index = this.getRandomInt(0, pool.length - 1)
            questions.push(pool.splice(index, 1)[0])
        }

        console.log("1 Pool", questions)
        return questions;
    }

    /*
    * Generate quiz
    */
    public async quizRandom(): Promise<Flashcard[] | undefined> {
        let tagIDs: string[] = this.tagToStringArr(this.selectedTags);
        let cardPool: Flashcard[] = [];

        console.log("TAGS", tagIDs)

        await db.cards
            .where("tagIDs")
            .anyOf(tagIDs)
            .toArray(arr => {
                cardPool = arr;
                console.log("recived arr", cardPool)
            })

        return cardPool;
    }

    onSubmitAnswer() {
        if (this.answer.value.toLowerCase().trim() === this.currentQuestion?.answer.toLowerCase().trim()) {
            this.correctAnswers++;
        }

        this.answer.setValue('');

        if (this.currentQuestionIndex == this.quizQuestions.length - 1) {
            let tagIDs: string[] = [];

            this.globalData.tagsQuiz.forEach((tag) => {
                tagIDs.push(tag.id);
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

    close() {
        this.showQuiz = false;
        this.globalData.createQuiz = false;
        this.closeEvent.emit(true);
    }

    public tagToStringArr(tagList: Tag[]): string[] {
        let tags: string[] = [];
        tagList.forEach(tag => tags.push(tag.id));
        return tags;
    }

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
