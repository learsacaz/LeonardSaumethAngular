import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "Listar-productos",
        loadComponent: ()=>import("./components/lista-productos/lista-productos").then(m=>m.ListaProductos)
    },
    {
        path: "Registrar-productos",
        loadComponent: ()=>import("./components/registro-productos/registro-productos").then(m=>m.RegistroProductos)
    },
    {
        path: "Actualizar-producto",
        loadComponent: ()=>import("./components/actualizacion-producto/actualizacion-producto").then(m=>m.ActualizacionProducto)
    },
    {
        path: "**",
        redirectTo: "Listar-productos"
    }
];
