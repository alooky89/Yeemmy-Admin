import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";


@Injectable()
export class HttpInterceptor implements HttpInterceptor {
  constructor(private _snackBar: MatSnackBar,private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = localStorage.getItem('token')
    if (token)
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

    return next.handle(req).pipe(catchError(error=>{
      if(error.status==401) {
        localStorage.clear()
        this.router.navigate(['/login'])
      }else
        this._snackBar.open(error.error.message,null,{duration:2000})
      return of(error)
    }))


  }
}
