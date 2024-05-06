import { LightningElement, track} from 'lwc';
import getInstallationRecord from '@salesforce/apex/IntallerWelcome.getInstallationRecord';
import bgImage_page from '@salesforce/resourceUrl/bgImage_page';
import rsgLogo_page from '@salesforce/resourceUrl/rsgLogo_page';
import site_action_logo from '@salesforce/resourceUrl/NavIcon1';
import home_action_logo from '@salesforce/resourceUrl/NavIcon2';
import action_action_logo from '@salesforce/resourceUrl/NavIcon3';

export default class installerFormWithWizzard extends LightningElement {
    options = [
        {value: 'Open', label: 'Open'},
        {value: 'In Progress', label: 'In Progress'},
        {value: 'Submitted', label: 'Submitted'}
    ];
    showCfaChecklist = false;
    showGenralChecklist = true;
    installations = [];
    notes;
    dummyField;
    error;
    value;
    sfdcBaseURL;
    siteBaseURL;
    projectName;
    siteNum;
    siteStreet;
    siteCountry;
    siteCity;
    sitePostal;
    siteState;
    installerName;
    customerName;
    storeNum;
     InstallationDate;
     InstallSONum='';
     InstallationStatus;
     InstallerName;
     InstallerId;
     defaultDate;
     InstallationDate;
     InstallSONum1;
     recordId;
     accountId;
    @track currentStep ="1";
    @track showIndicator= false; 
    //CFA Checklist
    @track section7Open = true;
    @track showMedTemp = true;

    bgImageUrl=bgImage_page;
    rsgLogoUrl = rsgLogo_page;
          siteActionUrl      = site_action_logo;
          homeActionUrl    =  home_action_logo;
          actionActionUrl = action_action_logo;

    get backgroundImage() {
        return `background-image: url(${this.bgImageUrl}); background-size: cover; padding: 20px; box-sizing: border-box; `;
    }
    connectedCallback() {
        var fullurl = window.location.href;
        
        var urlParams = new URLSearchParams(new URL(fullurl).search);
    
        var recordId = urlParams.get('recordId');
        this.recordId = recordId;

        var instaId = urlParams.get('instaId');
        this.accountId = instaId;

        console.log('proId:', this.recordId);
        this.handleService();
        this.setDefaultDate();
    }

    //pre-populate the values from project Object
    handleService(event){
        getInstallationRecord({recId : this.recordId})
            .then(result => {
                this.installerName = result.Installer_Name__r.Name;
                this.projectName = result.Project_Name__r.Name;
                this.InstallSONum = result.Project_Name__r.Install_SO__c;
                this.storeNum = result.Store_No__c;
                this.siteNum = result.Site_Number__c;
                this.siteStreet = result.Site_Address__Street__s;
                this.siteCountry = result.Site_Address__CountryCode__s;
                this.siteCity = result.Site_Address__City__s;
                this.sitePostal = result.Site_Address__PostalCode__s;
                this.siteState = result.Site_Address__StateCode__s;
                this.customerName = result.Project_Name__r.Customer_Name__r.Name;
                this.InstallerId = result.Installer_Name__c;
                this.value = result.Installation_Status__c;
                if(result.Project_Name__r.Customer_Name__r.Name == 'Chick-fil-A'){
                        this.showCfaChecklist = true;
                     }
                this.projectId = result.Id;
                this.value = result.Installation_Status__c;
                this.InstallationDate = result.Project_Name__r.Installation_Date__c;
            })
            .catch(error => {
                this.error = error;
                console.log('Error in fetching customer name 111:'+ JSON.stringify(this.error));
            });
      }

      //set the default date
      setDefaultDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1; // Month is zero-indexed
        let day = today.getDate();
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        this.defaultDate = `${year}-${month}-${day}`;
    }
    
    handleStepClick(event){
        this.currentStep = event.target.value;
    }

    get isStepOne(){
        return this.currentStep==="1";
    }

    get isStepTwo(){
        return this.currentStep==="2";
    }

    get isStepThree(){
        return this.currentStep==="3";
    }

    get isStepFour(){
        return this.currentStep==="4";
    }
    get isEnableNext(){
        return this.currentStep!="3";
    }
    get isEnablePrevious(){
        return this.currentStep!="1";
    }

    get isEnableFinish(){
        return this.currentStep==="2";
    }

    handleNext(event){
        if(this.currentStep==="1"){
            this.currentStep = "2";
        }else if(this.currentStep==="2"){
            this.currentStep = "3";
        }
    }

    handlePrevious(event){
        if(this.currentStep==="2"){
            this.currentStep = "1";
        }else if(this.currentStep==="3"){
            this.currentStep = "2";
        }
    }

    handleChange(event) {
        const fieldName = event.target.name;
        console.log(event.target.value);
        if (fieldName === 'InstallationDate') {
            console.log(event.target.value);
            this.defaultDate=event.target.value;
  
        } if (fieldName === 'installationSo') {
            console.log(event.target.value);
            this.InstallSONum1=event.target.value;
  
        } if(fieldName === 'input1'){
            console.log(event.target.value);
            this.notes=event.target.value;
        }else if(fieldName ==='installationSo11'){
            console.log(event.target.value);
            this.dummyField = event.target.value;
            if(this.dummyField!=''){
                this.disableSubmit = false;
            }else{
                this.disableSubmit = true;
            }
        }
        this.value = 'In Progress';
    }
    get setBaseUrl1() {
        return (this.sfdcBaseURL = window.location.origin + "/" + this.vfPage + '?instaId='+ this.accountId);
    }
    get section7Class(){
        return this.section7Open ? 'panel' : 'panel hidden';
    }
    toggleSection(event) {
        const section = event.target.textContent.trim();
        switch (section) {
            case 'Details':
                this.section7Open = !this.section7Open;
                this.showMedTemp  = !this.showMedTemp
                break;   
            default:
                break;
        }
    }
    get medTempIcon() {
        return this.showMedTemp ? 'utility:dash' : 'utility:add';
    }
    get setBaseUrl1() {
        return (this.sfdcBaseHome = window.location.origin + "/RSGInstaller/s/" +'?instaId='+ this.accountId);
    }
    get setBaseUrl2() {
        return (this.sfdcBaseDataTable = window.location.origin + "/RSGInstaller/s/installerList" +'?instaId='+ this.accountId);
    }
    get setBaseUrl() {
        return (this.sfdcBaseURL = window.location.origin + "/RSGInstaller/s/installerMenu" +'?instaId='+ this.accountId +'&recordId=' + this.currentSite);
    }

}