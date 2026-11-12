export interface Categoria {
  creadoPor?: string;
  modificadoPor?: string; id: number; nombre: string; descripcion: string | null; estado: boolean; }
export type CategoriaRequest = Omit<Categoria, 'id'>;
