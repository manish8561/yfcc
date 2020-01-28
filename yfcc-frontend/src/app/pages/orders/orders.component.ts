import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import noUiSlider from 'nouislider';
import Dropzone from 'dropzone';
Dropzone.autoDiscover = false;
import Quill from 'quill';
import Selectr from 'mobius1-selectr';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html'
})
export class OrdersComponent implements OnInit {
  rows = [];
  temp = [];
  entries = 10;
  constructor(private router: Router, private commonservice: CommonService) { }

  ngOnInit() {
    let url = 'order/getAll';
    if (this.commonservice.loggedRole === 'player') {
      url += '?uid=' + this.commonservice.loggedUser.uid;
    }
    this.commonservice.get(url).subscribe(data => {
      this.rows = this.temp = data.data;
    });
  }
  deleteRow(index, id) {
    if (window.confirm(`Are you sure to delete the record?`)) {
      this.commonservice.post('order/remove', { id }).subscribe(res => {
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
      if (d.title.toLowerCase().indexOf(val) !== -1) {
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
