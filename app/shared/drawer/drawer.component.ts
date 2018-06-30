import { Component } from '@angular/core';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';


@Component({
	selector: 'drawer-content',
	templateUrl: './shared/drawer/drawer.component.html'
})
export class DrawerComponent {

	constructor(private fonticon: TNSFontIconService) { }

	// displayLoginDialog() {
	// 	let options = {
	// 		title: "Login",
	// 		message: 'Type your login credentials',
	// 		userName: getString("userName", ""),
	// 		password: getString("password", ""),
	// 		okButtonText: "Ok",
	// 		cancelButtonText: "Cancel"
	// 	}

	// 	login(options)
	// 		.then((loginResult: LoginResult) => {
	// 			setString("userName", loginResult.userName);
	// 			setString("password", loginResult.password);
	// 			},
	// 			() => { console.log('Login cancelled'); }
	// 		);
	// }

}