import {Component, OnInit, inject} from '@angular/core';
import { HomeService } from './home.service';
import { JobNotificationDoc } from 'src/app/shared/jobNotification.interface';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  homeService = inject(HomeService);

  jobNotifications: JobNotificationDoc[] = [];

  ngOnInit(): void {
    this.homeService.getJobNotifications().subscribe((res) => this.jobNotifications = res);
  }

}
