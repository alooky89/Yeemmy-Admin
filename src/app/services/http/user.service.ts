import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root',
})
export class UserService {


  constructor(private http:HttpClient) {
  }


  getMyProfile(){
    return this.http.get<any>(environment.backendURL+'api/user/me')
  }

  getEvents(){
    return this.http.get<any>(environment.backendURL+'api/user/events')
  }

  getChampions(){
    return this.http.get<any>(environment.backendURL+'api/user/champions')
  }

  getMatches(){
    return this.http.get<any>(environment.backendURL+'api/user/matches')
  }

  getMyCourts(){
    return this.http.get<any>(environment.backendURL+'api/user/court')
  }

  getAllCourts(){
    return this.http.get<any>(environment.backendURL+'api/user/court/all')
  }

  getAllClub(type:string){
    let params=new HttpParams().set('type',type)
    return this.http.get<any>(environment.backendURL+'api/user/club/all', {params})
  }


  getClubCourts(club_id,courtIDs?){

    let params=new HttpParams().set('court',courtIDs)
    return this.http.get<any>(environment.backendURL+'api/user/club/'+club_id+'/court', {params})
  }


  getCourtByID(id){
    return this.http.get<any>(environment.backendURL+'api/user/court/'+id)
  }

  saveMyProfile(payload){
    let formData = new FormData();
    for (const key in payload) {
      if (payload.hasOwnProperty(key)) {
        formData.append(key, payload[key]);
      }
    }
    return this.http.post(environment.backendURL+'api/user/me',formData)
  }

  getCourtReservation(court_id){
    return this.http.get<any>(environment.backendURL+'api/booking/court/'+court_id)
  }



  }
