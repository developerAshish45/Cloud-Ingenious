import { LightningElement, api, track } from 'lwc';
import getWalkinRecords from '@salesforce/apex/InstallerDetailFormController.getWalkinRecords';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import updateData from '@salesforce/apex/InstallerDetailFormController.updateData';
import createNote from '@salesforce/apex/InstallerDetailFormController.createNote';
import getNote from '@salesforce/apex/InstallerDetailFormController.getNote';
export default class InstallerCfaChecklistClone extends NavigationMixin (LightningElement) {
    @api recordId;
    @api accountId;
    hasChecked = false;
    alert;
    alertMessage;
    showData=false;
    data1;
    data2;
    data3;
    data4;
    data5;
    data6;
    error;
    disableSubmit = true;
    newMap;
    checkboxCounter = 0;
    checklistSection = 'Walk-In'; 
    checkboxValueList = [];
    selectedCons;
    checkMap; /////
    allCons;/////
    @track isVisible = false;
    @track allQuestion = [];
    @track questions = [];
    @track questions0 = [];
    @track questions1 = [];
    @track questions2 = [];
    @track questions3 = [];
    @track questions4 = [];
    @track questions5 = [];
    isPopupVisible = false;
    isShowModal = false;
    @track noteBody = '' ;
    @track section1Open = false;
    @track section2Open = false;
    @track section3Open = false;
    @track section4Open = false;
    @track section5Open = false; 
    @track section6Open = false; 


    @track showMedTemp1 = false;
    @track showMedTemp2 = false;
    @track showMedTemp3 = false;
    @track showMedTemp4 = false;
    @track showMedTemp5 = false;
    @track showMedTemp6 = false;

    connectedCallback() {
        var fullurl = window.location.href;
        var urlParams = new URLSearchParams(new URL(fullurl).search);
        var instaId = urlParams.get('instaId');
        this.accountId = instaId;
        const sectionList = ['Walk-In', 'Refrigeration – Evaporator Section for the Cooler', 'Refrigeration – Evaporator Section for the Freezer', 'Refrigeration – Condensing Unit for the Cooler', 'Refrigeration – Condensing Unit for the Freezer', 'Final Inspection of the Walk-in and Refrigeration Systems'];
        sectionList.forEach(str => {
            this.handleDisplayChecklist(str);
        });
    }

    get section1Class() {
        return this.section1Open ? 'panel' : 'panel hidden';
    }
    get section2Class() {
        return this.section2Open ? 'panel' : 'panel hidden';
    }

    get section3Class() {
        return this.section3Open ? 'panel' : 'panel hidden';
    }
    get section4Class() {
        return this.section4Open ? 'panel' : 'panel hidden';
    }
    get section5Class() {
        return this.section5Open ? 'panel' : 'panel hidden';
    }
    get section6Class() {
        return this.section6Open ? 'panel' : 'panel hidden';
    }
    get medTempIcon1() {
        return this.showMedTemp1 ? 'utility:dash' : 'utility:add';
    }
    get medTempIcon2() {
        return this.showMedTemp2 ? 'utility:dash' : 'utility:add';
    }
    get medTempIcon3() {
        return this.showMedTemp3 ? 'utility:dash' : 'utility:add';
    }
    get medTempIcon4() {
        return this.showMedTemp4 ? 'utility:dash' : 'utility:add';
    }
    get medTempIcon5() {
            return this.showMedTemp5 ? 'utility:dash' : 'utility:add';
        }
    get medTempIcon6() {
        return this.showMedTemp6 ? 'utility:dash' : 'utility:add';
    }

