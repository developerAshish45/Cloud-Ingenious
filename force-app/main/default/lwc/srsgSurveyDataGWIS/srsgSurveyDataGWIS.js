import { LightningElement, track, api} from 'lwc';
import getSurveyRecordApex from '@salesforce/apex/SurveyorPortalController.getSurveyRecord';
import updateSurveyRecordApex from '@salesforce/apex/SurveyorPortalController.updateSurveyRecord';
import createNote from '@salesforce/apex/SurveyorPortalController.createNote';
import getNote from '@salesforce/apex/SurveyorPortalController.getNote';
import { ShowToastEvent} from 'lightning/platformShowToastEvent';
import RSGRailDimensions from '@salesforce/resourceUrl/RailDimensions'; 
import railDimensions from '@salesforce/resourceUrl/RailDimensions2';
export default class SrsgSurveyDataGWIS extends LightningElement {
    railDimensions1 = RSGRailDimensions;
    railDimensions2 = railDimensions;
       type ;
       @api surveyRec ;
        surveyRecord = [];
        isShelves = false;
        isPopupVisible = false;
        fieldName = '';
       @track noteBody ;
        noteTitle ;
        isCondensingImageUpload = false;
        isEvaporatorImageUpload = false;
        isFileUpload = false;
        count ;
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

        get locationOptions(){
            return [
                {label : 'Roof', value : 'Roof'},
                {label : 'Exterior Platform', value : 'Exterior Platform'},
                {label : 'Ground', value : 'Ground'}
            ]
        }

        get compressorOptions(){
            return [
                { label: 'Yes', value: 'Yes' },
                { label: 'No', value: 'No' },
                { label: 'NA', value: 'NA' }
            ];
        }
    
        connectedCallback(){
            this.getSurveyRecord();
        }
    
