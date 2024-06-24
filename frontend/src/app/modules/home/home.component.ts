import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class HomeComponent implements OnInit {


  constructor(private dialog: MatDialog) {
    this.dialog = dialog;
  }




  ngOnInit(): void {
   
  }

  abrirDialogVenda() {
  
  }



}
