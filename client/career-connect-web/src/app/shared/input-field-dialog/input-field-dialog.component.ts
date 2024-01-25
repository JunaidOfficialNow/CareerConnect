import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input'

export interface DialogData {
  title: string;
  label: string;
  placeholder: string;
}

@Component({
  selector: 'app-input-field-dialog',
  standalone: true,
  templateUrl: './input-field-dialog.component.html',
  styleUrl: './input-field-dialog.component.css',
  imports: [MatFormFieldModule, MatButtonModule, MatDialogModule, MatInputModule, FormsModule]
})
export class InputFieldDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
  private dialogRef: MatDialogRef<InputFieldDialogComponent>
  ) {}

  onSubmit(form: NgForm) {
    if (form.valid)  this.dialogRef.close(form.value['input']);
  }

}
