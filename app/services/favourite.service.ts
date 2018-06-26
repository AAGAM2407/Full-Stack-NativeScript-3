import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Observable } from 'rxjs';

import { map} from 'rxjs/operators';

@Injectable() 
export class FavouriteService {

	favourites: Array<number>;

	constructor(private dishservice: DishService) {
		this.favourites = [];
	}

	isFavourite(id: number): boolean {
		return this.favourites.some(el => el === id);
	}

	addFavourite(id: number): boolean {
		if(!this.isFavourite(id)) {
			this.favourites.push(id);
		} 
		return true;
	}

	getFavourites(): Observable<Dish[]> {
		return this.dishservice.getDishes()
			.pipe(map (dishes=> dishes.filter(dish => this.favourites.some(el => el === dish.id))));
	}

	deleteFavourite(id: number): Observable<Dish[]> {
		let index = this.favourites.indexOf(id);
		if(index >= 0) {
			this.favourites.splice(index,1);
		} else {
			return Observable.throw('Deleting non-existing favourite');
		}
	}
}