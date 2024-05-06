import { LightningElement, track,wire } from 'lwc';
import getContactService from '@salesforce/apex/SurveyorPortalController.getContactService';
import createSurvey from '@salesforce/apex/SurveyorPortalController.createSurvey';
import createSiteSurveyRecord from '@salesforce/apex/SurveyorPortalController.createSiteSurveyRecord';
import RGS_logo from "@salesforce/resourceUrl/RGS_logo";
import { ShowToastEvent} from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";
import getVersionFiles from "@salesforce/apex/SurveyorPortalController.getVersionFiles";
import renameFile from "@salesforce/apex/SurveyorPortalController.renameFile";
import uploadFile from '@salesforce/apex/SurveyorPortalController.uploadFile'
export default class SurveyorPortal extends LightningElement {
    rsgLogo = RGS_logo;
   // SurveyLogo = SurveyLogo;
    isSuryveyor = false;
    isInstallPlanned = false;
    isInstallReactive = false;
    isSurveyorForm = false; 
    isServiceType = false;
    isSurveyTabActive = true;
    urlId = null;
    urlLanguage = null;
    urlType = null;
   @track projectId ;
   @track surveyId;
    fileData;
    attachmentData ;
    manufactValue = '';
    locationValue = '';
    firstName;
    lastName;
    email;
    phone;
    manufactureMedValue
    manufactureLowTempValue;
    manufactureBeerValue;
    manufactureBeerValue;
    manufactureNotesValue;
    locationMedValue;
    locationLowValue;
    locationBeerValue;
    locationNotesValue;
    serviceTypes = []; 

    get manufactureOptions() {
        return [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
        ];
    } 

    get locationOptions() {
        return [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
        ];
    }

    // imageUrl = SurveyLogo ;

    // get getBackgroundImage(){
    //     return `background-image:url("${this.imageUrl}")`;
    // }
    
    connectedCallback() {
        this.handleGetContactService();
    
        // Get the full URL
        var fullurl = window.location.href;
    
        // Parse the URL to get the query parameters
        var urlParams = new URLSearchParams(new URL(fullurl).search);
    
        // Get the oppId parameter from the URL
         var projId = urlParams.get('projectId');
        this.projectId = projId;
        // Get the surveyId parameter from the URL
         var surveId = urlParams.get('surveyId');
         this.surveyId = surveId;
        // Now you have oppId and surveyId stored in variables
        console.log('projectId:', this.projectId);
        console.log('surveyId:', this.surveyId);
    
        // You can further use these variables as needed
    }
    

    // @wire(CurrentPageReference)
    // getStateParameters(currentPageReference) {
    //    if (currentPageReference) {
    //       this.urlId = currentPageReference.state?.id;
    //       this.urlLanguage = currentPageReference.state?.lang;
    //       this.urlType = currentPageReference.state?.type;
    //       console.log('urlId=>'+this.urlId);
    //    }
    // }

    handleGetContactService(){
        getContactService({ recordId: this.projectId})
        .then(result => {
            // Update the serviceTypes array with the result returned from the Apex method
            this.serviceTypes = result;
            // Set isServiceType to true to render the buttons
            this.isServiceType = true;
        })
        .catch(error => {
            console.error('Error fetching contact service:', error);
            // Handle error
        });
    }

    handleRadioButton(event){
        if(event.target.name == 'manufactRadioGroup'){
            this.manufactValue = event.target.value;
            console.log('manufactValue ', this.manufactValue);
        }
        if(event.target.name == 'locationRadioGroup'){
            this.locationValue = event.target.value;
            console.log('locationValue ', this.locationValue);
        }

    }
   
    handleInputText(event){
        if(event.target.name == 'firstName'){
          this.firstName = event.target.value;
        }
        if(event.target.name == 'lastName'){
           this.lastName = event.target.value; 
        }
        if(event.target.name == 'email'){
            this.email = event.target.value;
        }
        if(event.target.name == 'phone'){
            this.phone = event.target.value;
        }
        if(event.target.name == 'manufactureMedValue'){
            this.manufactureMedValue = event.target.value;
        }
        if(event.target.name == 'manufactureBeerValue'){
            this.manufactureBeerValue = event.target.value;
        }
        if(event.target.name == 'manufactureNotesValue'){
            this.manufactureNotesValue = event.target.value;
        }
        if(event.target.name == 'locationMedValue'){
            this.locationMedValue = event.target.value;
        }
        if(event.target.name == 'locationLowValue'){
            this.locationLowValue = event.target.value;
        }
        if(event.target.name == 'locationBeerValue'){
            this.locationBeerValue = event.target.value;
        }
        if(event.target.name == 'locationNotesValue'){
            this.locationNotesValue = event.target.value;
        }
    }

