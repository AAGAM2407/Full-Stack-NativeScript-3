import { Component, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';

import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";

import { View } from 'ui/core/view';
import { Page } from 'ui/page';
import { Animation, AnimationDefinition } from 'ui/animation';
import { SwipeGestureEventData, SwipeDirection } from 'ui/gestures';
import { Color } from 'color';
import * as enums from 'ui/enums';
import { CouchbaseService } from '../services/couchbase.service';

@Component({
	selector: 'app-reservation',
	moduleId: module.id,
	templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit{
	
	reservation: FormGroup;
	displayValues: boolean = false;
	docId: string = "reservations";
	reservationValues = null;
	reservationForm: View;
	reservationV: View;

	constructor(private changeDetectorRef: ChangeDetectorRef,
				private modalService: ModalDialogService,
				private vcRef: ViewContainerRef,
				private couchbaseservice: CouchbaseService,
				private page: Page,
			    private formBuilder: FormBuilder) {
		super(changeDetectorRef);
		this.reservation = this.formBuilder.group({
			guests: 3,
			smoking: false,
			dateTime: ['', Validators.required]
		});

		let doc = this.couchbaseservice.getDocument(this.docId);
		if (doc == null) {
			this.couchbaseservice.createDocument({"reservations": []}, this.docId);
		}
	}

	ngOnInit() {
	}

	//reservationOn() {
		//if something is in the database
			//display the values - true
		//else open the form - html
			// display values - false
	//}

	// called when the switch is turned on and off
	onSmokingChecked(args) {
		let smokingSwitch = <Switch>args.object;
		if (smokingSwitch.checked) {
			this.reservation.patchValue({ smoking: true });
		} else {
			this.reservation.patchValue({ smoking: false });
		}
	}

	onGuestChange(args) {
		let textField = <TextField>args.object;

		this.reservation.patchValue({ guests: textField.text });
	}

	onDateTimeChange(args) {
		let textField = <TextField>args.object;

		this.reservation.patchValue({ dateTime: textField.text });
	}

	createModalView(args) {
		let options: ModalDialogOptions = {
			viewContainerRef: this.vcRef,
			context: args,
			fullscreen: false
		};

		this.modalService.showModal(ReservationModalComponent, options)
			.then((result: any) => {
				if (args === "guest") {
					this.reservation.patchValue({ guests: result });
				} else if (args === "date-time") {
					this.reservation.patchValue({ dateTime: result});
				}

			});
	}

	onSubmit() {
		console.log("This is the first reservation");
		console.log(JSON.stringify(this.reservation.value));

		// #form fadeOut

		// this.couchbaseservice
		// 	.updateDocument(this.docId, {"reservations": [this.reservation.value]});
		
		this.reservationForm = this.page.getViewById<View>("reservationForm");
			
		let definitions = new Array<AnimationDefinition>();

		let a1: AnimationDefinition = {
			target: this.reservationForm,
			scale: {x: 0, y: 0},
			translate: {x: 0, y: -200},
			opacity: 0,
			duration: 500,
			curve: enums.AnimationCurve.easeInOut
		};
		definitions.push(a1);

		let animationSet = new Animation(definitions);
		animationSet.play()
			.then(() => {
				this.reservationValues = this.reservation.value;

				let definitions = new Array<AnimationDefinition>();
				let a1: AnimationDefinition = {
					target: this.reservationForm,
					scale: {x: 1, y: 1},
					translate: {x: 0, y: 0},
					opacity: 1,
					duration: 500,
					curve: enums.AnimationCurve.easeInOut
				};
				definitions.push(a1);

				let animationSet = new Animation(definitions);
				animationSet.play()
					.then(() => {
						this.couchbaseservice.updateDocument(this.docId, {"reservations": this.reservationValues});
						console.log(this.couchbaseservice.getDocument(this.docId));
					});
			})
			.catch((e) => {
				console.log(e.message)
			});

	}
}