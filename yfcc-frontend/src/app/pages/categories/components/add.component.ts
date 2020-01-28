import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonService } from '../../../shared/common.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  focus;

  formdata: any;
  constructor(private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.formdata = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });

  }
  save() {
    if (this.formdata.valid) {
      const data = this.formdata.value;
      this.commonservice.post('category/add', data).subscribe(res => {
        if (res.data) {
          this.router.navigate(['/category']);
        }
      });
    }
  }
}
