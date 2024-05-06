import { LightningElement, track, api } from 'lwc';
import RGS_logo from "@salesforce/resourceUrl/RGS_logo";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createCompanyInformation from '@salesforce/apex/CreditFormController.createCompanyInformation'; 
import getAccountInfo from '@salesforce/apex/CreditFormController.getAccountInfo';
import getContactId from '@salesforce/apex/CreditFormController.getContactId';
import getContactByEmail from '@salesforce/apex/CreditFormController.getContactByEmail';
import updateContactRecord from '@salesforce/apex/CreditFormController.updateContactRecord';
import getContactByCreditId from '@salesforce/apex/CreditFormController.getContactByCreditId';
import getAccountInfoFromCreditId from '@salesforce/apex/CreditFormController.getAccountInfoFromCreditId'; 

export default class CreditForm extends LightningElement {
    @track showSpinner = false;
    @api newCreditIdFromCreditDetails;
    @api newCreditId;
    @track createdCreditId;
    @api actionTypeCredit;
    @track Next = true;
    @api creditSelectedRowStatus;
    @track creditStatusInRow;
    @api creditSelectedRowId;
    @api creditIdFromCreditDetails;
    @track creditRowId;
    @api companyId;
    @api contactEmail;
    @api contactLogInEmail;
    @api creditDetailId;
    @api actionType
    @track logInEmail;
    @track buyingGroupName = false;
    rsgLogo = RGS_logo;
    @track creditInformation = false;
    @track companyInformation = true;
    // @track backButtonCompany = false;
    @track whenBuyingGroupYes = false;
    @track checkStatus = true;
    @track recordId;
    @track yearStarted;
    @track errorMessage = '';
    @track businessName;
    @track parentCompany;
    @track radioGroup;
    @track buyingGroup;
    @track groupName;
    @track phone;
    @track physicalAddress;
    @track physicalCity;
    @track physicalState;
    @track physicalCountry;
    @track physicalZip;
    @track mailingAddress;
    @track mailingCity;
    @track mailingState;
    @track mailingCountry;
    @track mailingZip;
    @track billingAddress;
    @track billingCity;
    @track billingState;
    @track billingCountry;
    @track billingZip;
    @track apName;
    @track Contact;
    @track email;
    @track invoiceEmail;
    @track orderEmail;
    @track timeZone;
    @track resaleNumber;
    @track duns;
    @track website;

