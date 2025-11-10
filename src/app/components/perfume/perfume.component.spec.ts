import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfumeComponent } from './perfume.component';

describe('PerfumeComponent', () => {
  let component: PerfumeComponent;
  let fixture: ComponentFixture<PerfumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