        getSurveyRecord() {
            getSurveyRecordApex({   
                surveyId: this.surveyRec
            })
            .then(result => {
                if(result != null){
                    this.surveyRecord = result;
                    if(this.surveyRecord.Brkn_Or_Missing_Cooler_Or_FS_MediumTemp__c == 'Yes'){
                        this.isShelves = true;
                     }else{
                        this.isShelves = false;
                     }
                    console.log('surveyRecord = ' + JSON.stringify(this.surveyRecord));
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });            
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
             if(this.surveyRecord.Brkn_Or_Missing_Cooler_Or_FS_MediumTemp__c == 'Yes'){
                this.isShelves = true;
             }else{
                this.isShelves = false;
             }
    
           
        }
    
        updateSurveyRecord(event) {
            updateSurveyRecordApex({
                surveyRecord: this.surveyRecord,
            })
                .then(result => {
                    if(result != null){
                        this.surveyRecord = result; 
                        console.log('Updated surveyRecord = ' + JSON.stringify(this.surveyRecord));
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
    
       
        handleAddNoteClick(event) {
            this.fieldName = event.currentTarget.dataset.fieldName;
            this.isPopupVisible = true;
            
            const button = event.currentTarget;
            const formElement = button.closest('.slds-form-element');
        
            const inputElement = formElement.querySelector('lightning-input');
            const comboboxElement = formElement.querySelector('lightning-combobox');
        
            if (inputElement || comboboxElement) {
                let fieldValue;
                if (inputElement) {
                    fieldValue = inputElement.dataset.field;
                } else {
                    fieldValue = comboboxElement.dataset.field;
                }
                
                if (fieldValue) {
                    let fieldNameWithoutSuffix = fieldValue.slice(0, -3);
                    this.noteTitle = fieldNameWithoutSuffix;
                    console.log("Field Value:", fieldNameWithoutSuffix);
                } else {
                    console.error("Field Value not found.");
                }
            } else {
                console.error("Input or Combobox Element not found.");
            }
            this.handleGetNote();
            
        }
        
    
        closePopup() {
            this.isPopupVisible = false;
            this.noteBody = '';
        }
    
        handleSave(){
            this.handleCreateNote();
        }
    
        handleNoteInput(event){
           this.noteBody = event.target.value;
        }
    
        handleCreateNote(){
            createNote({noteTitle :this.noteTitle , noteBody :this.noteBody, parentId :this.surveyRec}) 
            .then(result => {
                if(result === 'Success'){
                    this.isPopupVisible = false;
                    this.noteTitle = '';
                    console.log('Create Note = ' + result);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Success!",
                            message: "Note updated successfully.",
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
    
        handleGetNote(){
            console.log('LIne 184 ', this.surveyRec);
            console.log('LIne 185 ', this.noteTitle);
            getNote({ parentId :this.surveyRec, noteTitle :this.noteTitle}) 
            .then(result => {
                console.log('Result 155', result);
                if(result != null){
                   this.noteBody = result;
                   console.log('this.noteBody ' , this.noteBody);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
               // this.displayError(error.body.message);
         });
        }

        handleFileUpload(event){
            this.isFileUpload = true;
            this.fieldName = event.currentTarget.dataset.fieldName;
            if(this.fieldName == 'Condensing Unit 1'){
                this.type = 'MediumTemp';
                this.count = 1;
                this.isCondensingImageUpload = true;
            }
            if(this.fieldName == 'Condensing Unit 2'){
                this.type = 'MediumTemp';
                this.count = 2;
                this.isCondensingImageUpload = true;
            }
            if(this.fieldName == 'Condensing Unit 3'){
                this.type = 'MediumTemp';
                this.count = 3;
                this.isCondensingImageUpload = true;
            }
            if(this.fieldName == 'Low Temp Condensing Unit 1'){
                this.type = 'LowTemp';
                this.count = 1;
                this.isCondensingImageUpload = true;
            }
            if(this.fieldName == 'Low Temp Condensing Unit 2'){
                this.type = 'LowTemp';
                this.count = 2;
                this.isCondensingImageUpload = true;
            }
            if(this.fieldName == 'Low Temp Condensing Unit 3'){
                this.type = 'LowTemp';
                this.count = 3;
                this.isCondensingImageUpload = true;
            }
            if(this.fieldName == 'Evaporators 1'){
                this.type = 'MediumTemp';
                this.count = 1;
                this.isEvaporatorImageUpload = true;
            }
            if(this.fieldName == 'Evaporators 2'){
                this.type = 'MediumTemp';
                this.count = 2;
                this.isEvaporatorImageUpload = true;
            }
            if(this.fieldName == 'Evaporators 3'){
                this.type = 'MediumTemp';
                this.count = 3;
                this.isEvaporatorImageUpload = true;
            }
            if(this.fieldName == 'Low Temp Evaporators 1'){
                this.type = 'LowTemp';
                this.count = 1;
                this.isEvaporatorImageUpload = true;
            }
            if(this.fieldName == 'Low Temp Evaporators 2'){
                this.type = 'LowTemp';
                this.count = 2;
                this.isEvaporatorImageUpload = true;
            }
            if(this.fieldName == 'Low Temp Evaporators 3'){
                this.type = 'LowTemp';
                this.count = 3;
                this.isEvaporatorImageUpload = true;
            }
            if(this.fieldName == 'Beer Cooler Condensing Unit 1'){
                this.type = 'BeerCooler';
                this.count = 1;
                this.isCondensingImageUpload = true;
            } if(this.fieldName == 'Beer Cooler Condensing Unit 2'){
                this.type = 'BeerCooler';
                this.count = 2;
                this.isCondensingImageUpload = true;
            }
            if(this.fieldName == 'Beer Cooler Condensing Unit 3'){
                this.type = 'BeerCooler';
                this.count = 3;
                this.isCondensingImageUpload = true;
            }
            if(this.fieldName == 'Beer Cooler Evaporator 1'){
                this.type = 'BeerCooler';
                this.count = 1;
                this.isEvaporatorImageUpload = true;
            } if(this.fieldName == 'Beer Cooler Evaporator 2'){
                this.type = 'BeerCooler';
                this.count = 2;
                this.isEvaporatorImageUpload = true;
            }
            if(this.fieldName == 'Beer Cooler Evaporator 3'){
                this.type = 'BeerCooler';
                this.count = 3;
                this.isEvaporatorImageUpload = true;
            }
        }

        closeFilePopup(){
            this.isFileUpload = false;
            this.isCondensingImageUpload = false;
            this.isEvaporatorImageUpload = false;
        }
    
    }