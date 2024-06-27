import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner-default',
  templateUrl: './spinner-default.component.html',
  styleUrls: ['./spinner-default.component.scss']
})
export class SpinnerDefaultComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {}

  
  @Input() isLoading!: boolean;
}
