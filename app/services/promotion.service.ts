import { Injectable } from '@angular/core';

import { Promotion } from '../shared/promotion';

import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';

import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

import { map } from 'rxjs/operators';

import 'rxjs/add/operator/catch';

@Injectable()
export class PromotionService {

	constructor(public http: Http, 
				private processHTTPMsgService: ProcessHTTPMsgService) {
	}

	getPromotions(): Observable<Promotion[]> {
		//returned observable is mapped - if it returns the result it will be processed with the extract data method
		return this.http.get(baseURL + 'promotions')
		.pipe(map(res => { return this.processHTTPMsgService.extractData(res);}));
	}

	getPromotion(id: number): Observable<Promotion> {
		return this.http.get(baseURL + 'promotions/' + id)
		.pipe(map(res => { return this.processHTTPMsgService.extractData(res);}));
	}

	getFeaturedPromotion(): Observable<Promotion> {
		return this.http.get(baseURL + 'promotions?featured=true')
		.pipe(map(res => { return this.processHTTPMsgService.extractData(res)[0];}));
	}
}