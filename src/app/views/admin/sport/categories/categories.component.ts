import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AdminService} from "../../../../services/http/admin.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  displayedColumns: string[] = ['id', 'name', 'parentCategory','route','action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('addCourt') courtModal: TemplateRef<any>;
  @ViewChild('confirmDeleteing') confirmDeleteing: TemplateRef<any>;
  categoryForm:FormGroup;

  constructor(private adminService: AdminService, private dialog: MatDialog,private _formBuilder:FormBuilder) {
    this.adminService.getAllCategories().subscribe(res => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    this.categoryForm=this._formBuilder.group({
      id:[null],
      name:['', Validators.required],
      parentCategory:[''],
      route:['', Validators.required],
      photo:['', Validators.required],
    })
  }

  addCourtModel() {
    this.categoryForm.reset()
    this.dialog.open(this.courtModal)
  }

  save() {
    if(this.categoryForm.invalid)
      return
    let payload=this.categoryForm.getRawValue()
    if(this.selectedFile)
      payload.photo=this.selectedFile
    if(payload.id)
      this.adminService.updateCategory(payload).subscribe(res=>{
        let index=this.dataSource.data.findIndex(c=>c.id==res.id)
        this.dataSource.data[index]=res
        this.dataSource._updateChangeSubscription()
        this.dialog.closeAll()
      })
    else
      this.adminService.addCategory(payload).subscribe(res=>{
        this.dataSource.data.push(res)
        this.dataSource._updateChangeSubscription()
        this.dialog.closeAll()
      })

  }

  editCourt(court){
    this.categoryForm.patchValue(court)
    this.categoryForm.get('parentCategory').setValue(court.parentCategory?.id)
    this.selectedFile=this.imagePreview=court.photo
    this.dialog.open(this.courtModal)
  }


  deleteCourt(id) {
    this.dialog.open(this.confirmDeleteing).afterClosed().subscribe(res => {
      if (res) {
        this.adminService.deleteCategory(id).subscribe(() => {
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

  getParentCategoryName(id){
    return this.dataSource.data.find(e=>e.id==id)?.name
  }





}