    @track buyingGroupValue = '';
    @track buyingGroupOptions = [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' }
    ];
    @track timeZoneOptions = [
        { label: 'Choose One', value: 'GMT-12:00' },
        { label: 'Eastern', value: 'Eastern' },
        { label: 'Central', value: 'Central' },
        { label: 'Mountain', value: 'Mountain' },
        { label: 'Pacific', value: 'Pacific' }
    ];


    
    handleChange(event) {
        const field = event.target.name;
        const value = event.target.value;
   
        // Set the value of the corresponding field based on its name
        switch(field) {
            case 'buyingGroup':
                this.buyingGroup = value;
                //console.log('Buying Group:', value);
                if(value == 'Yes'){
                    // this.buyingGroup = value;  
                    this.whenBuyingGroupYes = true;
                    this.buyingGroupName = true;
                }
                else{
                    // this.buyingGroupValue = '';
                    this.buyingGroupName = false;
                }
                break;
            case 'businessName':
                this.businessName = value;
                //console.log('Business Name:', value);
                break;
                case 'yearStarted':
                    const currentDate = new Date();
                    const currentYear = currentDate.getFullYear();
                    const isValidFormat = /^(0[1-9]|1[0-2])\/([0-9]{4})$/.test(value);
                    if (isValidFormat) {
                        const yearEntered = parseInt(value.split('/')[1]);
                        if (yearEntered <= currentYear) {
                            this.yearStarted = value;
                            this.errorMessage = '';
                            //console.log('Year Started:', value);
                        } else {
                            this.errorMessage = 'Please put the valid year.';
                        }
                    } else {
                        this.errorMessage = 'Please enter the date in mm/yyyy format';
                    }
                    break;
                
            case 'parentCompany':
                this.parentCompany = value;
                //console.log('Parent Company:', value);
                break;
            // case 'radioGroup':
            //     this.radioGroup = value;
            //     //console.log('Radio Group:', value);
            //     if(value == 'yes'){
            //         this.buyingGroupValue = value;  
            //     }
            //     else{
            //         this.buyingGroupValue = '';
                
            //     }
            //     break;
            case 'groupName':
                this.groupName = value;
                //console.log('Group Name:', value);
                break;
            case 'phone':
                this.phone = value;
                //console.log('Phone:', value);
                break;
            case 'physicalAddress':
                this.physicalAddress = value;
                //console.log('Physical Address:', value);
                break;
            case 'physicalCity':
                this.physicalCity = value;
                //console.log('Physical City:', value);
                break;
            case 'physicalState':
                this.physicalState = value;
                //console.log('Physical State:', value);
                break;
                case 'physicalCountry':
                    this.physicalCountry = value;
                    //console.log('Physical State:', value);
                    break;
            case 'physicalZip':
                this.physicalZip = value;
                //console.log('Physical Zip:', value);
                break;
            case 'mailingAddress':
                this.mailingAddress = value;
                //console.log('Mailing Address:', value);
                break;
            case 'mailingCity':
                this.mailingCity = value;
                //console.log('Mailing City:', value);
                break;
            case 'mailingState':
                this.mailingState = value;
                //console.log('Mailing State:', value);
                break;
            case 'mailingCountry':
                this.mailingCountry = value;
                //console.log('Mailing State:', value);
                break;
            case 'mailingZip':
                this.mailingZip = value;
                //console.log('Mailing Zip:', value);
                break;
            case 'billingAddress':
                this.billingAddress = value;
                //console.log('Billing Address:', value);
                break;
            case 'billingCity':
                this.billingCity = value;
                //console.log('Billing City:', value);
                break;
                case 'billingState':
                    this.billingState = value;
                    //console.log('Billing State:', value);
                    break;

            case 'billingCountry':
                    this.billingCountry = value;
                    //console.log('Billing State:', value);
                    break;
                    
            case 'billingZip':
                this.billingZip = value;
                //console.log('Billing Zip:', value);
                break;
            case 'apName':
                this.apName = value;
                //console.log('AP Name:', value);
                break;
            case 'Contact':
                this.Contact = value;
                //console.log('Contact:', value);
                break;
            case 'email':
                this.email = value;
                //console.log('Email:', value);
                break;
            case 'invoiceEmail':
                this.invoiceEmail = value;
                //console.log('Invoice Email:', value);
                break;
            case 'orderEmail':
                this.orderEmail = value;
                //console.log('Order Email:', value);
                break;
            case 'timeZone':
                this.timeZone = value;
                //console.log('Time Zone:', value);
                break;
            case 'resaleNumber':
                this.resaleNumber = value;
                //console.log('Resale Number:', value);
                break;
            case 'duns':
                this.duns = value;
                //console.log('DUNS:', value);
                break;
            case 'website':
                this.website = value;
                //console.log('Website:', value);
                break;
            default:
                break;
        }
    }

    @track contactLogInEmail;
    @track nameValue;
    @track firstNameValue;
    @track phoneValue;
    @track titleValue;
    @track dateValue;
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
    @track creditIdFromCompany;
    handleNextClick(){
    this.creditInformation = true;
    this.companyInformation = false;
    }

    accountDomain;
    contactLogInId;
    contactIdFromLogIn


