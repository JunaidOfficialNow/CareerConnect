import {Component} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { InputFieldDialogComponent } from 'src/app/shared/input-field-dialog/input-field-dialog.component';

const ELEMENT_DATA = [
  {name: 'Hydrogen', actions: 'helo'},
  {name: 'Helium',actions: 'hi'},

];


@Component({
  selector: 'app-admin-skills',
  templateUrl: 'skills.component.html',
  styleUrls: ['skills.component.css'],
  standalone: true,
  imports: [MatTableModule, MatRippleModule, MatButtonModule, MatIconModule],
})
export class SkillsComponent {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = ELEMENT_DATA;

  constructor(private dialog: MatDialog) {}


  openAddNewSkillDialog() {
    const dialogRef = this.dialog.open(InputFieldDialogComponent, {data: {title: 'Add New Skill', label: 'New skill', placeholder:  'Eg: Angular'}})
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        
      }
    })

  }
}