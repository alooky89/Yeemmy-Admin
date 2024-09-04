import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";


@Injectable()
export class AdminService {


  constructor(private http:HttpClient) {
  }


  getAllCategories(){
    return this.http.get<any>(environment.backendURL+'/admin/category/all')
  }

  getAllCourts(){
    return this.http.get<any>(environment.backendURL+'/admin/court/all')
  }
  getAllBats(){
    return this.http.get<any>(environment.backendURL+'/admin/bat/all')
  }
  getAllTransactions(){
    return this.http.get<any>(environment.backendURL+'/admin/transactions')
  }

  getFees(){
    return this.http.get<any>(environment.backendURL+'/admin/fees')
  }

  createAccount(user){
    return this.http.post<any>(environment.backendURL+'/admin/account',{user})
  }

  AdminPayUser(payload){
    return this.http.post<any>(environment.backendURL+'/admin/account/pay',payload)
  }
  getAllWallet(){
    return this.http.get<any>(environment.backendURL+'/admin/wallet')
  }


  updateBat(data): Observable<any> {
    return this.http.patch<any>(environment.backendURL+'/admin/bat/'+data.id, {name:data.name});
  }

  updateFees(data): Observable<any> {
    return this.http.patch<any>(environment.backendURL+'/admin/fees/'+data.id, data);
  }

  createPricing(data): Observable<any> {
    return this.http.post<any>(environment.backendURL+'/admin/pricing', data);
  }

  addBat(data): Observable<any> {
    return this.http.post<any>(environment.backendURL+'/admin/bat', data);
  }


  updateCategory(data): Observable<any> {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    return this.http.patch<any>(environment.backendURL+'/admin/category/'+data.id, formData);
  }

  addCategory(data): Observable<any> {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    return this.http.post<any>(environment.backendURL+'/admin/category', formData);
  }




  createCourt(courtData): Observable<any> {
    const formData = new FormData();
    for (const key in courtData) {
      if (courtData.hasOwnProperty(key)) {
        formData.append(key, courtData[key]);
      }
    }
    return this.http.post<any>(environment.backendURL+'/admin/court', formData);
  }

  updateCourt(courtData): Observable<any> {
    const formData = new FormData();
    for (const key in courtData) {
      if (courtData.hasOwnProperty(key)) {
        formData.append(key, courtData[key]);
      }
    }
    return this.http.patch<any>(environment.backendURL+'/admin/court/'+courtData.id, formData);
  }


  deleteCourt(id: number): Observable<any> {
    return this.http.delete<any>(environment.backendURL+'/admin/court/'+id);
  }

  deleteBat(id: number): Observable<any> {
    return this.http.delete<any>(environment.backendURL+'/admin/bat/'+id);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(environment.backendURL+'/admin/category/'+id);
  }



  getAllClub(){
    return this.http.get<any>(environment.backendURL+'/admin/club/all')
  }

  createClub(courtData): Observable<any> {
    const formData = new FormData();
    for (const key in courtData) {
      if (courtData.hasOwnProperty(key)) {
        formData.append(key, courtData[key]);
      }
    }
    return this.http.post<any>(environment.backendURL+'/admin/club', formData);
  }

  updateClub(clubData): Observable<any> {
    let formData = new FormData();
    for (const key in clubData) {
      if (clubData.hasOwnProperty(key)) {
        formData.append(key, clubData[key]);
      }
    }
    return this.http.patch<any>(environment.backendURL+'/admin/club/'+clubData.id, formData);
  }

  deleteClub(id: number): Observable<any> {
    return this.http.delete<any>(environment.backendURL+'/admin/club/'+id);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(environment.backendURL+'/admin/transactions/'+id);
  }

  getAllUsers(){
    return this.http.get<any>(environment.backendURL+'/admin/user/all')
  }

  createUser(userData): Observable<any> {
    const formData = new FormData();
    for (const key in userData) {
      if (userData.hasOwnProperty(key)) {
        formData.append(key, userData[key]);
      }
    }
    return this.http.post<any>(environment.backendURL+'/admin/user', formData);
  }

  updateUser(userData): Observable<any> {
    const formData = new FormData();
    for (const key in userData) {
      if (userData.hasOwnProperty(key)) {
        formData.append(key, userData[key]);
      }
    }
    return this.http.patch<any>(environment.backendURL+'/admin/user/'+userData.id, formData);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(environment.backendURL+'/admin/user/'+id);
  }



}
