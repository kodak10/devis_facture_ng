import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureList } from './facture-list';

describe('FactureList', () => {
  let component: FactureList;
  let fixture: ComponentFixture<FactureList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
