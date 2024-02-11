import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { InputFieldDialogComponent } from 'src/app/shared/input-field-dialog/input-field-dialog.component';
import { EducationsService } from './educations.service';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import {  DeslugifyPipeModule } from 'src/app/shared/deslugify.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, fromEvent, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-educations',
  standalone: true,
  imports: [
    MatTableModule,
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule,
    DeslugifyPipeModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './educations.component.html',
  styleUrl: './educations.component.css'
})
export class EducationsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['educations', 'actions'];
  educationsCount$ = this.educationsService.count$.asObservable();
  dataSource$ = this.educationsService.educations$.asObservable();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput') searchInput! : ElementRef;

  constructor(
    private dialog: MatDialog,
    private educationsService: EducationsService
  ) {}

  ngAfterViewInit(): void {
    fromEvent<Event>(this.searchInput.nativeElement, 'input').
    pipe(
      debounceTime(300),
      map((event: Event) => (event.target as HTMLInputElement)?.value ),
      distinctUntilChanged(),
      switchMap(() => of(this.educationsService.getPaginatedResults(1, this.paginator.pageSize, this.searchInput.nativeElement.value)))
    ).subscribe()
  }

  ngOnInit(): void {
    this.educationsService.getPaginatedResults(1, 10, '');
  }

  clearFilter() {
    this.searchInput.nativeElement.value = '';
    this.educationsService.getPaginatedResults(1, 10, '');
  }

  handlePageEvent(e: PageEvent) {
    this.educationsService.getPaginatedResults(e.pageIndex + 1, e.pageSize, this.searchInput.nativeElement.value);
  }

  openAddNewEducationDialog() {
    const dialogRef = this.dialog.open(InputFieldDialogComponent, {
      data: {
        title: 'Add New Education',
        label: 'New Education',
        placeholder: 'Eg: Bsc Mathematics and physics',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.educationsService
          .createNewEducation(
            result,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            this.searchInput.nativeElement.value
          )
          .subscribe();
      }
    });
  }

  deleteEducation(id: string) {
    this.educationsService
      .deleteEducation(id, this.paginator.pageIndex + 1, this.paginator.pageSize, this.searchInput.nativeElement.value)
      .subscribe();
  }

}
