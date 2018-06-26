import { Injectable } from '@angular/core';

import { Dish } from '../shared/dish';

import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';

import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


import { map} from 'rxjs/operators';

import 'rxjs/add/operator/catch';

@Injectable()
export class DishService {

	constructor(public http: Http, 
				private processHTTPMsgService: ProcessHTTPMsgService) {
	}

	getDishes(): Observable<Dish[]> {
		//returned observable is mapped - if it returns the result it will be processed with the extract data method
		return this.http.get(baseURL + 'dishes')
		.pipe(map(res => { return this.processHTTPMsgService.extractData(res);}));
	}

	getDish(id: number): Observable<Dish> {
		return this.http.get(baseURL + 'dishes/' + id)
		.pipe(map(res => { return this.processHTTPMsgService.extractData(res);}));
	}

	getFeaturedDish(): Observable<Dish> {
		return this.http.get(baseURL + 'dishes?featured=true')
		.pipe(map(res => { return this.processHTTPMsgService.extractData(res)[0];}));
	}
}