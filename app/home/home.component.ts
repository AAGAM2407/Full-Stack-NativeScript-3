import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';

import { Dish } from '../shared/dish';
import { Leader } from '../shared/leader';
import { Promotion } from '../shared/promotion';

import { DishService } from '../services/dish.service';
import { LeaderService } from '../services/leader.service';
import { PromotionService } from '../services/promotion.service';

import { DrawerPage } from '../shared/drawer/drawer.page';

@Component({
	selector: 'app-home',
	moduleId: module.id,
	templateUrl: './home.component.html'
})
export class HomeComponent extends DrawerPage implements OnInit{

	dish: Dish;
	leader: Leader;
	promotion: Promotion;

	constructor(private dishService: DishService,
				private leaderService: LeaderService,
				private promotionService: PromotionService,
				private changeDetectorRef: ChangeDetectorRef,
				@Inject('BaseURL') private BaseURL) {
		super(changeDetectorRef);
	}

	ngOnInit() {
		this.dishService.getFeaturedDish()
			.subscribe(dish => this.dish = dish);
		this.leaderService.getFeaturedLeader()
			.subscribe(leader => this.leader = leader);
		this.promotionService.getFeaturedPromotion()
			.subscribe(promotion => this.promotion = promotion);
	}
}