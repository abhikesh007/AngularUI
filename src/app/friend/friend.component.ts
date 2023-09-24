import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';


export class Friend {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public department: string,
    public email: string,
    public country: string
  ) {
  }
}

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  friends: Friend[] = [];
  closeResult : string | undefined;
  editForm!: FormGroup;
  private deleteId : Number | undefined;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private fb : FormBuilder,
  ){}

  ngOnInit(): void {
    this.getFriends();
    this.editForm = this.fb.group({
      id: [''],
      firstName: [''],
      lastName: [''],
      department: [''],
      email: [''],
      country: ['']
    } );
  }

  getFriends(){
    this.httpClient.get<any>('http://localhost:8080/friends').subscribe(
      response => {
        console.log(response);
        this.friends = response;
      }
    );
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(f: NgForm) {
    const url = 'http://localhost:8080/addFriend';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  openDetails(targetModal: any, friend: Friend) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
   });
const firstNameInput = document.getElementById('fname');
if (firstNameInput !== null) {
  firstNameInput.setAttribute('value', friend.firstName);
} else {
  console.log("Element with id 'firstName' not found.");
}
const lastNameInput = document.getElementById('lname');
if (lastNameInput !== null) {
  lastNameInput.setAttribute('value', friend.lastName);
} else {
  console.log("Element with id 'lastName' not found.");
}
const deptInput = document.getElementById('dept');
if (deptInput !== null) {
  deptInput.setAttribute('value', friend.department);
} else {
  console.log("Element with id 'dept' not found.");
}
const emailInput = document.getElementById('email2');
if (emailInput !== null) {
  emailInput.setAttribute('value', friend.email);
} else {
  console.log("Element with id 'email' not found.");
}
const countryInput = document.getElementById('cntry');
if (countryInput !== null) {
  countryInput.setAttribute('value', friend.country);
} else {
  console.log("Element with id 'cntry' not found.");
}
 }

openEdit(targetModal: any, friend: Friend) {
  this.modalService.open(targetModal, {
   centered: true,
   backdrop: 'static',
   size: 'lg'
 });
 this.editForm.patchValue( {
  id: friend.id, 
  firstName: friend.firstName,
  lastName: friend.lastName,
  department: friend.department,
  email: friend.email,
  country: friend.country
});
}

onSave() {
  const editURL = 'http://localhost:8080/updateFriend/' + this.editForm.value.id;
  console.log(this.editForm.value);
  this.httpClient.put(editURL, this.editForm.value)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService.dismissAll();
    });
}

openDelete(targetModal: any, friend: Friend) {
  this.deleteId = friend.id;
  this.modalService.open(targetModal, {
    backdrop: 'static',
    size: 'lg'
  });
}

onDelete() {
  const deleteURL = 'http://localhost:8080/deleteFriend/' + this.deleteId;
  this.httpClient.delete(deleteURL)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService.dismissAll();
    });
}
}
