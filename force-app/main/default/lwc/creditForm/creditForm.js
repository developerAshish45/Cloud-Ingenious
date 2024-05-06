import { LightningElement, track,api,wire } from 'lwc';
import RGS_logo from "@salesforce/resourceUrl/RGS_logo";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import sendOTP from '@salesforce/apex/LogInPageController.sendOTP';
//import validateOTP from '@salesforce/apex/LogInPageController.validateOTP'; 
import getCreditRecords from '@salesforce/apex/CreditFormController.getCreditRecords';
import getCreditStatus from '@salesforce/apex/CreditFormController.getCreditStatus';
import changeCreditStatus from '@salesforce/apex/CreditFormController.changeCreditStatus';
import ThreeLinerMenu from '@salesforce/resourceUrl/ThreeLinerMenu';
import RSG_Logo_Page from '@salesforce/resourceUrl/RSG_Logo_Page'; 
import Norlake_Logo from '@salesforce/resourceUrl/Norlake_Logo'; 
import Master_Built_Logo from '@salesforce/resourceUrl/Master_Built_Logo';
import NorlakeScientificLogo from '@salesforce/resourceUrl/NorlakeScientificLogo'; 
import createCreditRecord from '@salesforce/apex/CreditFormController.createCreditRecord';
import getCreditInfo from '@salesforce/apex/CreditFormController.getCreditInfo';
import Terms_And_Condition_Part_2 from '@salesforce/label/c.Terms_And_Condition_Part_2';
import Terms_And_Condition_Part_1 from '@salesforce/label/c.Terms_And_Condition_Part_1';
import contactEmailForQueries from '@salesforce/label/c.contactEmailForQueries';

export default class CreditForm extends LightningElement {
    @track showSpinner = false;
    Terms_And_Condition_Part_1 = Terms_And_Condition_Part_1;
    Terms_And_Condition_Part_2 = Terms_And_Condition_Part_2;
    contactEmailForQueries = contactEmailForQueries;
    @track fetchCredidtRecordFromId = "";
    @track newCreditId;
    @api successMessage;
    @api contactLogInEmail;
    ThreeLinerMenu = ThreeLinerMenu;
    norlakeScientficLogo = NorlakeScientificLogo;
    rsgLogoPage = RSG_Logo_Page;
    rsgLogo = RSG_Logo_Page;
    norlakeLogo = Norlake_Logo;
    masterBuiltLogo = Master_Built_Logo;
    // @track showModal = false;
    @track creditSelectedRowStatus;
    @track showLoginPage = true;
    @track companyInformation = false;
    @track termsAndConditions = false;
    @track showCreditDetails = false;
    @track checkStatus = false;
    @track showExistingRecords = false;
    // @track contactPage = false;
    @track recordId;
    @track loginEmail;
    @track contactEmail;
    @track otp;
    @track type;
    @track headingSection = true;

    handleEmailChange(event) {
        this.loginEmail = event.target.value;
        this.contactEmail = this.loginEmail;
    }

    handleOTPChange(event) {
        this.otp = event.target.value;
    }

