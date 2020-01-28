import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import noUiSlider from 'nouislider';
import Dropzone from 'dropzone';
Dropzone.autoDiscover = false;
import Quill from 'quill';
import Selectr from 'mobius1-selectr';
import { CommonService } from '../../../shared/common.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  formdata: any;
  categories = [];
  isMeridian = false;
  constructor(private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.commonservice.get('category/getAll').subscribe(data => this.categories = data.data);

    this.formdata = new FormGroup({
      category: new FormControl('', [Validators.required]),
      days: new FormControl('Sunday', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      venue: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
    });
  }
  save() {
    if (this.formdata.valid) {
      const data = this.formdata.value;
      data.startTime = moment(data.startTime).format('HH:mm');
      data.endTime = moment(data.endTime).format('HH:mm');
      this.commonservice.post('schedule/add', data).subscribe(res => {
        if (res.data) {
          this.router.navigate(['/schedule']);
        }
      });
    }
  }
}
