import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Flashcard } from '../clases/flashcard';
import { FormsModule } from '@angular/forms';
import { CreateCardComponent } from './create-card.component';

describe('CreateCardComponent', () => {
  let component: CreateCardComponent;
  let fixture: ComponentFixture<CreateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create card', async () => {
    component.globalData.setCard(undefined);
    component.question.setValue("test");
    component.answer.setValue("test");
    component.description.setValue("test");
    component.difficulty.setValue("test");
    component.tags.setValue("test,test2");
    expect(component.newCard()).toBeTruthy();
  })

  it('should modify card', async () => {
    var card: Flashcard = new Flashcard("b", "b", "", "", undefined);
    component.globalData.cards = []
    component.globalData.setCard(undefined);
    component.question.setValue("test");
    component.answer.setValue("test");
    component.description.setValue("test");
    component.difficulty.setValue("test");
    component.tags.setValue("test,test2");
    await component.newCard();

    component.globalData.setCard(card);
    
    // component.globalData.getCards();
    
    expect(component.newCard()).toBeTruthy();
  })
});