    handleSubmit(){
        createSurvey({firstName :this.firstName, lastName :this.lastName, email :this.email, phone :this.phone, manufactureMedValue :this.manufactureMedValue, manufactureLowTempValue :this.manufactureLowTempValue, manufactureBeerValue :this.manufactureBeerValue, manufactureNotesValue :this.manufactureNotesValue, locationMedValue :this.locationMedValue, locationLowValue :this.locationLowValue, locationBeerValue :this.locationBeerValue, locationNotesValue :this.locationNotesValue,  manufactValue :this.manufactValue, locationValue :this.locationValue, projectId :this.projectId, surveyId :this.surveyId}).then(result => {
           console.log('result ', result);
           if(result == 'Success'){
            alert('Record Successfully Created');
           }
        })
        .catch(error => {
           alert(error);
        });
    }
  
    
    

    // My code starts here

    //Upload Image Section

    loaded = false;
    @track fileList;
    //@api surveyRecordId;
    // surveyRecordId = 'a0g3I000000GHvTQAW';
    surveyRecordId = 'a0g3I000000GHvYQAW';
    //recordId = this.surveyId;
    //console.log('recordId' this.recordId);
    @track files = [];
    get acceptedFormats() {
        return [".pdf", ".png", ".jpg", ".jpeg"];
    }

  

    @track fileNumber = 1;

    // Define a set to store used filenames
    @track usedFileNames = new Set();
    @track fileName;
    handleChange(event){
        this.fileName = event.target.value;
        console.log('fileName'+ this.fileName);
        this.fileNumber = 1;
    }

handleUploadFinished(event) {
    console.log('handleUploadFinished')
    const uploadedFiles = event.detail.files;
    console.log('Uploaded files:', uploadedFiles);
    uploadedFiles.forEach(uploadedFile => {
        let newFileName = this.generateUniqueFileName(uploadedFile.name);
        
        // Call Apex method to rename the file
        renameFile({ fileId: uploadedFile.contentVersionId, newFileName: newFileName })
        .then(() => {
            console.log('File renamed successfully:', uploadedFile.name, 'to', newFileName);
        })
        .catch(error => {
            console.error('Error renaming file:', error);
        });
    });

    refreshApex(this.wiredActivities);

    this.dispatchEvent(
        new ShowToastEvent({
            title: "Success!",
            message: uploadedFiles.length + " Files Uploaded Successfully.",
            variant: "success"
        })
    );
    this.fileName = '';
}

generateUniqueFileName() {   //originalFileName
    //const extension = originalFileName.substring(originalFileName.lastIndexOf('.'));
    console.log('Unique fileName'+ this.fileName)
    let newFileName = this.fileName + this.fileNumber ;
    while (this.usedFileNames.has(newFileName)) {
        this.fileNumber++;
        newFileName = this.fileName + this.fileNumber;
        console.log('newFileName'+newFileName);
    }
    this.usedFileNames.add(newFileName);
    this.fileNumber++;

    return newFileName;
}

