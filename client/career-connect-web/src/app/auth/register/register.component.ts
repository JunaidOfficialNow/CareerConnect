import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { passwordMatchValidator } from './passwordMatch.validator';
import { RegisterService } from './register.service';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { MatStepper } from '@angular/material/stepper';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER} from '@angular/cdk/keycodes';
import { Subscription, debounceTime, distinctUntilChanged, filter, fromEvent, map, switchMap } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { slugify } from 'src/app/shared/slugify';
import { deslugify } from 'src/app/shared/deslugify';
import { Router } from '@angular/router';
import { ISampleLists } from 'src/app/shared/SampleLists.interface';
import { FiltersService } from 'src/app/shared/http/filters.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  userId: string | null = null;
  basicDetailsFormGroup = this._formBuilder.group(
    {
      name: ['', Validators.required],
      email: ['', Validators.required],
      age: ['', Validators.required],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('[6-9]\\d{9}')],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );
  
  jobPreferenceFormGroup = this._formBuilder.group({
    highestEducation: ['', Validators.required],
    course: '',
    remoteJob: false,
    OnSiteJob: false,
    HybridJob: false,
    govtJob: false,
    nonGovtJob: false,
    skills: [([] as string[])],
    categoriesInterested: [([] as string[])],
  });
  separatorKeysCodes = [ENTER,COMMA]
  qualifications = ['High School', 'SSLC', 'Higher Secondary', 'Graduation', 'Post Graduation'];

  sampleLists: ISampleLists  = {} as ISampleLists
  skillsSelected: string[] = [];
  categoriesSelected: string[] = [];

  filteredCategories: { category: string}[] = [];
  filteredSkills: {skill: string} [] = [];
  filteredEducations: {education: string}[] = [];

  @ViewChild(MatStepper) stepper! : MatStepper
  @ViewChild('categoryInput') categoryInput! : ElementRef
  @ViewChild('skillsInput') skillsInput! : ElementRef
  @ViewChild('educationsInput') educationsInput! : ElementRef

  educationInputSubscription! : Subscription
  skillInputSubscription! : Subscription
  categoryInputSubscription! : Subscription

  ngOnInit(): void {
    this.filtersService.getSampleLists().subscribe((res) => {
      this.sampleLists = res;
      this.filteredCategories = this.sampleLists.categories;
      this.filteredSkills = this.sampleLists.skills;
      this.filteredEducations = this.sampleLists.educations;
    })
    const courseControl  = this.jobPreferenceFormGroup.controls['course'];
      this.jobPreferenceFormGroup.controls['highestEducation'].valueChanges.subscribe((value) => {
        if (value === 'Graduation' || value === 'Post Graduation') {
           courseControl.setValidators(Validators.required)
           setTimeout(() => {
           this.educationInputSubscription =  fromEvent<Event>(this.educationsInput.nativeElement, 'input')
            .pipe(
              debounceTime(300),
              map((event) => (event.target as HTMLInputElement)?.value),
              filter((value) => {
                if (value !== '') return true;
                this.filteredEducations = this.sampleLists.educations
                return  false;
              }),
              distinctUntilChanged(),
              switchMap((query) => this.filtersService.getEducationFilters(query))
            ).subscribe((res) => this.filteredEducations = res);
           }, 100)

        } else {
          courseControl.clearValidators();
          this.educationInputSubscription?.unsubscribe();
        }
      })
  }

  constructor(
    private _formBuilder: FormBuilder,
    private registerService: RegisterService,
    private auth: Auth,
    private router: Router,
    private filtersService: FiltersService 
  ) {}
  ngOnDestroy(): void {
    this.skillInputSubscription?.unsubscribe();
    this.educationInputSubscription?.unsubscribe();
    this.categoryInputSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
   this.categoryInputSubscription =  fromEvent<Event>(this.categoryInput.nativeElement, 'input')
    .pipe(
      debounceTime(300),
      map((event) => (event.target as HTMLInputElement)?.value),
      filter((value) => {
        if (value !== '') return true;
        this.filteredCategories = this.sampleLists.categories
        return  false;
      }),
      distinctUntilChanged(),
      switchMap((query) => this.filtersService.getCategoryFilters(query))
    ).subscribe((res) => this.filteredCategories = res);

   this.skillInputSubscription = fromEvent<Event>(this.skillsInput.nativeElement, 'input')
    .pipe(
      debounceTime(300),
      map((event) => (event.target as HTMLInputElement)?.value),
      filter((value) => {
        if (value !== '') return true;
        this.filteredSkills = this.sampleLists.skills
        return  false;
      }),
      distinctUntilChanged(),
      switchMap((query) => this.filtersService.getSkillsFilters(query))
    ).subscribe((res) => this.filteredSkills = res);

  }

  onJobPreferenceFormSubmit() {
    if (this.jobPreferenceFormGroup.valid && this.userId) {
      this.registerService.updateJobPreferences(this.userId, 
        {
          highestEducation: this.jobPreferenceFormGroup.value['highestEducation']!,
          skills: this.jobPreferenceFormGroup.value['skills']!,
          categoriesInterested: this.jobPreferenceFormGroup.value['categoriesInterested']!,
          course: this.jobPreferenceFormGroup.value['course'],
          remoteJob: this.jobPreferenceFormGroup.value['remoteJob']!,
          HybridJob: this.jobPreferenceFormGroup.value['HybridJob']!,
          govtJob: this.jobPreferenceFormGroup.value['govtJob']!,
          nonGovtJob: this.jobPreferenceFormGroup.value['nonGovtJob']!,
          OnSiteJob: this.jobPreferenceFormGroup.value['OnSiteJob']!,
        }
        ).subscribe(() => this.stepper.next());
    }
  }

  displayFn(value: string) {
    return deslugify(value);
  }

  addSkillFromInput(event: MatChipInputEvent) {
    const value = slugify((event.value || ''));
    if (value && !this.skillsSelected.includes(value)) {
      this.skillsSelected.push(value);
      this.jobPreferenceFormGroup.controls['skills'].setValue(this.skillsSelected);
    }
    event.chipInput.clear();

  }


  selectedCategory(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value
    if (!this.categoriesSelected.includes(value)) {
      this.categoriesSelected.push(value)
      this.jobPreferenceFormGroup.controls['categoriesInterested'].setValue(this.categoriesSelected)
    }
    this.categoryInput.nativeElement.value = '';
    this.filteredCategories = this.sampleLists.categories;
  }

  selectedSkill(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value
    if (!this.skillsSelected.includes(value)) {
      this.skillsSelected.push(value)
      this.jobPreferenceFormGroup.controls['skills'].setValue(this.skillsSelected)
    }
    this.skillsInput.nativeElement.value = '';
    this.filteredSkills = this.sampleLists.skills;
  }


  removedCategory(category: string) {
    const index = this.categoriesSelected.indexOf(category);
    this.categoriesSelected.splice(index, 1);
    this.jobPreferenceFormGroup.controls['categoriesInterested'].setValue(this.categoriesSelected);
  }
  

  removedSkill(skill: string) {
    const index = this.skillsSelected.indexOf(skill);
    this.skillsSelected.splice(index, 1);
    this.jobPreferenceFormGroup.controls['skills'].setValue(this.skillsSelected);
  }

  onBasicDetailsFormSubmit() {
    if (this.basicDetailsFormGroup.valid) {
      this.registerService
        .createNewUser({
          name: this.basicDetailsFormGroup.value['name']!,
          age: this.basicDetailsFormGroup.value['age']!,
          phoneNumber: this.basicDetailsFormGroup.value['phoneNumber']!,
          email: this.basicDetailsFormGroup.value['email']!,
        })
        .subscribe((res) => {
          this.userId = res._id;
          createUserWithEmailAndPassword(
            this.auth,
            this.basicDetailsFormGroup.value['email']!,
            this.basicDetailsFormGroup.value['password']!
          ).then(() => {
            this.stepper.next();
          });
        });
    }
  }
  goToHome() {
    this.router.navigateByUrl('/home');
  }
}
