trigger TriggerOnOpportunity on Opportunity (after update) {
    if(Trigger.isAfter && Trigger.isUpdate){
       OpportunityTriggerHandler.createRelatedProject(Trigger.New); 
    }
}