import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureEdit } from './facture-edit';

describe('FactureEdit', () => {
  let component: FactureEdit;
  let fixture: ComponentFixture<FactureEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactureEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
