import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import noUiSlider from 'nouislider';
import Dropzone from 'dropzone';
Dropzone.autoDiscover = false;
import Quill from 'quill';
import Selectr from 'mobius1-selectr';
import { environment } from 'src/environments/environment';

import { CommonService } from '../../../shared/common.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  focus;
  focus1;

  uploadedPostFiles = [];
  formdata: any;
  constructor(private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    const page_image_upload = environment.page_image_upload;
    this.formdata = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormArray([
        new FormControl('', [Validators.required]),
      ]),
    });

    // console.log(page_image_upload, 'add');
    // this constiable is to delete the previous image from the dropzone state
    // it is just to make the HTML DOM a bit better, and keep it light
    // let currentSingleFile: any;
    // // single dropzone file - accepts only images
    // const a = new Dropzone(document.getElementById('dropzone-single'), {
    //   url: '/',
    //   thumbnailWidth: null,
    //   thumbnailHeight: null,
    //   previewsContainer: document.getElementsByClassName(
    //     'dz-preview-single'
    //   )[0],
    //   previewTemplate: document.getElementsByClassName('dz-preview-single')[0]
    //     .innerHTML,
    //   maxFiles: 1,
    //   acceptedFiles: 'image/*',
    //   init() {
    //     this.on('addedfile', (file) => {
    //       if (currentSingleFile) {
    //         this.removeFile(currentSingleFile);
    //       }
    //       currentSingleFile = file;
    //     });
    //   }
    // });
    // document.getElementsByClassName('dz-preview-single')[0].innerHTML = '';
    // this constiable is to delete the previous image from the dropzone state
    // it is just to make the HTML DOM a bit better, and keep it light

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
          if (currentMultipleFile) {
          }
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
                that.commonservice.post('post/removeSingle', dd).subscribe(data => {
                  // console.log(data, 'remove from server');
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

    // const quill = new Quill('#quill', {
    //   modules: {
    //     toolbar: [
    //       ['bold', 'italic'],
    //       ['link', 'blockquote', 'code', 'image'],
    //       [
    //         {
    //           list: 'ordered'
    //         },
    //         {
    //           list: 'bullet'
    //         }
    //       ]
    //     ]
    //   },
    //   placeholder: 'Quill WYSIWYG',
    //   theme: 'snow'
    // });
  }
  save() {
    if (this.formdata.valid) {
      const data = this.formdata.value;
      data.image = this.uploadedPostFiles;
      this.commonservice.post('page/add', data).subscribe(res => {
        if (res.data) {
          this.router.navigate(['/page']);
        }
      });
    }
  }
  addDescription(): void {
    (this.formdata.get('description') as FormArray).push(new FormControl('', Validators.required));
  }
  removeDescription(i): void {
    (this.formdata.get('description') as FormArray).removeAt(i);
  }
}
