import { inject, Injectable, signal } from '@angular/core';
import { Supabase } from './supabase';
import { Spot } from '../models/spot.model';




@Injectable({
  providedIn: 'root',
})
export class Spots {

  supabase = inject(Supabase);

  spots = signal<Spot[]>([]);

  constructor() {
    this.getSpots();
    this.subscribeToSpots();
  }

  async getSpots() {
    const { data, error } = await this.supabase.client.from('spots').select('*');
    if (error) {
      console.error('Error trayendo spots:', error);
    } else {
      this.spots.set(data || []);
    }
  }

  async addSpot(title: string, location: string, location_map: string) {
    const { error } = await this.supabase.client.from('spots').insert({ title, location, location_map });
    if (error) {
      console.error('Error añadiendo spot:', error);
    }
  }

  async updateSpot(id: string, title: string, location: string, location_map: string) {
    const { error } = await this.supabase.client.from('spots').update({ title, location, location_map }).eq('id', id);
    if (error) {
      console.error('Error actualizando spot:', error);
    }
  }

  async markVisited(id: string) {
    const { error } = await this.supabase.client.from('spots').update({ visited: true }).eq('id', id);
    if (error) {
      console.error('Error actualizando spot:', error);
    }
  }

  async deleteSpot(id: string) {

    const { error } = await this.supabase.client.from('spots').delete().eq('id', id);
    if (error) {
      console.error('Error eliminando spot:', error);
    }

  }

  subscribeToSpots() {
    this.supabase.client
      .channel('spots')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'spots' }, _ => {
          this.getSpots();
        }).subscribe();
  }

}
