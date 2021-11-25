import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormArray,FormControl,ValidatorFn, ControlValueAccessor } from '@angular/forms';
import { of } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { RoleMenuModel } from './Role-menu.model';

@Component({
  selector: 'app-role-menu',
  templateUrl: './role-menu.component.html',
  styleUrls: ['./role-menu.component.css']
})
export class RoleMenuComponent implements OnInit {

  formMenu !: FormGroup;
  menusData = [{checked:false,name: 'Process-1'},{checked:false ,name: 'Process-2'},{checked:false ,name: 'Process-3'},{checked:false ,name: 'Process-4'}];
  actiondata = []
  get menusFormArray() {
    return this.formMenu.controls.menus as FormArray;
  }
  roleMenuModelObj : RoleMenuModel = new RoleMenuModel();
  rolemenuData !: any;
  showAdd!: boolean;
  showUpdate !: boolean;
  checked : boolean=false;
  tooglebool: boolean=false;
  constructor(private formbuilber: FormBuilder,
   private api : ApiService) { }

  ngOnInit(): void {
    this.formMenu = this.formbuilber.group({
      roleName : [''],
      menu : [''],
      menus: new FormArray([])
    })
    this.getAllrole();
    this.addCheckboxes();
  }
  private addCheckboxes() {
    this.menusData.forEach(() => this.menusFormArray.push(new FormControl(false)));
  }
  submit(){
    const selectedmenusIds = this.formMenu.value.menus
    .map((checked: any, i: number) => checked ? this.menusData[i].name : null)
    .filter((v: null) => v !== null);
    this.actiondata = selectedmenusIds;
    
    this.api.postEmployee(this.roleMenuModelObj)
    this.getAllrole();
  }
  changeEvent(event: any){ 
    if (event.target.checked) {
      this.checked = true;
    }
       else {
         this.checked = false;
       }
  }
  clickAddrole(){
    this.formMenu.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }
  postRolemenu(){
    let action = document.getElementById('menuaction')
    action?.click();
    this.roleMenuModelObj.roleName = this.formMenu.value.roleName;
    this.roleMenuModelObj.menu = this.actiondata.toString();

    this.api.postEmployee(this.roleMenuModelObj)
    .subscribe(res=>{
      console.log(res);
      alert("role added success")
      let ref= document.getElementById('cancel')
      ref?.click();
      this.getAllrole();
    },
    _err=>{
      alert("error")
    })
  }
  getAllrole(){
    this.api.getEmployee()
    .subscribe(res=>{
      this.rolemenuData = res;
    })
  }
  deleteRole(row : any){
    this.api.deleteEmployee(row.id)
    .subscribe(_res=>{
      alert("Detail Delete Successfully")
      this.getAllrole();
    })
  }
  onEdit(row: any){
    this.showAdd = false;
    this.showUpdate = true;
    this.roleMenuModelObj.id = row.id;
    this.formMenu.controls['roleName'].setValue(row.roleName);
    this.formMenu.controls['menu'].setValue(row.menu)
}
updateRole(){
  let action = document.getElementById('menuaction')
    action?.click();
  this.roleMenuModelObj.roleName = this.formMenu.value.roleName;
  this.roleMenuModelObj.menu = this.actiondata.toString();

  this.api.updateEmployee(this.roleMenuModelObj,this.roleMenuModelObj.id)
  .subscribe(_res=>{
    alert("Updated Successfully");
    let ref = document.getElementById('cancel')
    ref?.click();
    this.getAllrole();
  })
 }
}