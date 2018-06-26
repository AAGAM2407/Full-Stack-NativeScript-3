import { Component, OnInit, Inject } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import 'rxjs/add/operator/switchMap';

@Component({
	selector: 'app-contact',
	moduleId: module.id,
	templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

	constructor(private route: ActivatedRoute,
				private routerExtensions: RouterExtensions,
				@Inject('BaseURL') private BaseURL) {
	}

	ngOnInit() {
		
	}

	goBack(): void {
		this.routerExtensions.back();
	}
}