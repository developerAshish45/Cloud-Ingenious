trigger triggerOnCredit on Credit__c (after insert,after update) {   
    if(Trigger.IsInsert || Trigger.IsUpdate){
        SendEmailForCreditController.sendCreditEmailNotifications(Trigger.New, Trigger.OldMap);
    }
}