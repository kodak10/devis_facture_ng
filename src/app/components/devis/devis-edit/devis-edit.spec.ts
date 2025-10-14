import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisEdit } from './devis-edit';

describe('DevisEdit', () => {
  let component: DevisEdit;
  let fixture: ComponentFixture<DevisEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevisEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevisEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
