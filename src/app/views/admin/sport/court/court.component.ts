import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AdminService} from "../../../../services/http/admin.service";
import {MatDialog,} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-court',
  templateUrl: './court.component.html',
  styleUrl: './court.component.scss'
})
export class CourtComponent {
  displayedColumns: string[] = ['id', 'name', 'club', 'type', 'capacity', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('addCourt') courtModal: TemplateRef<any>;
  @ViewChild('confirmDeleteing') confirmDeleteing: TemplateRef<any>;
  clubs;
  capacity;
  courtForm:FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;



  constructor(private adminService: AdminService, private dialog: MatDialog,private _formBuilder:FormBuilder) {
    this.adminService.getAllCourts().subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    this.adminService.getAllClub().subscribe(res => {
      this.clubs = res
    })

    this.courtForm=this._formBuilder.group({
      id:[null],
      name:['', Validators.required],
      type:['', Validators.required],
      photo:['', Validators.required],
      club:['', Validators.required],
      capacity:['', Validators.required],
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setCapacity(event) {
    if (event.value == 'padel') {
      this.capacity = [{value:2,label:'Single'},{value:4,label:'Double'}]
    }
    if (event.value == 'football') {
      this.capacity = [{value:5,label:5},{value:8,label:8},{value:11,label:11}]
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  addCourtModel() {
    this.dialog.open(this.courtModal)
  }

  save() {
    if(this.courtForm.invalid)
      return
    let payload=this.courtForm.getRawValue()
    if(this.selectedFile)
    payload.photo=this.selectedFile
    if(payload.id)
      this.adminService.updateCourt(payload).subscribe(res=>{
        let index=this.dataSource.data.findIndex(c=>c.id==res.id)
        this.dataSource.data[index]=res
        this.dataSource._updateChangeSubscription()
        this.dialog.closeAll()
        this.courtForm.reset()
      })
    else
    this.adminService.createCourt(payload).subscribe(res=>{
      this.dataSource.data.push(res)
      this.dataSource._updateChangeSubscription()
      this.dialog.closeAll()
      this.courtForm.reset()
    })

  }

  editCourt(court){
    this.courtForm.patchValue(court)
    this.courtForm.get('club').setValue(court.club.id)
    this.setCapacity({value:court.type})
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

}
