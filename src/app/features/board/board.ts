import { Component, computed, inject } from '@angular/core';
import { Spots } from '../../core/services/spots';
import { AddSpotModal } from '../../shared/components/add-spot-modal/add-spot-modal';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';
import { LucideAngularModule, LogOut, Trash2, MapPin, Pencil } from 'lucide-angular';
import { Rating } from '../../core/services/rating';
import { FormsModule } from "@angular/forms";
import { Spot } from '../../core/models/spot.model';

@Component({
  selector: 'app-board',
  imports: [AddSpotModal, LucideAngularModule, FormsModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {

  spots = inject(Spots);
  router = inject(Router);
  auth = inject(Auth);
  rating = inject(Rating);

  showSpotModal = false;
  spotToEdit?:Spot;

  readonly LogOut = LogOut;
  readonly Trash2 = Trash2;
  readonly MapPin = MapPin;
  readonly Pencil = Pencil;

  visitedSpot = computed(() => this.spots.spots().filter(spot => spot.visited));
  pendingSpot = computed(() => this.spots.spots().filter(spot => !spot.visited));

  nickname = this.auth.getNickname() || '';
  nota: number = null!;

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  averageRating(spotId: string) {
    const ratings = this.rating.ratings();
    const spotRatings = ratings.filter(rating => rating.spot_id === spotId)
    if (spotRatings.length === 0) {
      return 0;
    }
    const total = spotRatings.reduce((sum, rating) => sum + rating.score, 0);
    return Math.round((total / spotRatings.length) * 100) / 100;
  }

  noteTheme(score: number): string {
    if (score === 0) return 'bg-gradient-to-r from-gray-100 to-gray-100';
    if (score <= 4) return 'bg-gradient-to-r from-red-50 to-red-100';
    if (score <= 7) return 'bg-gradient-to-r from-yellow-50 to-yellow-100';
    return 'bg-gradient-to-r from-green-50 to-green-100';
  }

  ratingTheme(spotId: string): { cardBg: string, cardBorder: string, headerHover: string, expandedBorder: string, noteBg: string, buttonBg: string, scoreText: string } {
    const avg = this.averageRating(spotId);

    if (avg === 0) return {
      cardBg: 'bg-gray-100',
      cardBorder: 'border-gray-200',
      headerHover: 'hover:bg-gray-100',
      expandedBorder: 'border-gray-200',
      noteBg: 'bg-gray-100',
      buttonBg: 'bg-gray-500 hover:bg-gray-600',
      scoreText: 'text-gray-500'
    };
    if (avg <= 4) return {
      cardBg: 'bg-red-100',
      cardBorder: 'border-red-100',
      headerHover: 'hover:bg-red-100',
      expandedBorder: 'border-red-200',
      noteBg: 'bg-red-50',
      buttonBg: 'bg-red-500 hover:bg-red-600',
      scoreText: 'text-red-600'
    };
    if (avg <= 7) return {
        cardBg: 'bg-yellow-100',
      cardBorder: 'border-yellow-100',
      headerHover: 'hover:bg-yellow-100',
      expandedBorder: 'border-yellow-200',
      noteBg: 'bg-yellow-50',
      buttonBg: 'bg-yellow-500 hover:bg-yellow-600',
      scoreText: 'text-yellow-600'
    };
    return {
      cardBg: 'bg-green-100',
      cardBorder: 'border-green-100',
      headerHover: 'hover:bg-green-100',
      expandedBorder: 'border-green-200',
      noteBg: 'bg-green-50',
      buttonBg: 'bg-green-600 hover:bg-green-700',
      scoreText: 'text-green-700'
    };
  }

  editSpot(spot:Spot){
    this.spotToEdit = spot;
    this.showSpotModal = true;
  }

  addRating(spotId: string) {
    const yaExiste = this.rating.ratings()
      .filter(r => r.spot_id === spotId)
      .some(r => r.nickname.toLowerCase() === this.nickname.toLowerCase());
    if (!yaExiste) {
      const notaValida = this.nota >= 0 && this.nota <= 10 && Math.round(this.nota * 10) === this.nota * 10;
      if (this.nickname.trim() === '' || !notaValida) {
        alert('introduce un nickname y una nota valida');

      } else {

        this.rating.addRating(spotId, this.nickname, this.nota);
        this.auth.nicknameStorage(this.nickname);

        this.nota = null!;
        return;
      }
    } else {
      alert('Ya has valorado este sitio');
    }
  }

  //funcionalidad para desplegamble
  expandedSpotId: string | null = null;
  deletePopoverId: string | null = null;

  toggleSpot(id: string) {
    this.expandedSpotId = this.expandedSpotId === id ? null : id;
  }

  toggleDeletePopover(id: string) {
    this.deletePopoverId = this.deletePopoverId === id ? null : id;
  }


}
