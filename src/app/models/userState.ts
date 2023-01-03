export interface UserState {
    usuario: string;
    Grupo: string;
    groupPermissions: string[];
    SubGrupo: string[];
    permisoUsuario: string[];
    HoraLogueo: Date;
    TokenAcceso: string;
    TokenRefresco: string;
  }