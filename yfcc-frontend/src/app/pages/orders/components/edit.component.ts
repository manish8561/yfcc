import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';



@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  editScheduleId: any;
  categories = [];
  formdata: any;

  isMeridian = false;
  editTime1 = new Date();
  editTime2 = new Date();
  constructor(private activeroute: ActivatedRoute, private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.commonservice.get('category/getAll').subscribe(data => this.categories = data.data);

    this.activeroute.params.subscribe(params => {
      this.editScheduleId = params.id;
    });

    this.formdata = new FormGroup({
      category: new FormControl('', [Validators.required]),
      days: new FormControl('Sunday', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      venue: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      status: new FormControl('Pending'),
    });

    this.commonservice.get('schedule/get/' + this.editScheduleId).subscribe(data => {
      const record = data.data;
      const time = record.startTime.split(':');
      this.editTime1.setHours(time[0]);
      this.editTime1.setMinutes(time[1]);
      const time2 = record.endTime.split(':');
      this.editTime2.setHours(time2[0]);
      this.editTime2.setMinutes(time2[1]);

      this.formdata.patchValue({
        category: record.category,
        days: record.days,
        venue: record.venue,
        location: record.location,
        teamB_goals: record.teamB_goals,
        schedule_date: record.schedule_date,
        startTime: this.editTime1,
        endTime: this.editTime2,
        status: record.status
      });
    });
  }
  save() {
    if (this.formdata.valid) {
      const data = this.formdata.value;

      data.startTime = moment(data.startTime).format('HH:mm');
      data.endTime = moment(data.endTime).format('HH:mm');
      this.commonservice.put('schedule/edit/' + this.editScheduleId, data).subscribe(res => {
        if (res.success === 'OK') {
          this.router.navigate(['/schedule']);
        }
      });
    }
  }
}
