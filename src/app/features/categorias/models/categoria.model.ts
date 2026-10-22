export interface Categoria { id: number; nombre: string; descripcion: string | null; estado: boolean; }
export type CategoriaRequest = Omit<Categoria, 'id'>;
