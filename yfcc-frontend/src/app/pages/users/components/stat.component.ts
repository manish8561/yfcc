import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {
  statUserId: any;

  formdata: any;
  constructor(private activeroute: ActivatedRoute, private router: Router, private commonservice: CommonService) { }

  ngOnInit() {

    this.activeroute.params.subscribe(params => {
      this.statUserId = params.id;
    });
    this.formdata = new FormGroup({
      age: new FormControl('', [Validators.required]),
      goals: new FormControl('', [Validators.required]),
      position: new FormControl(''),
    });

    this.commonservice.get('user/details/' + this.statUserId).subscribe(data => {
      const record = data.data[0].stats[0];
      if (record) {
        this.formdata.patchValue({
          age: record.age || '',
          position: record.position || '',
          goals: record.goals || 0,
        });
      }
    });


  }
  save() {
    if (this.formdata.valid) {
      let stats = [];
      stats = [...stats, this.formdata.value];
      this.commonservice.put('user/stat/' + this.statUserId, { stats }).subscribe(res => {
        if (res.success === 'OK') {
          this.router.navigate(['/user/user']);
        }
      });
    }
  }
}
