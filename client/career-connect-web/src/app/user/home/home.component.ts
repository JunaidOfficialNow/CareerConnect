import { Component, OnInit, inject } from '@angular/core';
import { HomeService } from './home.service';
import { JobNotificationDoc } from 'src/app/shared/jobNotification.interface';
import { MatDialog } from '@angular/material/dialog';
import {
  EditProfileComponent,
  EditProfileUserData,
} from '../edit-profile/edit-profile.component';
import { UserDoc } from 'src/app/shared/userDoc.interface';
import { UserDto } from 'src/app/shared/UserDto.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  homeService = inject(HomeService);
  dialog = inject(MatDialog);

  jobNotifications: JobNotificationDoc[] = [];
  currUser!: UserDoc;

  ngOnInit(): void {
    this.homeService
      .getJobNotifications()
      .subscribe((res) => (this.jobNotifications = res));
    this.homeService
      .getCurrentUserData()
      .subscribe((res) => (this.currUser = res));
  }

  openEditProfileDialog() {
    this.dialog.open<EditProfileComponent, EditProfileUserData, UserDto>(
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
    ).afterClosed().subscribe((data) => {
      this.currUser.name = data?.name!,
      this.currUser.age = data?.age!,
      this.currUser.phoneNumber =  data?.phoneNumber!
    });
  }
}
