import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableModule } from '@angular/material/table';
import { InputFieldDialogComponent } from 'src/app/shared/input-field-dialog/input-field-dialog.component';
import { SkilllsService } from './skillls.service';
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
  selector: 'app-admin-skills',
  templateUrl: 'skills.component.html',
  styleUrls: ['skills.component.css'],
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
})
export class SkillsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['skill', 'actions'];
  skillsCount: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('searchInput') searchInput! : ElementRef;

  constructor(
    private dialog: MatDialog,
    private skillService: SkilllsService
  ) {}
  ngAfterViewInit(): void {
    fromEvent<Event>(this.searchInput.nativeElement, 'input').
    pipe(
      debounceTime(300),
      map((event: Event) => (event.target as HTMLInputElement)?.value ),
      distinctUntilChanged(),
      switchMap((query) => of(this.searchInput.nativeElement.value))
    ).subscribe((results) => console.log(results))
  }
  dataSource$ = this.skillService.skills.asObservable();

  ngOnInit(): void {
    this.skillService
      .getSkillsCount()
      .subscribe((res) => (this.skillsCount = res.count));
    this.skillService.getPaginatedResults(1, 10);
  }

  handlePageEvent(e: PageEvent) {
    this.skillService.getPaginatedResults(e.pageIndex + 1, e.pageSize);
  }

  openAddNewSkillDialog() {
    const dialogRef = this.dialog.open(InputFieldDialogComponent, {
      data: {
        title: 'Add New Skill',
        label: 'New skill',
        placeholder: 'Eg: Angular',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.skillService
          .createNewSkill(
            result,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          )
          .subscribe(() => this.skillsCount++);
      }
    });
  }

  applyFilter(e : Event) {

  }
 
  deleteSkill(id: string) {
    this.skillService
      .deleteSkill(id, this.paginator.pageIndex + 1, this.paginator.pageSize)
      .subscribe(() => this.skillsCount--);
  }
}
