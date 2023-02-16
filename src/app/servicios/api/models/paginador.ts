export interface FiltroProductoLista {
    Modo                   : number;
    Filtro                 : string;
    Orden                  : string;
    Filas                  : number;
    Pagina                 : number;
    Empresa?               : any;
    Codigo?                : string;
    TotalPaginas?          : number;
    TotalRegistros?        : number;
    [key: string]          : any;
  };