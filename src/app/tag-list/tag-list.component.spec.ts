import { ComponentFixture, TestBed } from '@angular/core/testing';
import { db } from '../clases/DbManager';
import { Flashcard } from '../clases/flashcard';
import { CreateCardComponent } from '../create-card/create-card.component';

import { TagListComponent } from './tag-list.component';

describe('TagListComponent', () => {
  let component: TagListComponent;
  let fixture: ComponentFixture<TagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagListComponent, CreateCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', async () => {
    let createCardComponentFixture = TestBed.createComponent(CreateCardComponent);
    let createCardComponent = createCardComponentFixture.componentInstance;

    component.globalData.setCard(undefined);
    createCardComponent.question.setValue("test");
    createCardComponent.answer.setValue("test");
    createCardComponent.description.setValue("test");
    createCardComponent.difficulty.setValue("test");
    createCardComponent.tags.setValue("new tag");
    await createCardComponent.newCard();

    expect(createCardComponent.newTag).toBeTruthy();
  });
});
