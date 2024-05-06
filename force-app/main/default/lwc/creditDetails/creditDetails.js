import { LightningElement,track,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createCreditRecord from '@salesforce/apex/CreditFormController.createCreditRecord';
import getCreditInfo from '@salesforce/apex/CreditFormController.getCreditInfo';
import getContactId from '@salesforce/apex/CreditFormController.getContactId';
import reparentFileAttachment from '@salesforce/apex/CreditFormController.reparentFileAttachment';

export default class CreditDetails extends LightningElement {
    @track showSpinner = false;
    @api fetchCreditRecordIdFromContact;
    @track createdCreditId;
    @track newCreditIdFromCreditDetails;
    @api newCreditIdFromCompany;
    @api newCreditIdFromContact
    @api actionTypeCredit;
    @track creitActionType;
    @track saveContinue = false;
    @track Next = false;
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
    @track checkStatus = false;
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
    @track radio1 = false;
    @track radio2 = false;

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

    @track type;
    handleClick() {
        this.showSpinner = true;
        //console.log('132 line', this.companyId);
        this.accountId = this.companyId;
        //console.log('this.accountId',this.accountId);
        this.contactLogInEmail = this.logInEmail;
        //console.log('this.contactLogInEmail',this.contactLogInEmail);
        const creditData = [];
        const groupBrand = [];
        if (this.MasterBilt) {
            groupBrand.push('Master-Bilt');
        }
        if (this.Norlake) {
            groupBrand.push('Norlake');
        }
        //console.log('contactLogInId before creating', this.contactLogInId)
        //console.log('this.selectedValue',this.selectedValue)
        //console.log('this.selectedValue',this.website)
        if (!this.bankName || ( this.website == undefined  && this.selectedValue == 'yes') || !this.accountNumber || !this.address ||
            !this.city || !this.state || !this.zip || !this.contactPhone ||
            !this.bankPhone || !this.creditLimitRequested) {
            this.showToast('Error', 'Please fill in all required fields.', 'error');
            this.showSpinner = false;
            return;
        }
        //console.log('Before creating record', this.creditId)
        //console.log()
        if(this.creditSelectedRowId && this.actionType == 'edit'){
        this.creditId=this.creditSelectedRowId
        }
        //console.log('Before creating credit record',this.creditSelectedRowId)
        if(this.newCreditIdFromCompany){
            this.creditId = this.newCreditIdFromCompany;
        }
        //console.log('Before creating credit record',this.creditId)

        //console.log('Before creating credit record actionType',this.actionType)
        //console.log('Before creating credit record creditSelectedRowId',this.creditSelectedRowId)
        if(this.actionType == 'clone' && this.creditSelectedRowId){
            this.creditId = null; 
        }
        //console.log('creditSelectedRowStatus before updating 179:-',this.creditSelectedRowStatus)
        //console.log('action type before going to update 180:-', this.actionType)
        //console.log('credit Id before going to update the credit recod 181:-', this.creditId)
        //console.log('Radio Button 221 ', this.radio1);
        //console.log('Radio Button 222 ', this.radio2);
        const creditRecord = {
            sobjectType: 'Credit__c',
            Id:this.creditId,
            Account_Id__c:this.companyId,
            Contact_Id__c:this.contactLogInId,
            Customer_Accounts_Payable_Portal_Require__c:this.selectedValue,
            Website__c:this.website,
            Group_brand_s__c:groupBrand.join(';'),
            Resale_Certificate__c:this.radio1,
            Pay_tax_on_shipment__c: this.radio2,
            Business_Type__c:this.businessType,
            President_Owner__c:this.presidentOwner,
            VP_of_Finance_CFO__c:this.vpFinanceCFO,
            Sec_Treasurer__c:this.secTreasurer,
            Credit_Limit_Requested__c: this.creditLimitRequested,
            Company_1__c: this.company1,
            Contact_Number_1__c:this.contact1,
            Acct_1__c:this.acctNumber1,
            Supplier_Email_1__c:this.email1,
            Phone_Number_1__c:this.phone1,
            Company_2__c:this.company2,
            Contact_Number_2__c:this.contact2,
            Acct_2__c:this.acctNumber2,
            Supplier_Email_2__c:this.email2,
            Phone_Number_2__c:this.phone2,
            Company_3__c:this.company3,
            Contact_Number_3__c:this.contact3,
            Acct_3__c:this.acctNumber3,
            Supplier_Email_3__c:this.email3,
            Phone_Number_3__c:this.phone3,
            Bank_Name__c:this.bankName,
            Account__c:this.accountNumber,
            Address__c:this.address,
            City__c:this.city,
            State__c:this.state,
            Zip__c:this.zip,
            Contact__c:this.contactPhone,
            Phone__c:this.bankPhone,
            Fax__c:this.fax,
            Head_of_Finance_or_Head_of_Accounting__c:this.hedOfFinance,
            Name_Finance__c:this.nameFinance,
            Phone_Finance__c:this.phoneFinance,
            Email_Finance__c:this.emailFinance,
            Terms_And_Conditions__c: true
        };
        //console.log('creditRecord ------------',JSON.stringify(creditRecord))
        //console.log('creditRecord.Id',creditRecord.Phone_Finance__c)
        //console.log('creditRecord.Id',creditRecord.Email_Finance__c)
        creditData.push(creditRecord);
        // if(this.creditId != null){
            createCreditRecord({creditData})
            .then(result => {
                this.showSpinner = false;
                this.creditStatusInRow = this.creditSelectedRowStatus;
                //console.log('creditSelectedRowStatus from credit',this.creditSelectedRowStatus)
                //console.log('creditStatusInRow from credit',this.creditStatusInRow)
                //console.log('contactLogInEmail', this.contactLogInEmail)
                //console.log('Records created successfully:', result);
                //console.log('resultId', result[0].Id)
                //this.showToast('Success', 'Record created successfully', 'success');
                this.showContactDetails = true;
                this.showCreditDetails = false; 
                this.creditInformation = false
                // this.backButton = true;
                this.creditRecordId = result[0].Id;
                this.creditId = result[0].Id;
                //console.log('creditRecordId', this.creditRecordId)
                this.type = this.actionType;
                this.creitActionType = this.actionType;
                this.createdCreditId = this.newCreditId ? this.newCreditId : this.newCreditIdFromContact;
                //console.log('createdCreditId from credit details',this.createdCreditId);

                //console.log('creditId before re parenting', this.creditId)
                //console.log('reparentFileDocumentId before re parenting', this.reparentFileDocumentId)
                reparentFileAttachment({ contentDocumentId: this.reparentFileDocumentId, newParentId: this.creditId })
                .then(result => {
                    //console.log('File attachment reparented successfully:', result);
                })
                .catch(error => {
                    console.error('Error reparenting file attachment:', error);
                });
            })
            .catch(error => {
                console.error('Error creating records:', error);
                this.showToast('Error', 'Error creating company information: ' + error.body.message, 'error');
                this.showSpinner = false;
            });
        // }
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
        this.showSpinner = true;
        //console.log('132 line', this.companyId);
        this.accountId = this.companyId;
        //console.log('this.accountId',this.accountId);
        this.contactLogInEmail = this.logInEmail;
        //console.log('this.contactLogInEmail',this.contactLogInEmail);
        const creditData = [];
        const groupBrand = [];
        if (this.MasterBilt) {
            groupBrand.push('Master-Bilt');
        }
        if (this.Norlake) {
            groupBrand.push('Norlake');
        }
        //console.log('contactLogInId before creating', this.contactLogInId)
        //console.log('this.selectedValue',this.selectedValue)
        //console.log('this.selectedValue',this.website)
        //console.log('Before creating record', this.creditId)
        //console.log()
        if(this.creditSelectedRowId){
        this.creditId=this.creditSelectedRowId
        }
        //console.log('Before creating credit record',this.creditSelectedRowId)
        //console.log('Before creating credit record',this.creditId)
        if(this.actionType == 'clone'){
            this.creditId = null; 
        }
        //console.log('creditSelectedRowStatus before updating 179:-',this.creditSelectedRowStatus)
        //console.log('action type before going to update 180:-', this.actionType)
        //console.log('credit Id before going to update the credit recod 181:-', this.creditId)
        const creditRecord = {
            sobjectType: 'Credit__c',
            Id:this.creditId,
            Account_Id__c:this.companyId,
            Contact_Id__c:this.contactLogInId,
            Customer_Accounts_Payable_Portal_Require__c:this.selectedValue,
            Website__c:this.website,
            Group_brand_s__c:groupBrand.join(';'),
            Resale_Certificate__c:this.radio1,
            Pay_tax_on_shipment__c: this.radio2,
            Business_Type__c:this.businessType,
            President_Owner__c:this.presidentOwner,
            VP_of_Finance_CFO__c:this.vpFinanceCFO,
            Sec_Treasurer__c:this.secTreasurer,
            Credit_Limit_Requested__c: this.creditLimitRequested,
            Company_1__c: this.company1,
            Contact_Number_1__c:this.contact1,
            Acct_1__c:this.acctNumber1,
            Supplier_Email_1__c:this.email1,
            Phone_Number_1__c:this.phone1,
            Company_2__c:this.company2,
            Contact_Number_2__c:this.contact2,
            Acct_2__c:this.acctNumber2,
            Supplier_Email_2__c:this.email2,
            Phone_Number_2__c:this.phone2,
            Company_3__c:this.company3,
            Contact_Number_3__c:this.contact3,
            Acct_3__c:this.acctNumber3,
            Supplier_Email_3__c:this.email3,
            Phone_Number_3__c:this.phone3,
            Bank_Name__c:this.bankName,
            Account__c:this.accountNumber,
            Address__c:this.address,
            City__c:this.city,
            State__c:this.state,
            Zip__c:this.zip,
            Contact__c:this.contactPhone,
            Phone__c:this.bankPhone,
            Fax__c:this.fax,
            Head_of_Finance_or_Head_of_Accounting__c:this.hedOfFinance,
            Name_Finance__c:this.nameFinance,
            Phone_Finance__c:this.phoneFinance,
            Email_Finance__c:this.emailFinance,
            Terms_And_Conditions__c: true
        };
        //console.log('creditRecord.Id',creditRecord.Id)
        creditData.push(creditRecord);
        createCreditRecord({creditData})
            .then(result => {
                this.creditStatusInRow = this.creditSelectedRowStatus;
                //console.log('creditSelectedRowStatus from credit',this.creditSelectedRowStatus)
                //console.log('creditStatusInRow from credit',this.creditStatusInRow)
                //console.log('contactLogInEmail', this.contactLogInEmail)
                //console.log('Records created successfully:', result);
                //console.log('resultId', result[0].Id)
                this.showContactDetails = true;
                this.showCreditDetails = false; 
                this.creditInformation = false
                this.creditRecordId = result[0].Id;
                //console.log('creditRecordId', this.creditRecordId)
                this.type = this.actionType;
                this.creitActionType = this.actionType;
                this.createdCreditId = this.newCreditId ? this.newCreditId : this.newCreditIdFromContact;
                this.showSpinner = false;
            })
            .catch(error => {
                console.error('Error creating records:', error);
                this.showSpinner = false;
            });
    }
    handleBack(){
        //console.log("1111111111111111", this.contactLogInEmail)
        this.type = this.actionType;
        this.newCreditIdFromCreditDetails = this.newCreditId ? this.newCreditId : this.newCreditIdFromContact;
        //console.log('22222222222222222', this.type)
        // this.showContactDetails = false;
        // this.showCreditDetails = true; 
        this.showCompanyPge = true
        this.showCreditDetails = false
        // this.backButton = true;
        // //console.log('getAccountInfo Id: ', this.recordId)
        
    }

    // reparentFileAttachment(contentDocumentId) {
    //     reparentFileAttachment({ contentDocumentId: contentDocumentId, newParentId: 'YOUR_CREDIT_RECORD_ID' })
    //         .then(result => {
    //             // Handle success
    //             //console.log('File attachment reparented successfully:', result);
    //         })
    //         .catch(error => {
    //             // Handle error
    //             console.error('Error reparenting file attachment:', error);
    //         });
    // }
   
    connectedCallback(){
        this.showSpinner = true;
        window.scrollTo(0, 0);
        //console.log('newCreditIdFromCompany',this.newCreditIdFromCompany)
        //console.log('fetchCreditRecordIdFromContact in credit details page from contact',this.fetchCreditRecordIdFromContact)
        if(this.fetchCreditRecordIdFromContact){
        this.creditSelectedRowId = this.fetchCreditRecordIdFromContact;
        }
        //console.log('newCreditId in credit details page', this.newCreditId)
        //console.log('newCreditId in credit details page 2 ', this.newCreditIdFromContact)
        //console.log('action type in credit form', this.actionType)
        setTimeout(() => {
            //console.log('credit status in credit page',this.creditSelectedRowStatus)
            this.creditRowId = this.creditSelectedRowId;
            //console.log('creditSelectedRowId in credit page', this.creditSelectedRowId)
            this.showSpinner = false;
        }, 1000);  
        if(this.actionTypeCredit){
            this.actionType = this.actionTypeCredit;
        }     
        if(this.actionType === 'view') {
            this.Next = true;
            this.saveContinue = false;
            this.checkStatus = true;
        } else {
            this.Next = false;
            this.saveContinue = true;
            this.checkStatus = false;
        }
        //console.log('creditSelectedRowId in credit page',this.creditSelectedRowId)
        //console.log('creditSelectedRowStatus in credit page',this.creditSelectedRowStatus)
        //console.log('this.logInEmail',this.logInEmail)
        setTimeout(() => {
        getContactId({logInEmail:this.logInEmail})
        .then(result => {
            //console.log('Contact Id from logIn Email.:', result);
            this.contactLogInEmail = this.logInEmail ? this.logInEmail : "";
            this.contactLogInId = result;
            this.contactIdFromLogIn = this.contactLogInId;
            //console.log('contactIdFromLogIn', this.contactIdFromLogIn)
            //console.log('contactLogInId',this.contactLogInId)
            this.showSpinner = false;
        })
        .catch(error => {
            console.error('Error fetching contact Id:', error);
            this.showSpinner = false;
        });
    }, 1000);
        this.creditId = this.creditId ? this.creditId : this.creditDetailsId
        //console.log('this.creditId123',this.creditId)
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
                //console.log('Radio Button 1 ', this.radio1);
                //console.log('Radio Button 2 ', this.radio2);
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
        else if(this.creditSelectedRowId){
            //console.log("this.creditSelectedRowId in else if",this.creditSelectedRowId)
            //console.log("this.creditSelectedRowStatus in else if",this.creditSelectedRowStatus)
            getCreditInfo({
                creditId:this.creditSelectedRowId
            })
            .then(result => {
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
                if(this.creditSelectedRowStatus == 'Submitted'&& this.actionType != "clone"){
                    this.checkStatus = true;
                }  
                else if(this.creditSelectedRowStatus == 'In Progress'&& this.actionType == "view"){
                    this.checkStatus = true;
                }
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