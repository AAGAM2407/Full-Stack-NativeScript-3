import { Component, OnInit, Inject } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as Email from 'nativescript-email';
import * as Phone from 'nativescript-phone';

import 'rxjs/add/operator/switchMap';

@Component({
	selector: 'app-contact',
	moduleId: module.id,
	templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

	constructor(private route: ActivatedRoute,
				private routerExtensions: RouterExtensions,
				private fonticon: TNSFontIconService,
				@Inject('BaseURL') private BaseURL) {
	}

	ngOnInit() {
		
	}

	sendEmail() {
		Email.available()
			.then((avail: boolean) => {
				if (avail) {
					Email.compose({
						to: ['confusion@food.net'],
						subject: '[ConFusion: Query',
						body: 'Dear Sir/Madam:'
					});
				} else {
					console.log('No Email Configured');
				}
			});
	}

	callRestaurant() {
		console.log('call button is clicked');
		Phone.sms(['415-123-4567'], 'My message')
			.then((args) => {
				console.log(JSON.stringify(args));
			},
			(err) => {
				console.log("Error " + err);
			});
	}

	goBack(): void {
		this.routerExtensions.back();
	}
}