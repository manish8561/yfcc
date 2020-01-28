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
  editPostId: any;
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
      this.editPostId = params.id;
    });
    const product_image_upload = environment.product_image_upload;
    this.formdata = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      quantity: new FormControl(0, [Validators.required]),
      status: new FormControl('Active'),
    });

    this.commonservice.get('product/get/' + this.editPostId).subscribe(data => {
      const product = data.data;
      this.uploadedPostFiles = product.image;
      this.frontUploadFiles = product.image;

      this.formdata.patchValue({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        status: product.status,

      });
    });
    /* after getting the values */
    let currentMultipleFile: any;
    const that = this;
    // multiple dropzone file - accepts any type of file
    const b = new Dropzone(document.getElementById('dropzone-multiple'), {
      url: product_image_upload,
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
                that.commonservice.post('product/removeSingle', dd).subscribe(res => {
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
      this.commonservice.put('product/edit/' + this.editPostId, data).subscribe(res => {
        if (res.success === 'OK') {
          this.router.navigate(['/product']);
        }
      });
    }
  }
  removeImage(image) {
    const dd = { id: this.editPostId, image };
    this.frontUploadFiles.map((ele, index) => {
      if (ele === image) {
        this.frontUploadFiles.splice(index, 1);
        this.uploadedPostFiles.splice(index, 1);
      }
      this.commonservice.post('product/removeImage', dd).subscribe(res => {
        console.log(res, 'remove from server');

      });
    });

  }
}
