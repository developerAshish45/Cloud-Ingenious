import { LightningElement, api } from 'lwc';

export default class CasePagination extends LightningElement {
    @api currentPage;
    @api totalPages;
    @api isFirstPage;
    @api isLastPage;

    handlePrevious() {
        this.dispatchEvent(new CustomEvent('previous'));
    }

    handleNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }
}