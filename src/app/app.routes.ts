import { Routes } from '@angular/router';
import { DashboardComponent  } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    {path : '', redirectTo: '/dashboard', pathMatch: 'full'},

    { 
        path: 'dashboard', component: DashboardComponent 
    },
    {
        path: 'configuration-generale',
        loadChildren: () => import('./components/configuration-generale/configuration-generale.routes').then(m => m.CONFIGURATION_GENERALE_ROUTES)
    },
    {
        path: 'utilisateurs',
        loadChildren: () => import('./components/utilisateurs/utilisateurs.routes').then(m => m.UTILISATEURS_ROUTES)
    },
    {
        path: 'banques',
        loadChildren: () => import('./components/banques/banques.routes').then(m => m.BANQUE_ROUTES)
    },
    {
        path: 'clients',
        loadChildren: () => import('./components/clients/clients.routes').then(m => m.CLIENTS_ROUTES)
    },
    {
        path: 'designations',
        loadChildren: () => import('./components/designations/designations.routes').then(m => m.DESIGNATION_ROUTES)
    },
    // { 
    //     path: 'devis', 
    //     loadChildren: () => import('./components/devis/devis.routes').then(m => m.DEVIS_ROUTES)
    // },
    // { 
    //     path: 'factures', 
    //     loadChildren: () => import('./components/factures/factures.routes').then(m => m.FACTURES_ROUTES)
    // }
];
