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
  editMatchId: any;
  teams = [];
  formdata: any;
  minDate = new Date();
  isMeridian = false;
  editTime = new Date();
  constructor(private activeroute: ActivatedRoute, private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.commonservice.get('team/getAllAdmin').subscribe(data => this.teams = data.data);
    this.activeroute.params.subscribe(params => {
      this.editMatchId = params.id;
    });

    this.formdata = new FormGroup({
      teamA: new FormControl('', [Validators.required]),
      teamB: new FormControl('', [Validators.required]),
      venue: new FormControl('', [Validators.required]),
      teamA_goals: new FormControl(0, [Validators.required]),
      teamB_goals: new FormControl(0, [Validators.required]),
      schedule_date: new FormControl(new Date(), [Validators.required]),
      schedule_time: new FormControl('', [Validators.required]),
      status: new FormControl('Pending'),
      remark: new FormControl('Pending'),
    });

    this.commonservice.get('match/get/' + this.editMatchId).subscribe(data => {
      const record = data.data;
      const time = record.schedule_time.split(':');
      this.editTime.setHours(time[0]);
      this.editTime.setMinutes(time[1]);

      this.formdata.patchValue({
        teamA: record.teamA,
        teamB: record.teamB,
        venue: record.venue,
        teamA_goals: record.teamA_goals,
        teamB_goals: record.teamB_goals,
        schedule_date: record.schedule_date,
        schedule_time: this.editTime,
        status: record.status,
        remark: record.remark,
      });
    });
  }
  save() {
    if (this.formdata.valid) {
      const data = this.formdata.value;

      data.schedule_date = moment(data.schedule_date).format('YYYY-MM-DD');
      data.schedule_time = moment(data.schedule_time).format('HH:mm');
      this.commonservice.put('match/edit/' + this.editMatchId, data).subscribe(res => {
        if (res.success === 'OK') {
          this.router.navigate(['/match']);
        }
      });
    }
  }
}
