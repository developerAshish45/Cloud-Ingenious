import { LightningElement,track,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createCreditRecord from '@salesforce/apex/CreditFormController.createCreditRecord';
import getCreditInfo from '@salesforce/apex/CreditFormController.getCreditInfo';
import getContactId from '@salesforce/apex/CreditFormController.getContactId';
import reparentFileAttachment from '@salesforce/apex/CreditFormController.reparentFileAttachment';

export default class CreditDetails extends LightningElement {
    @track showSpinner = false;
    @track Next = true;
    @api creditSelectedRowId;
    @api creditSelectedRowStatus;
    @api logInEmail;
    @api companyId;
    @api contactId;
    @api creditId;
    @api creditDetailsId;
    @api actionType;
    @track creditRowId;
    @track creditStatusInRow;
    @track checkStatus = true;
    @track contactLogInEmail;
    @track contactLogInId;
    @track contactIdFromLogIn;
    @track recordId;
    @track accountId;
    @api companyRecord;
    @track showContactDetails = false;
    @track showCreditDetails = true;
    @track showCompanyPge = false;
    @track websiteDisplay = false;
    @track creditInformation = false
    // @track backButton = false;

    @track creditRecordId;
    @track selectedValue = '';
    @track website;
    @track MasterBilt;
    @track Norlake;
    @track radio1;
    @track radio2;

    @track businessType;
    @track presidentOwner;
    @track vpFinanceCFO;
    @track secTreasurer;
    @track creditLimitRequested;
    @track company1;
    @track contact1;
    @track acctNumber1;
    @track email1;
    @track phone1;

    @track company2;
    @track contact2;
    @track acctNumber2;
    @track email2;
    @track phone2;

    @track company3;
    @track contact3;
    @track acctNumber3;
    @track email3;
    @track phone3;

    @track bankName;
    @track accountNumber;
    @track address;
    @track city;
    @track state;
    @track zip;
    @track contactPhone;
    @track bankPhone;
    @track fax;

    @track hedOfFinance;
    @track nameFinance;
    @track phoneFinance;
    @track emailFinance;
    @track signatureValue;


// myComponent.js
get options() {
    // Return the options with labels styled accordingly
    return [
        { label: 'Yes', value: 'Yes', class: 'custom-radio-label-yes' },
        { label: 'No', value: 'No', class: 'custom-radio-label-no' },
    ];
}


    @track reparentFileDocumentId;
    handleUploadFinished(event) {
        //console.log('Contact Record Id = ', this.contactLogInId)
        const uploadedFiles = event.detail.files;
        //console.log('uploadedFiles', uploadedFiles)
        uploadedFiles.forEach(file => {
            //console.log('File data', file)
            //console.log('Uploaded File Name: ', file.name);
            //console.log('Uploaded File ID: ', file.documentId); // This id need to be re parented
            //console.log('Parent Record ID: ', this.parentId);
            this.reparentFileDocumentId = file.documentId;
            //console.log('reparentFileDocumentId', this.reparentFileDocumentId);
        });
    }

    handleChangeRadio(event) {
        this.selectedValue = event.detail.value;
        //console.log('this.selectedValue',this.selectedValue)
        if(this.selectedValue == 'Yes'){
            this.websiteDisplay = true;
        }
        else{
            this.websiteDisplay = false;
        }
    }
    
    // handleChangeCheckBox(event) {
    //     this.selectedBrands = event.detail.value;
    // }

    handleChangeCheckBox1(event){
        this.MasterBilt = event.target.checked;
        //console.log('this.MasterBilt',this.MasterBilt)
    }
    handleChangeCheckBox2(event){
        this.Norlake = event.target.checked;
        //console.log('this.Norlake',this.Norlake)
    }
    handleRadioChange(event) {
        //console.log('event called');
       
    
        const radioButtonValue = event.target.name;
        //console.log('Event target id:', radioButtonValue);
        if (radioButtonValue === 'radioGroup1') {
            this.radio1 = true;
            this.radio2 = false;
            //console.log('this.radio1:', this.radio1);
            //console.log('this.radio2:', this.radio2);
        }if (radioButtonValue === 'radioGroup2') {
            this.radio1 = false;
            this.radio2 = true;
            //console.log('this.radio1:', this.radio1);
            //console.log('this.radio2:', this.radio2);
        }
    }
    
    businessTypeOptions = [
        { label: 'Corporation', value: 'Corporation' },
        { label: 'LLC', value: 'LLC' },
        { label: 'S-Corp', value: 'S-Corp' },
        { label: 'Partnership/Proprietorship', value: 'Partnership/Proprietorship' },
        { label: 'Government', value: 'Government' }
    ];

    handleBusinessTypeChange(event) {
        this.businessType = event.detail.value;
    }

    handleInputChange(event) {
        const { name, value } = event.target;
        //console.log(`Updating ${name} to ${value}`);
        this[name] = value;
    }    
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
    handleNextClick(){
    this.showContactDetails = true;
    this.showCreditDetails = false; 
    this.creditInformation = false
    }
    handleBack(){
        //console.log("1111111111111111", this.contactLogInEmail)
        this.type = this.actionType;
        //this.newCreditIdFromCreditDetails = this.newCreditId ? this.newCreditId : this.newCreditIdFromContact;
        //console.log('22222222222222222', this.type)
        this.showCompanyPge = true
        this.showCreditDetails = false
        //console.log('1',this.showCompanyPge)
        //console.log('2',this.showCreditDetails)
    }
    connectedCallback(){
        this.showSpinner = true;
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
                this.selectedValue = result.Customer_Accounts_Payable_Portal_Require__c;
                //console.log('this.selectedValue',this.selectedValue)
                if(this.selectedValue == 'Yes'){
                    this.websiteDisplay = true;
                }
                else{
                    this.websiteDisplay = false;
                }
                this.website = result.Website__c;
                this.radio1 = result.Resale_Certificate__c;
                this.radio2 = result.Pay_tax_on_shipment__c;
                this.businessType = result.Business_Type__c;
                this.presidentOwner = result.President_Owner__c;
                this.vpFinanceCFO = result.VP_of_Finance_CFO__c;
                this.secTreasurer = result.Sec_Treasurer__c;
                this.creditLimitRequested = result.Credit_Limit_Requested__c;
                this.company1 = result.Company_1__c;
                this.contact1 = result.Contact_Number_1__c;
                this.acctNumber1 = result.Acct_1__c;
                this.email1 = result.Supplier_Email_1__c;
                this.phone1 = result.Phone_Number_1__c;
                this.company2 = result.Company_2__c;
                this.contact2 = result.Contact_Number_2__c;
                this.acctNumber2 = result.Acct_2__c;
                this.email2 = result.Supplier_Email_2__c;
                this.phone2 = result.Phone_Number_2__c;
                this.company3 = result.Company_3__c;
                this.contact3 = result.Contact_Number_3__c;
                this.acctNumber3 = result.Acct_3__c;
                this.email3 = result.Supplier_Email_3__c;
                this.phone3 = result.Phone_Number_3__c;
                this.bankName = result.Bank_Name__c;
                this.accountNumber = result.Account__c;
                this.address = result.Address__c;
                this.city = result.City__c;
                this.state = result.State__c;
                this.zip = result.Zip__c;
                this.contactPhone = result.Contact__c;
                this.bankPhone = result.Phone__c;
                this.fax = result.Fax__c;
                this.hedOfFinance = result.Head_of_Finance_or_Head_of_Accounting__c;
                this.nameFinance= result.Name_Finance__c;
                this.phoneFinance = result.Phone_Finance__c
                this.emailFinance = result.Email_Finance__c;
                this.signatureValue = result.Applicant_Signature__c;
                //console.log('result.group brand :', result.Group_brand_s__c)
                const selectedBrands = result.Group_brand_s__c ? result.Group_brand_s__c.split(';') : [];
                this.MasterBilt = selectedBrands.includes('Master-Bilt');
                //console.log('this.MasterBilt',this.MasterBilt)
                this.Norlake = selectedBrands.includes('Norlake');
                //console.log('this.Norlake', this.Norlake)
                this.showSpinner = false;
                
            })
            .catch(error => {
                console.error('Error fetching company information:', error);
                this.showToast('Error', 'Error fetching company information: ' + error.body.message, 'error');
                this.showSpinner = false;
            });
        }
        
    }
    
}