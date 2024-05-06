public class OpportunityTriggerHandler {
    public static void createRelatedProject(List<Opportunity>oppList){
        List<Project__c> projectList = new List<Project__c>();
        Map<ID, Schema.RecordTypeInfo> rtMap = Schema.SObjectType.Opportunity.getRecordTypeInfosById();
        for(Opportunity opp : oppList){
            String type = rtMap.get(opp.RecordTypeId).getName();
            if(opp.StageName == 'Customer Evaluating' && type =='RSG Opportunities'){
                Project__c pro = new Project__c();
                pro.Installation_Type__c = 'Planned';
                pro.Opportunity__c = opp.Id;
                pro.Name = opp.Name + 'Project';
                pro.Customer_Name__c = opp.AccountId;
                projectList.add(pro);
            } 
        }
        if(!projectList.isEmpty()){
            insert projectList;
        }
    }
}