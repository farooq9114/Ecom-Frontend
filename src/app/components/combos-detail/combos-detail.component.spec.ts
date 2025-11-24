import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombosDetailComponent } from './combos-detail.component';

describe('CombosDetailComponent', () => {
  let component: CombosDetailComponent;
  let fixture: ComponentFixture<CombosDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CombosDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombosDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
