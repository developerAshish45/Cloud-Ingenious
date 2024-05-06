import { LightningElement } from 'lwc';

export default class CaseSearch extends LightningElement {
    handleSearch(event) {
        const searchValue = event.target.value;
        this.dispatchEvent(new CustomEvent('search', { detail: searchValue }));
    }
}