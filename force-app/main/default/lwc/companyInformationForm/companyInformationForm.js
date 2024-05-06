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
    @track saveContinue = false;
    @track Next = false;
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
    @track checkStatus = false;
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
    @track physicalCountry = 'United States';
    @track physicalZip;
    @track mailingAddress;
    @track mailingCity;
    @track mailingState;
    @track mailingCountry = 'United States';
    @track mailingZip;
    @track billingAddress;
    @track billingCity;
    @track billingState;
    @track billingCountry = 'United States';
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
        //console.log('this.nameValue',this.nameValue)
    }
    handleInputChangePhone(event) {
        this.phoneValue = event.target.value;
        //console.log('this.phoneValue',this.phoneValue)
    }
    handleInputChangeDate(event) {
        this.dateValue = event.target.value;
        //console.log('this.nameValue',this.nameValue)
    }

    domainName;    
    @track type;
    handleClick() {
        this.showSpinner = true;
        this.logInEmail = this.contactEmail;
        //console.log('contactEmail',this.contactEmail)
        //console.log('logInEmail',this.logInEmail)
        //console.log('this.groupName',this.groupName)
        //console.log('this.buyingGroup',this.buyingGroup)
        //console.log('After handle click', this.recordId)
        try {
            this.domainName = this.contactEmail.split('@')[this.contactEmail.split('@').length - 1];
            //console.log('domainName', this.domainName)
            if (!this.businessName || !this.buyingGroup||( this.groupName == undefined  && this.buyingGroup == 'Yes') || !this.phone || !this.mailingAddress ||
                !this.mailingCity || !this.mailingState || !this.mailingZip || !this.billingAddress ||
                !this.billingCity || !this.billingState || !this.billingZip || !this.Contact || 
                !this.email || !this.timeZone || !this.nameValue || !this.firstNameValue) {
                this.showToast('Error', 'Please fill in all required fields.', 'error');
                this.showSpinner = false;
                return;
            }

        createCompanyInformation({
            accountDomain:this.domainName,
            recordId: this.recordId,
            businessName: this.businessName,
            yearStarted: this.yearStarted,
            parentCompany: this.parentCompany,
            radioGroup: this.buyingGroup,
            groupName: this.groupName,
            phone: this.phone,
            physicalAddress: this.physicalAddress,
            physicalCity: this.physicalCity,
            physicalState: this.physicalState,
            physicalZip: this.physicalZip,
            mailingAddress: this.mailingAddress,
            mailingCity: this.mailingCity,
            mailingState: this.mailingState,
            mailingZip: this.mailingZip,
            billingAddress: this.billingAddress,
            billingCity: this.billingCity,
            billingState: this.billingState,
            billingZip: this.billingZip,
            apName: this.apName,
            Contact: this.Contact,
            email: this.email,
            invoiceEmail: this.invoiceEmail,
            orderEmail: this.orderEmail,
            timeZone: this.timeZone,
            resaleNumber: this.resaleNumber,
            duns: this.duns,
            website: this.website
        })
        .then(result => {
            //console.log('Result:', result);
            this.recordId = result; 
            this.creditInformation = true;
            this.companyInformation = false;
            // this.backButtonCompany = true;
            //console.log('recordId from parent :',this.recordId)
            this.handleUpdate();
            // this.handleGetAccountInfo();
            //this.showToast('Success', 'Record created successfully', 'success');
            this.creditStatusInRow = this.creditSelectedRowStatus;
            //console.log('creditSelectedRowStatus from parent',this.creditSelectedRowStatus)
            //console.log('creditStatusInRow from parent',this.creditStatusInRow)
            this.type = this.actionType;
            this.createdCreditId = this.newCreditId;
            //this.createdCreditId = this.newCreditIdFromCreditDetails;
            this.showSpinner = false;
        })
        .catch(error => {
            console.error('Error creating company information:', error);
            this.showToast('Error', 'Error creating company information: ' + error.body.message, 'error');
            this.showSpinner = false;
        });
        } catch (error) {
            console.error("err",error)
        }
        
        
    }
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
    handleUpdate(){
        //console.log('Account id to be assoiciated with', this.recordId)
        //console.log('Contact id to be assoiciated with', this.contactIdFromLogIn)
        //console.log('Contact id to be assoiciated with', this.nameValue)
        //console.log('Contact id to be assoiciated with', this.firstNameValue)
        //console.log('Contact id to be assoiciated with', this.titleValue)
        //console.log('Contact id to be assoiciated with', this.phoneValue)
        //console.log('Contact id to be assoiciated with', this.dateValue)
        updateContactRecord({ 
            email:this.contactEmail,
            updatedDate:this.dateValue,
            conId:this.contactIdFromLogIn,
            accID:this.recordId,
            LastName:this.nameValue,
            FirstName:this.firstNameValue,
            Title: this.titleValue,
            phoneNumber:this.phoneValue
        })
        .then(result => {
            //console.log('Record updated successfully:', result);
            //this.showToast('Success', 'Record updated successfully', 'success');
        })
        .catch(error => {
            console.error('Error updated record:', error);
            this.showToast('Error', 'Error updated contact information: ' + error.body.message, 'error');
        });
    }
    handleNextClick(){
        this.showSpinner = true;
        this.logInEmail = this.contactEmail;
        //console.log('contactEmail',this.contactEmail)
        //console.log('logInEmail',this.logInEmail)
        //console.log('this.groupName',this.groupName)
        //console.log('this.buyingGroup',this.buyingGroup)
        //console.log('After handle click', this.recordId)
        this.domainName = this.contactEmail.split('@')[this.contactEmail.split('@').length - 1];
        //console.log('domainName', this.domainName)
        createCompanyInformation({
            accountDomain:this.domainName,
            recordId: this.recordId,
            businessName: this.businessName,
            yearStarted: this.yearStarted,
            parentCompany: this.parentCompany,
            radioGroup: this.buyingGroup,
            groupName: this.groupName,
            phone: this.phone,
            physicalAddress: this.physicalAddress,
            physicalCity: this.physicalCity,
            physicalState: this.physicalState,
            physicalZip: this.physicalZip,
            mailingAddress: this.mailingAddress,
            mailingCity: this.mailingCity,
            mailingState: this.mailingState,
            mailingZip: this.mailingZip,
            billingAddress: this.billingAddress,
            billingCity: this.billingCity,
            billingState: this.billingState,
            billingZip: this.billingZip,
            apName: this.apName,
            Contact: this.Contact,
            email: this.email,
            invoiceEmail: this.invoiceEmail,
            orderEmail: this.orderEmail,
            timeZone: this.timeZone,
            resaleNumber: this.resaleNumber,
            duns: this.duns,
            website: this.website
        })
        .then(result => {
            //console.log('Result:', result);
            this.recordId = result; 
            this.creditInformation = true;
            this.companyInformation = false;
            //console.log('recordId from parent :',this.recordId)
            this.creditStatusInRow = this.creditSelectedRowStatus;
            //console.log('creditSelectedRowStatus from parent',this.creditSelectedRowStatus)
            //console.log('creditStatusInRow from parent',this.creditStatusInRow)
            this.type = this.actionType;
            this.createdCreditId = this.newCreditId;
            this.showSpinner = false;
        })
        .catch(error => {
            console.error('Error creating company information:', error);
            this.showSpinner = false;
        });
    }

    accountDomain;
    contactLogInId;
    contactIdFromLogIn


    connectedCallback(){
        //console.log('newCreditIdFromCreditDetails from credit details',this.newCreditIdFromCreditDetails)
        //console.log('newCreditId in company form', this.newCreditId)
        //console.log('Action Type from existing records',this.actionType)
        //console.log('actionTypeCredit', this.actionTypeCredit);
        window.scrollTo(0, 0);
        
        this.showSpinner = true;
        if(this.actionTypeCredit){
            this.actionType = this.actionTypeCredit;
        }
        //this.actionTypeCredit = this.actionType;
        if(this.actionType === 'view') {
            this.Next = true;
            this.saveContinue = false;
            this.checkStatus = true;
            //console.log('checkStatus status',this.checkStatus)
        } else {
            this.Next = false;
            this.saveContinue = true;
            this.checkStatus = false;
            //console.log('checkStatus status',this.checkStatus)
        }
        //console.log('checkStatus',this.checkStatus)
        //console.log('action type in company form', this.actionType)
        //this.checkStatus = false;
        this.creditInformation = false;
        this.companyInformation = true;
        // //console.log('getAccountInfo Id: ', this.recordId)
        setTimeout(() => {
            //console.log('credit status in account page',this.creditSelectedRowStatus)
            //console.log('credit status in account page creditIdFromCreditDetails',this.creditIdFromCreditDetails)
            if(this.creditIdFromCreditDetails){
                this.creditRowId = this.creditIdFromCreditDetails;
            }
            if(this.creditSelectedRowId){
                this.creditRowId = this.creditSelectedRowId;
            }
            //console.log('creditSelectedRowId in account page', this.creditRowId)
        }, 1000);
        
        //console.log('connected callback called',this.creditDetailId)
        //console.log(' connected callback called this.contactEmail', this.contactEmail)

        this.domainName = this.contactEmail.split('@')[this.contactEmail.split('@').length - 1];
        //console.log('domainName', this.domainName)
        //console.log('Domain NAme:',this.domainName)
        // this.accountDomain = this.contactEmail;
        // //console.log('account Domain ',this.accountDomain);
        setTimeout(() => {
        //console.log('contactEmail before getting account records' ,this.contactEmail);
        //console.log('accountDomain before getting account records' ,this.domainName);
        //console.log('creditRowId before getting account records' ,this.creditRowId);
        
        if(this.creditRowId){
            getAccountInfoFromCreditId({
                creditId : this.creditRowId
            })
            .then(result => {
                //console.log('Result getAccountInfo creditRowId:', result);
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
                    this.physicalZip = result[0].ShippingPostalCode;
                    this.mailingAddress = result[0].Mailing_address__c;
                    this.mailingCity = result[0].Mailing_City__c;
                    this.mailingState = result[0].Mailing_State__c;
                    this.mailingZip = result[0].Mailing_Zip__c;
                    this.billingAddress = result[0].BillingStreet;
                    this.billingCity = result[0].BillingCity;
                    this.billingState = result[0].BillingState;
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
                    if(this.creditSelectedRowStatus == 'Submitted' && this.actionType != "clone"){
                        this.checkStatus = true;
                    }
                    else if(this.creditSelectedRowStatus == 'In Progress'&& this.actionType == "view"){
                        this.checkStatus = true;
                    }
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
        else{
            getAccountInfo({
                accountDomain:this.domainName,
                logInEmail : this.contactEmail
            })
            .then(result => {
                //console.log('Result getAccountInfo contactEmail:', result);
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
                    this.physicalZip = result[0].ShippingPostalCode;
                    this.mailingAddress = result[0].Mailing_address__c;
                    this.mailingCity = result[0].Mailing_City__c;
                    this.mailingState = result[0].Mailing_State__c;
                    this.mailingZip = result[0].Mailing_Zip__c;
                    this.billingAddress = result[0].BillingStreet;
                    this.billingCity = result[0].BillingCity;
                    this.billingState = result[0].BillingState;
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
                    if(this.creditSelectedRowStatus == 'Submitted' && this.actionType != "clone"){
                        this.checkStatus = true;
                    }
                    else if(this.creditSelectedRowStatus == 'In Progress'&& this.actionType == "view"){
                        this.checkStatus = true;
                    }
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
    }, 1000);
        //console.log('this.contactEmail for getting id',this.contactEmail)
        getContactId({logInEmail:this.contactEmail})
        .then(result => {
            //console.log('Contact Id from logIn Email.:', result);
            this.contactLogInEmail = this.contactEmail ? this.contactEmail : "";
            this.contactLogInId = result;
            this.contactIdFromLogIn = this.contactLogInId;
            //console.log('contactIdFromLogIn for getting id', this.contactIdFromLogIn)
            //console.log('contactLogInId for getting id',this.contactLogInId)
            //this.showSpinner = false;
        })
        .catch(error => {
            console.error('creditRowIdError fetching contact Id:', error);
            //this.showSpinner = false;
        });

        //console.log('fetchContactRecord called in connected callback');
        //console.log('contactEmail inside connected callback', this.contactEmail);
        //console.log('CreditRowID before going to condition', this.creditRowId);
        //console.log('creditSelectedRowId before going to condition', this.creditSelectedRowId);

        setTimeout(() => {
            //console.log('Inside setTimeout');
            //console.log('CreditRowID inside setTimeout', this.creditRowId);
            //console.log('creditSelectedRowId inside setTimeout', this.creditSelectedRowId);
            if (this.creditRowId && this.actionType == 'view' || this.actionType == 'edit') {
                this.fetchContactRecordFromCreditId(this.creditRowId);
                //console.log('fetchContactRecordFromCreditId called');// View
            } else {
                this.fetchContactRecord(this.contactEmail);
                //console.log('fetchContactRecord called'); // clone & edit and new
            }
        }, 1100);

        //this.fetchContactRecord(this.contactEmail);
       //console.log('checkStatus status at last',this.checkStatus)
    }
    fetchContactRecord(email) {
        //this.showSpinner = true;
        //console.log('fetchContactRecord called through connected callback')
        //console.log('contactEmail through connected callback',this.contactEmail)
        setTimeout(() => {
            getContactByEmail({ email: this.contactEmail })
                .then(result => {
                    //console.log('Result from fetchContactRecord',result)
                    if (result) {
                        this.showSpinner = false;
                        this.nameValue = result.LastName;
                        this.firstNameValue = result.FirstName;
                        this.lastNameValue = result.LastName;
                        this.titleValue = result.Title;
                        this.phoneValue = result.Phone;
                        this.dateValue=result.Updated_Date__c;
                        if (this.firstNameValue) {
                            this.nameValue = result.LastName;
                           
                        }
                        else{
                            this.nameValue = '';
                    
                        }
                    } else {
                        //this.showToast('Error', 'Contact not found for the provided email.', 'error');
                      
                    }
                })
                .catch(error => {
                    console.error('Error fetching contact record:', error);
                    this.showSpinner = false;
                    //this.showToast('Error', 'Error fetching contact record: ' + error.body.message, 'error');
                });
        }, 1000); // 1000 milliseconds delay, adjust as needed
    }

    fetchContactRecordFromCreditId(Id) {
        //this.showSpinner = true;
        //console.log('fetchContactRecordFromCreditId called through connected callback')
        //console.log('creditSelectedRowId through connected callback',this.creditRowId)
        setTimeout(() => {
            getContactByCreditId({ creditId: this.creditRowId })
                .then(result => {
                    //console.log('Result from fetchContactRecord',result)
                    if (result) {
                        this.showSpinner = false;
                        this.nameValue = result.LastName;
                        this.firstNameValue = result.FirstName;
                        this.lastNameValue = result.LastName;
                        this.titleValue = result.Title;
                        this.phoneValue = result.Phone;
                        this.dateValue=result.Updated_Date__c;
                        if(this.actionType == 'view'){
                            this.contactLogInEmail = result.Email;
                        }
                        if (this.firstNameValue) {
                            this.nameValue = result.LastName;
                        }
                        else{
                            this.nameValue = '';
                        }
                    } else {
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