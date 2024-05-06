import { LightningElement } from 'lwc';
import RGS_logo from "@salesforce/resourceUrl/RGS_logo";
import getSurveyRecordApex from '@salesforce/apex/SurveyorPortalController.getSurveyRecord';
import updateSurveyRecordApex from '@salesforce/apex/SurveyorPortalController.updateSurveyRecord'; 
import getProjectRecord from '@salesforce/apex/SurveyorPortalController.getProjectRecord';
import { ShowToastEvent} from 'lightning/platformShowToastEvent';
import bgImage_page from '@salesforce/resourceUrl/bgImage_page';
import SurveyCheckboxLabel from '@salesforce/label/c.SurveyCheckboxLabel';
export default class SrsgSurveyData extends LightningElement {
    surveyCheckboxLabel = SurveyCheckboxLabel;
    bgImageUrl=bgImage_page;
    rsgLogo = RGS_logo;
    projectId;
    surveyId;
    surveyRecord = [];
    isChecked = false;
    isSubmitSurvey = true;
    projectName ;
    get backgroundImage() {
        return `background-image: url(${this.bgImageUrl}); background-size: cover; padding: 20px; `;
    }
    get options() {
        return [
            { label: 'Yes', value: 'Yes' },
            { label: 'No', value: 'No' },
        ];
    }
    get reachOptions(){
        return [
            {label : 'Self-Contained', value : 'Self-Contained'},
            {label : 'Remote Condensing Unit', value : 'Remote Condensing Unit'}
        ]
    }
    get viOptions(){
        return [
            {label : 'Poor - Major repairs may be needed', value : 'Poor - Major repairs may be needed'},
            {label : 'Typical - minor repairs may be needed', value : 'Typical - minor repairs may be needed'},
            {label : 'Acceptable - no obvious repairs observed', value : 'Acceptable - no obvious repairs observed'}
        ]
    }

    get intextOptions(){
        return [
            {label : 'Internal', value : 'Internal'},
            {label : 'External', value : 'External'}
        ]
    }

    connectedCallback() {
        // Get the full URL
        var fullurl = window.location.href;
        // Parse the URL to get the query parameters
        var urlParams = new URLSearchParams(new URL(fullurl).search);

        // Get the oppId parameter from the URL
         this.projectId = urlParams.get('projectId');

        // Get the surveyId parameter from the URL
         this.surveyId = urlParams.get('surveyId');

        console.log('projectId:', this.projectId);
        console.log('surveyId:', this.surveyId);
    
        this.getSurveyRecord();
        this.handleGetProjectRecord();
    }

    getSurveyRecord() {
        getSurveyRecordApex({   
            surveyId: this.surveyId
        })
        .then(result => {
            this.surveyRecord = result;
        })
        .catch(error => {
            console.error('Error fetching data:', JSON.stringify(error));
        });            
    } 

    handleGetProjectRecord(){
        getProjectRecord({projectId :this.projectId}).then(result =>{
            this.projectName = result.Name;
        })
    }

    handleInputChange(event) {
        // Get the field name and value from the input event
        const fieldName = event.target.dataset.field;
        let fieldValue;
        if (event.target.type === 'checkbox') {
            fieldValue = event.target.checked;
        }
        else {
            if(event.target.value) {
                fieldValue = event.target.value;
            }
        }
        // Update the corresponding property in the worksheet object
         this.surveyRecord[fieldName] = fieldValue;
         console.log('surveyRecord = ' + JSON.stringify(this.surveyRecord));
    }
    
