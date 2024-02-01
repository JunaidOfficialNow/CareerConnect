import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { InputFieldDialogComponent } from 'src/app/shared/input-field-dialog/input-field-dialog.component';
import { CategoriesService } from './categories.service';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { DeslugifyPipe } from 'src/app/shared/deslugify.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import {  MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, fromEvent, map, of, switchMap } from 'rxjs';


@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    MatTableModule,
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    CommonModule,
    DeslugifyPipe,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['categories', 'actions'];
  categoriesCount$ = this.categoriesService.count$.asObservable();
  dataSource$ = this.categoriesService.categories$.asObservable();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput') searchInput! : ElementRef;

  constructor(
    private dialog: MatDialog,
    private categoriesService: CategoriesService
  ) {}

  ngAfterViewInit(): void {
    fromEvent<Event>(this.searchInput.nativeElement, 'input').
    pipe(
      debounceTime(300),
      map((event: Event) => (event.target as HTMLInputElement)?.value ),
      distinctUntilChanged(),
      switchMap(() => of(this.categoriesService.getPaginatedResults(1, this.paginator.pageSize, this.searchInput.nativeElement.value)))
    ).subscribe()
  }

  ngOnInit(): void {
    this.categoriesService.getPaginatedResults(1, 10, '');
  }

  clearFilter() {
    this.searchInput.nativeElement.value = '';
    this.categoriesService.getPaginatedResults(1, 10, '');
  }

  handlePageEvent(e: PageEvent) {
    this.categoriesService.getPaginatedResults(e.pageIndex + 1, e.pageSize, this.searchInput.nativeElement.value);
  }

  openAddNewCategoryDialog() {
    const dialogRef = this.dialog.open(InputFieldDialogComponent, {
      data: {
        title: 'Add New Category',
        label: 'New Category',
        placeholder: 'Eg: Research',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoriesService
          .createNewCategory(
            result,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            this.searchInput.nativeElement.value
          )
          .subscribe();
      }
    });
  }

  deleteCategory(id: string) {
    this.categoriesService
      .deleteCategory(id, this.paginator.pageIndex + 1, this.paginator.pageSize, this.searchInput.nativeElement.value)
      .subscribe();
  }
}
