import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AdminService} from "../../../../services/http/admin.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  displayedColumns: string[] = ['id', 'name', 'phone','email','role', 'bithdate','gender', 'adress','action'];
  dataSource: MatTableDataSource<any>=new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('addUser') userModal: TemplateRef<any>;
  @ViewChild('confirmDeleteing') confirmDeleteing: TemplateRef<any>;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  userForm:FormGroup;



  constructor(private adminService: AdminService, private dialog: MatDialog,private _formBuilder:FormBuilder){
    this.adminService.getAllUsers().subscribe(res=>{
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    this.userForm=this._formBuilder.group({
      id:[null],
      firstName:['', Validators.required],
      lastName:['', Validators.required],
      birthdate:['', Validators.required],
      photo:['', Validators.required],
      email:['', [Validators.required,Validators.email]],
      password:[null],
      phone:['', Validators.required],
      adress:[''],
      gender:['', Validators.required],
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


  addUserModel() {
    this.dialog.open(this.userModal)
  }

  save() {
    if(this.userForm.invalid)
      return
    let payload=this.userForm.getRawValue()
    if(this.selectedFile)
      payload.photo=this.selectedFile
    if(payload.id)
      this.adminService.updateUser(payload).subscribe(res=>{
        let index=this.dataSource.data.findIndex(c=>c.id==res.id)
        this.dataSource.data[index]=res
        this.dataSource._updateChangeSubscription()
        this.dialog.closeAll()
        this.userForm.reset()
      })
    else
      this.adminService.createUser(payload).subscribe(res=>{
        this.dataSource.data.push(res)
        this.dataSource._updateChangeSubscription()
        this.dialog.closeAll()
        this.userForm.reset()
      })

  }

  editUser(user){
    this.userForm.patchValue(user)
    this.dialog.open(this.userModal)
  }






  deleteUser(id) {
    this.dialog.open(this.confirmDeleteing).afterClosed().subscribe(res => {
      if (res) {
        this.adminService.deleteUser(id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(user => user.id !== id);
        })
      }
    })
  }

}
