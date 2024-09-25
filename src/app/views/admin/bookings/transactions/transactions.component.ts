import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AdminService} from "../../../../services/http/admin.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent {
  displayedColumns: string[] = ['id', 'amount', 'paidBy', 'paidTo', 'createdAt', 'type', 'status', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  transactions = []
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('confirmDeleteing') confirmDeleteing: TemplateRef<any>;

  constructor(private adminService: AdminService,
              private dialog: MatDialog,) {
    this.adminService.getAllTransactions().subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.transactions = res
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterPaidBy(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue)
      this.dataSource.data = this.transactions.filter(tr => tr.paidBy.username.toLowerCase().includes(filterValue))
    else
      this.dataSource.data = this.transactions
    this.dataSource._updateChangeSubscription()
  }

  filterPaidTo(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue)
      this.dataSource.data = this.transactions.filter(tr => tr.paidTo.username.toLowerCase().includes(filterValue))
    else
      this.dataSource.data = this.transactions
    this.dataSource._updateChangeSubscription()
  }

  filterType(event) {
    this.dataSource.data = this.dataSource.data.filter(tr => tr.type == event.value)
    this.dataSource._updateChangeSubscription()
  }


  deleteTr(id) {
    this.dialog.open(this.confirmDeleteing).afterClosed().subscribe(res => {
      if (res) {
        this.adminService.deleteTransaction(id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(user => user.id !== id);
        })
      }
    })
  }

}