    toggleSection(event) {
        console.log('Questions: '+this.questions);
        this.checklistSection = event.target.textContent.trim();
        const section = event.target.textContent.trim();
        switch (section) {
            case 'Walk-In':
                this.section1Open = !this.section1Open;
                this.showMedTemp1  = !this.showMedTemp1
                break;
            case 'Refrigeration – Evaporator Section for the Cooler':
                this.section2Open = !this.section2Open;
                this.showMedTemp2  = !this.showMedTemp2
                break;
            case 'Refrigeration – Evaporator Section for the Freezer':
                this.section3Open = !this.section3Open;
                this.showMedTemp3  = !this.showMedTemp3
                break;
            case 'Refrigeration – Condensing Unit for the Cooler':
                this.section4Open = !this.section4Open;
                this.showMedTemp4  = !this.showMedTemp4
                break;
            case 'Refrigeration – Condensing Unit for the Freezer':
                this.section5Open = !this.section5Open;
                this.showMedTemp5  = !this.showMedTemp5
                break;
            case 'Endless Cases Installation':
                this.section6Open = !this.section6Open;
                this.showMedTemp6  = !this.showMedTemp6
                break;
            default:
                break;
        }
    }

    handleSubmit(){
        this.selectedCons = [];
        let checkedRows = 0;
        this.allCons = [];
        let selectedRows = this.template.querySelectorAll('lightning-input');
        console.log('selectedRows: '+selectedRows);
        try {
            for(let i=0; i<selectedRows.length; i++) {
                this.allCons.push({
                        Name: selectedRows[i].checked,
                        Id: selectedRows[i].dataset.id
                    });
                if(selectedRows[i].checked && selectedRows[i].type === "checkbox"){
                    this.selectedCons.push({
                        Name: selectedRows[i].value,
                        Id: selectedRows[i].dataset.id
                    });
                }
            }
            this.newMap = new Map();
            this.checkMap = new Map();
            for(let i=0; i < this.allCons.length; i++){
                this.checkMap = this.allCons[i];
                var idVal = this.checkMap['Id'];
                if(!this.newMap.has(idVal)){
                    this.newMap.set(idVal, new Array());
                }
                this.newMap.get(this.checkMap['Id']).push(this.checkMap['Name']);
            }
            for(let key of this.newMap.keys()) {
                if( this.newMap.get(key).includes(true)) {
                    this.hasChecked = true;
                    checkedRows = checkedRows + 1;
                }
            }
            if (!this.hasChecked) {
                this.isShowModal = true;
                this.alert = 'Error: Incomplete Submission';
                this.alertMessage = 'It seems like you have not marked any of the questions answers. Before continuing, kindly respond to at least one question.';
            } else if (this.hasChecked && (checkedRows != this.allQuestion.length)) {
                updateData({recId: this.recordId, checkboxSelectList: this.selectedCons, status: 'In Progress'})
                .then(result => {
                    this.isShowModal = true;
                    this.alert = 'Alert';
                    this.alertMessage = 'Thank You! Your records are partially saved !!!';
                });
            } else if (this.hasChecked && (checkedRows == this.allQuestion.length)) {
                updateData({recId: this.recordId, checkboxSelectList: this.selectedCons, status: 'Submitted'})
                .then(result => {
                    this.isShowModal = false;
                    const event = new ShowToastEvent({
                        title: 'Success',
                        message: 'Records created successfully',
                        variant: 'success'
                    });
                    this.dispatchEvent(event);
                    setTimeout(() => {
                        this[NavigationMixin.Navigate]({
                            type: 'comm__namedPage',
                            attributes: {
                                pageName: 'home'
                            },
                            state: {
                                instaId: this.accountId
                            }
                        });
                    }, 2000);
                });
            }
        } catch (error) {
            console.log('this is from catch'+ error.message());
        }
    }

    hideModalBox(event){
        this.isShowModal = false;
    }