    //Survey Form Section
    @track tableData = [
        { id: '1', surveyItem: 'LOCATION OF CRANE FOR ROOF EQ. INSTALL', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '2', surveyItem: 'Is there an airport nearby that would require an FAA study? (can take 3-6 months)', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '3', surveyItem: 'LOCATION OF ROOF HATCH, ACCEPTANCE OF ACCESS', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '4', surveyItem: 'STORE ENERGY MANAGEMENT SYSTEM (EMS) (GRIDPOINT, FSG, OTHER) - Take photos of EMS system inside the cooler/freezer', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '5', surveyItem: 'MANUFACTURER', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '',type:'text' },
        { id: '6', surveyItem: 'DATE OF MFG.', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '',type:'Date' },
        { id: '7', surveyItem: 'CONDENSING UNIT #M1/L1 - MODEL #', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '8', surveyItem: 'CONDENSING UNIT #M1/L1 - SERIAL #', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '9', surveyItem: 'CONDENSING UNIT #M1/L1 - WAG ASSET TAG # (IF APPLICABLE)', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '10', surveyItem: 'CONDENSING UNIT #M2/L2 - MODEL #', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '11', surveyItem: 'CONDENSING UNIT #M2/L2 - SERIAL #', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '12', surveyItem: 'CONDENSING UNIT #M2/L2 - WAG ASSET TAG # (IF APPLICABLE)', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '13', surveyItem: 'CONDENSING UNIT #M3/L3 - MODEL #', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '14', surveyItem: 'CONDENSING UNIT #M3/L3 - SERIAL #', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' },
        { id: '15', surveyItem: 'CONDENSING UNIT #M3/L3 - WAG ASSET TAG # (IF APPLICABLE)', mediumTemp: '', lowTemp: '', beerCool: '', photosTaken: '', notes: '' }
    ];
    jsonData
    renderedCallback() {
        this.adjustColumnHeight();
    }
    
    adjustColumnHeight() {
        const firstColumn = this.template.querySelector('.slds-size_1-of-12');
        const secondColumn = this.template.querySelector('.slds-size_11-of-12');
        if (firstColumn && secondColumn) {
            firstColumn.style.height = secondColumn.clientHeight + 'px';
        }
    }
    

    handleInputChange(event) {
        const id = event.target.dataset.id;
        const field = event.target.dataset.field;
        const value = event.target.value;
        const rowIndex = this.tableData.findIndex(row => row.id === id);
        if (rowIndex !== -1) {
            this.tableData[rowIndex][field] = value;
            this.tableData = [...this.tableData];
        }
        console.log("this.tableData",this.tableData)

        this.jsonData = this.getTableDataAsJSON();
        console.log(this.jsonData);
        //this.handleClick()
    }


    handleClick(){
        console.log('LOCATION OF CRANE FOR ROOF EQ. INSTALL MEDIUM TEMP :-'+this.jsonData[0].mediumTemp)
        console.log('LOCATION OF CRANE FOR ROOF EQ. INSTALL LOW TEMP :-'+this.jsonData[0].lowTemp)
        console.log(' DATE OF MFG MEDIUM TEMP :-'+this.jsonData[5].mediumTemp)
        const locOfCraneMediumTemp = this.jsonData[0].mediumTemp;
        const locOfCraneLowTemp = this.jsonData[0].lowTemp;
        const locOfCraneBeerCoolerMedTemp = this.jsonData[0].beerCool;
        const locOfCranePhotosTaken = this.jsonData[0].photosTaken;
        const locOfCraneNotes = this.jsonData[0].notes;
        const storeEnergyMediumTemp = this.jsonData[3].mediumTemp;
        const storeEnergyLowTemp = this.jsonData[3].lowTemp;
        const storeEnergyBeerCoolerMedTemp = this.jsonData[3].beerCool;
        const storeEnergyPhotosTaken = this.jsonData[3].photosTaken;
        const storeEnergyNotes = this.jsonData[3].notes;
        const dateOfMfgMedTemp = this.jsonData[5].mediumTemp;
        console.log('dateOfMfgMedTemp'+dateOfMfgMedTemp);
        const dateOfMfgLowTemp = this.jsonData[5].lowTemp;
        const dateOfMfgBeerCoolerMedTemp = this.jsonData[5].beerCool;
        const dateOfMfgPhotosTaken = this.jsonData[5].photosTaken;
        const dateOfMfgNotes = this.jsonData[5].notes;
        const manufacureMedTemp = this.jsonData[4].notes;
        const manufacureLowTemp = this.jsonData[4].notes;
        const manufacurebeerCoolerTemp = this.jsonData[4].notes;
        const manufacurePhotosTaken = this.jsonData[4].notes;
        const manufacureNotes = this.jsonData[4].notes;
        
        createSiteSurveyRecord({
            locOfCraneMediumTemp,
            locOfCraneLowTemp,
            locOfCraneBeerCoolerMedTemp,
            locOfCranePhotosTaken,
            locOfCraneNotes,
            storeEnergyMediumTemp,
            storeEnergyLowTemp,
            storeEnergyBeerCoolerMedTemp,
            storeEnergyPhotosTaken,
            storeEnergyNotes,
            dateOfMfgMedTemp,
            dateOfMfgLowTemp,
            dateOfMfgBeerCoolerMedTemp,
            dateOfMfgPhotosTaken,
            dateOfMfgNotes,
            manufacureMedTemp,
            manufacureLowTemp,
            manufacurebeerCoolerTemp,
            manufacurePhotosTaken,
            manufacureNotes
        })
        .then(result => {
            // Handle success
            console.log('Records created successfully:', result);
            const event = new ShowToastEvent({
                title: 'Success',
                message: 'Records created successfully',
                variant: 'success'
            });
            this.dispatchEvent(event);
    
            // Clear the form fields
            this.clearFormFields();
        })
        .catch(error => {
            // Handle error
            console.error('Error creating records:', error);
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Error creating records',
                variant: 'error'
            });
            this.dispatchEvent(event);
        });
    }
    
    clearFormFields() {
        this.tableData = this.tableData.map(row => ({
            ...row,
            mediumTemp: '',
            lowTemp: '',
            beerCool: '',
            photosTaken: '',
            notes: ''
        }));
    }
    
    getTableDataAsJSON() {
        return JSON.parse(JSON.stringify(this.tableData));
    }



    //New Image display section

}