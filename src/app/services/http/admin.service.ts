import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";


@Injectable()
export class AdminService {


  constructor(private http:HttpClient) {
  }


  getMyProfile(){
    return this.http.get<any>(environment.backendURL+'/user/me')
  }

  getEvents(){
    return this.http.get<any>(environment.backendURL+'/user/events')
  }

  getChampions(){
    return this.http.get<any>(environment.backendURL+'/user/champions')
  }

  getMatches(){
    return this.http.get<any>(environment.backendURL+'/user/matches')
  }

  getMyCourts(){
    return this.http.get<any>(environment.backendURL+'/user/court')
  }

  getAllCourts(){
    return this.http.get<any>(environment.backendURL+'/admin/court/all')
  }
  getAllBats(){
    return this.http.get<any>(environment.backendURL+'/admin/bat/all')
  }


  updateBat(data): Observable<any> {
    return this.http.patch<any>(environment.backendURL+'/admin/bat/'+data.id, {name:data.name});
  }

  addBat(data): Observable<any> {
    return this.http.post<any>(environment.backendURL+'/admin/bat', data);
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

  updateClub(id: number, clubData: FormData): Observable<any> {
    return this.http.patch<any>(environment.backendURL+'/admin/club/'+id, clubData);
  }

  deleteClub(id: number): Observable<any> {
    return this.http.delete<any>(environment.backendURL+'/admin/club/'+id);
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




  getClubCourts(club_id,courtIDs?){

    let params=new HttpParams().set('court',courtIDs)
    return this.http.get<any>(environment.backendURL+'/user/club/'+club_id+'/court', {params})
  }


  getCourtByID(id){
    return this.http.get<any>(environment.backendURL+'/user/court/'+id)
  }

  saveMyProfile(payload){
    let formData = new FormData();
    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(environment.backendURL+'/user/me',formData)
  }

  getCourtReservation(court_id){
    return this.http.get<any>(environment.backendURL+'/booking/court/'+court_id)
  }



}
