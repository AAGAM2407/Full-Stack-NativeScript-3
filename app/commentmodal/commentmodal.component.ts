import { Component, OnInit, Inject } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
	moduleId: module.id,
	templateUrl: './commentmodal.component.html'
})
export class CommentModalComponent implements OnInit {

	commentForm: FormGroup;

	constructor(private params: ModalDialogParams,
				private formBuilder: FormBuilder) {
		this.commentForm = this.formBuilder.group({
			author: '',
			rating: 4,
			comment: ''
		});
	}

	ngOnInit() {
	}

	public submit() {
		this.params.closeCallback(this.commentForm.value);
	}
}