import { LightningElement, api, track } from 'lwc';
import getWalkinRecords from '@salesforce/apex/InstallerDetailFormController.getWalkinRecords';
import updateData from '@salesforce/apex/InstallerDetailFormController.updateData';
export default class InstallerCfaChecklist extends LightningElement {
    @api recordId;
    showData=false;
    data1; // Variable for storing result for Walkin
    data2;
    data3;
    data4;
    data5;
    data6;
    error;
    checklistSection; // this variable is use to pass the section name to getRecord Apex Method
    checkboxValueList = [];
    selectedCons;
    @track isVisible = false;
    @track yesCheckbox = false;
    @track noCheckbox = false;
    checkboxStatus = [];
    value ='';
    get options() {
        return [
            { label: 'Sales', value: 'option1' },
            { label: 'Force', value: 'option2' },
        ];
    }

    // handleInputChange(event) {
    //     //const checkboxValueMap = new Map();
    //     let selectedRows = this.template.querySelectorAll('input[type="checkbox"]');
    //     console.log(selectedRows);
    //     let checkedValuesMap = new Map();
    //     selectedRows.forEach(currentItem => {
    //         if (currentItem.checked && currentItem.type === 'checkbox') {
    //             checkedValuesMap.set(currentItem.name, currentItem.value);
    //         }
    //     });
    //     let allNewValues = checkedValuesMap.values();
    //     console.log(allNewValues);
    //     let allKeys = checkedValuesMap.key();
    //     console.log(allKeys);

    //     if(event.target.checked){

    //     }
    // }

    /* 03/20/2024*/
    /* Handle Accordion Toggle */
    @track section1Open = false; // variable for panel
    @track section2Open = false; // variable for panel
    @track section3Open = false; // variable for panel
    @track section4Open = false; // variable for panel
    @track section5Open = false; // variable for panel
    @track section6Open = false; // variable for panel


    @track showMedTemp1 = false; // variable for the + and - Sign
    @track showMedTemp2 = false; // variable for the + and - Sign
    @track showMedTemp3 = false; // variable for the + and - Sign
    @track showMedTemp4 = false; // variable for the + and - Sign
    @track showMedTemp5 = false; // variable for the + and - Sign
    @track showMedTemp6 = false; // variable for the + and - Sign

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

    // icon + and -
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
        this.checklistSection = event.target.textContent.trim();
        console.log('section Name---' + this.checklistSection);
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
            case 'Final Inspection of the Walk-in and Refrigeration Systems':
                this.section6Open = !this.section6Open;
                this.showMedTemp6  = !this.showMedTemp6
                break; 
            default:
                break;
        }
        this.handleDisplayChecklist();
    }

    handleSubmit(){
        this.selectedCons = [];
        let selectedRows = this.template.querySelectorAll('lightning-input');
        console.log('length of seletedRows --->'+ selectedRows.length);
        console.log('values of selectedRows --->'+ JSON.stringify(selectedRows));
        try {
            for(let i=0; i<selectedRows.length; i++){
                console.log(selectedRows[i]);
                // alert('inside for loop' + selectedRows[i].value +'---'+ selectedRows[i].dataset.id);
                
                if(selectedRows[i].checked && selectedRows[i].type === "checkbox"){
                    //alert('inside if 12345' + selectedRows[i].value);
                    console.log('dataset Id' + selectedRows[i].dataset.id);
                    this.selectedCons.push({
                        Name: selectedRows[i].value,
                        Id: selectedRows[i].dataset.id
                    });
                    
                    console.log('1232141 --->')
                    //this.selectedCons.set(selectedRows[i].dataset.id, selectedRows[i].value);
                }
            }
            console.log('This is from try'+ JSON.stringify(this.selectedCons)); 
        } catch (error) {
            console.log('this is from catch'+ error.message());
        }
                
        updateData({recId: this.recordId, checkboxSelectList: this.selectedCons})
        .then(result =>{
            console.log('result Line 156'+JSON.stringify(result));
        })
        .catch(error =>{
            this.error = error;
        })
    }


    handleToggle(event){
        /*03/20/2024*/
        console.log("handleToggle function called");
        const clickedCheckbox = event.target.checked;
        console.log("Clicked Checkbox:", clickedCheckbox);
        const container = clickedCheckbox.closest('tr');
        console.log("Container:", container);

        // Find all inputs within the container with the same data-id and value "Yes" or "No"
        const yesCheckbox = container.querySelector(`[data-id="${clickedCheckbox.dataset.id}"]`).value="Yes";
        console.log('yes--->'+yesCheckbox);
        const noCheckbox = container.querySelector(`[data-id="${clickedCheckbox.dataset.id}"]`).value="No";
        console.log('no---->'+noCheckbox);

        if (clickedCheckbox.checked) {
            if (clickedCheckbox.value === 'Yes') {
                // If "Yes" is checked, disable "No"
                noCheckbox.disabled = true;
            } else if (clickedCheckbox.value === 'No') {
                // If "No" is checked, disable "Yes"
                yesCheckbox.disabled = true;
            }
        } else {
            // If the clicked input is unchecked, enable both "Yes" and "No"
            yesCheckbox.disabled = false;
            noCheckbox.disabled = false;
        }

    }

    handleCheckboxChange(event) {
        const checkboxChecked = event.target.checked;
        const checkboxId = event.target.dataset.id;
        console.log('checkboxChecked: '+checkboxChecked);
        console.log('checkboxId: '+checkboxId);
        this.checkboxStatus[checkboxId] = checkboxChecked;
        console.log('checkboxId: '+his.checkboxStatus[checkboxId]);
    }

    // handleOptionChange(event) {
    //     const clickedInput = event.target;
    //     const container = clickedInput.closest('.slds-table');

    //     // Find all inputs within the container
    //     const inputs = container.querySelectorAll(`[data-id="${clickedInput.dataset.id}"]`);

    //     if (clickedInput.checked && clickedInput.value === "NA") {
    //         inputs.forEach(input => {
    //             if (input !== clickedInput) {
    //                 input.disabled = true;
    //                 input.checked = false;
    //             }
    //         });
    //     } else {
    //         inputs.forEach(input => {
    //             input.disabled = false;
    //         });
    //     }
        
    // }
