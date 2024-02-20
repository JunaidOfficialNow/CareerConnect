import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJobPreferenceComponent } from './edit-job-preference.component';

describe('EditJobPreferenceComponent', () => {
  let component: EditJobPreferenceComponent;
  let fixture: ComponentFixture<EditJobPreferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditJobPreferenceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditJobPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
