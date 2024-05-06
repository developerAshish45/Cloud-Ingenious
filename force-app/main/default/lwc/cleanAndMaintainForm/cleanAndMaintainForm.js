import { LightningElement, track, wire} from 'lwc';
import bgImage_page from '@salesforce/resourceUrl/bgImage_page';
import rsgLogo_page from '@salesforce/resourceUrl/rsgLogo_page';
import site_action_logo from '@salesforce/resourceUrl/NavIcon1';
import home_action_logo from '@salesforce/resourceUrl/NavIcon2';
import action_action_logo from '@salesforce/resourceUrl/NavIcon3';
import { ShowToastEvent} from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";
import uploadFile from "@salesforce/apex/CleaningAndMaintenanceController.uploadFile";
import getRecords from "@salesforce/apex/CleaningAndMaintenanceController.getRecords";
import updateCleanAndMaintRecord from "@salesforce/apex/CleaningAndMaintenanceController.updateCleanAndMaintRecord";
export default class CleanAndMaintainForm extends LightningElement {
    options = [
        {value: 'yes', label: 'Yes'},
        {value: 'no', label: 'No'}
    ];
    value = 'yes';
    vfPage = 'CleanDataTable';
    vfPage1 = 'InstallerCardList';
    bgImageUrl=bgImage_page;
    rsgLogoUrl = rsgLogo_page;
    siteActionUrl  = site_action_logo;
    homeActionUrl  =  home_action_logo;
    actionActionUrl = action_action_logo;
    defaultDate;
    recordId;
    accountId;
    cleanAndMaintName;
    projectName;
    customerName;
    PastDueDate;
    CleaningPerformed;
    CleaningPicturesUploaded;
    CleaningPicturesReceived;
    MaintenancePerformed;
    MaintenancePicturesUploaded
    MaintenancePicturesReceived;
    @track currentStep ="1";
    @track showIndicator= false;

    connectedCallback() {
        // Get the full URL
        var fullurl = window.location.href;
    
        // Parse the URL to get the query parameters
        var urlParams = new URLSearchParams(new URL(fullurl).search);
    
        // Get the proId parameter from the URL
        // var proId = urlParams.get('proId');
        // this.projectId = proId;

        var recordId = urlParams.get('recordId');
        this.recordId = recordId;

        var instaId = urlParams.get('instaId');
        this.accountId = instaId;

        // Now you have proId stored in variables
        console.log('recordId:', this.recordId);
        this.handleService();
        // Set today's date as the default value
        this.setDefaultDate();
    }

    get backgroundImage() {
        return `background-image: url(${this.bgImageUrl}); background-size: cover; padding: 20px; box-sizing: border-box; `;
    } 

    handleService(){
      getRecords({recId : this.recordId})
            .then(result => {
                console.log('result 21312312 ---'+ JSON.stringify(result));
                this.cleanAndMaintName = result.Cleaning_Maintainance_Name__r.Name;
                this.projectName = result.Project_Name__r.Name;
                this.customerName = result.Project_Name__r.Customer_Name__r.Name;
                //this.projectId = result.Id;
            })
            .catch(error => {
                this.error = error;
                console.log('Error in fetching customer name:'+ JSON.stringify(this.error));
                // Handle error
            });
    }

