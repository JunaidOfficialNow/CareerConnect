import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { AddNotificationDialogComponent } from './add-notification-dialog/add-notification-dialog.component';
import { JobNotificationService } from './notification.service';
import { JobNotificationDto } from './JobNotification.interface';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  of,
  switchMap,
} from 'rxjs';
import { JobNotificationDoc } from 'src/app/shared/jobNotification.interface';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-admin-notifications',
  styleUrls: ['notifications.component.css'],
  templateUrl: 'notifications.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class NotificationsComponent {
  columnsToDisplay = [
    'title',
    'company/dept',
    'location',
    'category',
    'createdAt',
    'deadline',
    'label',
    'actions',
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: JobNotificationDoc | null = null;

  constructor(
    private dialog: MatDialog,
    private jobNotificationService: JobNotificationService
  ) {}

  dataSource$ = this.jobNotificationService.jobNotifications$.asObservable();
  jobNotificationsCount$ = this.jobNotificationService.count$.asObservable();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    fromEvent<Event>(this.searchInput.nativeElement, 'input')
      .pipe(
        debounceTime(300),
        map((event: Event) => (event.target as HTMLInputElement).value),
        distinctUntilChanged(),
        switchMap((query) =>
          of(
            this.jobNotificationService.getPaginatedResults(
              1,
              this.paginator.pageSize,
              query,
              this.sort.direction
            )
          )
        )
      )
      .subscribe();
  }

  handleSortChange(sortState: Sort) {
    this.jobNotificationService.getPaginatedResults(
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      this.searchInput.nativeElement.value,
      sortState.direction
    );
  }

  isExpired(date: string) {
    const deadline = new Date(date);

    return deadline < new Date();
  }

  ngOnInit() {
    this.jobNotificationService.getPaginatedResults(
      1,
      10,
      '',
      this.sort.direction
    );
  }

  clearFilter() {
    this.searchInput.nativeElement.value = '';
    this.jobNotificationService.getPaginatedResults(
      1,
      10,
      '',
      this.sort.direction
    );
  }

  handlePageEvent(e: PageEvent) {
    this.jobNotificationService.getPaginatedResults(
      e.pageIndex + 1,
      e.pageSize,
      this.searchInput.nativeElement.value,
      this.sort.direction
    );
  }

  OpenAddNewNotificationDialog() {
    this.dialog
      .open<AddNotificationDialogComponent, null, JobNotificationDto>(
        AddNotificationDialogComponent,
        { disableClose: true }
      )
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.jobNotificationService
            .addNewJobNotification(
              res,
              this.paginator.pageIndex + 1,
              this.paginator.pageSize,
              this.searchInput.nativeElement.value,
              this.sort.direction
            )
            .subscribe();
        }
      });
  }

  deleteJobNotification(id: string) {
    this.jobNotificationService
      .deleteJobNotification(
        id,
        this.paginator.pageIndex + 1,
        this.paginator.pageSize,
        this.searchInput.nativeElement.value,
        this.sort.direction
      )
      .subscribe();
  }
}
