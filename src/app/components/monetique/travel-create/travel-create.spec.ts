import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelCreateComponent } from './travels-create';

describe('TravelCreate', () => {
  let component: TravelCreateComponent;
  let fixture: ComponentFixture<TravelCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
