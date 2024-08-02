import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from "./admin.component";
import {ClubComponent} from "./sport/club/club.component";
import {CourtComponent} from "./sport/court/court.component";
import {UserComponent} from "./sport/user/user.component";
import {BatBrandComponent} from "./sport/bat-brand/bat-brand.component";

const routes: Routes = [
  {path: '',
    component: AdminComponent,
    children: [
      {path:'club',
      component:ClubComponent},
      {path:'court',
      component:CourtComponent},
      {path:'batbrand',
      component:BatBrandComponent},
      {path:'user',
      component:UserComponent},


    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
