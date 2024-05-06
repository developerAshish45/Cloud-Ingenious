public class LeadTriggerHandler {
    public static void SaveleadHistoryOnOpp(List<Lead> leadList){
        List<Lead_History__c> oppLeadHistory=New List<Lead_History__c>();
        Map<String,Lead> leadMap=New Map<String,Lead>();
        List<Lead> convertedLeadList=New List<Lead>();
        system.debug('leadList'+leadList);
        if(LeadList.size()>0){
            for(Lead leadobj:LeadList){
                if(leadobj.IsConverted==true){
                    convertedLeadList.add(leadobj);
                    leadMap.put(leadobj.Id,leadobj);
                    system.debug('leadobj'+leadobj.ConvertedOpportunityId);
                    
                }
            }
            if(convertedLeadList.size()>0){
                quoteProcess(convertedLeadList);
            }
            
            List<LeadHistory> historyList=[SELECT OldValue, Id, IsDeleted, LeadId, CreatedById, CreatedDate, Field, DataType, NewValue FROM LeadHistory WHERE LeadId In :leadMap.keySet()];
            if(historyList.Size()>0){
                for(LeadHistory leadHistoryObj:historyList){
                    String projectId=leadMap.get(leadHistoryObj.LeadId).ConvertedOpportunityId;
                    Lead_History__c historyObj=New Lead_History__c();
                    historyObj.Data_Type__c=leadHistoryObj.DataType;
                    historyObj.New_Value__c=String.valueof(leadHistoryObj.NewValue);
                    historyObj.Old_Value__c=String.valueof(leadHistoryObj.OldValue);
                    historyObj.Projects__c=projectId;
                    oppLeadHistory.add(historyObj);
                    
                }
                
                
            }
        }
        if(oppLeadHistory.Size()>0){
            Insert oppLeadHistory;
        }
    }
    public static void quoteProcess(List<Lead> leadList){
        List<Pricebook2> standardPriceBook=[SELECT Id ,IsStandard from pricebook2 where IsStandard =true limit 1];
        List<Quote> quoteList=New List<Quote>();
        List<OpportunityLineItem> oppItem=New List<OpportunityLineItem>();
        for(Lead leadObj:leadList){
            List<QuoteLineItem> itemList=New List<QuoteLineItem>();
            String leadInterested=leadObj.Product_Interest__c;
            
            Quote quoteObj=New Quote();
            quoteObj.OpportunityId = leadObj.ConvertedOpportunityId;
            quoteObj.Pricebook2Id = standardPriceBook[0].Id;
            quoteObj.name=leadObj.Company;
            quoteObj.Email=leadObj.Email;
         //   quoteObj.ShippingAddress=leadObj.Address;
           // quoteObj.BillingAddress=leadObj.Address;
            insert quoteObj;
            if(leadInterested!=null){
                List<String> values = leadInterested.split(';');
                List<Product2> prodList=[SELECT Id, ProductCode FROM Product2 where productCode IN :values];
                Map<String,Product2> prdMap=New Map<String,Product2>([SELECT Id, ProductCode FROM Product2 where productCode IN :values]);
                system.debug('prodmap>'+prdMap);
                system.debug('prodlist>'+prodList);
                List<PricebookEntry> pricebookEntryList=New List<PricebookEntry>([SELECT Id, Product2Id, UnitPrice FROM PricebookEntry where product2Id IN :prdMap.keySet()]);
                Map<String,PricebookEntry> mapOfPriceEntry=New Map<String,PricebookEntry>();
                for(PricebookEntry priceobj:pricebookEntryList){
                    mapOfPriceEntry.put(priceobj.Product2Id,priceobj);
                    
                }
                for(Product2 prObj:prodList){
                    Decimal price=mapOfPriceEntry.get(prObj.Id).UnitPrice;
                    string pricebookId=mapOfPriceEntry.get(prObj.Id).Id;
                    QuoteLineItem item=New QuoteLineItem();
                    item.QuoteId=quoteObj.Id;
                    item.PricebookEntryId=pricebookId;
                    item.UnitPrice=price;
                    item.Product2Id=prObj.Id;
                    item.Quantity=1;
                    item.Door_Position__c=leadObj.Door_Position__c;
                    item.Project_Application__c=leadObj.Project_Application__c;
                    item.Contracted_Installation_Needed__c=leadObj.Contracted_Installation_Needed__c;
                    item.Design_Temperature__c=leadObj.Design_Temperature__c;
                    item.Overall_Room_Height__c=leadObj.Overall_Room_Height__c;
                    item.Overall_Width_Depth__c=leadObj.Overall_Width_Depth__c;
                    item.Door_Swing__c=leadObj.Door_Swing__c;
                    item.Door_Position__c=leadObj.Door_Position__c;
                        
                    itemList.add(item);
                    OpportunityLineItem oppObj=New OpportunityLineItem();
                    oppObj.OpportunityId=leadObj.ConvertedOpportunityId;
                    oppObj.PricebookEntryId=pricebookId;
                    oppObj.Quantity=1;
                    oppObj.UnitPrice=price;
                    oppItem.add(oppObj);
                    
                }
                if(itemList.size()>0){
                    Insert itemList;
                }
                if(oppItem.size()>0){
                    Insert oppItem;
                }
            }
            
            
            
            
            
            
            
        }
        
        
    }
    
}