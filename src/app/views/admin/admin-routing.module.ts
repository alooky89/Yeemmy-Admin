import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from "./admin.component";
import {ClubComponent} from "./sport/club/club.component";
import {CourtComponent} from "./sport/court/court.component";
import {UserComponent} from "./sport/user/user.component";
import {BatBrandComponent} from "./sport/bat-brand/bat-brand.component";
import {CategoriesComponent} from "./sport/categories/categories.component";
import {TransactionsComponent} from "./bookings/transactions/transactions.component";
import {WalletComponent} from "./bookings/wallet/wallet.component";
import {FeesComponent} from "./bookings/fees/fees.component";

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'club',
        component: ClubComponent
      },
      {
        path: 'court',
        component: CourtComponent
      },
      {
        path: 'batbrand',
        component: BatBrandComponent
      },
      {
        path: 'user',
        component: UserComponent
      },
      {
        path: 'categories',
        component: CategoriesComponent
      },

      {
        path: 'transactions',
        component: TransactionsComponent
      },

      {
        path: 'wallet',
        component: WalletComponent
      },
      {
        path: 'fees/:type',
        component: FeesComponent
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