handleOptionChange(event) {
        const clickedInput = event.target;
        const container = clickedInput.closest('.container');
    
        // Find all inputs within the container
        const inputs = container.querySelectorAll('.checkbox-input');
    
        // Find the last checkbox within the container
        const lastCheckbox = container.querySelector('.checkbox-input[value^="lastcheckbox"]');
    
        if (clickedInput === lastCheckbox) {
            if (clickedInput.checked) {
                // Deselect all other checkboxes when the last checkbox is checked
                inputs.forEach(input => {
                    if (input !== clickedInput && input.checked) {
                        input.checked = false;
                    }
                });
    
                // Disable all other inputs when the last checkbox is checked
                inputs.forEach(input => {
                    if (input !== clickedInput) {
                        input.disabled = true;
                    }
                });
    
                // Disable all radios when the last checkbox is checked
                const radios = container.querySelectorAll('input[type="radio"]');
                radios.forEach(radio => {
                    radio.disabled = true;
                });
            } else {
                // Enable all other inputs when the last checkbox is unchecked
                inputs.forEach(input => {
                    input.disabled = false;
                    this.checkboxCounter = 0;
                });
    
                // Enable all radios when the last checkbox is unchecked
                const radios = container.querySelectorAll('input[type="radio"]');
                radios.forEach(radio => {
                    radio.disabled = false;
                });
            }
        }
        this.disableSubmit = false;
    }


    handleDisplayChecklist(){

        getWalkinRecords({checklistSection: this.checklistSection})
        .then(result =>{
            console.log('result Line 13'+JSON.stringify(result));
            if(this.checklistSection == 'Walk-In'){
            this.data1 = result;  
            } else if(this.checklistSection == 'Refrigeration – Evaporator Section for the Cooler'){
                this.data2 = result;
            }else if(this.checklistSection == 'Refrigeration – Evaporator Section for the Freezer'){
                this.data3 = result;
            }else if(this.checklistSection == 'Refrigeration – Condensing Unit for the Cooler'){
                this.data4 = result;
            }else if(this.checklistSection == 'Refrigeration – Condensing Unit for the Freezer'){
                this.data5 = result;
            }else if(this.checklistSection == 'Final Inspection of the Walk-in and Refrigeration Systems'){
                this.data6 = result;
            }
            //console.log('data Line 15'+JSON.stringify(this.data));
            this.showData = true;
            this.isVisible = true;
        })
        .catch(error =>{
            this.error = error;
        })
    }
}