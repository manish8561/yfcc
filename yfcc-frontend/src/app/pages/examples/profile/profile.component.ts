import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { CommonService } from 'src/app/shared/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  loggedUser: any;
  user: any;
  stats = [];
  addresses = [];
  domain = environment.domainurl;
  formdata: FormGroup;
  formdata2: FormGroup;
  constructor(private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.formdata = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl({ value: '', disabled: true }, [Validators.required]),
      password: new FormControl(''),
      phone: new FormControl('', [Validators.required]),
    });
    this.formdata2 = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      locality: new FormControl(''),
      district: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      pincode: new FormControl('', [Validators.required]),
    });
    this.loggedUser = this.commonservice.loggedUser;
    this.getDetails();
  }
  getDetails() {
    this.commonservice.get('user/details/' + this.loggedUser.uid).subscribe(data => {
      this.user = data.data[0];
      if (this.user.stats) {
        this.stats = this.user.stats;
      }
      if (this.user.userAddress) {
        this.addresses = this.user.userAddress;
      }
      this.formdata.patchValue({
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
      });
    });
  }
  saveProfile() {
    if (this.formdata.valid) {
      const data = this.formdata.value;
      //  data.profile = this.uploadedPostFiles[0];
      this.commonservice.put('user/updateProfile/' + this.loggedUser.uid, data).subscribe(res => {
        if (res.success === 'OK') {
          this.getDetails();
          window.alert('Profile updated.');
        }
      });
    }
  }

  removeAddress(item) {
    console.log('address', item);
    if (window.confirm(`Are you sure to detele the record?`)) {
      this.commonservice.post('address/remove', { id: item._id }).subscribe(res => {
        if (res.success === 'OK') {
          this.getDetails();
          window.alert('Address deleted successfully.');
        }
      });
    }
  }
  defaultAddress(item) {
    this.commonservice.get('address/defaultAddress/' + item._id).subscribe(res => {
      if (res.data) {
        this.getDetails();
      }
    });
  }
  saveAddress() {
    if (this.formdata2.valid) {
      const data = this.formdata2.value;
      data.uid = this.loggedUser.uid;
      data.location = { type: 'Point', coordinates: [-104.9903, 39.7392] };

      this.commonservice.post('address/add', data).subscribe(res => {
        if (res.success === 'OK') {
          this.getDetails();
          this.formdata2.reset();
          window.alert('Addres added.');
        }
      });
    }
  }
}
