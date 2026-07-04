import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBookDialog } from './addBookDialog';

describe('AddBookDialog', () => {
  let component: AddBookDialog;
  let fixture: ComponentFixture<AddBookDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBookDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBookDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
