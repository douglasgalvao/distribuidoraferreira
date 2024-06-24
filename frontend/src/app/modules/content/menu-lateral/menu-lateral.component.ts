import { DrawerService } from 'src/app/service/drawer/drawer.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { Menu } from './menu-itens-data';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { MatDrawerMode } from '@angular/material/sidenav';
import { MenuLateralItens } from 'src/app/models/models';



@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.scss']
})
export class MenuLateralComponent implements OnInit {
  data: MenuLateralItens[] = Menu;
  isDrawerOpened: boolean = true;
  selectedItem: MenuLateralItens | undefined;
  mode: MatDrawerMode = 'side';


  constructor(private drawer: DrawerService) {



  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.renderAccordingScreen();
  }



  ngOnInit(): void {
    this.renderAccordingScreen();

    this.drawer.drawerState.subscribe((state) => {
      this.isDrawerOpened = state;
    });

  }

  renderAccordingScreen() {
    let screenSize = window.innerWidth;
    if (screenSize < 950) {
      this.mode = 'over';
      this.isDrawerOpened = false;
    } else {
      this.isDrawerOpened = true;
      this.mode = 'side';
    }
  }

  selectItem(item: MenuLateralItens) {
    this.selectedItem = item;
    let screenSize = window.innerWidth;
    if (screenSize < 500) {
      this.drawer.toggleDrawerBool(false);
    }

  }
}
