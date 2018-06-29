import { Component, OnInit, Inject, ChangeDetectorRef, ViewContainerRef } from '@angular/core';

import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { FavouriteService } from '../services/favourite.service';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';

import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

import * as dialogs from "ui/dialogs";
import { Toasty } from 'nativescript-toasty';

import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { CommentModalComponent } from "../commentmodal/commentmodal.component";

import 'rxjs/add/operator/switchMap';

@Component({
	selector: 'app-dishdetail',
	moduleId: module.id,
	templateUrl: './dishdetail.component.html'
})
export class DishdetailComponent implements OnInit {

	dish: Dish;
	comment: Comment;
	avgstars: string;
	numcomments: number;
	favourite: boolean = false;

	constructor(private dishservice: DishService,
				private favouriteservice: FavouriteService,
				private fonticon: TNSFontIconService,
				private route: ActivatedRoute,
				private vcRef: ViewContainerRef,
				private modalService: ModalDialogService,
				private routerExtensions: RouterExtensions,
				@Inject('BaseURL') private BaseURL) {
	}

	ngOnInit() {
		this.route.params
			.switchMap((params: Params) => this.dishservice.getDish(+params['id']))
			.subscribe(dish => {
				this.dish = dish;
				this.favourite = this.favouriteservice.isFavourite(this.dish.id);
				this.numcomments = this.dish.comments.length;
				
				let total = 0;
				this.dish.comments.forEach(comment => total += comment.rating);
				this.avgstars = (total/this.numcomments).toFixed(2);
			});
	}
	//action dialogue -> addToFavourites()

	actionDialogue() {
		dialogs.action({
		    message: "Select an option",
		    cancelButtonText: "Cancel",
		    actions: ["Add to Favourites", "Add a Comment"]
		}).then(result => {
		    console.log("Dialog result: " + result);
		    if(result == "Add to Favourites"){
		        this.addToFavourites();
		    }else if(result == "Add a Comment"){
		        this.addAComment();
		    }
		});
	}

	addToFavourites() {
		if(!this.favourite) {
			this.favourite = this.favouriteservice.addFavourite(this.dish.id);
			const toast = new Toasty('Added dish ' + this.dish.id, "short", "bottom");
			toast.show();
		}
	}

	addAComment() {
		let options: ModalDialogOptions = {
			viewContainerRef: this.vcRef,
            fullscreen: true
		};

		this.modalService.showModal(CommentModalComponent, options)
			.then((result: any) => {
				const date = new Date();
				this.dish.comments.push({
					author: result.author,
					rating: result.rating,
					comment: result.comment,
					date: date.toISOString()
				})
			});
	}

	goBack(): void {
		this.routerExtensions.back();
	}
}