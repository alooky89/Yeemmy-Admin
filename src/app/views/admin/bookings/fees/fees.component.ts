import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AdminService} from "../../../../services/http/admin.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrl: './fees.component.scss'
})
export class FeesComponent implements OnInit{
  displayedColumns: string[] = [ 'type', 'commission', 'providerfees', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild('addCourt') courtModal: TemplateRef<any>;
  feesForm:FormGroup;
  constructor(private adminService: AdminService, private dialog: MatDialog,private _formBuilder:FormBuilder) {
  }

  ngOnInit() {
    this.adminService.getFees().subscribe(res=>{
      this.dataSource = new MatTableDataSource(res);
    })
    this.feesForm=this._formBuilder.group({
      id:[null],
      commission:['', Validators.required],
      type:['', Validators.required],
      providerfees:['', Validators.required],
    })

  }




  addCourtModel() {
    this.dialog.open(this.courtModal)
  }

  save() {
    if(this.feesForm.invalid)
      return
    let payload=this.feesForm.getRawValue()
      this.adminService.updateFees(payload).subscribe(res=>{
        let index=this.dataSource.data.findIndex(c=>c.id==res.id)
        this.dataSource.data[index]=res
        this.dataSource._updateChangeSubscription()
        this.dialog.closeAll()
        this.feesForm.reset()
      })

  }

  editCourt(court){
    this.feesForm.patchValue(court)
    this.dialog.open(this.courtModal)
  }




}
