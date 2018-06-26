import { Component, OnInit, Inject } from '@angular/core';

import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import 'rxjs/add/operator/switchMap';

@Component({
	selector: 'app-about',
	moduleId: module.id,
	templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {

	leaders: Leader[];
	constructor(private leaderService: LeaderService,
				private route: ActivatedRoute,
				private routerExtensions: RouterExtensions,
				@Inject('BaseURL') private BaseURL) {
	}

	ngOnInit() {
		this.leaderService.getLeaders()
			.subscribe(leaders => this.leaders = leaders);
	}

	goBack(): void {
		this.routerExtensions.back();
	}
}