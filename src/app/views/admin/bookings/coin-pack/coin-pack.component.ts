import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdminService} from "../../../../services/http/admin.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-coin-pack',
  templateUrl: './coin-pack.component.html',
  styleUrl: './coin-pack.component.scss'
})
export class CoinPackComponent {

  displayedColumns: string[] = ['id', 'coin', 'price', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('addCourt') courtModal: TemplateRef<any>;
  @ViewChild('confirmDeleteing') confirmDeleteing: TemplateRef<any>;
  courtForm:FormGroup;
  constructor(private adminService: AdminService, private dialog: MatDialog,private _formBuilder:FormBuilder) {
    this.adminService.getCoinPackage().subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    this.courtForm=this._formBuilder.group({
      id:[null],
      coin:['', Validators.required],
      price:['', Validators.required],
    })
  }

  addCourtModel() {
    this.dialog.open(this.courtModal)
  }

  save() {
    if(this.courtForm.invalid)
      return
    let payload=this.courtForm.getRawValue()
    if(payload.id)
      this.adminService.updateCoinPackage(payload).subscribe(res=>{
        let index=this.dataSource.data.findIndex(c=>c.id==res.id)
        this.dataSource.data[index]=res
        this.dataSource._updateChangeSubscription()
        this.dialog.closeAll()
        this.courtForm.reset()
      })
    else
      this.adminService.addCoinPackage(payload).subscribe(res=>{
        this.dataSource.data.push(res)
        this.dataSource._updateChangeSubscription()
        this.dialog.closeAll()
        this.courtForm.reset()
      })

  }

  editCourt(court){
    this.courtForm.patchValue(court)
    this.dialog.open(this.courtModal)
  }

  deleteCourt(id) {
    this.dialog.open(this.confirmDeleteing).afterClosed().subscribe(res => {
      if (res) {
        this.adminService.deleteCoinPackage(id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(user => user.id !== id);
        })
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
