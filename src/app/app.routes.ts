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
        path: 'absences',
        loadChildren: () => import('./components/demandes/absence.routes').then(m => m.ABSENCE_ROUTES)
    },
    {
        path: 'materiels',
        loadChildren: () => import('./components/demandes/bien-et-service.routes').then(m => m.BIEN_ET_SERVICE_ROUTES)
    },
    {
        path: 'congers',
        loadChildren: () => import('./components/demandes/conge.routes').then(m => m.CONGE_ROUTES)
    },
    {
        path: 'permissions',
        loadChildren: () => import('./components/demandes/permission.routes').then(m => m.PERMISSION_ROUTES)
    },
    {
        path: 'designations',
        loadChildren: () => import('./components/designations/designations.routes').then(m => m.DESIGNATION_ROUTES)
    },
    {
        path: 'devis',
        loadChildren: () => import('./components/devis/devis-list/devis-list/devis_list.routes').then(m => m.DEVIS_LIST_ROUTES)
    },
    {
        path: 'devis/create',
        loadChildren: () => import('./components/devis/devis-create/devis-create/devis-create.routes').then(m => m.DEVIS_CREATE_ROUTES)
    },
    {
        path: 'devis/edit/:id',
        loadChildren: () => import('./components/devis/devis-edit/devis-edit/devis-edit.routes').then(m => m.DEVIS_EDIT_ROUTES)
    },
    {
        path: 'travel',
        loadChildren: () => import('./components/travel_request/travel-list/travel_list.routes').then(m => m.TRAVELS_LIST_ROUTES)
    },
    {
        path: 'travel/create',
        loadChildren: () => import('./components/travel_request/travel-create/travel-create.routes').then(m => m.TRAVELS_CREATE_ROUTES)
    },
    {
        path: 'travel/edit/:id',
        loadChildren: () => import('./components/travel_request/travel-edit/travel-edit.routes').then(m => m.TRAVELS_EDIT_ROUTES)
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
