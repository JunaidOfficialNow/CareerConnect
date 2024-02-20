import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { HomeService } from './home.service';
import { JobNotificationDoc } from 'src/app/shared/jobNotification.interface';
import { MatDialog } from '@angular/material/dialog';
import {
  EditProfileComponent,
  EditProfileUserData,
} from '../edit-profile/edit-profile.component';
import { UserDoc } from 'src/app/shared/userDoc.interface';
import { UserDto } from 'src/app/shared/UserDto.interface';
import { EditJobPreferenceComponent } from '../edit-job-preference/edit-job-preference.component';
import { UpdateJobPreferenceDTO } from 'src/app/shared/updateJobPreference.Dto.interface';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  homeService = inject(HomeService);
  dialog = inject(MatDialog);
  auth = inject(Auth);
  router = inject(Router);


  jobNotifications: JobNotificationDoc[] = [];
  currUser!: UserDoc;
  name = ''


  searchControl = new FormControl('');
  options: string[] = []




  ngOnInit(): void {
   this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    tap((value) => {
      if  (value === '') {
       this.homeService.getJobNotifications().subscribe(res => this.jobNotifications = res);
      }
    }),
    switchMap((query) => this.homeService.getSearchSuggestions(query!))
  )
  .subscribe((res) => (this.options = res));

    this.homeService
      .getJobNotifications()
      .subscribe((res) => (this.jobNotifications = res));
    this.homeService
      .getCurrentUserData()
      .subscribe((res) => (this.currUser = res, this.name = this.currUser.name));
  }
 
  onSelection(event: MatAutocompleteSelectedEvent) {
    this.homeService.getJobNotifications(event.option.value).subscribe((res) => this.jobNotifications = res);
  }

  clearFilter() {
    this.searchControl.setValue('');
  }

  openEditProfileDialog() {
    this.dialog
      .open<EditProfileComponent, EditProfileUserData, UserDto>(
        EditProfileComponent,
        {
          data: {
            id: this.currUser?._id,
            name: this.currUser?.name,
            email: this.currUser?.email,
            age: this.currUser?.age,
            phoneNumber: this.currUser?.phoneNumber,
          },
        }
      )
      .afterClosed()
      .subscribe((data) => {
        (this.currUser.name = data?.name!),
          (this.currUser.age = data?.age!),
          (this.currUser.phoneNumber = data?.phoneNumber!);
      });
  }

  onOpenUpdateJobPreferenceDialog() {
    this.dialog
      .open<EditJobPreferenceComponent, UserDoc, UpdateJobPreferenceDTO>(
        EditJobPreferenceComponent,
        { data: this.currUser }
      )
      .afterClosed()
      .subscribe((res) => {
        this.currUser.course = res?.course!;
        this.currUser.highestEducation = res?.highestEducation!;
        this.currUser.jobPreferences!.HybridJob = res?.HybridJob!;
        this.currUser.jobPreferences!.OnSiteJob = res?.OnSiteJob!;
        this.currUser.jobPreferences!.categoriesInterested =
          res?.categoriesInterested!;
        this.currUser.jobPreferences!.govtJob = res?.govtJob!;
        this.currUser.jobPreferences!.nonGovtJob = res?.nonGovtJob!;
        this.currUser.jobPreferences!.remoteJob = res?.remoteJob!;
        this.currUser.skills = res?.skills!;
      });
  }

  logout() {
    this.auth.signOut()
    .then(() => this.router.navigateByUrl('/auth'));
  }
}
