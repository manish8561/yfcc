import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import Dropzone from 'dropzone';
Dropzone.autoDiscover = false;
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  editTeamId: any;
  categories = [];
  formdata: any;
  uploadedFile = '';
  domain = environment.domainurl;
  constructor(private activeroute: ActivatedRoute, private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.commonservice.get('category/getAll').subscribe(data => this.categories = data.data);

    this.activeroute.params.subscribe(params => {
      this.editTeamId = params.id;
    });

    this.formdata = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      status: new FormControl('Active'),
    });

    this.commonservice.get('team/get/' + this.editTeamId).subscribe(data => {
      const record = data.data;
      this.uploadedFile = record.logo;
      this.formdata.patchValue({
        name: record.name,
        description: record.description,
        category: record.category,
        status: record.status,

      });
    });
    const team_image_upload = environment.team_image_upload;
    const that = this;
    // this constiable is to delete the previous image from the dropzone state
    // it is just to make the HTML DOM a bit better, and keep it light
    let currentSingleFile: any;
    // single dropzone file - accepts only images
    const a = new Dropzone(document.getElementById('dropzone-single'), {
      url: team_image_upload,
      thumbnailWidth: null,
      thumbnailHeight: null,
      previewsContainer: document.getElementsByClassName(
        'dz-preview-single'
      )[0],
      previewTemplate: document.getElementsByClassName('dz-preview-single')[0]
        .innerHTML,
      maxFiles: 1,
      acceptedFiles: 'image/*',
      init() {
        this.on('addedfile', (file) => {
          if (currentSingleFile) {
            this.removeFile(currentSingleFile);
          }
          currentSingleFile = file;
        });
        this.on('removedfile', (file) => {
          if (file.xhr.response) {
            const d = JSON.parse(file.xhr.response);
            const image = d.data[0];
            that.uploadedFile = '';
            that.commonservice.post('team/removeSingle', { image }).subscribe(data => {
              console.log(data, 'remove from server');
            });
          }
        });
        this.on('success', (file, resp) => {
          // console.log(file, resp, 'after upload2');
          if (resp.data) {
            that.uploadedFile = resp.data[0];
          }
        });
      },

    });
    document.getElementsByClassName('dz-preview-single')[0].innerHTML = '';
  }
  save() {
    if (this.formdata.valid) {
      const data = this.formdata.value;
      data.logo = this.uploadedFile;
      this.commonservice.put('team/edit/' + this.editTeamId, data).subscribe(res => {
        if (res.success === 'OK') {
          this.router.navigate(['/team']);
        }
      });
    }
  }

  removeImage(image) {
    const dd = { id: this.editTeamId, image };
    this.commonservice.post('team/removeImage', dd).subscribe(res => {
      this.uploadedFile = '';
      console.log(res, 'remove from server');
    });
  }
}
