import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, filter, fromEvent, map, switchMap } from 'rxjs';
import { ISampleLists } from 'src/app/shared/SampleLists.interface';
import { EditJObPreferenceService } from './edit-job-preference.service';
import { Auth } from '@angular/fire/auth';
import { FiltersService } from 'src/app/shared/http/filters.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDoc } from 'src/app/shared/userDoc.interface';
import { deslugify } from 'src/app/shared/deslugify';
import { MatChipInputEvent } from '@angular/material/chips';
import { slugify } from 'src/app/shared/slugify';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-edit-job-preference',
  templateUrl: './edit-job-preference.component.html',
  styleUrl: './edit-job-preference.component.css'
})
export class EditJobPreferenceComponent {
  userId = this.data._id
  jobPreferenceFormGroup = this._formBuilder.group({
    highestEducation: [this.data.highestEducation, Validators.required],
    course: this.data.course,
    remoteJob: this.data.jobPreferences?.remoteJob,
    OnSiteJob: this.data.jobPreferences?.remoteJob,
    HybridJob: this.data.jobPreferences?.HybridJob,
    govtJob: this.data.jobPreferences?.govtJob,
    nonGovtJob: this.data.jobPreferences?.nonGovtJob,
    skills: [this.data.skills!],
    categoriesInterested: [this.data.jobPreferences?.categoriesInterested!],
  });
  separatorKeysCodes = [ENTER, COMMA];
  qualifications = [
    'High School',
    'SSLC',
    'Higher Secondary',
    'Graduation',
    'Post Graduation',
  ];

  sampleLists: ISampleLists = {} as ISampleLists;
  skillsSelected: string[] =  this.data.skills
  categoriesSelected: string[] = this.data.jobPreferences?.categoriesInterested!

  filteredCategories: { category: string }[] = [];
  filteredSkills: { skill: string }[] = [];
  filteredEducations: { education: string }[] = [];

  @ViewChild('categoryInput') categoryInput!: ElementRef;
  @ViewChild('skillsInput') skillsInput!: ElementRef;
  @ViewChild('educationsInput') educationsInput!: ElementRef;

  educationInputSubscription!: Subscription;
  skillInputSubscription!: Subscription;
  categoryInputSubscription!: Subscription;

  ngOnInit(): void {
    console.log(this.data)
    console.log(this.skillsSelected, this.categoriesSelected)
    this.filtersService.getSampleLists().subscribe((res) => {
      this.sampleLists = res;
      this.filteredCategories = this.sampleLists.categories;
      this.filteredSkills = this.sampleLists.skills;
      this.filteredEducations = this.sampleLists.educations;
    });
    const courseControl = this.jobPreferenceFormGroup.controls['course'];
    this.jobPreferenceFormGroup.controls[
      'highestEducation'
    ].valueChanges.subscribe((value) => {
      if (value === 'Graduation' || value === 'Post Graduation') {
        courseControl.setValidators(Validators.required);
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
        courseControl.clearValidators();
        this.educationInputSubscription?.unsubscribe();
      }
    });
  }

  constructor(
    private _formBuilder: FormBuilder,
    private registerService: EditJObPreferenceService,
    private auth: Auth,
    private filtersService: FiltersService,
    private snackBar: SnackbarService,
    private matDialogRef: MatDialogRef<EditJobPreferenceComponent>,
   @Inject(MAT_DIALOG_DATA) private data: UserDoc,
  ) {}
  ngOnDestroy(): void {
    this.skillInputSubscription?.unsubscribe();
    this.educationInputSubscription?.unsubscribe();
    this.categoryInputSubscription?.unsubscribe();
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

  onJobPreferenceFormSubmit() {
    if (this.jobPreferenceFormGroup.valid && this.userId) {
      const result = {
        highestEducation:
          this.jobPreferenceFormGroup.value['highestEducation']!,
        skills: this.jobPreferenceFormGroup.value['skills']!,
        categoriesInterested:
          this.jobPreferenceFormGroup.value['categoriesInterested']!,
        course: this.jobPreferenceFormGroup.value['course'],
        remoteJob: this.jobPreferenceFormGroup.value['remoteJob']!,
        HybridJob: this.jobPreferenceFormGroup.value['HybridJob']!,
        govtJob: this.jobPreferenceFormGroup.value['govtJob']!,
        nonGovtJob: this.jobPreferenceFormGroup.value['nonGovtJob']!,
        OnSiteJob: this.jobPreferenceFormGroup.value['OnSiteJob']!,
      }
      this.registerService
        .updateJobPreferences(this.userId, result)
        .subscribe(() => this.matDialogRef.close(result));
    }
  }

  displayFn(value: string) {
    return deslugify(value);
  }

  addSkillFromInput(event: MatChipInputEvent) {
    const value = slugify(event.value || '');
    if (value && !this.skillsSelected.includes(value)) {
      this.skillsSelected.push(value);
      this.jobPreferenceFormGroup.controls['skills'].setValue(
        this.skillsSelected
      );
    }
    event.chipInput.clear();
  }

  selectedCategory(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
    if (!this.categoriesSelected.includes(value)) {
      this.categoriesSelected.push(value);
      this.jobPreferenceFormGroup.controls['categoriesInterested'].setValue(
        this.categoriesSelected
      );
    }
    this.categoryInput.nativeElement.value = '';
    this.filteredCategories = this.sampleLists.categories;
  }

  selectedSkill(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
    if (!this.skillsSelected.includes(value)) {
      this.skillsSelected.push(value);
      this.jobPreferenceFormGroup.controls['skills'].setValue(
        this.skillsSelected
      );
    }
    this.skillsInput.nativeElement.value = '';
    this.filteredSkills = this.sampleLists.skills;
  }

  removedCategory(category: string) {
    const index = this.categoriesSelected.indexOf(category);
    this.categoriesSelected.splice(index, 1);
    this.jobPreferenceFormGroup.controls['categoriesInterested'].setValue(
      this.categoriesSelected
    );
  }

  removedSkill(skill: string) {
    const index = this.skillsSelected.indexOf(skill);
    this.skillsSelected.splice(index, 1);
    this.jobPreferenceFormGroup.controls['skills'].setValue(
      this.skillsSelected
    );
  }

}
