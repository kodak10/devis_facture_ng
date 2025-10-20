import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AbsenceService, Absence } from '../../../services/absence.service';
import { DemandeService, Demande } from '../../../services/demande.service';
import { CongerService, Congers } from '../../../services/conges.service';
import { permissionsService, Permissions } from '../../../services/permissions.service';

declare var $: any;

@Component({
  selector: 'app-liste-demandes',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './liste.html',
  styleUrls: ['./liste.scss']
})
export class ListeComponent implements OnInit {

  Number(arg0: string|undefined) {
    throw new Error('Method not implemented.');
  }

  /** --- Absences --- */
  absences: any[] = [];
  selectedAbsence: Absence = {} as Absence;
  formAbsence: Absence = {} as Absence;

  /** --- Demandes --- */
  demandes: any[] = [];
  selectedDemande: Demande = {} as Demande;
  formDemande: Demande = {} as Demande;

  /** --- Congés --- */
  conges: any[] = [];
  selectedConger: Congers = {} as Congers;
  formConger: Congers = {} as Congers;
  dateRepriseMessageConges: string = '';
  isPartielConges: boolean = false;

  /** --- Permissions --- */
  permissions: any[] = [];
  selectedPermission: Permissions = {} as Permissions;
  formPermission: Permissions = {} as Permissions;
  dateRepriseMessagePermissions: string = '';
  isPartielPermissions: boolean = false;

  /** --- Erreurs --- */
  errors: any = {};

  /** --- Jours fériés --- */
  joursFeries: string[] = [
    '2025-01-01','2025-04-21','2025-05-01','2025-05-29','2025-06-09','2025-07-14','2025-08-07','2025-11-01','2025-12-25',
    '2026-01-01','2026-04-21','2026-05-01','2026-05-29','2026-06-09','2026-07-14','2026-08-07','2026-11-01','2026-12-25',
    '2027-01-01','2027-04-21','2027-05-01','2027-05-29','2027-06-09','2027-07-14','2027-08-07','2027-11-01','2027-12-25',
    '2028-01-01','2028-04-21','2028-05-01','2028-05-29','2028-06-09','2028-07-14','2028-08-07','2028-11-01','2028-12-25'
  ];

  constructor(
    private absenceService: AbsenceService,
    private demandeService: DemandeService,
    private congerService: CongerService,
    private permissionsService: permissionsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadAbsences();
    this.loadDemandes();
    this.loadConges();
    this.loadPermissions();
  }

  /** ===================== ABSENCES ===================== */
  loadAbsences() {
    this.absenceService.getAbsences().subscribe(res => {
      this.absences = (res as any).data ?? res;
      this.initDataTable('#datatableAbsence');
    });
  }

  openAbsenceModal(content: any, absence: Absence | null = null) {
    this.selectedAbsence = absence ? { ...absence } : {} as Absence;
    this.formAbsence = { ...this.selectedAbsence };
    this.modalService.open(content, { size: 'lg' });
    this.errors = {};
  }

  saveAbsence(formData: any) {
    const payload = { ...this.selectedAbsence, ...formData };
    const request = this.selectedAbsence.id
      ? this.absenceService.updateAbsences(payload)
      : this.absenceService.createAbsences(payload);
    request.subscribe({
      next: () => { this.modalService.dismissAll(); this.loadAbsences(); this.errors = {}; },
      error: (err) => this.errors = err.error.errors
    });
  }

  deleteAbsence(id?: number) {
    if (!id || !confirm('Voulez-vous supprimer cette absence ?')) return;
    this.absenceService.deleteAbsences(id).subscribe(() => this.loadAbsences());
  }

  /** ===================== DEMANDES ===================== */
  loadDemandes() {
    this.demandeService.getDemandes().subscribe(res => {
      this.demandes = (res as any).data ?? res;
      this.initDataTable('#datatableDemande');
    });
  }

  openDemandeModal(content: any, demande: Demande | null = null) {
    this.selectedDemande = demande ? { ...demande } : {} as Demande;
    this.formDemande = { ...this.selectedDemande };
    this.modalService.open(content, { size: 'lg' });
    this.errors = {};
  }

  saveDemande(formData: any) {
    const payload = { ...this.selectedDemande, ...formData };
    const request = this.selectedDemande.id
      ? this.demandeService.updateDemandes(payload)
      : this.demandeService.createDemandes(payload);
    request.subscribe({
      next: () => { this.modalService.dismissAll(); this.loadDemandes(); this.errors = {}; },
      error: (err) => this.errors = err.error.errors
    });
  }

  hasPendingRequestsdemande(): boolean {
    return this.demandes?.some(d => d.statut === 0);
  }

  hasPendingRequestspermission(): boolean {
    return this.permissions?.some(p => p.statut === 0);
  }

  hasPendingRequestsabcence(): boolean {
    return this.absences?.some(a => a.statut === 0);
  }

  hasPendingRequestsconges(): boolean {
    return this.conges?.some(c => c.statut === 0);
  }

  updateStatutdemande(demandeId: number, statut: number) {
    this.demandeService.updateStatutDemandes(demandeId, statut).subscribe(() => this.loadDemandes());
  }

  updateStatutabsence(absenceId: number, statut: number) {
    this.absenceService.updateStatutAbsences(absenceId, statut).subscribe(() => this.loadAbsences());
  }

  updateStatutpermission(demandeId: number, statut: number) {
    this.permissionsService.updateStatutPermissions(demandeId, statut).subscribe(() => this.loadPermissions());
  }

  updateStatutconges(demandeId: number, statut: number) {
    this.congerService.updateStatutCongers(demandeId, statut).subscribe(() => this.loadConges());
  }

