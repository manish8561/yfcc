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
  editUserId: any;
  focus;
  focus1;
  uploadedPostFiles = [];
  frontUploadFiles = [];
  formdata: any;
  domain: string;
  categories = [];
  teams = [];
  constructor(private activeroute: ActivatedRoute, private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    /* get Categories */
    this.commonservice.get('category/getAll').subscribe(data => this.categories = data.data);
    this.commonservice.get('team/getAllAdmin').subscribe(data => this.teams = data.data);

    this.domain = environment.domainurl;
    this.activeroute.params.subscribe(params => {
      this.editUserId = params.id;
    });
    const profile_image_upload = environment.profile_image_upload;
    this.formdata = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl({ value: '', disabled: true }, [Validators.required]),
      password: new FormControl(''),
      role: new FormControl('player', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      team: new FormControl('', [Validators.required]),
      status: new FormControl('Active'),
    });

    this.commonservice.get('user/details/' + this.editUserId).subscribe(data => {
      const record = data.data[0];
      this.uploadedPostFiles = [...this.uploadedPostFiles, record.profile];
      this.frontUploadFiles = [...this.frontUploadFiles, record.profile];

      this.formdata.patchValue({
        name: record.name,
        email: record.email,
        phone: record.phone,
        role: record.role,
        category: record.category,
        team: record.team,
        status: record.status,
      });
    });
    /* after getting the values */
    let currentMultipleFile: any;
    const that = this;
    // multiple dropzone file - accepts any type of file
    const b = new Dropzone(document.getElementById('dropzone-multiple'), {
      url: profile_image_upload,
      thumbnailWidth: null,
      thumbnailHeight: null,
      previewsContainer: document.getElementsByClassName(
        'dz-preview-multiple'
      )[0],
      previewTemplate: document.getElementsByClassName('dz-preview-multiple')[0]
        .innerHTML,
      maxFiles: null,
      acceptedFiles: null,
      init() {
        this.on('addedfile', (file) => {
          currentMultipleFile = file;
        });
        this.on('removedfile', (file) => {
          if (file.xhr.response) {
            const d = JSON.parse(file.xhr.response);
            const image = d.data[0];
            that.uploadedPostFiles.map((ele, index) => {
              if (ele === image) {
                that.uploadedPostFiles.splice(index, 1);
                const dd = { image };
                that.commonservice.post('user/removeSingle', dd).subscribe(res => {
                  // console.log(res, 'remove from server');
                });
              }
            });
          }
        });
        this.on('success', (file, resp) => {
          // console.log(file, resp, 'after upload2');
          if (resp.data) {
            that.uploadedPostFiles = [...that.uploadedPostFiles, resp.data[0]];
          }
        });
      }
    });
    document.getElementsByClassName('dz-preview-multiple')[0].innerHTML = '';

  }
  save() {
    if (this.formdata.valid) {
      const data = this.formdata.value;
      data.profile = this.uploadedPostFiles[0];
      this.commonservice.put('user/edit/' + this.editUserId, data).subscribe(res => {
        if (res.success === 'OK') {
          this.router.navigate(['/user/user']);
        }
      });
    }
  }
  removeImage(image) {
    const dd = { id: this.editUserId, image };
    this.frontUploadFiles.map((ele, index) => {
      if (ele === image) {
        this.frontUploadFiles.splice(index, 1);
        this.uploadedPostFiles.splice(index, 1);
      }
      this.commonservice.post('user/removeImage', dd).subscribe(res => {
        console.log(res, 'remove from server');
      });
    });
  }

}
