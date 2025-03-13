import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ErrorDialogConfig {
  isOpen: boolean;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {
  private errorDialog = new BehaviorSubject<ErrorDialogConfig>({
    isOpen: false,
    title: '',
    message: ''
  });

  getErrorDialog() {
    return this.errorDialog.asObservable();
  }

  showError(title: string, message: string) {
    this.errorDialog.next({
      isOpen: true,
      title,
      message
    });
  }

  closeError() {
    this.errorDialog.next({
      isOpen: false,
      title: '',
      message: ''
    });
  }
} 