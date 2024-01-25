import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-notification-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './add-notification-dialog.component.html',
  styleUrl: './add-notification-dialog.component.css'
})
export class AddNotificationDialogComponent {

}
