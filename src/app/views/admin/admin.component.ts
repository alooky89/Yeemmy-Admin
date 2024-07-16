import {Component} from '@angular/core';
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  isDrawerOpened=true
  constructor(private _formBuilder: FormBuilder) {
  }

  toggleDrawer() {
    this.isDrawerOpened = !this.isDrawerOpened;
  }
}
