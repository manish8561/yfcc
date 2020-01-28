import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from '../../../variables/charts';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked = true;
  public clicked1 = false;
  showCardStats = false;
  teams = 0;
  matches = 0;
  products = 0;
  users = 0;

  constructor(private commonservice: CommonService) { }

  ngOnInit() {
    if (this.commonservice.loggedRole === 'admin') {
      this.showCardStats = true;
      /* teams */
      this.commonservice.get('team/total').subscribe(data => this.teams = data.data);
      /* users */
      this.commonservice.get('user/total').subscribe(data => this.users = data.data);
      /* matches */
      this.commonservice.get('match/total').subscribe(data => this.matches = data.data);
      /* products */
      this.commonservice.get('product/total').subscribe(data => this.products = data.data);

    }


    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];

    parseOptions(Chart, chartOptions());

    /*  const chartOrders = document.getElementById('chart-bars');    
 
     const ordersChart = new Chart(chartOrders, {
       type: 'bar',
       options: chartExample2.options,
       data: chartExample2.data
     }); */

    const chartSales = document.getElementById('chart-sales-dark');

    this.salesChart = new Chart(chartSales, {
      type: 'line',
      options: chartExample1.options,
      data: chartExample1.data
    });
    this.getChartData('month');
  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

  getChartData(type = 'month') {
    const data: any = { type };
    if (this.commonservice.loggedRole !== 'admin') {
      data.uid = this.commonservice.loggedUser.uid;
    }
    this.commonservice.post('order/chartdata', data).subscribe(res => {

      this.salesChart.data.datasets[0].data = res.data.map(d => {
        return d[0].count;
      });
      this.salesChart.data.datasets[1].data = res.data.map(d => {
        return d[0].total;
      });
      this.salesChart.data.datasets[2].data = res.data.map(d => {
        return d[0].success;
      });
      this.salesChart.data.labels = res.days;
      this.salesChart.update();
    });
  }
}