    connectedCallback(){
        this.showSpinner = true;
        window.scrollTo(0, 0);
        //console.log('contactEmail value in company',this.contactEmail)
        let currentUrl = window.location.href;
        //console.log('Current URL:', currentUrl);
        if (currentUrl.includes('Id=')) {
            let id = currentUrl.split('=')[1];
            //console.log('ID:', id);
            this.creditSelectedRowId = id;
            //console.log('creditSelectedRowId:', this.creditSelectedRowId);
        }
        if(this.creditSelectedRowId){
            getAccountInfoFromCreditId({
                creditId:this.creditSelectedRowId
            })
            .then(result => {
                //console.log('Result getAccountInfo:', result);
                if(result && result.length > 0){
                    this.recordId = result[0].Id;
                    //console.log('this.recordId', this.recordId)
                    this.businessName = result[0].Name;
                    //console.log('this.businessName', this.businessName)
                    this.yearStarted = result[0].Year__c;
                    //console.log('this.yearStarted', this.yearStarted)
                    this.parentCompany = result[0].Parent_Company__c;
                    this.buyingGroup = result[0].Are_you_a_Buying_Group_member__c;
                    this.groupName = result[0].Buying_group_Note__c;
                    this.phone = result[0].Phone;
                    this.physicalAddress = result[0].ShippingStreet;
                    this.physicalCity = result[0].ShippingCity;
                    this.physicalState = result[0].ShippingState;
                    this.physicalCountry = result[0].ShippingCountry;
                    this.physicalZip = result[0].ShippingPostalCode;
                    this.mailingAddress = result[0].Mailing_address__c;
                    this.mailingCity = result[0].Mailing_City__c;
                    this.mailingState = result[0].Mailing_State__c;
                    this.mailingCountry = result[0].Mailing_Country__c;
                    this.mailingZip = result[0].Mailing_Zip__c;
                    this.billingAddress = result[0].BillingStreet;
                    this.billingCity = result[0].BillingCity;
                    this.billingState = result[0].BillingState;
                    this.billingCountry = result[0].BillingCountry;
                    this.billingZip = result[0].BillingPostalCode;
                    this.apName = result[0].AP_Name_Title__c;
                    this.Contact = result[0].Contact_Number__c;
                    this.email = result[0].Email__c;
                    this.invoiceEmail = result[0].Dedicated_Invoice_Email__c;
                    this.orderEmail = result[0].Order_Acknowledgment_Email__c;
                    this.timeZone = result[0].Time_Zone__c;
                    this.resaleNumber = result[0].State_Resale_Number__c;
                    this.duns = result[0].DUNS__c;
                    this.website = result[0].Website;
                    //console.log('result[0].Status__c',result[0].Status__c)
                    //console.log('result[0].Are_you_a_Buying_Group_member__c',result[0].Are_you_a_Buying_Group_member__c)
                    //console.log('this.buyingGroup', this.buyingGroup);
                    if(this.buyingGroup && this.buyingGroup == "Yes"){
                        this.buyingGroupName = true;
                    } else {
                        this.buyingGroupName = false;
                    }
                }
                //this.showSpinner = false;
            })
            .catch(error => {
                console.error('Error fetching company information:', error);
                //this.showToast('Error', 'Error fetching company information: ' + error.body.message, 'error');
                //this.showSpinner = false;
            });
        }
        setTimeout(() => {
            //console.log('Inside setTimeout');
            //console.log('CreditRowID inside setTimeout', this.creditRowId);
            //console.log('creditSelectedRowId inside setTimeout', this.creditSelectedRowId);
            if (this.creditSelectedRowId) {
                this.fetchContactRecordFromCreditId(this.creditSelectedRowId);
                //console.log('fetchContactRecordFromCreditId called');
            } 
        }, 1100);
       //console.log('checkStatus status at last',this.checkStatus)
    }
    fetchContactRecordFromCreditId(Id) {
        //console.log('fetchContactRecordFromCreditId called through connected callback')
        //console.log('creditSelectedRowId through connected callback',this.creditRowId)
        setTimeout(() => {
            getContactByCreditId({ creditId: this.creditSelectedRowId})
                .then(result => {
                    //console.log('Result from fetchContactRecord',result)
                    if (result) {
                        this.showSpinner = false;
                        this.nameValue = result.LastName;
                        this.firstNameValue = result.FirstName;
                        this.lastNameValue = result.LastName;
                        this.titleValue = result.Title;
                        this.phoneValue = result.Phone;
                        this.contactLogInEmail = result.Email;
                        this.dateValue=result.Updated_Date__c;
                        if (this.firstNameValue) {
                            this.nameValue = result.LastName;
                        }
                        else{
                            this.nameValue = '';
                        }
                    } else {
                        this.showSpinner = false;
                        //this.showToast('Error', 'Contact not found for the provided email.', 'error');
                    }
                })
                .catch(error => {
                    this.showSpinner = false;
                    console.error('Error fetching contact record:', error);
                    //this.showToast('Error', 'Error fetching contact record: ' + error.body.message, 'error');
                });
        }, 1000);
    }
    

}