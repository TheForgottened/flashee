import { ComponentFixture, TestBed } from '@angular/core/testing';
import { db } from '../clases/DbManager';
import { CreateCardComponent } from '../create-card/create-card.component';

import { QuizComponent } from './quiz.component';

describe('QuizComponent', () => {
    let component: QuizComponent;
    let fixture: ComponentFixture<QuizComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [QuizComponent, CreateCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(QuizComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create random quiz', async () => {
        const ccFixture = TestBed.createComponent(CreateCardComponent);
        let ccComp = ccFixture.componentInstance;
        ccComp.globalData.setCard(undefined);
        ccComp.question.setValue('test');
        ccComp.answer.setValue('test');
        ccComp.description.setValue('test');
        ccComp.difficulty.setValue('test');
        ccComp.tags.setValue('test,test2');
        ccComp.newCard();

        component.numCards.setValue('1');
        await component.randomizeQuestions();
        expect(component.quizCreated).toBeTruthy();
    });

    it('should create chosen tags quiz', async () => {
        const ccFixture = TestBed.createComponent(CreateCardComponent);
        let ccComp = ccFixture.componentInstance;
        for (let i = 0; i < 3; i++) {
            ccComp.globalData.setCard(undefined);
            ccComp.question.setValue('test' + i);
            ccComp.answer.setValue('test' + i);
            ccComp.description.setValue('test' + i);
            ccComp.difficulty.setValue('test' + i);
            ccComp.tags.setValue('test,test2' + i);
            ccComp.newCard();
        }
        await db.tags.each((dbtag) => {
          //console.log(dbtag.name);
          if ('test' == dbtag.name) {
            ccComp.globalData.tagsQuiz.push(dbtag);
          }
        });
       
        component.numCards.setValue('3');
        await component.randomizeQuestions();
        expect(component.quizCreated).toBeTruthy();
    });
});
