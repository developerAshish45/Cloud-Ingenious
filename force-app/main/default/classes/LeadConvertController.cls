public class LeadConvertController {
    
    @AuraEnabled
    public static String leadConvert(String leadId){
        string message;
        
        //task check
        List<Task> tasks = [SELECT Id, Status FROM Task WHERE WhoId = :leadId];
        
        Boolean allTasksCompleted = true;
        
        for (Task task : tasks) {
            if (task.Status != 'Completed') {
                allTasksCompleted = false;
                break;
            }
        }
        //end 
        
        
        Boolean hasIncompleteTasks = [SELECT COUNT() FROM Task WHERE WhoId = :leadId AND Status = 'Completed'] > 0;
        if(allTasksCompleted==true){
            
            String projectId;
            String quoteId;
            LeadStatus CLeadStatus= [SELECT Id, MasterLabel FROM LeadStatus 
                                     WHERE  IsConverted=true Limit 1];
            String ProjectName=[SELECT Id, Project_Name__c FROM Lead where id=:leadId limit 1].Project_Name__c;
            List<Lead> leadRecord= New List<Lead>([SELECT ID, FirstName,LastName,Email,Company,Website FROM Lead where Id =:leadId]);
            List<Account> accountMatch=New List<Account>([SELECT ID,Name from Account WHERE Name =:leadRecord[0].Company]);
            List<Contact> contactMatch =New List<Contact>([SELECT ID,Email FROM Contact WHERE Email =:leadRecord[0].Email]);
            
          
            List<Database.LeadConvert> MassLeadconvert = new List<Database.LeadConvert>();
            
            Database.LeadConvert Leadconvert = new Database.LeadConvert();
              if(accountMatch.size()>0){
                 Leadconvert.setAccountId(accountMatch[0].Id);
                    if(contactMatch.size()>0){
                Leadconvert.setContactId(contactMatch[0].Id);
            }
                
            }
          
            
            Leadconvert.setLeadId ( leadId );                 
            Leadconvert.setConvertedStatus(CLeadStatus.MasterLabel);
            if(ProjectName !=null){
                Leadconvert.setOpportunityName(ProjectName);
            }
            
            //you can remove this line if you want to create an opportunity during  conversion 
            MassLeadconvert.add(Leadconvert);
            
            
            if (!MassLeadconvert.isEmpty()) {
                List<Database.LeadConvertResult> lcr = Database.convertLead(MassLeadconvert);
                system.debug('lcr'+lcr);
                
                for(Database.LeadConvertResult convertResult : lcr) {
                    if(convertResult.isSuccess()) {
                        projectId = convertResult.getOpportunityId();
                        
                    }
                }
                
                
            }
          system.debug('projectId--->'+projectId);
            
            quoteId=[SELECT ID,OpportunityId from Quote WHERE OpportunityId =: projectId LIMIT 1].ID;
             system.debug('quoteId--->'+quoteId);
            message=quoteId;
            // return message;
            /* Checking Duplicate record in Account and Contact for lead conversion */
         /* List<Lead> LeadCompanyName = new List<Lead>();
          LeadCompanyName = [select  Company from Lead where id =:leadId Limit 1 ];
            
          List<Account> matchingAccountCount = [SELECT COUNT(Name) FROM Account WHERE Name = :LeadCompanyName] ;*/
            
          
          
        }else{
            message='Please complete all task';
            
        }
        return message;
        
        
    } 
    //List<Account> Accountname = [select Name from Account ];
 	
    
}