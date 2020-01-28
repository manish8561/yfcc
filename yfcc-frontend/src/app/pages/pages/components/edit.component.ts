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
  editPageId: any;
  focus;
  focus1;
  uploadedPostFiles = [];
  frontUploadFiles = [];
  formdata: any;
  domain: string;
  constructor(private activeroute: ActivatedRoute, private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.domain = environment.domainurl;
    this.activeroute.params.subscribe(params => {
      this.editPageId = params.id;
    });
    const page_image_upload = environment.page_image_upload;
    this.formdata = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormArray([]),
      status: new FormControl('Active'),
    });

    this.commonservice.get('page/get/' + this.editPageId).subscribe(data => {
      const record = data.data;
      this.uploadedPostFiles = record.image;
      this.frontUploadFiles = record.image;
      if (record.description.length > 0) {
        for (const d of record.description) {

          (this.formdata.get('description') as FormArray).push(new FormControl(d, Validators.required));
        }
      }
      this.formdata.patchValue({
        title: record.title,

        status: record.status,

      });
    });
    /* after getting the values */
    let currentMultipleFile: any;
    const that = this;
    // multiple dropzone file - accepts any type of file
    const b = new Dropzone(document.getElementById('dropzone-multiple'), {
      url: page_image_upload,
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
                that.commonservice.post('page/removeSingle', dd).subscribe(res => {
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
      data.image = this.uploadedPostFiles;
      this.commonservice.put('page/edit/' + this.editPageId, data).subscribe(res => {
        if (res.success === 'OK') {
          this.router.navigate(['/page']);
        }
      });
    }
  }
  removeImage(image) {
    const dd = { id: this.editPageId, image };
    this.frontUploadFiles.map((ele, index) => {
      if (ele === image) {
        this.frontUploadFiles.splice(index, 1);
        this.uploadedPostFiles.splice(index, 1);
      }
      this.commonservice.post('page/removeImage', dd).subscribe(res => {
        console.log(res, 'remove from server');

      });
    });
  }
  addDescription(): void {
    (this.formdata.get('description') as FormArray).push(new FormControl('', Validators.required));
  }
  removeDescription(i): void {
    (this.formdata.get('description') as FormArray).removeAt(i);
  }
}
