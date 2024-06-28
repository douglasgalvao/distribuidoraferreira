import { animate, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { Balance, Caixa, Vendas } from 'src/app/models/models';
import { CaixaService } from 'src/app/service/caixa/caixa.service';
import { NotificationService } from 'src/app/service/notifications/notifications.service';
import { VendasService } from 'src/app/service/vendas/vendas.service';

@Component({
    selector: 'app-caixa',
    templateUrl: './caixa.component.html',
    styleUrls: ['./caixa.component.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('700ms', style({ opacity: 1 })),
            ]),
        ]),
    ]
})
export class CaixaComponent implements OnInit {
    toolbarTitle: string = 'Caixa';
    vendas: Vendas[] = []
    actions = [{
        icon: 'add',
        label: 'Perda',
        menu: 'Adicionar',
    }];

    isLoading!: boolean;
    isLoaded!: boolean;
    caixasData!: Caixa[];
    dataSource!: MatTableDataSource<Caixa>;
    balance: Balance = { toolbarTitle: 'Faturamento Diário', toolbarIcon: 'wallet', value: 0.0, currency: 'BRL', arrowType: 'none', isCurrency: false }
    caixaAberto!: boolean;
    caixaID!: number;



    constructor(
        private dialog: MatDialog,
        private caixaService: CaixaService,
        private notificationService: NotificationService) { }


    ngOnInit(): void {

        this.isLoaded = false;
        this.isLoading = !this.isLoaded;
        forkJoin({
            getCaixas: this.caixaService.getCaixas(),
            caixa: this.caixaService.getCaixa(),
            caixaID: this.caixaService.getCaixaID(),
            caixaAberto: this.caixaService.verificarCaixa()
        }).subscribe(({ getCaixas, caixa, caixaID, caixaAberto }) => {
            this.caixasData = getCaixas.entity;
            this.dataSource = new MatTableDataSource(this.caixasData);
            this.isLoaded = true;
            this.isLoading = !this.isLoaded;

            const faturamentoDia = caixa.entity.faturamento_dia ?? 0.0;

            this.balance.value = faturamentoDia;
            this.balance.arrowType = faturamentoDia > 0 ? 'up' : 'down';

            this.caixaID = caixaID.entity;
            this.caixaAberto = caixaAberto.entity;
            this.isLoaded = true;
            this.isLoading = !this.isLoaded;
        })

        this.notificationService.caixaAlterado$.subscribe(() => forkJoin({
            getCaixas: this.caixaService.getCaixas(),
            caixa: this.caixaService.getCaixa(),
            caixaID: this.caixaService.getCaixaID(),
            caixaAberto: this.caixaService.verificarCaixa()
        }).subscribe(({ getCaixas, caixa, caixaID, caixaAberto }) => {
            getCaixas.entity.forEach((e: Caixa) => {
                e.data_hora = this.formatarData(e.data_hora);
            });
            this.caixasData = getCaixas.entity;
            this.dataSource = new MatTableDataSource(this.caixasData);

            const faturamentoDia = caixa.entity.faturamento_dia ?? 0.0;

            this.balance.value = faturamentoDia;
            this.balance.arrowType = faturamentoDia > 0 ? 'up' : 'down';

            this.caixaID = caixaID.entity;
            this.caixaAberto = caixaAberto.entity;
        }))

    }

    formatarData(data: string): string {
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' +
            date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }


}
