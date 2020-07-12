import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error/error.component';

@Injectable()
export class ErrorInterCeptor implements HttpInterceptor {

    constructor(private dialog: MatDialog){}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse)=>{
          let errorMessage = 'An unkwon error occured!';
          if(error.error.message) {
            errorMessage = error.error.message;
          }
          this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
          //console.log(error.error.message);
          //alert(error.error.message);
          return throwError(error);
        })
      );
    }
}
