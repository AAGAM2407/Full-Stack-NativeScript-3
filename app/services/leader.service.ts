import { Injectable } from '@angular/core';

import { Leader } from '../shared/leader';

import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';

import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

import { map } from 'rxjs/operators';

import 'rxjs/add/operator/catch';

@Injectable()
export class LeaderService {

	constructor(public http: Http, 
				private processHTTPMsgService: ProcessHTTPMsgService) {
	}

	getLeaders(): Observable<Leader[]> {
		//returned observable is mapped - if it returns the result it will be processed with the extract data method
		return this.http.get(baseURL + 'leaders')
		.pipe(map(res => { return this.processHTTPMsgService.extractData(res);}));
	}

	getLeader(id: number): Observable<Leader> {
		return this.http.get(baseURL + 'leaders/' + id)
		.pipe(map(res => { return this.processHTTPMsgService.extractData(res);}));
	}

	getFeaturedLeader(): Observable<Leader> {
		return this.http.get(baseURL + 'leaders?featured=true')
		.pipe(map(res => { return this.processHTTPMsgService.extractData(res)[0];}));
	}
}