    handleYesChange(event) {
        const questionId = event.target.dataset.id;
        const checklistName = event.target.name;
        if (checklistName === 'Walk-In') {
            this.questions = this.questions.map(question => {
                if (question.SF_ApiName__c === questionId) {
                    question.yesChecked = event.target.checked;
                    question.noChecked = !event.target.checked;
                }
                return question;
            });
        }

        if (checklistName === 'Refrigeration – Evaporator Section for the Cooler') {
            this.questions1 = this.questions1.map(question => {
                if (question.SF_ApiName__c === questionId) {
                    question.yesChecked = event.target.checked;
                    question.noChecked = !event.target.checked;
                }
                return question;
            });
        }

         if (checklistName === 'Refrigeration – Evaporator Section for the Freezer') {
            this.questions2 = this.questions2.map(question => {
                if (question.SF_ApiName__c === questionId) {
                    question.yesChecked = event.target.checked;
                    question.noChecked = !event.target.checked;
                }
                return question;
            });
        }
        if (checklistName === 'Refrigeration – Condensing Unit for the Cooler') {
            this.questions3 = this.questions3.map(question => {
                if (question.SF_ApiName__c === questionId) {
                    question.yesChecked = event.target.checked;
                    question.noChecked = !event.target.checked;
                }
                return question;
            });
        }
        if (checklistName === 'Refrigeration – Condensing Unit for the Freezer') {
            this.questions4 = this.questions4.map(question => {
                if (question.SF_ApiName__c === questionId) {
                    question.yesChecked = event.target.checked;
                    question.noChecked = !event.target.checked;
                }
                return question;
            });
        }
        //if (checklistName === 'Final Inspection of the Walk-in and Refrigeration Systems') {
        if (checklistName === 'Endless Cases Installation') {
            this.questions5 = this.questions5.map(question => {
                if (question.SF_ApiName__c === questionId) {
                    question.yesChecked = event.target.checked;
                    question.noChecked = !event.target.checked;
                }
                return question;
            });
        }
    }

    handleNoChange(event) {
        const questionId = event.target.dataset.id;
        const checklistName = event.target.name;
        if (checklistName === 'Walk-In') {
            this.questions = this.questions.map(question => {
                if (question.SF_ApiName__c === questionId) {
                    question.noChecked = event.target.checked;
                    question.yesChecked = !event.target.checked;
                }
                return question;
            });
        }

        if (checklistName === 'Refrigeration – Evaporator Section for the Cooler') {
            this.questions1 = this.questions1.map(question => {
                if (question.SF_ApiName__c === questionId) {
                    question.noChecked = event.target.checked;
                    question.yesChecked = !event.target.checked;
                }
                return question;
            });
        }

        if (checklistName === 'Refrigeration – Evaporator Section for the Freezer') {
            this.questions2 = this.questions2.map(question => {
                if (question.SF_ApiName__c === questionId) {
                    question.noChecked = event.target.checked;
                    question.yesChecked = !event.target.checked;
                }
                return question;
            });
        }
        if (checklistName === 'Refrigeration – Condensing Unit for the Cooler') {
            this.questions3 = this.questions3.map(question => {
                if (question.SF_ApiName__c === questionId) {
                    question.noChecked = event.target.checked;
                    question.yesChecked = !event.target.checked;
                }
                return question;
            });
        }
        if (checklistName === 'Refrigeration – Condensing Unit for the Freezer') {
            this.questions4 = this.questions4.map(question => {
                if (question.SF_ApiName__c === questionId) {
                    question.noChecked = event.target.checked;
                    question.yesChecked = !event.target.checked;
                }
                return question;
            });
        }
        //if (checklistName === 'Final Inspection of the Walk-in and Refrigeration Systems') {
        if (checklistName === 'Endless Cases Installation') {
            this.questions5 = this.questions5.map(question => {
                if (question.SF_ApiName__c === questionId) {
                    question.noChecked = event.target.checked;
                    question.yesChecked = !event.target.checked;
                }
                return question;
            });
        }
    }

    get yesCheckbox1(){
        return this.checkboxId ? this.yesCheckboxStatus[this.checkboxId] : false;
    }

    get noCheckbox1(){
        return this.checkboxId ? this.noCheckboxStatus[this.checkboxId] : false;
    }

