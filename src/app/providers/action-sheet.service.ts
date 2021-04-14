import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

/**
 * actionsheet service
 */
@Injectable({
    providedIn: 'root'
})
export class ActionSheetService {
    constructor(
        private actionSheetCtrl: ActionSheetController
    ) { }
    async present(buttons: Array<any>) {
        buttons.push({
            text: 'Cancel',
            role: 'cancel',
        });
        const actionSheet = await this.actionSheetCtrl.create({
            buttons: buttons // buttons list 
        });
        await actionSheet.present();
    }
}