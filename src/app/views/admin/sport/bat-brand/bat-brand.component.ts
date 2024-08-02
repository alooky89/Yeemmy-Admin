import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdminService} from "../../../../services/http/admin.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-bat-brand',
  templateUrl: './bat-brand.component.html',
  styleUrl: './bat-brand.component.scss'
})
export class BatBrandComponent {


  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('addCourt') courtModal: TemplateRef<any>;
  @ViewChild('confirmDeleteing') confirmDeleteing: TemplateRef<any>;
  courtForm:FormGroup;
  constructor(private adminService: AdminService, private dialog: MatDialog,private _formBuilder:FormBuilder) {
    this.adminService.getAllBats().subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    this.courtForm=this._formBuilder.group({
      id:[null],
      name:['', Validators.required],
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
      this.adminService.updateBat(payload).subscribe(res=>{
        let index=this.dataSource.data.findIndex(c=>c.id==res.id)
        this.dataSource.data[index]=res
        this.dataSource._updateChangeSubscription()
        this.dialog.closeAll()
        this.courtForm.reset()
      })
    else
      this.adminService.addBat(payload).subscribe(res=>{
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
        this.adminService.deleteCourt(id).subscribe(() => {
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
