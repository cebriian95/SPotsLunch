import { Component, computed, inject } from '@angular/core';
import { Spots } from '../../core/services/spots';
import { AddSpotModal } from '../../shared/components/add-spot-modal/add-spot-modal';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';
import { LucideAngularModule, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-board',
  imports: [AddSpotModal, LucideAngularModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {

  spots = inject(Spots);
  auth = inject(Auth);
  router = inject(Router);
  
  showSpotModal = false;
  readonly LogOut = LogOut;

  visitedSpot = computed(() => this.spots.spots().filter(spot => spot.visited));
  pendingSpot = computed(() => this.spots.spots().filter(spot => !spot.visited));

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
