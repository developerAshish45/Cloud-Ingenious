import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createCreditRecord from '@salesforce/apex/CreditFormController.createCreditRecord';

export default class TermsAndConditions extends LightningElement {
    @track conditions = false;
    @track MasterBilt = true;
    @track Norlake = true;
    @track checkStatus = false;
    @api contactLogInId;
    @api creditId;
    @track termsAndConditions = true;
    @track companyInformation = false;

    handleChangeCheckBox1(event) {
        this.MasterBilt = event.target.checked;
    }

    handleChangeCheckBox2(event) {
        this.Norlake = event.target.checked;
    }

    handleChangeCheckBox3(event) {
        this.conditions = event.target.checked;
    }

    handleSaveAndContinue() {
        const groupBrand = [];
        if (this.MasterBilt) {
            groupBrand.push('Master-Bilt');
        }
        if (this.Norlake) {
            groupBrand.push('Norlake');
        }

        const creditRecord = {
            sobjectType: 'Credit__c',
            Contact_Id__c: this.contactLogInId,
            Group_brand_s__c: groupBrand.join(';'),
            Terms_And_Conditions__c: this.conditions
        };

        createCreditRecord({ creditData: [creditRecord] })
            .then(result => {
                console.log('Records created successfully:', result);
                this.showToast('Success', 'Record created successfully', 'success');
                console.log('this.companyInformation',this.companyInformation)
                console.log('this.termsAndConditions',this.termsAndConditions)
                this.companyInformation = true;
                this.termsAndConditions = false;
            })
            .catch(error => {
                console.error('Error creating records:', error);
                this.showToast('Error', 'Error creating company information: ' + error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}