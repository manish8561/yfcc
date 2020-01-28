import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import Dropzone from 'dropzone';
Dropzone.autoDiscover = false;

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  editCategoryId: any;

  formdata: any;
  constructor(private activeroute: ActivatedRoute, private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.activeroute.params.subscribe(params => {
      this.editCategoryId = params.id;
    });
    this.formdata = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('Active'),
    });

    this.commonservice.get('category/get/' + this.editCategoryId).subscribe(data => {
      const record = data.data;

      this.formdata.patchValue({
        name: record.name,
        description: record.description,
        status: record.status,

      });
    });
  }
  save() {
    if (this.formdata.valid) {
      const data = this.formdata.value;
      this.commonservice.put('category/edit/' + this.editCategoryId, data).subscribe(res => {
        if (res.success === 'OK') {
          this.router.navigate(['/category']);
        }
      });
    }
  }
}
