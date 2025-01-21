import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message:string,panelClass:string) {
    this.snackBar.open(message, undefined, {
      duration: 5 * 1000,
      panelClass: panelClass,
    });
    
  }
}
