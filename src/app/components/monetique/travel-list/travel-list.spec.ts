import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelsListsComponent } from './travel-list';

describe('TravelsList', () => {
  let component: TravelsListsComponent;
  let fixture: ComponentFixture<TravelsListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelsListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelsListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
