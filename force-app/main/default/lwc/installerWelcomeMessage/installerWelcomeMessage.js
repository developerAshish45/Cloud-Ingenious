import { LightningElement, wire, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import welcomeMessage from '@salesforce/apex/IntallerWelcome.welcomeMessage';
export default class InstallerWelcomeMessage extends NavigationMixin (LightningElement) {
    @api recordId;
    data;
    error;

    @wire(welcomeMessage, { recId: '$recordId' })
    wiredData({ error, data }) {
        if (data) {
            this.data = data;
            if (data.Customer_Name__r.Name) {
                console.log(data.Customer_Name__r.Name);
            } else {
                console.error('Customer_Name__c is null or undefined');
            }
        } else if (error) {
            this.error = error;
        }
    }
}