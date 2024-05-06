trigger TriggerOnLead on Lead (after update) {
    system.debug('Old value>>'+trigger.old);
    system.debug('New Value'+trigger.New);
    LeadTriggerHandler.SaveleadHistoryOnOpp(trigger.New);
    

}