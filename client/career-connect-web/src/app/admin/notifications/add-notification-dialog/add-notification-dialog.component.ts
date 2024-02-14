import { FormBuilder, Validators } from '@angular/forms';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subscription, fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { ISampleLists } from 'src/app/shared/SampleLists.interface';
import { FiltersService } from 'src/app/shared/http/filters.service';
import { deslugify } from 'src/app/shared/deslugify';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { JobNotificationDto } from '../JobNotification.interface';

@Component({
  selector: 'app-form',
  templateUrl: './add-notification-dialog.component.html',
  styleUrl: './add-notification-dialog.component.css',
})
export class AddNotificationDialogComponent
  implements OnDestroy, AfterViewInit, OnInit
{
  private fb = inject(FormBuilder);
  private filtersService = inject(FiltersService);
  private snackbarService = inject(SnackbarService);
  private dialog = inject(MatDialogRef<AddNotificationDialogComponent, JobNotificationDto>);

  addOfficialLink = false;
  addWebsiteLink = false;

  qualifications = [
    'High School',
    'SSLC',
    'Higher Secondary',
    'Graduation',
    'Post Graduation',
  ];

  sampleLists: ISampleLists = {} as ISampleLists;
  skillsSelected: string[] = [];
  educationsSelected: string[] = [];

  filteredCategories: { category: string }[] = [];
  filteredSkills: { skill: string }[] = [];
  filteredEducations: { education: string }[] = [];

  @ViewChild('categoryInput') categoryInput!: ElementRef;
  @ViewChild('skillsInput') skillsInput!: ElementRef;
  @ViewChild('educationsInput') educationsInput!: ElementRef;

  educationInputSubscription!: Subscription;
  skillInputSubscription!: Subscription;
  categoryInputSubscription!: Subscription;

  jobNotificationFormGroup = this.fb.group({
    jobTitle: ['', Validators.required],
    CompanyOrDept: ['', Validators.required],
    description: ['', Validators.required],
    location: ['', Validators.required],
    category: ['', Validators.required],
    educations: [[] as string[]],
    skills: [[] as string[], Validators.required],
    deadline: ['', Validators.required],
    jobType: ['OnSiteJob', Validators.required],
    govtOrNot: ['govtJob', Validators.required],
    applicationLink: ['', Validators.required],
    officialLink: [''],
    websiteLink: [''],
    minQualification: ['', Validators.required],
  });

  ngOnInit(): void {
    this.filtersService.getSampleLists().subscribe((res) => {
      this.sampleLists = res;
      this.filteredCategories = this.sampleLists.categories;
      this.filteredSkills = this.sampleLists.skills;
      this.filteredEducations = this.sampleLists.educations;
    });
    const educationsControl =
      this.jobNotificationFormGroup.controls['educations'];
    this.jobNotificationFormGroup.controls[
      'minQualification'
    ].valueChanges.subscribe((value) => {
      if (value === 'Graduation' || value === 'Post Graduation') {
        educationsControl.setValidators(Validators.required);
        setTimeout(() => {
          this.educationInputSubscription = fromEvent<Event>(
            this.educationsInput.nativeElement,
            'input'
          )
            .pipe(
              debounceTime(300),
              map((event) => (event.target as HTMLInputElement)?.value),
              filter((value) => {
                if (value !== '') return true;
                this.filteredEducations = this.sampleLists.educations;
                return false;
              }),
              distinctUntilChanged(),
              switchMap((query) =>
                this.filtersService.getEducationFilters(query)
              )
            )
            .subscribe((res) => (this.filteredEducations = res));
        }, 100);
      } else {
        educationsControl.clearValidators();
        this.educationInputSubscription?.unsubscribe();
      }
    });
  }

  ngAfterViewInit(): void {
    this.categoryInputSubscription = fromEvent<Event>(
      this.categoryInput.nativeElement,
      'input'
    )
      .pipe(
        debounceTime(300),
        map((event) => (event.target as HTMLInputElement)?.value),
        filter((value) => {
          if (value !== '') return true;
          this.filteredCategories = this.sampleLists.categories;
          return false;
        }),
        distinctUntilChanged(),
        switchMap((query) => this.filtersService.getCategoryFilters(query))
      )
      .subscribe((res) => (this.filteredCategories = res));

    this.skillInputSubscription = fromEvent<Event>(
      this.skillsInput.nativeElement,
      'input'
    )
      .pipe(
        debounceTime(300),
        map((event) => (event.target as HTMLInputElement)?.value),
        filter((value) => {
          if (value !== '') return true;
          this.filteredSkills = this.sampleLists.skills;
          return false;
        }),
        distinctUntilChanged(),
        switchMap((query) => this.filtersService.getSkillsFilters(query))
      )
      .subscribe((res) => (this.filteredSkills = res));
  }

  displayFn(value: string) {
    return deslugify(value);
  }

  selectedSkill(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
    if (!this.skillsSelected.includes(value)) {
      this.skillsSelected.push(value);
      this.jobNotificationFormGroup.controls['skills'].setValue(
        this.skillsSelected
      );
    }
    this.skillsInput.nativeElement.value = '';
    this.filteredSkills = this.sampleLists.skills;
  }

  removedSkill(skill: string) {
    const index = this.skillsSelected.indexOf(skill);
    this.skillsSelected.splice(index, 1);
    this.jobNotificationFormGroup.controls['skills'].setValue(
      this.skillsSelected
    );
  }

  selectedEducation(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
    if (!this.educationsSelected.includes(value)) {
      this.educationsSelected.push(value);
      this.jobNotificationFormGroup.controls['educations'].setValue(
        this.educationsSelected
      );
    }
    this.educationsInput.nativeElement.value = '';
    this.filteredEducations = this.sampleLists.educations;
  }

  removedEducation(category: string) {
    const index = this.educationsSelected.indexOf(category);
    this.educationsSelected.splice(index, 1);
    this.jobNotificationFormGroup.controls['educations'].setValue(
      this.educationsSelected
    );
  }

  private isEducationError() {
    return ((this.jobNotificationFormGroup.controls['minQualification'].value ==
    'Graduation' ||
    this.jobNotificationFormGroup.controls['minQualification'].value ===
      'Post Graduation') &&
  this.educationsSelected.length == 0)
  }

  onSubmit() {
    if (this.jobNotificationFormGroup.valid && !this.isEducationError()) {
      this.dialog.close(this.jobNotificationFormGroup.value)
    } else if (this.jobNotificationFormGroup.controls['skills'].errors) {
      this.snackbarService.openSnackBar(
        'Please select skills required for this job'
      );
      // } else if (this.jobNotificationFormGroup.controls['educations'].errors) {
    } else if (this.isEducationError()) {
      this.snackbarService.openSnackBar(
        'Please select educations that can be used for this job'
      );
    }
  }

  ngOnDestroy(): void {
    this.skillInputSubscription?.unsubscribe();
    this.educationInputSubscription?.unsubscribe();
    this.categoryInputSubscription?.unsubscribe();
  }
}
