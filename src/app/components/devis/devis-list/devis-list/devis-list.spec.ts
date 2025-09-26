import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisList } from './devis-list';

describe('DevisList', () => {
  let component: DevisList;
  let fixture: ComponentFixture<DevisList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevisList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevisList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