    handleOptionChange(event) {
        const clickedInput = event.target;
        const container = clickedInput.closest('.slds-table');
        const inputs = container.querySelectorAll(`[data-id="${clickedInput.dataset.id}"]`);

        if (clickedInput.checked && clickedInput.value === "NA") {
            inputs.forEach(input => {
                if (input !== clickedInput) {
                    input.disabled = true;
                    input.checked = false;
                }
            });
        } else {
            inputs.forEach(input => {
                input.disabled = false;
            });
        }
    }

    addCheckboxKey(value) {
        return {
            ...value,
            yesChecked : null,
            noChecked : null,
            repairsMadeChecked: false,
            naChecked: false
        }
    }

    handleDisplayChecklist(checklist) {
        getWalkinRecords({checklistSection: checklist})
        .then(result => {
            if(checklist == 'Walk-In'){
                this.data1 = result;
                this.questions = result;
                this.questions = this.questions.map(element => {
                    return this.addCheckboxKey(element);
                });
                this.allQuestion = this.allQuestion.concat(this.questions);
                console.log('Questions: '+this.questions);
            } else if(checklist == 'Refrigeration – Evaporator Section for the Cooler'){
                this.data2 = result;
                this.questions1 = result;
                this.questions1 = this.questions1.map(element => {
                    return this.addCheckboxKey(element);
                });
                 this.allQuestion = this.allQuestion.concat(this.questions1);
            } else if (checklist == 'Refrigeration – Evaporator Section for the Freezer'){
                this.data3 = result;
                this.questions2 = result;
                this.questions2 = this.questions2.map(element => {
                    return this.addCheckboxKey(element);
                });
                 this.allQuestion = this.allQuestion.concat(this.questions2);
            } else if (checklist == 'Refrigeration – Condensing Unit for the Cooler'){
                this.data4 = result;
                this.questions3 = result;
                this.questions3 = this.questions3.map(element => {
                    return this.addCheckboxKey(element);
                });
                this.allQuestion = this.allQuestion.concat(this.questions3);
            } else if (checklist == 'Refrigeration – Condensing Unit for the Freezer'){
                this.data5 = result;
                this.questions4 = result;
                this.questions4 = this.questions4.map(element => {
                    return this.addCheckboxKey(element);
                });
                this.allQuestion = this.allQuestion.concat(this.questions4);
            } else if (checklist == 'Final Inspection of the Walk-in and Refrigeration Systems'){
                this.data6 = result;
                this.questions5 = result;
                this.questions5 = this.questions5.map(element => {
                    return this.addCheckboxKey(element);
                });
                this.allQuestion = this.allQuestion.concat(this.questions5);
            }
            this.showData = true;
            this.isVisible = true;
        })
        .catch(error =>{
            this.error = error;
        })
    }

//Modal JS
    handleAddNoteClick(event) {
        this.isPopupVisible = event.target.checked;
        if (this.isPopupVisible == true) {
            const button = event.currentTarget;
            const inputElement = button.closest('.slds-table').querySelector('lightning-input');
            if (inputElement) {
                const fieldValue = inputElement.dataset.id;
                let fieldNameWithoutSuffix = fieldValue.slice(0, -3);
                this.noteTitle = fieldNameWithoutSuffix;
            } else {
                console.error("Input Element not found.");
            }
            this.handleGetNote();
        }
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
        createNote({noteTitle :this.noteTitle ,noteBody :this.noteBody, parentId :this.recordId}) 
        .then(result => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Success!",
                    message: "Note updated successfully.",
                    variant: "success"
                })
            );
            if(result === 'Success'){
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

    clearNote() {
        this.noteBody = '';
    }

    handleGetNote(){
        getNote({ parentId :this.recordId, noteTitle :this.noteTitle}) 
        .then(result => {
            if(result != null){
               this.noteBody = result;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
}