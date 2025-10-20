// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  // Routes publiques
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },

    // {
    //     path: 'dashboard', component: DashboardComponent
    // },
    // {
    //     path: 'configuration-generale',
    //     loadChildren: () => import('./components/configuration-generale/configuration-generale.routes').then(m => m.CONFIGURATION_GENERALE_ROUTES)
    // },
    // {
    //     path: 'utilisateurs',
    //     loadChildren: () => import('./components/utilisateurs/utilisateurs.routes').then(m => m.UTILISATEURS_ROUTES)
    // },
    // {
    //     path: 'banques',
    //     loadChildren: () => import('./components/banques/banques.routes').then(m => m.BANQUE_ROUTES)
    // },
    // {
    //     path: 'clients',
    //     loadChildren: () => import('./components/clients/clients.routes').then(m => m.CLIENTS_ROUTES)
    // },
    // {
    //     path: 'absences',
    //     loadChildren: () => import('./components/demandes/absence.routes').then(m => m.ABSENCE_ROUTES)
    // },
    // {
    //     path: 'materiels',
    //     loadChildren: () => import('./components/demandes/bien-et-service.routes').then(m => m.BIEN_ET_SERVICE_ROUTES)
    // },
    // {
    //     path: 'congers',
    //     loadChildren: () => import('./components/demandes/conge.routes').then(m => m.CONGE_ROUTES)
    // },
    // {
    //     path: 'permissions',
    //     loadChildren: () => import('./components/demandes/permission.routes').then(m => m.PERMISSION_ROUTES)
    // },
    // {
    //     path: 'designations',
    //     loadChildren: () => import('./components/designations/designations.routes').then(m => m.DESIGNATION_ROUTES)
    // },
    // {
    //     path: 'devis',
    //     loadChildren: () => import('./components/devis/devis-list/devis-list/devis_list.routes').then(m => m.DEVIS_LIST_ROUTES)
    // },
    // {
    //     path: 'devis/create',
    //     loadChildren: () => import('./components/devis/devis-create/devis-create/devis-create.routes').then(m => m.DEVIS_CREATE_ROUTES)
    // },
    // {
    //     path: 'devis/edit/:id',
    //     loadChildren: () => import('./components/devis/devis-edit/devis-edit/devis-edit.routes').then(m => m.DEVIS_EDIT_ROUTES)
    // },
    // {
    //     path: 'travel',
    //     loadChildren: () => import('./components/travel_request/travel-list/travel_list.routes').then(m => m.TRAVELS_LIST_ROUTES)
    // },
    // {
    //     path: 'travel/create',
    //     loadChildren: () => import('./components/travel_request/travel-create/travel-create.routes').then(m => m.TRAVELS_CREATE_ROUTES)
    // },
    // {
    //     path: 'travel/edit/:id',
    //     loadChildren: () => import('./components/travel_request/travel-edit/travel-edit.routes').then(m => m.TRAVELS_EDIT_ROUTES)
    // },
    // {
    //     path: 'devis',
    //     loadChildren: () => import('./components/devis/devis.routes').then(m => m.DEVIS_ROUTES)
    // },
    // {
    //     path: 'factures',
    //     loadChildren: () => import('./components/factures/factures.routes').then(m => m.FACTURES_ROUTES)
    // }
  // Routes protégées
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'configuration-generale',
    loadChildren: () =>
      import('./components/configuration-generale/configuration-generale.routes')
        .then(m => m.CONFIGURATION_GENERALE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'utilisateurs',
    loadChildren: () =>
      import('./components/utilisateurs/utilisateurs.routes').then(m => m.UTILISATEURS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'banques',
    loadChildren: () =>
      import('./components/banques/banques.routes').then(m => m.BANQUE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients',
    loadChildren: () =>
      import('./components/clients/clients.routes').then(m => m.CLIENTS_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'designations',
    loadChildren: () =>
      import('./components/designations/designations.routes').then(m => m.DESIGNATION_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'devis',
    loadChildren: () =>
      import('./components/devis/devis-list/devis_list.routes').then(m => m.DEVIS_LIST_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'devis/create',
    loadChildren: () =>
      import('./components/devis/devis-create/devis-create.routes').then(m => m.DEVIS_CREATE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'devis/edit/:id',
    loadChildren: () =>
      import('./components/devis/devis-edit/devis-edit.routes').then(m => m.DEVIS_EDIT_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'devis/suivi',
    loadChildren: () =>
      import('./components/devis/suivi/suivi.routes').then(m => m.DEVIS_SUIVI_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'factures',
    loadChildren: () =>
      import('./components/factures/facture-list/facture-list.routes').then(m => m.FACTURE_LIST_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'factures/create',
    loadChildren: () =>
      import('./components/factures/facture-create/facture-create.routes').then(m => m.FACTURE_CREATE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'factures/create/partielle/:id',
    loadChildren: () =>
      import('./components/factures/facture-create-partielle/facture-create-partielle.routes')
        .then(m => m.FACTURE_PARTIELLE_CREATE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'factures/create/totale/:id',
    loadChildren: () =>
      import('./components/factures/facture-create-totale/facture-create-totale.routes')
        .then(m => m.FACTURE_TOTALE_CREATE_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'factures/paiement',
    loadChildren: () =>
      import('./components/factures/facture-paiement/facture-paiement.routes').then(m => m.FACTURE_PAIEMENT_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'factures/suivi',
    loadChildren: () =>
      import('./components/factures/facture-suivi/facture-suivi.routes').then(m => m.FACTURE_SUIVI_ROUTES),
    canActivate: [AuthGuard]
  },

    {
        path: 'travel',
        loadChildren: () => import('./components/travel_request/travel-list/travel_list.routes').then(m => m.TRAVELS_LIST_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'travel/create',
        loadChildren: () => import('./components/travel_request/travel-create/travel-create.routes').then(m => m.TRAVELS_CREATE_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'travel/edit/:id',
        loadChildren: () => import('./components/travel_request/travel-edit/travel-edit.routes').then(m => m.TRAVELS_EDIT_ROUTES),
        canActivate: [AuthGuard]
    },

    {
      path: 'travel/suivi',
      loadChildren: () =>
        import('./components/travel_request/suivi/suivi.routes').then(m => m.TRAVELS_SUIVI_ROUTES),
      canActivate: [AuthGuard]
    },

    {
        path: 'absences',
        loadChildren: () => import('./components/demandes/absence.routes').then(m => m.ABSENCE_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'materiels',
        loadChildren: () => import('./components/demandes/bien-et-service.routes').then(m => m.BIEN_ET_SERVICE_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'analysedemandes',
        loadChildren: () => import('./components/demandes/analysedemande/liste.routes').then(m => m.LISTE_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'congers',
        loadChildren: () => import('./components/demandes/conge.routes').then(m => m.CONGE_ROUTES),
        canActivate: [AuthGuard]
    },
    {
        path: 'permissions',
        loadChildren: () => import('./components/demandes/permission.routes').then(m => m.PERMISSION_ROUTES),
        canActivate: [AuthGuard]
    },

  // Route wildcard pour rediriger les routes inconnues vers login
  { path: '**', redirectTo: '/login' }
];
