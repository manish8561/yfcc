import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

import {
  Location,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { CommonService } from 'src/app/shared/common.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  sidenavOpen = true;
  loggedUser: any;
  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private commonservice: CommonService
  ) {
    this.loggedUser = this.commonservice.loggedUser;
    this.location = location;
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator

      }
      if (event instanceof NavigationEnd) {
        // Hide loading indicator

        if (window.innerWidth < 1200) {
          document.body.classList.remove('g-sidenav-pinned');
          document.body.classList.add('g-sidenav-hidden');
          this.sidenavOpen = false;
        }
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });

  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    if (!localStorage.loggedin || localStorage.loggedin === 'no') {
      this.router.navigate(['login']);
    }
  }
  getTitle() {
    let titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    /* for (let item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    } */
    for (const item of this.listTitles) {
      if (item.path === titlee) {
        return item.title;
      }
    }
    return 'Dashboard';
  }

  openSearch() {
    document.body.classList.add('g-navbar-search-showing');
    setTimeout(() => {
      document.body.classList.remove('g-navbar-search-showing');
      document.body.classList.add('g-navbar-search-show');
    }, 150);
    setTimeout(() => {
      document.body.classList.add('g-navbar-search-shown');
    }, 300);
  }
  closeSearch() {
    document.body.classList.remove('g-navbar-search-shown');
    setTimeout(() => {
      document.body.classList.remove('g-navbar-search-show');
      document.body.classList.add('g-navbar-search-hiding');
    }, 150);
    setTimeout(() => {
      document.body.classList.remove('g-navbar-search-hiding');
      document.body.classList.add('g-navbar-search-hidden');
    }, 300);
    setTimeout(() => {
      document.body.classList.remove('g-navbar-search-hidden');
    }, 500);
  }
  openSidebar() {
    if (document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-pinned');
      document.body.classList.add('g-sidenav-hidden');
      this.sidenavOpen = false;
    } else {
      document.body.classList.add('g-sidenav-pinned');
      document.body.classList.remove('g-sidenav-hidden');
      this.sidenavOpen = true;
    }
  }
  toggleSidenav() {
    if (document.body.classList.contains('g-sidenav-pinned')) {
      document.body.classList.remove('g-sidenav-pinned');
      document.body.classList.add('g-sidenav-hidden');
      this.sidenavOpen = false;
    } else {
      document.body.classList.add('g-sidenav-pinned');
      document.body.classList.remove('g-sidenav-hidden');
      this.sidenavOpen = true;
    }
  }
  logout() {
    this.commonservice.logout();
    this.router.navigate(['/login']);
  }
}
