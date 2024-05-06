import { LightningElement,track,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateContactRecordNew from '@salesforce/apex/CreditFormController.updateContactRecordNew';
import getContactByEmail from '@salesforce/apex/CreditFormController.getContactByEmail';
//import getAccountStatus from '@salesforce/apex/CreditFormController.getAccountStatus';
import updateCreditStatus from '@salesforce/apex/CreditFormController.updateCreditStatus';
import getCreditRecords from '@salesforce/apex/CreditFormController.getCreditRecords';
import saveSignature from '@salesforce/apex/CreditFormController.saveSignature';
import getCreditSignature from '@salesforce/apex/CreditFormController.getCreditSignature';

export default class ContactDataInCreditForm extends LightningElement {
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

    connectedCallback(){
        this.isLoading = true;       
        //console.log('newCreditId in contact data in credit form', this.newCreditIdFromCreditDetails)
        //console.log(this.newCreditIdFromCreditDetails)
        //console.log('action type in contact form: ', this.actionType)
        //console.log('33333333333333')
        //console.log("this.creditId",this.creditId)
        //console.log('this.recordId',this.recordId) 
        //console.log('this.accountId',this.accountId)     
        //console.log('this.contactId',this.contactId )  
        //console.log('this.contactLogInEmail',this.contactLogInEmail )
        //console.log('creditSelectedRowId in credit page',this.creditSelectedRowId)
        //console.log('creditSelectedRowStatus in credit page',this.creditSelectedRowStatus)
        if (this.contactLogInEmail) {
            this.fetchContactRecord(this.contactLogInEmail);
        }
        if(this.actionType === 'view') {
            this.saveContinue = false;
            this.checkStatus = true;
        } else {
            this.saveContinue = true;
            this.checkStatus = false;
        }
        if(this.creditSelectedRowId){
            this.fetchCreditRecordId =this.creditSelectedRowId;
        }
        else if(this.creditId){
            this.fetchCreditRecordId =this.creditId;
        }
        this.fetchCreditRecord(this.fetchCreditRecordId);
       
    }

    extractIdFromUrl(url) {
        const urlParts = url.split('/');
        const idIndex = urlParts.indexOf('approval') + 1; // assuming the ID comes after 'approval'
        
        return idIndex >= 0 && urlParts.length > idIndex ? urlParts[idIndex] : null;
    }
    fetchContactRecord(email) {
        getContactByEmail({ email: this.contactLogInEmail })
            .then(result => {
                if (result) {
                    this.nameValue = result.LastName;
                    this.firstNameValue = result.FirstName;
                    this.lastNameValue = result.LastName;
                    this.titleValue = result.Title;
                    this.phoneValue = result.Phone;
                    this.dateValue=result.Updated_Date__c;
                    if(this.creditSelectedRowStatus == 'Submitted'&& this.actionType != "clone"){
                        this.checkStatus = true;
                    } 
                    else if(this.creditSelectedRowStatus == 'In Progress'&& this.actionType == "view"){
                        this.checkStatus = true;
                    }
                } else {
                    this.showToast('Error', 'Contact not found for the provided email.', 'error');
                }
                this.isLoading = false;
            })
            .catch(error => {
                console.error('Error fetching contact record:', error);
                this.showToast('Error', 'Error fetching contact record: ' + error.body.message, 'error');
                this.isLoading = false;
            });
    }
    fetchCreditRecord(id){
        //console.log('credit id before showing the signature', this.fetchCreditRecordId)
        getCreditSignature({creditId : this.fetchCreditRecordId})
        .then(result => {
            if (result) {
                this.signatureValue = result.Applicant_Signature__c;
                if(this.creditSelectedRowStatus == 'Submitted'&& this.actionType != "clone"){
                    this.checkStatus = true;
                } 
                else if(this.creditSelectedRowStatus == 'In Progress'&& this.actionType == "view"){
                    this.checkStatus = true;
                }
            } else {
                this.showToast('Error', 'Contact not found for the provided email.', 'error');
            }
            this.isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching contact record:', error);
            this.showToast('Error', 'Error fetching contact record: ' + error.body.message, 'error');
            this.isLoading = false;
        });
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
    
    async handleSubmit() {
        this.isLoading = true;

        if (!this.signatureValue) {
            this.showToast('Error', 'Please fill in all required fields.', 'error');
            this.isLoading = false;
            return;
        }
        await this.handleUpdateCreditRecord();
        await this.handleContactRecordUpdate();
        // this.isLoading = false;
    }

    handleUpdateCreditRecord(){
        updateCreditStatus({
            creditId: this.creditId,
            status: 'Submitted',
            signature: this.signatureValue
        })
        .then((result) => {
            //console.log('Updated Credit Result:', result);
            //console.log('Credit Status', result[0].Status__c);
            //console.log('Credit signature', result[0].Applicant_Signature__c);
            this.isLoading = false;
        })
        .catch((error) => {
            //console.error('Error updating credit record:', JSON.stringify(error));
            this.isLoading = false;
        });
    }
    handleContactRecordUpdate(){
        updateContactRecordNew({
            updatedDate: this.dateValue,
            conId: this.contactId,
            //accID: this.accountId,
            LastName: this.nameValue,
            FirstName: this.firstNameValue,
            Title: this.titleValue,
            phoneNumber: this.phoneValue
        })
        .then(result => {
            //console.log('Record updated successfully:', result);
            //this.showToast('Success', 'Record updated successfully', 'success');
            this.showInternalUseForm = true;
            this.showConatctForm = false;
            this.successMessage = 'showExistingCreditRecords';
            this.contactEmailLogin = this.contactLogInEmail;
            //console.log('this.contactEmailLogin', this.contactEmailLogin);
            //console.log('This.successmessage', this.successMessage);
            this.successPage = true;
            this.showMessage = true;
            this.successMessage = 'Your credit application is submitted';
            //console.log('this.successMessage from submit', this.successMessage);
            this.isLoading = false;
        })
        .catch(error => {
            //console.error('Error updating record:', error);
            //this.showToast('Error', 'Error updating contact information: ' + error.body.message, 'error');
            this.isLoading = false;
        })
    }

    async handleSaveAndDraft() {
        this.isLoading = true;

        if (!this.signatureValue) {
            this.showToast('Error', 'Please fill in all required fields.', 'error');
            this.isLoading = false;
            return;
        }
        await this.handleUpdateCreditRecordForSaveAndDraft();
        await this.handleContactRecordUpdateForSaveAndDraft();
        // this.isLoading = false;

    }
    handleUpdateCreditRecordForSaveAndDraft(){
        updateCreditStatus({
            creditId: this.creditId,
            status: 'In progress',
            signature: this.signatureValue
        })
        .then(result => {
            //console.log('Updated Credit Result:', result);
            //console.log('Credit Status', result[0].Status__c);
            //console.log('Credit signature', result[0].Applicant_Signature__c);
            this.isLoading = false;
        })
        .catch(error => {
            //console.error('Error updating credit record for save and Draft:', error);
            this.isLoading = false;
        });
    }
    handleContactRecordUpdateForSaveAndDraft(){
        updateContactRecordNew({
            updatedDate: this.dateValue,
            conId: this.contactId,
            //accID: this.accountId,
            LastName: this.nameValue,
            FirstName: this.firstNameValue,
            Title: this.titleValue,
            phoneNumber: this.phoneValue
        })
        .then(result => {
            //console.log('Record updated successfully:', result);
            //this.showToast('Success', 'Record Saved In Draft', 'success');
            this.showInternalUseForm = true;
            this.showConatctForm = false;
            this.successPage = true;
            this.showMessage = true;
            this.successMessage = 'Your credit application is saved in draft.';
            //console.log('this.successMessage from save and draft', this.successMessage);
            this.isLoading = false;
        })
        .catch(error => {
            //console.error('Error Saved Draft information:', error);
            //this.showToast('Error', 'Error Saved Draft information: ' + error.body.message, 'error');
            this.isLoading = false;
        })
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

    columns = [
        { label: 'Credit Number', fieldName: 'Name', type: 'text', sortable: true },
        { label: 'Company Name', fieldName: 'AccountName', type: 'text', sortable: true },
        { label: 'Contact Name', fieldName: 'ContactName', type: 'text', sortable: true },
        { label: 'Credit Limit Requested', fieldName: 'Credit_Limit_Requested__c', type: 'text', sortable: true },
        { label: 'Business Type', fieldName: 'Business_Type__c', type: 'text', sortable: true },
        { label: 'Status', fieldName: 'Status__c', type: 'text', sortable: true, sortField: 'Status__c' }
    ];
    creditRecords;
    handleDataTable() {
        //console.log('handleDataTable method called');
        //console.log('handleDataTable method called', this.contactLogInEmail);
        getCreditRecords({ contactEmail: this.contactLogInEmail })
            .then(result => {
                this.creditRecords = result.map(record => {
                    const accountName = record.Account_Id__r ? record.Account_Id__r.Name : '';
                    //console.log('AccountName:', accountName);
                    const contactName = record.Contact_Id__r ? record.Contact_Id__r.Name : '';
                    //console.log('ContactName:', contactName);
                    return {
                        ...record,
                        AccountName: accountName,
                        ContactName: contactName
                    };
                });
                //console.log('result', result);
                this.showMessage = false;
                this.showDataTable = true;
            })
            .catch(error => {
                console.error('Error fetching credit records:', error);
            });
    }
    
}