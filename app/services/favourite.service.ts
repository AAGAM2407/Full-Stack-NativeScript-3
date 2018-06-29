import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Observable } from 'rxjs';
import { CouchbaseService } from '../services/couchbase.service';

import { map } from 'rxjs/operators';

@Injectable() 
export class FavouriteService {

	favourites: Array<number>;
	docId: string = "favorites";

	constructor(private dishservice: DishService,
			private couchbaseservice: CouchbaseService) {
		this.favourites = [];

		let doc = this.couchbaseservice.getDocument(this.docId);
		if(doc == null) {
			this.couchbaseservice.createDocument({"favourites": []}, this.docId);
		} else {
			this.favourites = doc.favourites;
		}
	}

	isFavourite(id: number): boolean {
		return this.favourites.some(el => el === id);
	}

	addFavourite(id: number): boolean {
		if(!this.isFavourite(id)) {
			this.favourites.push(id);
			this.couchbaseservice.updateDocument(this.docId, {"favourites": this.favourites});
		} 
		return true;
	}

	getFavourites(): Observable<Dish[]> {
		return this.dishservice.getDishes()
			.pipe(
			map(dishes => dishes.filter(dish => {
				return this.favourites.some(el => el === dish.id);
			}))
			);
	}

	deleteFavourite(id: number): Observable<Dish[]> {
		let index = this.favourites.indexOf(id);
		if(index >= 0) {
			this.favourites.splice(index,1);
			this.couchbaseservice.updateDocument(this.docId, {"favourites": this.favourites});
			return this.getFavourites();
		} else {
			return Observable.throw('Deleting non-existing favourite');
		}
	}
}