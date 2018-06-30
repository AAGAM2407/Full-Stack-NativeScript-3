import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FavouriteService } from '../services/favourite.service';
import { Dish } from '../shared/dish';
import { ListViewEventData, RadListView } from 'nativescript-pro-ui/listview';
import { RadListViewComponent } from 'nativescript-pro-ui/listview/angular';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { DrawerPage } from '../shared/drawer/drawer.page';

import { confirm } from 'ui/dialogs';
import { Toasty } from 'nativescript-toasty';

@Component({
    selector: 'app-favourites',
    moduleId: module.id,
    templateUrl: './favourites.component.html',
    styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent extends DrawerPage implements OnInit {

    favourites: ObservableArray<Dish>;

    @ViewChild('myListView') listViewComponent: RadListViewComponent;

    constructor(private favouriteservice: FavouriteService,
                private changeDetectorRef: ChangeDetectorRef,
                @Inject('BaseURL') private BaseURL) {
            super(changeDetectorRef);
    }

    ngOnInit() {
        this.favouriteservice.getFavourites()
            .subscribe(favourites => this.favourites = new ObservableArray(favourites));
    }

    deleteFavourite(id: number) {

        let options = {
            title: "Confirm Delete",
            message: "Do you want to delete Dish " + id,
            okButtonText: "Yes",
            cancelButtonText: "No",
            neutralButtonText: "Cancel"
        };

        confirm(options)
            .then((result: boolean) =>  {
                if(result) {
                    this.favourites = null;
                    this.favouriteservice.deleteFavourite(id)
                        .subscribe(favourites => {
                            const toast = new Toasty("Deleted Dish " + id, "short", "bottom");
                            toast.show();
                            this.favourites = new ObservableArray(favourites);
                        });

                } else {
                    console.log("Delete cancelled");
                }
            });
    }

    public onCellSwiping(args: ListViewEventData) {
        var swipeLimits = args.data.swipeLimits;
        var currentItemView = args.object;
        var currentView;

        if(args.data.x > 200) {

        }
        else if (args.data.x < -200) {

        }
    }

    public onSwipeCellStarted(args: ListViewEventData) {
        var swipeLimits = args.data.swipeLimits;
        var swipeView = args['object'];

        var leftItem = swipeView.getViewById('mark-view');
        // var rightItem = swipeView.getViewById('delete-view');
        // swipeLimits.left = leftItem.getMeasuredWidth();
        // swipeLimits.right = rightItem.getMeasuredWidth();
        // swipeLimits.threshold = leftItem.getMeasuredWidth()/2;
    }

    public onSwipeCellFinished(args: ListViewEventData) {

    }

    public onLeftSwipeClick(args: ListViewEventData) {
        console.log('Left swipe click');
        this.listViewComponent.listView.notifySwipeToExecuteFinished();
    }

    public onRightSwipeClick(args: ListViewEventData) {
        this.deleteFavourite(args.object.bindingContext.id);
        this.listViewComponent.listView.notifySwipeToExecuteFinished();
    }
}