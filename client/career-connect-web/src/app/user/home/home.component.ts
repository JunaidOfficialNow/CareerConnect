import {Component, OnInit, inject} from '@angular/core';
import { HomeService, JobNotificationDoc } from './home.service';



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