    //file Upload
    fileData
    openfileUpload(event) {
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.recordId
            }
            console.log(this.fileData)
        }
         reader.readAsDataURL(file)
    }
    
    handleClick(){
        const {base64, filename, recordId} = this.fileData
        uploadFile({ base64, filename, recordId }).then(result=>{
            this.fileData = null
            let title = `${filename} uploaded successfully!!`
            this.toast(title)
        })
    }

    toast(title){
        const toastEvent = new ShowToastEvent({
            title, 
            variant:"success"
        })
        this.dispatchEvent(toastEvent)
    }

    // For Cheveron 
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

    get isEnableNext(){
        return this.currentStep!="3";
    }

    get isEnablePrevious(){
        return this.currentStep!="1";
    }

    get isEnableFinish(){
        return this.currentStep==="3";
    }

    //set the default date
    setDefaultDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1; // Month is zero-indexed
        let day = today.getDate();

        // Ensure that the month and day have leading zeros if needed
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        // Format the date as "YYYY-MM-DD"
        this.defaultDate = `${year}-${month}-${day}`;
    }

    handleChange(event) {
      const fieldName = event.target.name;
      console.log(event.target.value);

      if (fieldName === 'pastDueDate') {
          console.log(event.target.value);
          this.defaultDate=event.target.value;

      } else if (fieldName === 'wgSign') {
          console.log(event.target.value);
          this.value=event.detail.value;

      } else if (fieldName === 'pastDuey/n') {
          console.log(event.target.value);
          this.value=event.detail.value;

      } else if(fieldName === 'cleaningPerformed'){
        console.log(event.target.value);
          this.defaultDate=event.target.value;

      } else if(fieldName === 'cleaningPicturesReceived'){
        console.log(event.target.value);
          this.defaultDate=event.target.value;
        
      } else if(fieldName === 'cleaningPicturesUploaded'){
        console.log(event.target.value);
          this.defaultDate=event.target.value;
        
      } else if(fieldName === 'maintenancePerformed'){
        console.log(event.target.value);
          this.defaultDate=event.target.value;
        
      } else if(fieldName === 'maintenancePicturesReceived'){
        console.log(event.target.value);
          this.defaultDate=event.target.value;
        
      } else if(fieldName === 'maintenancePicturesUploaded'){
        console.log(event.target.value);
          this.defaultDate=event.target.value;
        
      }
  }

    handleFinish(event){
        if(this.currentStep==="3"){
          updateCleanAndMaintRecord({recordId: this.recordId, pastDueDate: this.defaultDate,  wgSign: this.value,  pastDueyn: this.value, 
            cleaningPerformed: this.defaultDate, cleaningPicturesReceived: this.defaultDate, cleaningPicturesUploaded: this.defaultDate
            ,maintenancePerformed: this.defaultDate, maintenancePicturesReceived:this.defaultDate, maintenancePicturesUploaded:this.defaultDate})
            .then(result => {
                // Handle success
                //window.location.host + "/" + this.vfThankPage;
                console.log('Cleaning record updated:', JSON.stringify(result));
                
            })
            .catch(error => {
                // Handle error
                console.error('Error updating cleaning record:', error);
            });
            //this.currentStep ="4"
             this.showIndicator = true;
             const evt = new ShowToastEvent({
                 title:'Form Wizard',
                 message:'Your form has successfulyy submitted',
                 variant:'success'
             }); 
             this.dispatchEvent(evt);
        }
    }
    get setBaseUrlHome(){
      return (this.sfdcBaseURL = window.location.origin + '?instaId='+ this.accountId);
    }
    get setBaseUrlData(){
      return (this.sfdcBaseURL = window.location.origin + '/' + this.vfPage + '?instaId='+ this.accountId);
    }
    get setBaseUrlList(){
      return (this.sfdcBaseURL = window.location.origin + '/' + this.vfPage1 + '?instaId='+ this.accountId);
    }

//Upload Image Section

/*loaded = false;
@track fileList;
//   @api surveyRecordId;
//cleanRecordId = this.recordId;
cleanRecordId = 'a0tU8000002VluLIAS';
//recordId = this.surveyId;
//console.log('recordId'+ this.recordId);
@track files = [];
get acceptedFormats() {
  return [".pdf", ".png", ".jpg", ".jpeg"];
}*/

/*@wire(getVersionFiles, {cleanRecordId: "$cleanRecordId" })  
fileResponse(value) {
  console.log('cleanRecordId :- '+this.cleanRecordId);
  console.log('value'+this.value);
  this.wiredActivities = value;
  const { data, error } = value;
  this.fileList = "";
  this.files = [];
  console.log('datatatat --->'+ JSON.stringify(data));
  if (data) {
    console.log('Data is+++' + data);
    this.fileList = data;
    for (let i = 0; i < this.fileList.length; i++) {
      let file = {
        Id: this.fileList[i].Id,
        Title: this.fileList[i].Title,
        Extension: this.fileList[i].FileExtension,
        ContentDocumentId: this.fileList[i].ContentDocumentId,
        ContentDocument: this.fileList[i].ContentDocument,
        CreatedDate: this.fileList[i].CreatedDate,
        thumbnailFileCard:
          "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
          this.fileList[i].Id +
          "&operationContext=CHATTER&contentId=" +
          this.fileList[i].ContentDocumentId,
        downloadUrl:
          "/sfc/servlet.shepherd/document/download/" +
          this.fileList[i].ContentDocumentId
      };
      this.files.push(file);
    }
    this.loaded = true;
  } else if (error) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Error loading Files",
        message: error.body.message,
        variant: "error"
      })
    );
  }
  else{
    alert('not reachable 112299');
  }
}
handleUploadFinished(event) {
  alert('112222');
  const uploadedFiles = event.detail.files;
  console.log('uploadedFiles'+uploadedFiles);
  refreshApex(this.wiredActivities);
  this.dispatchEvent(
    new ShowToastEvent({
      title: "Success!",
      message: uploadedFiles.length + " Files Uploaded Successfully.",
      variant: "success"
    })
  );
}*/

}