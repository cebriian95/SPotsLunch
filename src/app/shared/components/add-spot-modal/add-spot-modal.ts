import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Spots } from '../../../core/services/spots';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-spot-modal',
  imports: [FormsModule],
  templateUrl: './add-spot-modal.html',
  styleUrl: './add-spot-modal.css',
})
export class AddSpotModal {

  spots=inject(Spots);

  @Output() close = new EventEmitter();

  title = '';
  location = '';
  titleError = '';
  locationError = '';

  createSpot() {
    if (this.title.trim() && this.location.trim()) {
      this.spots.addSpot(this.title, this.location);
      this.close.emit();
    } else {
      // Validación de campos
      if (!this.title.trim()) {
        this.titleError = 'Por favor, complete el campo de restaurante.';
      }else if (this.title.trim().length > 40) {
        this.titleError = 'El nombre del restaurante no puede exceder los 40 caracteres.';
      }else {
        this.titleError = '';
      }
      
      if (!this.location.trim()) {
        this.locationError = 'Por favor, complete el campo de ubicación.';
      }else if (this.location.trim().length > 40) {
        this.locationError = 'La ubicación no puede exceder los 40 caracteres.';
      }else {
        this.locationError = '';
      }
    }
  }

  cancel() {
    this.close.emit();
  }

}
