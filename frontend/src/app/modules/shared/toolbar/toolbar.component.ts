import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { DialogNovoProdutoComponent } from '../../produtos/dialog-novo-produto/dialog-novo-produto.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ]

})
export class ToolbarComponent {
  @Input() toolbarTitle!: string;
  @Input() actions: {
    icon: string;
    label: string;
    menu: string;
    menuItems: { icon: string; label: string; action: () => void }[];
  }[] = [];

  menus: { [key: string]: any } = {};
  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.menus = {};
  }

  @ViewChild(MatMenu) menu!: MatMenu;

  getMenu(menuName: string): MatMenu {
    return this.menus[menuName];
  }

  abrirDialogNovoProduto() {
    this.dialog.open(DialogNovoProdutoComponent, {
      width: 'max-content',
      height: 'max-content',
      panelClass: '',
      enterAnimationDuration: '350ms',
      exitAnimationDuration: '350ms'
    })
  }
  performAction(action: () => void) {
    action();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