  deleteDemande(id?: number) {
    if (!id || !confirm('Voulez-vous supprimer cette demande ?')) return;
    this.demandeService.deleteDemandes(id).subscribe(() => this.loadDemandes());
  }

  hasPending(list: any[]): boolean {
    return list.some(d => d.statut === 0);
  }

  /** ===================== CONGES ===================== */
  loadConges() {
    this.congerService.getCongers().subscribe(res => {
      this.conges = (res as any).data ?? res;
      this.initDataTable('#datatableConges');
    });
  }

  openCongerModal(content: any, conger: Congers | null = null) {
    this.selectedConger = conger ? { ...conger } : {} as Congers;
    this.formConger = { ...this.selectedConger };
    this.isPartielConges = this.formConger.motif === 'Congés partiel';
    this.modalService.open(content, { size: 'lg' });
    this.errors = {};
  }

  onTypeChangeConges(event: any) {
    const type = event.target.value;
    this.isPartielConges = type === 'Congés partiel';
    if (!this.isPartielConges) {
      this.formConger.nombre_de_jours = 30;
      this.updateDateFinConges();
    } else {
      this.formConger.nombre_de_jours = undefined;
    }
  }

  updateDateFinConges() {
    if (!this.formConger.date_depart) return;
    let jours = this.formConger.nombre_de_jours || (this.isPartielConges ? 1 : 30);
    let dateFin = new Date(this.formConger.date_depart);
    let joursAjoutes = 0;
    while (joursAjoutes < jours) {
      dateFin.setDate(dateFin.getDate() + 1);
      if (!this.joursFeries.includes(this.formatDate(dateFin))) joursAjoutes++;
    }
    this.formConger.date_fin = this.formatDate(dateFin);

    let dateReprise = new Date(dateFin);
    dateReprise.setDate(dateReprise.getDate() + 1);
    while (this.joursFeries.includes(this.formatDate(dateReprise))) dateReprise.setDate(dateReprise.getDate() + 1);
    this.dateRepriseMessageConges = `🗓️ Vous reprenez le service le ${this.formatDate(dateReprise)}.`;
  }

  saveConger(formData: any) {
    const payload = { ...this.selectedConger, ...formData };
    const request = this.selectedConger.id
      ? this.congerService.updateCongers(payload)
      : this.congerService.createCongers(payload);
    request.subscribe({
      next: () => { this.modalService.dismissAll(); this.loadConges(); this.errors = {}; },
      error: (err) => this.errors = err.error.errors
    });
  }

  deleteConger(id?: number) {
    if (!id || !confirm('Voulez-vous supprimer ce congé ?')) return;
    this.congerService.deleteCongers(id).subscribe(() => this.loadConges());
  }

  /** ===================== PERMISSIONS ===================== */
  loadPermissions() {
    this.permissionsService.getPermissions().subscribe(res => {
      this.permissions = (res as any).data ?? res;
      this.initDataTable('#datatablePermissions');
    });
  }

  openPermissionModal(content: any, permission: Permissions | null = null) {
    this.selectedPermission = permission ? { ...permission } : {} as Permissions;
    this.formPermission = { ...this.selectedPermission };
    this.isPartielPermissions = this.formPermission.motif === 'Congés partiel';
    this.modalService.open(content, { size: 'lg' });
    this.errors = {};
  }

  onTypeChangePermissions(event: any) {
    const type = event.target.value;
    this.isPartielPermissions = type === 'Congés partiel';
    if (!this.isPartielPermissions) {
      this.formPermission.nombre_de_jours = 30;
      this.updateDateFinPermissions();
    } else {
      this.formPermission.nombre_de_jours = undefined;
    }
  }

  updateDateFinPermissions() {
    if (!this.formPermission.date_depart || !this.formPermission.motif) return;

    const selectElement = document.getElementById('motifPermission') as HTMLSelectElement;
    const selectedOption = selectElement?.selectedOptions[0];
    const joursAttribues = selectedOption ? parseInt(selectedOption.getAttribute('data-nombre') || '1', 10) : 1;

    let dateFin = new Date(this.formPermission.date_depart);
    let joursAjoutes = 0;
    while (joursAjoutes < joursAttribues) {
      dateFin.setDate(dateFin.getDate() + 1);
      if (!this.joursFeries.includes(this.formatDate(dateFin))) joursAjoutes++;
    }
    this.formPermission.date_fin = this.formatDate(dateFin);

    let dateReprise = new Date(dateFin);
    dateReprise.setDate(dateReprise.getDate() + 1);
    while (this.joursFeries.includes(this.formatDate(dateReprise))) dateReprise.setDate(dateReprise.getDate() + 1);
    this.dateRepriseMessagePermissions = `🗓️ Vous reprenez le service le ${this.formatDate(dateReprise)}.`;
  }

  savePermission(formData: any) {
    const payload = { ...this.selectedPermission, ...formData };
    const request = this.selectedPermission.id
      ? this.permissionsService.updatePermissions(payload)
      : this.permissionsService.createPermissions(payload);
    request.subscribe({
      next: () => { this.modalService.dismissAll(); this.loadPermissions(); this.errors = {}; },
      error: (err) => this.errors = err.error.errors
    });
  }

  deletePermission(id?: number) {
    if (!id || !confirm('Voulez-vous supprimer cette permission ?')) return;
    this.permissionsService.deletePermissions(id).subscribe(() => this.loadPermissions());
  }

  /** ===================== UTILS ===================== */
  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  initDataTable(selector: string) {
    setTimeout(() => {
      if ($.fn.DataTable.isDataTable(selector)) $(selector).DataTable().destroy();
      $(selector).DataTable({ responsive: true });
    }, 0);
  }
}
