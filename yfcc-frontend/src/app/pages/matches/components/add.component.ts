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
  teams = [];
  minDate = new Date();
  isMeridian = false;
  constructor(private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.commonservice.get('team/getAllAdmin').subscribe(data => this.teams = data.data);

    this.formdata = new FormGroup({
      teamA: new FormControl('', [Validators.required]),
      teamB: new FormControl('', [Validators.required]),
      venue: new FormControl('', [Validators.required]),
      schedule_date: new FormControl(new Date(), [Validators.required]),
      schedule_time: new FormControl('', [Validators.required]),
    });
  }
  save() {
    if (this.formdata.valid) {
      const data = this.formdata.value;
      data.schedule_date = moment(data.schedule_date).format('YYYY-MM-DD');
      data.schedule_time = moment(data.schedule_time).format('HH:mm');
      // console.log(data, 'add match')
      this.commonservice.post('match/add', data).subscribe(res => {
        if (res.data) {
          this.router.navigate(['/match']);
        }
      });
    }
  }
}