    systemOtp;
    handleSendOTP() {
        if (!this.isValidEmail(this.loginEmail)) {
            this.showToast('Error', 'Please provide a valid email address', 'error');
            return;
        }
        //console.log('logInEmail',this.loginEmail)
        this.showSpinner = true;
        sendOTP({ email: this.loginEmail })
            .then(result => {
                //console.log('result', result)
                this.systemOtp = result;
                this.showSpinner = false;
                this.showToast('Success', 'Verification code sent successfully', 'success');
            })
            .catch(error => {
                // Handle error
                this.showToast('Error', 'Failed to send verification code: ' + error.body.message, 'error');
                this.showSpinner = false;
            });
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleLogin() {
        //console.log('logInEmail',this.loginEmail)
        //console.log('contactEmail From Login page',this.contactEmail)
        //console.log('otp',this.otp)
        this.showSpinner = true;
        if (!this.loginEmail || !this.otp) {
            this.showToast('Error', 'Please enter username and OTP', 'error');
            this.showSpinner = false;
            return;
        }
        if(this.systemOtp == this.otp){
            this.showLoginPage = false;
            this.checkStatus = true;
            this.showSpinner = false;
            // validateOTP({ email: this.loginEmail })
            // .then(result => {
            //     // Handle success
            //     if (result) {
            //         this.showSpinner = false;
                   
            //     } else {
            //         this.showToast('Error', 'Please enter a valid OTP', 'error');
            //         this.showSpinner = false;
            //     }
            // })
            // .catch(error => {
            //     // Handle error
            //     this.showSpinner = false;
               
            // });
        }
        else{
            this.showToast('Error', 'Incorrect OTP. Please try again.', 'error');
            this.showSpinner = false;
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
    handleNewClick() {
        //console.log('New button clicked', this.contactEmail);
        this.showSpinner = true;
        getCreditRecords({ contactEmail: this.contactEmail })
            .then(result => {
                //console.log('result in New button clicked', result);
    
                // Check if there is an "In Progress" record
                const inProgressRecord = result.find(record => record.Status__c === 'In Progress');
    
                if (inProgressRecord) {
                    this.showToast('Warning', 'Please complete or close the existing "In Progress" record before creating a new one.', 'warning');
                } else {
                    this.showLoginPage = false;
                    this.checkStatus = false;
                    this.companyInformation = false;
                    this.termsAndConditions = true;
                    this.creditSelectedRowStatus = ""
                    this.creditSelectedRowId = ""
                    // this.fetchCredidtRecordFromId = ""
                    // this.newCreditId = ""
                    // this.creditId = ""
                    this.type = ""
                    this.Next = false;
                    this.saveContinue = true;
                    this.agree = false;
                    this.conditions = ""
                }
                this.showSpinner = false;
            })
            .catch(error => {
                console.error('Error fetching credit records:', error);
                this.showSpinner = false;
            });
    }
    
      
    handleHomeClick(){
        this.showLoginPage = false;
        this.checkStatus = true;
        this.companyInformation = false;
        this.showExistingRecords = false;
        this.termsAndConditions = false;
        // this.showSpinner = true;
    }
  // For Existing button Starts here

  @track sortBy;
  @track sortDirection;
  creditRecords;

  handleExistingClick(){
    this.showSpinner = true;
    this.showLoginPage = false;
    this.checkStatus = false;
    this.companyInformation = false;
    this.showExistingRecords = true;
    this.termsAndConditions = false;
    //console.log('Existing button clicked')
    //console.log('Existing button clicked',this.contactEmail)
    getCreditRecords({contactEmail: this.contactEmail })
        .then(result => {
            //console.log('result',result);
            this.creditRecords = result.map(record => {
                // Generate actions based on status
                let actions;
                if (record.Status__c === 'In Progress') {
                    actions = [
                        { label: 'Edit', name: 'edit' }
                    ];
                } else{
                    actions = [
                        { label: 'View', name: 'view' },
                        { label: 'Clone', name: 'clone' }
                    ];
                }
                const accountName = record.Account_Id__r ? record.Account_Id__r.Name : '';
                //console.log('AccountName:', accountName);
                const contactName = record.Contact_Id__r ? record.Contact_Id__r.Name : '';
                //console.log('ContactName:', contactName);
                return { ...record, 
                    AccountName: accountName,
                    ContactName: contactName,
                    actions: actions };
            });
            this.showSpinner = false;
        })
        .catch(error => {
            console.error('Error fetching credit records:', error);
            this.showSpinner = false;
        });
}

columns = [
    { label: 'Credit Number', fieldName: 'Name', type: 'text', sortable: true },
    { label: 'Company Name', fieldName: 'AccountName', type: 'text', sortable: true },
    { label: 'Contact Name', fieldName: 'ContactName', type: 'text', sortable: true },
    { label: 'Credit Limit Requested', fieldName: 'Credit_Limit_Requested__c', type: 'currency', sortable: true },
    { label: 'Business Type', fieldName: 'Business_Type__c', type: 'text', sortable: true },
    { label: 'Status', fieldName: 'Status__c', type: 'text', sortable: true, sortField: 'Status__c' },
    { type: 'action', typeAttributes: { rowActions: { fieldName: 'actions' } } }
];

    @track creditSelectedRowId;
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        this.creditSelectedRowId = row.Id;
        getCreditStatus({creditId:this.creditSelectedRowId})
        .then(result => {
            this.creditSelectedRowStatus = result;
            //console.log('this.creditSelectedRowStatus',this.creditSelectedRowStatus)
            //console.log('Result Status', result)
        })
        .catch(error => {
            console.error('Error fetching credit status:', error);
        });
        //console.log('Selected Credit Record ID:', this.creditSelectedRowId);
        switch (actionName) {
            case 'view':
                this.handleView(row);
                break;
            case 'edit':
                this.handleEdit(row);
                break;
            case 'clone':
                this.handleClone(row);
                break;
            default:
                break;
        }
    }

    handleView(row) {
        //console.log('creditSelectedRowId from view',this.creditSelectedRowId)
        this.showSpinner = true;
        this.showLoginPage = false;
        this.checkStatus = false;
        this.showExistingRecords = false;
        this.companyInformation = false;
        this.termsAndConditions = true;
        this.type = "view";
        this.Next = true;
        this.saveContinue = false;
        this.agree = true;
        this.fetchCredidtRecordFromId = this.creditSelectedRowId;
        setTimeout(() => {
            if(this.fetchCredidtRecordFromId){
                //console.log('this.fetchCredidtRecordFromId in connected call back after condition',this.fetchCredidtRecordFromId)
                //console.log("this.fetchCredidtRecordFromId",this.fetchCredidtRecordFromId)
                getCreditInfo({
                    creditId:this.fetchCredidtRecordFromId
                })
                .then(result => {         
                    //console.log('Result creditInfo:', result);
                    //console.log('Terms_And_Conditions__c in result',result.Terms_And_Conditions__c)
                    this.conditions = result.Terms_And_Conditions__c;
                    this.showSpinner = false;
                })
                .catch(error => {
                    console.error('Error fetching company information:', error);
                    this.showSpinner = false;
                });
            }
        }, 500);
        
    }

    handleEdit(row) {
        this.showSpinner = true;
        this.showLoginPage = false;
        this.checkStatus = false;
        this.showExistingRecords = false;
        this.companyInformation = false;
        this.termsAndConditions = true;
        this.type = "edit";
        this.Next = false;
        this.saveContinue = true;
        this.agree = false;
        this.fetchCredidtRecordFromId = this.creditSelectedRowId;
        setTimeout(() => {
            if(this.fetchCredidtRecordFromId){
                //console.log('this.fetchCredidtRecordFromId in connected call back after condition',this.fetchCredidtRecordFromId)
                    //console.log("this.newCreditId",this.newCreditId)
                    getCreditInfo({
                        creditId:this.fetchCredidtRecordFromId
                    })
                    .then(result => {
                        //console.log('this.creditSelectedRowStatus in connected callback',this.creditSelectedRowStatus)             
                        //console.log('Result getAccountInfo:', result);
                        this.conditions = result.Terms_And_Conditions__c;
                        this.showSpinner = false;
                    })
                    .catch(error => {
                        console.error('Error fetching company information:', error);
                        this.showToast('Error', 'Error fetching company information: ' + error.body.message, 'error');
                        this.showSpinner = false;
                    });
                }
        }, 500);
        

    }

    handleClone(row) {
        //console.log('New button clicked', this.contactEmail);
        //console.log('Before changing status', this.creditSelectedRowStatus)
        //console.log('Before changing status', this.creditSelectedRowId) 
        this.showSpinner = true;
        getCreditRecords({ contactEmail: this.contactEmail })
            .then(result => {
                //console.log('result in New button clicked', result);
                const inProgressRecord = result.find(record => record.Status__c === 'In Progress');
    
                if (inProgressRecord) {
                    this.showToast('Warning', 'Please complete or close the existing "In Progress" record before creating a new one.', 'warning');
                    this.showSpinner = false;
                } else {
                    this.showLoginPage = false;
                    this.checkStatus = false;
                    this.showExistingRecords = false;
                    this.companyInformation = false;
                    this.termsAndConditions = true;
                    this.type = "clone";
                    this.Next = false;
                    this.saveContinue = true;
                    this.agree = false;
                    this.fetchCredidtRecordFromId = this.creditSelectedRowId;
                    setTimeout(() => {
                        if(this.fetchCredidtRecordFromId){
                            //console.log('this.fetchCredidtRecordFromId in connected call back after condition',this.fetchCredidtRecordFromId)
                                //console.log("this.newCreditId",this.newCreditId)
                                getCreditInfo({
                                    creditId:this.fetchCredidtRecordFromId
                                })
                                .then(result => {
                                    //console.log('this.creditSelectedRowStatus in connected callback',this.creditSelectedRowStatus)             
                                    //console.log('Result getAccountInfo:', result);
                                    this.conditions = result.Terms_And_Conditions__c;
                                    this.showSpinner = false;
                                })
                                .catch(error => {
                                    console.error('Error fetching company information:', error);
                                    this.showToast('Error', 'Error fetching company information: ' + error.body.message, 'error');
                                    this.showSpinner = false;
                                });
                            }
                    }, 500);
                    
                }
            })
            .catch(error => {
                console.error('Error fetching credit records:', error);
                this.showSpinner = false;
            });
        // getCreditStatus({creditId:this.creditSelectedRowId})
        // .then(result => {
        //     //console.log('Result in clone Status', result)
        //     if(result === 'In Progress'){ 
        //         this.showExistingRecords = true;         
        //         this.showModal = true;            
        //     }
        //     else{
        //         this.companyInformation = true; 
        //     }
        // })
        // .catch(error => {
        //     console.error('Error fetching credit status:', error);
        // });
    }
    // handleOk() {
    //     this.showModal = false;
    //     this.showLoginPage = false;
    //     this.checkStatus = false;
    //     this.showExistingRecords = false;
    //     this.companyInformation = true;
    //     changeCreditStatus({rowCreditId: this.creditSelectedRowId})
    //         .then(result => {
    //             //console.log('Result Status after clone', result);
    //         })
    //         .catch(error => {
    //             console.error('Error changing credit status:', error);
    //         });  
    // }
    // handleCancel() {
    //     this.showModal = false;
    //     this.showLoginPage = false;
    //     this.checkStatus = false;
    //     this.showExistingRecords = false;
    //     this.companyInformation = false;
    //     this.showExistingRecords = true;
    // }


    // connectedCallback(){
    //     //console.log('Connected Call back called')
    //     //console.log('success message is', this.successMessage)
    //     //console.log('Contact email from connected callback', this.contactEmail)
    //     //console.log('loginEmail email from connected callback', this.loginEmail)
    //     //console.log('contactLogInEmail in connected call back', this.contactLogInEmail)
    //     if(this.successMessage){
    //         this.showExistingRecords = true;
    //         this.showLoginPage = false;
    //         this.checkStatus = false;
    //         this.headingSection = false;
    //     //console.log('Contact email before going to data table', this.contactEmail) 
    //         getCreditRecords({ contactEmail: this.contactLogInEmail })
    //         .then(result => {
    //         //console.log('result',result);
    //         this.creditRecords = result.map(record => {
    //             // Generate actions based on status
    //             let actions;
    //             if (record.Status__c === 'In Progress') {
    //                 actions = [
    //                     { label: 'Edit', name: 'edit' }
    //                 ];
    //             } else{
    //                 actions = [
    //                     { label: 'View', name: 'view' },
    //                     { label: 'Clone', name: 'clone' }
    //                 ];
    //             }
    //             return { ...record, actions: actions };
    //         });
    //     })
    //     .catch(error => {
    //         console.error('Error fetching credit records:', error);
    //     });
    //     }
    // }


    @track conditions = false;
    @track MasterBilt = true;
    @track Norlake = true;
    // @track checkStatus = false;
    @api contactLogInId;

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
        // this.showSpinner = true;
        this.companyInformation = true;
        this.termsAndConditions = false;

        this.showLoginPage = false;
        this.checkStatus = false;
        this.showExistingRecords = false;

        // const groupBrand = [];
        // if (this.MasterBilt) {
        //     groupBrand.push('Master-Bilt');
        // }
        // if (this.Norlake) {
        //     groupBrand.push('Norlake');
        // }
        // //console.log('type after clicking on next',this.type)
        // //console.log('type after clicking on next',this.creditSelectedRowId)
        // if(this.type == 'clone'){
        //     this.newCreditId = null; 
        // }
        // else if (this.creditSelectedRowId && !(this.type == 'clone')) {
        //     this.newCreditId = this.creditSelectedRowId;
        // }
        // //console.log('credit record newCreditId before going for upsert new',this.newCreditId)

        // const creditRecord = {
        //     sobjectType: 'Credit__c',
        //     Id:this.newCreditId,
        //     Contact_Id__c: this.contactLogInId,
        //     Group_brand_s__c: groupBrand.join(';'),
        //     Terms_And_Conditions__c:true
        // };

        // createCreditRecord({ creditData: [creditRecord] })
        //     .then(result => {
        //         ////console.log('Records created successfully:', result);
        //         this.showToast('Success', 'Record created successfully', 'success');
        //         //console.log('this.companyInformation',this.companyInformation)
        //         //console.log('this.termsAndConditions',this.termsAndConditions)
        //         //console.log('result[0].Id',result[0].Id)
        //         this.newCreditId = result[0].Id;
        //         //console.log('newCreditId from creditForm',this.newCreditId)
        //         this.companyInformation = true;
        //         this.termsAndConditions = false;
        //         this.fetchCredidtRecordFromId = this.newCreditId;

        //     })
        //     .catch(error => {
        //         console.error('Error creating records:', error);
        //         this.showToast('Error', 'Error creating company information: ' + error.body.message, 'error');
        //     });
    }
    handleNextClick(){
        // this.showSpinner = true;
        this.companyInformation = true;
        this.termsAndConditions = false;
        // const groupBrand = [];
        // if (this.MasterBilt) {
        //     groupBrand.push('Master-Bilt');
        // }
        // if (this.Norlake) {
        //     groupBrand.push('Norlake');
        // }
        // //console.log('type after clicking on next',this.type)
        // //console.log('newCreditId after clicking on next',this.creditSelectedRowId)
        // //console.log('this.creditSelectedRowId after clicking on next', this.creditSelectedRowId)

        // if(this.creditSelectedRowId && !(this.type =='clone')){
        //     this.newCreditId = this.creditSelectedRowId;
        //     //console.log('this.creditSelectedRowId in if block',this.creditSelectedRowId)
        //     //console.log('this.type in if block',this.type)
        //     //console.log('this.newCreditId in if block',this.newCreditId)
        // }
        // else if(this.type == 'clone'){
        //     //console.log('this.type in else if block',this.type)
        //     this.newCreditId = null; 
        //     //console.log('this.newCreditId in else if block',this.newCreditId)
        // }
        // //console.log('credit record newCreditId before going for upsert',this.newCreditId)
        // const creditRecord = {
        //     sobjectType: 'Credit__c',
        //     Id:this.newCreditId,
        //     Contact_Id__c: this.contactLogInId,
        //     Group_brand_s__c: groupBrand.join(';'),
        //     Terms_And_Conditions__c: this.conditions
        // };

        // createCreditRecord({ creditData: [creditRecord] })
        //     .then(result => {
        //         //console.log('this.companyInformation',this.companyInformation)
        //         //console.log('this.termsAndConditions',this.termsAndConditions)
        //         //console.log('result[0].Id',result[0].Id)
        //         this.newCreditId = result[0].Id;
        //         //console.log('newCreditId from creditForm',this.newCreditId)
        //         this.companyInformation = true;
        //         this.termsAndConditions = false;

        //     })
        //     .catch(error => {
        //         console.error('Error creating records:', error);
        //     });
    }

    connectedCallback(){
        // this.showSpinner = true;
        setTimeout(() => {
            if(this.fetchCredidtRecordFromId){
                //console.log('this.fetchCredidtRecordFromId in connected call back after condition',this.fetchCredidtRecordFromId)
                    //console.log("this.newCreditId",this.newCreditId)
                    getCreditInfo({
                        creditId:this.fetchCredidtRecordFromId
                    })
                    .then(result => {
                        //console.log('this.creditSelectedRowStatus in connected callback',this.creditSelectedRowStatus)             
                        //console.log('Result getAccountInfo:', result);
                        this.conditions = result.Terms_And_Conditions__c;
                        // this.showSpinner = false;
                    })
                    .catch(error => {
                        console.error('Error fetching company information:', error);
                        this.showToast('Error', 'Error fetching company information: ' + error.body.message, 'error');
                        // this.showSpinner = false;
                    });
                }
        }, 500);
        
        
    }


}