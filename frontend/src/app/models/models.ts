export interface caixaRequest {
  valor_inicial: number
}

export interface caixaResponse {
  caixa_id: number,
  data_hora: string,
  status: string,
  valor_inicial: number,
  faturamento_dia: number,
  valor_total: number
}

export interface CategoriaElement {
  id: number,
  nome: string
}

export interface Balance {
  toolbarTitle: string,
  toolbarIcon: string,
  value: number,
  currency: string,
  arrowType: string,
  isCurrency: boolean
}

export interface Cliente {
  id: number,
  nome: string,
  telefone: string,
  total_compra: number,
  status: string
}

export interface ClienteRequest {
  nome_cliente: string,
  telefone: string,
}

export interface AlterarDadosClienteRequest {
  id: number,
  nome_cliente: string,
  telefone: string,
}

export interface ContaCliente {
  id: number;
  nome_cliente: string;
  telefone: string;
  status: string;
  // vendas: Venda[];
}

export interface ContaClienteRequest {
  nome_cliente: string;
  telefone: string;
}

export interface movimentacaoEstoqueResponse {
  id_movimentacao: number;
  produto_id: number;
  nome_produto: string;
  img: string;
  quantidade: number;
  horario_registro: string;
  tipo: string;
  valor: number;
  preco_unitario: number;
  observacao: string;
}

export interface VendaResponse {
  id: number;
  data_hora: string;
  metodo_pagamento: string;
  total_venda: number;
  total_pago: number;
  caixa: caixaResponse;
  movimentacoes_estoque: movimentacaoEstoqueResponse[];
  status: string;
  conta_cliente: ContaCliente;
}
export interface ClienteResponse {
  id: number,
  nome_cliente: string,
  telefone: string,
  status: string,
  saldo_devedor: number,
  valor_total: number,
  vendas: VendaResponse[];
  total_pago: number;
}

export interface Compras {
  compra_id: number,
  data_hora: string,
  total_compra: number,
  total_itens: number,
  metodo_pagamento: string,
}


export interface DetalhesCompra {
  horario_registro: string,
  img: string,
  nome_produto: string,
  observacao: string,
  preco_unitario: number,
  quantidade: number,
  tipo: string,
  valor: number
}

export interface ComprasItens {
  id: number,
  produto: ProdutoElement,
  quantidade: number,
  precoUnitario: string,
  tipo: string,
  valor: number,
  observacao: string
}


export interface VendasItens {
  produto: ProdutoElement,
  quantidade: number,
  observacao: string
}

export interface PagamentoComandaRequest {
  metodoPagamento: string
  idComanda: number
}

export interface ComandasItens {
  produto: ProdutoElement,
  quantidade: number,
}

export interface ComandasItensRequest {
  produto: number,
  tipo: string,
  quantidade: number,
  preco_unitario: number,
  observacao: string
}


export interface ComandaRequestAddItens {
  id_produto: number,
  quantidade: number
}


export interface ComprasItensRequest {
  produto: number,
  quantidade: number,
  preco_unitario: number,
  observacao: string
}

export interface ComprasRequest {
  metodo_pagamento: string,
  movimentacoes_estoque: ComprasItensRequest[]
}

export interface Vendas {
  venda_id: number,
  data_hora: string,
  total_venda: number,
  total_itens: number,
  metodo_pagamento: string,
}

export interface VendasItensRequest {
  produto: number,
  tipo: string,
  quantidade: number,
  preco_unitario: number,
  observacao: string
}

export interface VendasRequest {
  metodo_pagamento: string,
  movimentacoes_estoque: VendasItensRequest[],
  conta_cliente: ContaClienteRequest
}


export interface CategoriaElementRequest {
  id: number
}


export interface ProdutoFileIdResponse {
  img: string;
  imgID: string;
}

export interface categoria_produto {
  id: number,
  nome: string
}

export interface ProdutoElement {
  id: number,
  codBarras: string,
  nome: string,
  quantidade?: number,
  estoque: number,
  estoqueMinimo: number,
  img: string,
  imgID: string,
  preco: number,
  precoConsumo: number,
  subTotal: number,
  categoria: categoria_produto
}

export interface ProdutoElementRequest {
  id: number,
  nome: string,
  quantidade?: number,
  preco: number,
  precoConsumo: number,
  img: string,
  imgID: string,
  categoria: string
}

export interface ProdutoElementVendaResquest {
  codBarras: string,
  quantidade: number
}

export interface ClienteElementRequest {
  id: number
}

export interface ClienteElement {
  email: string,
  id: number,
  nome: string,
  numero: string
}


export interface Caixa {
  id: number,
  data_hora: string,
  status: string,
  valor_inicial: string,
  faturamento_dia: number,
  valor_total: number
}


export interface MovimentacoesEstoque {
  id_movimentacao: number,
  horario_registro: string,
  tipo: string,
  quantidade: number,
  valor: number,
  observacao: string,
  nome_produto: string
}

export interface MovimentacaoEstoqueComanda {
  id_movimentacao: number,
  produto_id: number,
  nome_produto: string,
  img: string,
  quantidade: number,
  horario_registro: string,
  tipo: string,
  valor: number,
  preco_unitario: number,
  observacao: string
}












export interface MovimentacoesEstoqueRequest {
  produto: number,
  tipo: string,
  quantidade: number,
  preco_unitario: number,
  observacao: string,
}

export interface VendaElement {
  id: number;
  totalVenda: number;
  dataVenda: string;
  statusVenda: string;
  metodoPagamento: string;
  produtos: ProdutoElement[];
  cliente: ClienteElement;
}



export interface VendaComandaElement {
  id: number;
  total_venda: number;
  total_pago: number;
  data_hora: string;
  status: string;
  metodo_pagamento: string;
  movimentacoes_estoque: MovimentacaoEstoqueComanda[];
}





export interface VendaElementRequest {
  cliente: ClienteElementRequest;
  statusVenda: string;
  metodoPagamento: string;
  produtos: ProdutoElementVendaResquest[];
}


export interface MenuLateralItens {
  nome: string,
  linkRouter: string,
  iconName: string
}


export interface ItemCompra {
  produto: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Compra {
  id: number;
  fornecedor: string;
  dataCompra: string;
  itens: ItemCompra[];
}

export interface ItemVenda {
  produto: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Venda {
  id: number;
  dataVenda: string;
  totalVenda: number;
}

export interface HistoricoDeCompras {
  id: number;
  fornecedor: string;
  dataCompra: string;
  itens: ItemCompra[];
}

export interface BasicResponse<T> {
  data: any
  entity: T;
  status: number;
}

export interface MenuLateralItens {
  nome: string,
  linkRouter: string,
  iconName: string
}

export interface CaixaDetails {
  debito: number,
  credito: number,
  pix: number,
  dinheiro: number,
  contaCliente: number
}

export interface ActionButton {
  title: string;
  icon: string;
  action: () => void;
}


export interface ComandaElement {
  id: number,
  data_hora: number,
  nomeCliente: string,
  idCliente: number,
  venda: VendaComandaElement[],
  status: string
}