    updateSurveyRecord(event) {
        this.surveyRecord.Survey_Status__c = 'Submitted';
        console.log('Survey Status ', this.surveyRecord.Survey_Status__c);
        updateSurveyRecordApex({
            surveyRecord: this.surveyRecord
        })
            .then(result => {
                if(result != null){
                    this.surveyRecord = result; 
                    console.log('Updated surveyRecord = ' + JSON.stringify(this.surveyRecord));
                    this.isSubmitSurvey = true;
                    this.isChecked = false;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Success!",
                            message: "Survey record submitted successfully.",
                            variant: "success"
                        })
                    );
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                this.displayError(error.body.message);
         });
    }

    showTab1Content = true;
    showTab2Content = false;

   get tab1Class() {
       return this.showTab1Content ? 'active-tab' : 'inactive-tab';
   }

   get tab2Class() {
       return this.showTab2Content ? 'active-tab' : 'inactive-tab';
   }

   handleTab1Click() {
       this.showTab1Content = true;
       this.showTab2Content = false;
   }

   handleTab2Click() {
       this.showTab1Content = false;
       this.showTab2Content = true;
   }

    showGWIS = false;
    showSRIC = false;
    showBOHC = false;
    showWIBE = false;
    showWICUE = false;
    showWICFEI = false;
    showWWIDSDI = false;
    showSGI = false;
    showGUI =  false;
    get buttonLabel() {
        return this.showGWIS ? 'Hide' : 'Show';
    }

    get buttonLabel2(){
        return this.showSRIC ? 'Hide' : 'Show';
    }

    get buttonLabel3(){
        return this.showBOHC ? 'Hide' : 'Show';
    }

    get buttonLabel4(){
        return this.showWIBE ? 'Hide' : 'Show';
    }

    get buttonLabel5(){
        return this.showWICUE ? 'Hide' : 'Show';
    }

    get buttonLabel6(){
        return this.showWICFEI ? 'Hide' : 'Show';
    }

    get buttonLabel7(){
        return this.showWWIDSDI ? 'Hide' : 'Show';
    }

    get buttonLabel8(){
        return this.showSGI ? 'Hide' : 'Show';
    }
    get buttonLabel9(){
        return this.showGUI ? 'Hide' : 'Show';
    }

    get GWISIcon() {
        return this.showGWIS ? 'utility:dash' : 'utility:add';
    }

    get SRICIcon(){
        return this.showSRIC ? 'utility:dash' : 'utility:add';
    }

    get BOHCIcon(){
        return this.showBOHC ? 'utility:dash' : 'utility:add';
    }

    get WIBEIcon(){
        return this.showWIBE ? 'utility:dash' : 'utility:add';
    }

    get WICUEIcon(){
        return this.showWICUE ? 'utility:dash' : 'utility:add';
    }

    get WICFEIIcon(){
        return this.showWICFEI ? 'utility:dash' : 'utility:add';
    }

    get WIDSDIIcon(){
        return this.showWWIDSDI ? 'utility:dash' : 'utility:add';
    }

    get SGIIcon(){
        return this.showSGI ? 'utility:dash' : 'utility:add';
    }

    get GIUIcon(){
        return this.showGUI ? 'utility:dash' : 'utility:add';
    }

    handleGWIS() {
        this.showGWIS = !this.showGWIS;
    }

    handleSRIC(){
        this.showSRIC = !this.showSRIC;
    }

    handleBOHC(){
        this.showBOHC = !this.showBOHC;
    }

    handleWIBE(){
        this.showWIBE = !this.showWIBE;
    }

    handleWICUE(){
        this.showWICUE = !this.showWICUE;
    }

    handleWICFEI(){
       this.showWICFEI = !this.showWICFEI;
    }

    handleWIDSDI(){
        this.showWWIDSDI = !this.showWWIDSDI;
     }

     handleSGI(){
        this.showSGI = !this.showSGI;
     }

     handleGIU(){
        this.showGUI = !this.showGUI;
     }

     handleCheckbox(event) {
        this.isChecked = event.target.checked;
        console.log('Checkbox value ', this.isChecked);
        if(this.isChecked == true){
            this.isSubmitSurvey = false;
        }else{
            this.isSubmitSurvey = true;
        }
    }

}