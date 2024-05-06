import { LightningElement,track,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateContactRecordNew from '@salesforce/apex/CreditFormController.updateContactRecordNew';
import getContactByEmail from '@salesforce/apex/CreditFormController.getContactByEmail';
import updateCreditStatus from '@salesforce/apex/CreditFormController.updateCreditStatus';
import getCreditRecords from '@salesforce/apex/CreditFormController.getCreditRecords';
import saveSignature from '@salesforce/apex/CreditFormController.saveSignature';
import getCreditSignature from '@salesforce/apex/CreditFormController.getCreditSignature';
import updateCreditStatusForApprover from '@salesforce/apex/CreditFormController.updateCreditStatusForApprover';
import getCreditInfo from '@salesforce/apex/CreditFormController.getCreditInfo';

export default class ContactDataInCreditForm extends LightningElement {
    @api contactEmail;
    @track email;
    @track isLoading = false;
    @api newCreditIdFromCreditDetails;
    @track saveContinue = false;
    @track successMessage;
    @api creditSelectedRowId;
    @api creditSelectedRowStatus;
    @api accountId;
    @api creditId;
    @api recordId;
    @api contactId;
    @api contactLogInEmail;
    @track contactEmailLogin;
    @track successMessage;
    @track nameValue;
    @track firstNameValue;
    // @track emailValue;
    @track phoneValue;
    @track titleValue;
    @track signatureValue;
    @track dateValue;
    @track showMessage = false;
    @track showInternalUseForm = false;
    @track showConatctForm = true;
    @track showDataTable = false;
    @api actionType;
    @track fetchCreditRecordId;
    @track comment;
    @track status;
    @track amount;

    connectedCallback(){
      
        //console.log('email in cb:-',this.email);
        window.scrollTo(0, 0);
      
        this.isLoading = true;
        let currentUrl = window.location.href;
        //console.log('Current URL:', currentUrl);
        if (currentUrl.includes('Id=')) {
            let id = currentUrl.split('=')[1];
            //console.log('ID:', id);
            this.creditId = id;
            //console.log('creditSelectedRowId:', this.creditId);
        }
        if(this.creditId){
            //console.log("this.creditId",this.creditId)
            getCreditInfo({
                creditId:this.creditId
            })
            .then(result => {
                //console.log('this.creditSelectedRowStatus in connected callback',this.creditSelectedRowStatus)             
                //console.log('Result getCreditInfo:', result);
                this.comment = result.Approver_Comment__c;
                this.email = result.Approver_Email__c;
                this.status = result.Status__c;
                this.amount = result.Approved_Credit_Amount__c;
                this.isLoading = false;
                
            })
            .catch(error => {
                console.error('Error fetching company information:', error);
                this.showToast('Error', 'Error fetching company information: ' + error.body.message, 'error');
                this.isLoading = false;
            });
        }
       
    }


    handleInputChangeName(event) {
        this.nameValue = event.target.value;
        //console.log('this.lastNameValue',this.nameValue)
    }
    handleInputChangeFirstName(event) {
        this.firstNameValue = event.target.value;
        //console.log('this.firstNameValue',this.firstNameValue)
    }
    handleInputChangeTitle(event) {
        this.titleValue = event.target.value;
        //console.log('this.titleValue',this.titleValue)
    }
    handleInputChangeSignature(event){
        this.signatureValue = event.target.value;
        //console.log('this.signatureValue',this.signatureValue)
    }
    // handleInputChangeEmail(event) {
    //     this.emailValue = this.contactLogInEmail;
    //     //console.log('this.emailValue',this.emailValue)
    // }
    handleInputChangePhone(event) {
        this.phoneValue = event.target.value;
        //console.log('this.phoneValue',this.phoneValue)
    }
    handleInputChangeDate(event) {
        this.dateValue = event.target.value;
        //console.log('this.nameValue',this.nameValue)
    }
    handleInputChangeComment(event){
        this.comment = event.target.value;
        //console.log('this.comment',this.comment)
    }
    handleInputChangeApproverEmail(event){
        this.email = this.approverEmail;
    }
    // handleInputChangeStatus(event){
    //     this.status = event.target.value;
    // }
    handleInputChangeAmount(event){
        this.amount = event.target.value;
    }

    handleApprove() {
        if (!this.comment) {
            this.showToast('Error', 'Please provide a comment before updating the status.', 'error');
            return;
        }
        this.isLoading = true;
        updateCreditStatusForApprover({
            creditId: this.creditId,
            status: 'Approved',
            comment: this.comment,
            amount: this.amount
        })
        .then(result => {
            //console.log('Updated Credit Result:', result);
            this.successPage = true;
            this.showMessage = true;
            this.isLoading = false;
            this.showConatctForm = false;
        })
        .catch(error => {
            console.error('Error updating credit record:', error);
            this.isLoading = false;
        });
    }

    handleReject() {
        if (!this.comment) {
            this.showToast('Error', 'Please provide a comment before updating the status.', 'error');
            return;
        }
        this.isLoading = true;
        updateCreditStatusForApprover({
            creditId: this.creditId,
            status: 'Rejected',
            comment: this.comment,
            amount: this.amount
        })
        .then(result => {
            //console.log('Updated Credit Result:', result);
            this.successPage = true;
            this.showMessage = true;
            this.isLoading = false;
            this.showConatctForm = false;
        })
        .catch(error => {
            console.error('Error updating credit record:', error);
            this.isLoading = false;
        });
    }
    handleNeedInformation() {
        if (!this.comment) {
            this.showToast('Error', 'Please provide a comment before updating the status.', 'error');
            return;
        }
        this.isLoading = true;
        updateCreditStatusForApprover({
            creditId: this.creditId,
            status: 'Need More Information',
            comment: this.comment,
            amount: this.amount
        })
        .then(result => {
            //console.log('Updated Credit Result:', result);
            this.successPage = true;
            this.showMessage = true;
            this.isLoading = false;
            this.showConatctForm = false;
        })
        .catch(error => {
            console.error('Error updating credit record:', error);
            this.isLoading = false;
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

    handleBack(){
        //console.log("this.creditId handle back",this.creditId)
        // this.showContactDetails = false;
        // this.showCreditDetails = true; 
        this.showCreditPge = true
        this.showConatctForm = false
        //this.type = this.actionType;
        if(this.actionType == 'clone'){
            this.type = null;
        }
        else{
            this.type = this.actionType;  
        }
        
    }
    
}