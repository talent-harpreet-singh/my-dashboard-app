import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TierProfileModalComponent } from './tier-profile-modal.component';

describe('TierProfileModalComponent', () => {
  let component: TierProfileModalComponent;
  let fixture: ComponentFixture<TierProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TierProfileModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TierProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
