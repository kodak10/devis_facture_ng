import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelsEditComponent } from './travel-edit';

describe('DevisEdit', () => {
  let component: TravelsEditComponent;
  let fixture: ComponentFixture<TravelsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
