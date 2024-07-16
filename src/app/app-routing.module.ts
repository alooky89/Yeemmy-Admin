import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./views/auth/login/login.component";
import {AdminComponent} from "./views/admin/admin.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path:'admin',
    loadChildren:()=>import('./views/admin/admin.module').then(m=>m.AdminModule),
   // canActivateChild: [RoleGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
