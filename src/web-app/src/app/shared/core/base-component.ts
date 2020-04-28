import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

export class BaseComponent implements OnDestroy {
    protected subscriptions = new Array<Subscription>();

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }
}
