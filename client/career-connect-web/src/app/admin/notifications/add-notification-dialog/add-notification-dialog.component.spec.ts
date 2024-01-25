import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNotificationDialogComponent } from './add-notification-dialog.component';

describe('AddNotificationDialogComponent', () => {
  let component: AddNotificationDialogComponent;
  let fixture: ComponentFixture<AddNotificationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNotificationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNotificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
