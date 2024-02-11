import { Injectable } from "@angular/core";
import { MatSnackBar} from '@angular/material/snack-bar'

@Injectable({providedIn: 'root'})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(msg: string, action?: string) {
    this.snackBar.open(msg, action ||'close', {
      duration: 4000,
      direction: 'ltr',
      horizontalPosition: 'center',
      verticalPosition: 'top',
    })
  }
}