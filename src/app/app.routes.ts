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

  // Route wildcard pour rediriger les routes inconnues vers login
  { path: '**', redirectTo: '/login' }
];
