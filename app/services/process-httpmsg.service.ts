import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';

@Injectable()
export class ProcessHTTPMsgService {

	constructor() {}

	public extractData(res: Response) {
		//process msgs from the server-side
		let body = res.json();
		return body || {};
	}

	// public handleError(error: Response | any) {
	// 	let errMsg: string;

	// 	// if the error is from the server-side
	// 	if(error instanceof Response) {
	// 		const body = error.json();
	// 		const err = body.error || JSON.stringify(body);
	// 		errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
	// 	} else {
	// 		errMsg = error.message ? error.message : error.toString();
	// 	}

	// 	return Observable.throw(errMsg);
		
	// }

}