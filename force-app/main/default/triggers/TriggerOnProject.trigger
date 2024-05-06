trigger TriggerOnProject on Project__c (after insert) {
    ProjectTriggerHandler.createRelatedOpp(Trigger.New);
    ProjectTriggerHandler.createRelatedInstall(Trigger.New);
}