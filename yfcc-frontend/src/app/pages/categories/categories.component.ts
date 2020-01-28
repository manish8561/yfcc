import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import noUiSlider from 'nouislider';
import Dropzone from 'dropzone';
Dropzone.autoDiscover = false;
import Quill from 'quill';
import Selectr from 'mobius1-selectr';
import { CommonService } from 'src/app/shared/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.component.html'
})
export class CategoriesComponent implements OnInit {
  rows = [];
  temp = [];
  entries = 10;
  domain = environment.domainurl;
  constructor(private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    this.commonservice.get('category/getAll').subscribe(data => {
      this.rows = this.temp = data.data;
    });
  }
  deleteRow(index, id) {
    if (window.confirm(`Are you sure to delete the record?`)) {
      this.commonservice.post('category/remove', { id }).subscribe(res => {
        // console.log(res, 'deleting record');
        window.location.reload();
      });
      // console.log(index, 'delete row', id);
    }
  }
  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    const val = $event.target.value;
    this.temp = this.rows.filter((d) => {
      if (d.name.toLowerCase().indexOf(val) !== -1) {
        return true;
      }
      if (d.status.toLowerCase().indexOf(val) !== -1) {
        return true;
      }
      if (d.createdAt.toLowerCase().indexOf(val) !== -1) {
        return true;
      }
      return false;
    });
  }
}
