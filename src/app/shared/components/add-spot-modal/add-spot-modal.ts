import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Spots } from '../../../core/services/spots';
import { FormsModule } from '@angular/forms';
import { Spot } from '../../../core/models/spot.model';

@Component({
  selector: 'app-add-spot-modal',
  imports: [FormsModule],
  templateUrl: './add-spot-modal.html',
  styleUrl: './add-spot-modal.css',
})
export class AddSpotModal implements OnInit {

  spots = inject(Spots);

  @Input() spot?: Spot;

  @Output() close = new EventEmitter();

  title = '';
  location = '';
  location_map = '';

  titleError = '';
  locationError = '';
  location_mapError = '';

  createSpot() {
    if (this.title.trim() && this.location.trim()) {
      if (this.location_map.trim() && !this.location_map.trim().startsWith('https://maps.app.goo.gl/')) {
        this.location_mapError = 'Por favor, ingrese un enlace válido de Google Maps.';
      } else {
        if (this.spot) {
          this.spots.updateSpot(this.spot.id, this.title, this.location, this.location_map);
        } else {
          this.spots.addSpot(this.title, this.location, this.location_map);
        }
        this.close.emit();
      }
    } else {
      // Validación de campos
      if (!this.title.trim()) {
        this.titleError = 'Por favor, complete el campo de restaurante.';
      } else {
        this.titleError = '';
      }

      if (!this.location.trim()) {
        this.locationError = 'Por favor, complete el campo de ubicación.';
      } else {
        this.locationError = '';
      }
    }
  }

  ngOnInit(){
    if (this.spot) {
      this.title=this.spot.title;
      this.location=this.spot.location;
      this.location_map=this.spot.location_map;
    }
  }

  cancel() {
    this.close.emit();
  }

}
