import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ComandaElement } from 'src/app/models/models';
import { NotificationService } from 'src/app/service/notifications/notifications.service';


@Component({
  selector: 'app-card-comanda',
  templateUrl: './card-comanda.component.html',
  styleUrls: ['./card-comanda.component.scss']
})

export class CardComandaComponent implements OnInit, OnChanges {
  @Input() comanda!: ComandaElement;


  classesCss: string[] = ['Aberta', 'Fechada'];

  constructor(private notificationService: NotificationService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.notificationService.comandaFinalizada$.subscribe((data) => {
      this.cdr.detectChanges();
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comanda']) {
      this.comanda = changes['comanda'].currentValue;
      this.cdr.detectChanges();
    }
  }


}
