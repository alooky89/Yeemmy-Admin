import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AdminService} from "../../../../services/http/admin.service";
import {MatDialog} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss'
})
export class WalletComponent {
  displayedColumns: string[] = ['id', 'user','club', 'balance', 'credit', 'updatedAt', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  userFc=new FormControl(null)
  payFc=new FormControl(null)
  users=[]
  @ViewChild('createAccount') createAccount: TemplateRef<any>;
  @ViewChild('paymentModal') paymentModal: TemplateRef<any>;
  constructor(private adminService:AdminService,
              private dialog: MatDialog,) {
    this.adminService.getAllWallet().subscribe(res=> {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    this.adminService.getAllUsers().subscribe(res=>this.users=res)
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getClubNames(club:any[]){
    return club?.map(club=>club.name).join(', ')
  }


  CreateAccount(){
    this.adminService.createAccount(this.userFc.value).subscribe(res=>{
      this.dataSource.data.push(res)
      this.dataSource._updateChangeSubscription()
      this.dialog.closeAll()
      this.userFc.reset()
    })
  }

  createAccountModal() {
    this.dialog.open(this.createAccount)
  }

  payAccountModal(wallet) {
    console.log(wallet)
    this.dialog.open(this.paymentModal).afterClosed().subscribe(res=>{
      if(res==true)
      {
        let payload={wallet,amount:this.payFc.value}
        this.adminService.AdminPayUser(payload).subscribe(res=>{
          let index=this.dataSource.data.findIndex(e=>e.id==res.id)
          this.dataSource.data[index]=res
          this.dataSource._updateChangeSubscription()
          this.payFc.reset()
        })



      }

    })
  }


}
