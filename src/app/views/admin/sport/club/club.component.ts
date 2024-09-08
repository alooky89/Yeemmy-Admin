import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {AdminService} from "../../../../services/http/admin.service";
import {FormArray, FormBuilder, FormGroup, Validator, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrl: './club.component.scss'
})
export class ClubComponent implements OnInit{
  displayedColumns: string[] = ['id', 'name', 'owner', 'courts','website', 'address', 'action'];
  dataSource: MatTableDataSource<any>=new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('confirmDeleteing') confirmDeleteing: TemplateRef<any>;
  @ViewChild('editClub') clubEditModal: TemplateRef<any>;
  showStepper=false;
  clubFormGroup:FormGroup;
  pricingFormGroup:FormGroup;
  courtForm:FormGroup;
  userForm:FormGroup;
  capacity;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  padelCapacity=[{value:2,label:'Single'},{value:4,label:'Double'}]
  footballCapacity=[{value:5,label:5},{value:8,label:8},{value:11,label:11}]
  imagePreviews: string[] = [];
  CourtsFiles=[]
  users=[]

  constructor(private adminService:AdminService,
              private dialog: MatDialog,
              private _formbuilder:FormBuilder) {
    this.initialiseClubs()

  }

  initialiseClubs(){
    this.adminService.getAllClub().subscribe(res=>{
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    this.adminService.getAllUsers().subscribe(users=>this.users=users)
  }

  ngOnInit() {
    this.clubFormGroup=this._formbuilder.group({
      id:[null,],
      name:[null,],
      address:[null,],
      website:[null,],
      photo:[null],
      latitude:[null,],
      longitude:[null,],

    });
    this.pricingFormGroup=this._formbuilder.group({
      type:['fixed', Validators.required],
      price:[null, Validators.required],
      from:[null],
      to:[null],
    });
    this.courtForm = this._formbuilder.group({
      courts:this._formbuilder.array([])
    });
    this.addNewCourt()

    this.userForm=this._formbuilder.group({
      id:[null],
      firstName:['', Validators.required],
      lastName:['', Validators.required],
      username:['', Validators.required],
      birthdate:['', Validators.required],
      email:['', [Validators.required,Validators.email]],
      password:[null],
      phone:['', Validators.required],
      role:['owner'],
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


  onClubFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.CourtsFiles[index]=file
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews[index] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  getSelectedFile(index: number): File {
    return this.CourtsFC.at(index).get('photo').value as File;
  }

  getImagePreview(index: number): string {
    return this.imagePreviews[index];
  }


  getCourtsName(courts:any[]){
    return courts.map(c=>c.name).join(',')
  }

  getOwnerName(owner){
    return owner.firstName+' '+owner.lastName
  }

  get PricingType(){
    return this.pricingFormGroup.get('type').value
  }
  toggleStepper(){
    this.showStepper=!this.showStepper
  }

  get CourtsFC(){
    return  this.courtForm.get('courts') as FormArray
  }

  addNewCourt(){
    this.CourtsFC.push(this._formbuilder.group({
      name:['', Validators.required],
      type:['', Validators.required],
      photo:['', Validators.required],
      club:['', Validators.required],
      capacity:['', Validators.required],
    }))
    this.imagePreviews.push(null);


  }


  submit(){
    if(this.userForm.invalid|| this.clubFormGroup.invalid)
    return
    let pricing=this.pricingFormGroup.getRawValue()
    if(this.userForm.get('id').value){
      let pc=this.clubFormGroup.getRawValue()
      pc.photo=this.selectedFile;
      pc.user=this.userForm.get('id').value
      this.adminService.upgradeRole({id:this.userForm.get('id').value}).subscribe()
      this.adminService.createClub(pc).subscribe(club=>{
        pricing.club=club.id
        this.adminService.createPricing(pricing).subscribe()
        for (let i = 0; i < this.CourtsFC.controls.length; i++) {
          let court=this.CourtsFC.at(i).getRawValue()
          court.club=club.id
          court.photo=this.CourtsFiles[i]??undefined
          this.adminService.createCourt(court).subscribe()
        }
        this.toggleStepper()
        this.initialiseClubs()

      })
    }else {
      this.adminService.createUser(this.userForm.getRawValue()).subscribe(res=>{
        let newUser=res
        let pc=this.clubFormGroup.getRawValue()
        pc.photo=this.selectedFile;
        pc.user=newUser.id

        this.adminService.createClub(pc).subscribe(club=>{

          pricing.club=club.id
          this.adminService.createPricing(pricing).subscribe()
          for (let i = 0; i < this.CourtsFC.controls.length; i++) {
            let court=this.CourtsFC.at(i).getRawValue()
            court.club=club.id
            court.photo=this.CourtsFiles[i]??undefined
            this.adminService.createCourt(court).subscribe()
          }
          this.toggleStepper()
          this.initialiseClubs()

        })
      })

    }



  }

  getCapacityFc(index){
    return this.CourtsFC.at(index).get('type').value;
  }

  setUser(event){
    this.userForm.patchValue(event.value)
  }


  saveEditClub(){
    if(this.clubFormGroup.invalid)
      return
    let payload=this.clubFormGroup.getRawValue()
    if(this.selectedFile)
      payload.photo=this.selectedFile
    this.adminService.updateClub(payload).subscribe(res=>{
      window.location.reload()
    })

  }
  editClubForm(court){
    this.clubFormGroup.patchValue(court)
    this.clubFormGroup.get('photo').setValue(null)
    this.selectedFile=this.imagePreview=court.photo
    this.dialog.open(this.clubEditModal)
  }


  deleteClub(id) {
    this.dialog.open(this.confirmDeleteing).afterClosed().subscribe(res => {
      if (res) {
        this.adminService.deleteClub(id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(user => user.id !== id);
        })
      }
    })
  }

}
