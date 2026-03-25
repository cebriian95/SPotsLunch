import { Component, computed, inject } from '@angular/core';
import { Spots } from '../../core/services/spots';
import { AddSpotModal } from '../../shared/components/add-spot-modal/add-spot-modal';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';
import { LucideAngularModule, LogOut, Trash2, MapPin, Pencil, Sun, Moon } from 'lucide-angular';
import { Rating } from '../../core/services/rating';
import { FormsModule } from "@angular/forms";
import { Spot } from '../../core/models/spot.model';
import { ThemeService } from '../../core/services/theme';

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
  themeService = inject(ThemeService);

  showSpotModal = false;
  spotToEdit?:Spot;
  expandedSpotId?: string;
  deletePopoverId?: string;
  nota: number | null = null;

  readonly LogOut = LogOut;
  readonly Trash2 = Trash2;
  readonly MapPin = MapPin;
  readonly Pencil = Pencil;
  readonly Sun = Sun;
  readonly Moon = Moon;

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  visitedSpot = computed(() => this.spots.spots().filter(spot => spot.visited));
  pendingSpot = computed(() => this.spots.spots().filter(spot => !spot.visited));

  nickname = this.auth.getNickname() || '';

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
    const isDark = this.themeService.isDarkMode();
    if (score === 0) return isDark ? 'bg-gradient-to-r from-gray-600 to-gray-700' : 'bg-gradient-to-r from-gray-100 to-gray-100';
    if (score <= 4) return isDark ? 'bg-gradient-to-r from-red-700 to-red-800' : 'bg-gradient-to-r from-red-50 to-red-100';
    if (score <= 7) return isDark ? 'bg-gradient-to-r from-yellow-700 to-yellow-800' : 'bg-gradient-to-r from-yellow-50 to-yellow-100';
    return isDark ? 'bg-gradient-to-r from-green-700 to-green-800' : 'bg-gradient-to-r from-green-50 to-green-100';
  }

  ratingTheme(spotId: string): { cardBg: string, cardBorder: string, headerHover: string, expandedBorder: string, noteBg: string, buttonBg: string, scoreText: string } {
    const avg = this.averageRating(spotId);
    const isDark = this.themeService.isDarkMode();

    if (avg === 0) return {
      cardBg: isDark ? 'bg-gray-700' : 'bg-gray-100',
      cardBorder: isDark ? 'border-gray-600' : 'border-gray-200',
      headerHover: isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-100',
      expandedBorder: isDark ? 'border-gray-600' : 'border-gray-200',
      noteBg: isDark ? 'bg-gray-600' : 'bg-gray-100',
      buttonBg: 'bg-gray-500 hover:bg-gray-600',
      scoreText: isDark ? 'text-gray-300' : 'text-gray-500'
    };
    if (avg <= 4) return {
      cardBg: isDark ? 'bg-red-800' : 'bg-red-100',
      cardBorder: isDark ? 'border-red-600' : 'border-red-100',
      headerHover: isDark ? 'hover:bg-red-700' : 'hover:bg-red-100',
      expandedBorder: isDark ? 'border-red-600' : 'border-red-200',
      noteBg: isDark ? 'bg-red-700' : 'bg-red-50',
      buttonBg: 'bg-red-500 hover:bg-red-600',
      scoreText: isDark ? 'text-red-300' : 'text-red-600'
    };
    if (avg <= 7) return {
        cardBg: isDark ? 'bg-yellow-800' : 'bg-yellow-100',
      cardBorder: isDark ? 'border-yellow-600' : 'border-yellow-100',
      headerHover: isDark ? 'hover:bg-yellow-700' : 'hover:bg-yellow-100',
      expandedBorder: isDark ? 'border-yellow-600' : 'border-yellow-200',
      noteBg: isDark ? 'bg-yellow-700' : 'bg-yellow-50',
      buttonBg: 'bg-yellow-500 hover:bg-yellow-600',
      scoreText: isDark ? 'text-yellow-300' : 'text-yellow-600'
    };
    return {
      cardBg: isDark ? 'bg-green-800' : 'bg-green-100',
      cardBorder: isDark ? 'border-green-600' : 'border-green-100',
      headerHover: isDark ? 'hover:bg-green-700' : 'hover:bg-green-100',
      expandedBorder: isDark ? 'border-green-600' : 'border-green-200',
      noteBg: isDark ? 'bg-green-700' : 'bg-green-50',
      buttonBg: 'bg-green-600 hover:bg-green-700',
      scoreText: isDark ? 'text-green-300' : 'text-green-700'
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
      const notaValida = this.nota !== null && this.nota >= 0 && this.nota <= 10 && Math.round(this.nota * 10) === this.nota * 10;
      if (this.nickname.trim() === '' || !notaValida) {
        alert('introduce un nickname y una nota valida');

      } else {

        this.rating.addRating(spotId, this.nickname, this.nota!);
        this.auth.nicknameStorage(this.nickname);

        this.nota = null;
        return;
      }
    } else {
      alert('Ya has valorado este sitio');
    }
  }

  //funcionalidad para desplegamble
  toggleSpot(id: string) {
    this.expandedSpotId = this.expandedSpotId === id ? undefined : id;
  }

  toggleDeletePopover(id: string) {
    this.deletePopoverId = this.deletePopoverId === id ? undefined : id;
  }


}
