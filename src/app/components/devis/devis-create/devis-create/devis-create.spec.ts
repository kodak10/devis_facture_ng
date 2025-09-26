import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevisCreate } from './devis-create';

describe('DevisCreate', () => {
  let component: DevisCreate;
  let fixture: ComponentFixture<DevisCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevisCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevisCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
