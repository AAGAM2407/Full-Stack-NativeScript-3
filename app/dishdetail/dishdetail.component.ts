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

import { View } from 'ui/core/view';
import { Page } from 'ui/page';
import { Animation, AnimationDefinition } from 'ui/animation';
import { SwipeGestureEventData, SwipeDirection } from 'ui/gestures';
import { Color } from 'color';
import * as enums from 'ui/enums';

import * as SocialShare from 'nativescript-social-share';
import { ImageSource, fromUrl } from 'image-source';

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
	showComments: boolean = false;
	cardImage: View;
	commentList: View;
	cardLayout: View;

	constructor(private dishservice: DishService,
				private favouriteservice: FavouriteService,
				private fonticon: TNSFontIconService,
				private route: ActivatedRoute,
				private vcRef: ViewContainerRef,
				private modalService: ModalDialogService,
				private routerExtensions: RouterExtensions,
				private page: Page,
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
		    actions: ["Add to Favourites", "Add a Comment", "Social Sharing"]
		}).then(result => {
		    console.log("Dialog result: " + result);
		    if(result == "Add to Favourites"){
		        this.addToFavourites();
		    }else if(result == "Add a Comment"){
		        this.addAComment();
		    } else if(result == "Social Sharing") {
		    	this.socialShare();
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


	onSwipe(args: SwipeGestureEventData) {
		if(args.direction === SwipeDirection.up) {
			this.animateUp();
		}
		else if(args.direction === SwipeDirection.down) {
			this.animateDown();
		}
	}

	showAndHideComments() {
		if (!this.showComments) {
			this.animateUp();
		} else {
			this.animateDown();
		}
	}

	animateUp() {
		if (this.dish  && !this.showComments) {
			this.cardImage = this.page.getViewById<View>("cardImage");
			this.cardLayout = this.page.getViewById<View>("cardLayout");
			this.commentList = this.page.getViewById<View>("commentList");

			let definitions = new Array<AnimationDefinition>();

			let a1: AnimationDefinition = {
				target: this.cardImage,
				scale: {x: 1, y: 0},
				translate: {x: 0, y: -200},
				opacity: 0,
				duration: 500,
				curve: enums.AnimationCurve.easeIn
			};
			definitions.push(a1);

			let a2: AnimationDefinition = {
				target: this.cardLayout,
				backgroundColor: new Color("#ffc107"),
				duration: 500,
				curve: enums.AnimationCurve.easeInOut
			}
			definitions.push(a2);

			let animationSet = new Animation(definitions);
			animationSet.play()
				.then(() => {
					this.showComments = true;
				})
				.catch((e) => {
					console.log(e.message)
				});
		}
	}

	animateDown() {
		if (this.dish  && this.showComments) {
			this.cardImage = this.page.getViewById<View>("cardImage");
			this.cardLayout = this.page.getViewById<View>("cardLayout");
			this.commentList = this.page.getViewById<View>("commentList");

			this.showComments = false; 

			let definitions = new Array<AnimationDefinition>();

			let a1: AnimationDefinition = {
				target: this.cardImage,
				scale: {x: 1, y: 1},
				translate: {x: 0, y: 0},
				opacity: 1,
				duration: 500,
				curve: enums.AnimationCurve.easeIn
			};
			definitions.push(a1);

			let a2: AnimationDefinition = {
				target: this.cardLayout,
				backgroundColor: new Color("#ffffff"),
				duration: 500,
				curve: enums.AnimationCurve.easeInOut
			}
			definitions.push(a2);

			let animationSet = new Animation(definitions);
			animationSet.play();
		}
	}

	socialShare() {
		let image: ImageSource;

		fromUrl(this.BaseURL + this.dish.image)
			.then((img: ImageSource) => {
				image = img;
				SocialShare.shareImage(image, 'How would you like to share this image?');
			})
			.catch(() => { console.log('Error loading image');});
	}
}