import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {jwtDecode} from "jwt-decode";


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private user=new BehaviorSubject<any>(null);

  constructor(private http:HttpClient) {
  }


  public getAuthUser() {
    if(this.user.getValue())
      return this.user.getValue();
    else {
    let user= jwtDecode(localStorage.getItem('token'));
      this.user.next(user)
      return user;
    }

  }

  public setAuthUser(user){
    return this.user.next(user)
  }

  public logout(){
    this.user.next(null)

  }

  login(payload:any):Observable<any>{
    return this.http.post(environment.backendURL+'/auth/admin/login',payload)
  }


}
