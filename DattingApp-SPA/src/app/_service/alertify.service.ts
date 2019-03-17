import { Injectable } from '@angular/core';
import alertify from 'alertifyjs';
// declare var alertify: any ;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
  constructor() {}
  confirm(message: string, okCallBack: () => any) {
    alertify.confirm(message, function(e) {
      if (e) {
        okCallBack();
      } else {
      }
    });
  }

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }
}
