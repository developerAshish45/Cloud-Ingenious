/**
 * @description       : 
 * @author            : 
 * @group             : 
 * @last modified on  : 03-19-2024
 * @last modified by  : 
**/
public without sharing class SurveyorPortalController {

    @AuraEnabled
    public static List<ContentVersion> getVersionFiles(String recordId) {
        // Query ContentDocumentLink records with a single Id filter on LinkedEntityId
        List<ContentDocumentLink> contentDocumentLinks = [SELECT ContentDocumentId 
                                                           FROM ContentDocumentLink 
                                                           WHERE LinkedEntityId = :recordId];
        
        Set<Id> contentDocumentIds = new Set<Id>();
        for (ContentDocumentLink link : contentDocumentLinks) {
            contentDocumentIds.add(link.ContentDocumentId);
        }
        
        List<ContentVersion> relatedFiles = new List<ContentVersion>();
        
        // Check if there are any ContentDocumentIds retrieved
        if (!contentDocumentIds.isEmpty()) {
            // Query ContentVersion records using the IN operator for multiple ContentDocumentIds
            relatedFiles = [SELECT Id, Title, ContentDocumentId, FileType, ContentSize, FileExtension, VersionNumber,
                            CreatedDate, VersionData, FirstPublishLocationId FROM ContentVersion 
                            WHERE ContentDocumentId IN :contentDocumentIds];
        }
        
        return relatedFiles;
    }     

   

    @AuraEnabled
    public static Site_Survey__c getSurveyRecord(String surveyId) {   
        Site_Survey__c surveyRecord = new Site_Survey__c();          
        try {
            List<Site_Survey__c> lstSurvey = [Select Name, Project__r.Name, Survey_Status__c, Manufacturer_MediumTemp__c,Date_Of_Mfg_Med_Temp__c,CU_M1_L1_Model_MedTemp__c, BackOfHouse_BOH_Cases_MedTemp__c, CU_M1_L1_Serial_MedTemp__c,CU_M1_L1_Model_BeerCooler_MT__c,CU_M1_L1_Serial_BeerCooler_MT__c,
            CU_M1_L1_WagAssetTag_MedTemp__c, CU_M2_L2_Model_MedTemp__c, CU_M2_L2_Serial_MedTemp__c, CU_M2_L2_WagAssetTag_MedTemp__c, CU_M3_L3_Model_MedTemp__c, CU_M3_L3_Serial_Med_Temp__c, CU_M3_L3_WagAssetTag_MedTemp__c,
            CU_M2_L2_Model_LowTemp__c, CU_M2_L2_Serial_Low_Temp__c, CU_M2_L2_WagAssetTag_Low_Temp__c, CU_M3_L3_Model_Low_Temp__c, CU_M3_L3_Serial_Low_Temp__c, CU_M3_L3_WagAssetTag_LowTemp__c, CU_M1_L1_WagAssetTag_BeerCooler_MT__c, CU_M2_L2_Model_Beer_Cooler_MT__c, CU_M2_L2_Serial_BeerCooler_MT__c, CU_M2_L2_WagAssetTag_BeerCooler_MT__c, CU_M3_L3_Model_Beer_Cooler_MT__c, CU_M3_L3_Serial_BeerCooler_MT__c, CU_M3_L3_WagAssetTag_Beer_Cooler_MT__c, Decom_LkdCondUnits_MedTemp__c,
            Eva_M1_L1_Model_MedTemp__c, Eva_M1_L1_Serial_MedTemp__c, Eva_M1_L1_WagAssetTag_MedTemp__c, Eva_M2_L2_Model_MedTemp__c, Eva_M2_L2_Serial_MedTemp__c, Eva_M2_L2_WagAssetTag_MedTemp__c, Eva_M3_L3_Model_MedTemp__c, Eva_M3_L3_Serial_MedTemp__c, Eva_M3_L3_WagAssetTag_MedTemp__c,
             WillNewOrExistingReach_MedTemp__c, PermReachAtStore_MedTemp__c, Reach_InCaseSC_R_MedTemp__c, Reach_InCase_1Mfg_MedTemp__c, Reach_InCase_1_Model_MedTemp__c, Reach_InCase_1_Serial_MedTemp__c, Reach_InCase_1EleCon_MedTemp__c, Reach_InCase_1_DoorWidth_MedTemp__c, Reach_InCase_2Mfg_MedTemp__c, Reach_InCase_2_Model_MedTemp__c, Reach_InCase_2_Serial_MedTemp__c, Reach_InCase_2EleCon_MedTemp__c, Reach_InCase_2_DoorWidth_MedTemp__c, Reach_InCase_3Mfg_MedTemp__c, Reach_InCase_3_Model_MedTemp__c, Reach_InCase_3_Serial_MedTemp__c, Reach_InCase_3EleCon_MedTemp__c, Reach_InCase_3_DoorWidth_MedTemp__c, SharedCU_MedTemp__c, NumberOfTotalDoors_MedTemp__c,
             BOHCases_SC_R_MedTemp__c, BOHCase_1_Model_MedTemp__c, BOHCase_1_Serial_MedTemp__c, BOHCase_1_Age_MedTemp__c, BOHCase_2_Model_MedTemp__c, BOHCase_2_Serial_MedTemp__c, BOHCase_2_Age_MedTemp__c, BOHCase_2_Con_VI_MedTemp__c, BOHCase_3_Model_MedTemp__c, BOHCase_3_Serial_MedTemp__c, BOHCase_3_Age_MedTemp__c, BOHCase_3_Con_VI_MedTemp__c, INT_EXT_Elec_MedTemp__c, QF_Elec_MedTemp__c, FUSE_BB_VD_ELE_MedTemp__c, FUSE_BM_VD_Ele_MedTemp__c, Fuse_BT_VD_Ele_MedTemp__c, Rating_VD_Ele_MedTemp__c, Voltage_PS_Elec_MedTemp__c, Phase_PS_Elec_MedTemp__c, Fuse_BS_EP_Elec_MedTemp__c, Rating_EP_Elec_MedTemp__c, Fuse_BB_EP_Elec_MedTemp__c, Fuse_BM_EP_Elec_MedTemp__c, WS_PF_Elec_MedTemp__c, WQ_PF_Elec_MedTemp__c, CS_PF_Elec_MedTemp__c,
             INT_EXT_D_CU_Elec_MedTemp__c, NP_D_CU_Elec_MedTemp__c, F_NF_D_CU_Elec_MedTemp__c, QF_D_CU_Elec_MedTemp__c, Fuse_BB_D_CU_Elec_MedTemp__c, Fuse_B_DM_D_CU_Elec_MedTemp__c, Fuse_BT_D_CU_Elec_MedTemp__c, Rating_D_CU_Elec_MedTemp__c, Voltage_PS_CU_Elec_MedTemp__c, Phase_PS_CU_Elec_MedTemp__c, Fuse_B_EP_CU_Elec_MedTemp__c, Rating_EP_CU_Elec_MedTemp__c, Fuse_BB_EP_CU_Elec_MedTemp__c, Fuse_BM_EP_CU_Elec_MedTemp__c, WILL_NECNTBA_EP_CU_Elec_MedTemp__c, WS_PF_CU_Elec_MedTemp__c, WQ_PF_CU_Elec_MedTemp__c, IS_WRBOVIOC_PF_CU_Elec_MedTemp__c, CS_PF_CU_Elec_MedTemp__c, Temp_In_C_F_MedTemp__c, Temp_Reading_At_M_D_MedTemp__c, Box_Vs_MTR_Temp_Diff_MedTemp__c, Box_Temp_5_ABV_DSG_Temp_MediumTemp__c, DTHMTR_Bulb_EXT_PROP_INST_MediumTemp__c, Box_Vs_MDL_Diff_MediumTemp__c,
             HDR_Door_MC_FD_DMG_MediumTemp__c, HDR_Door_ACSRY_DMG_MediumTemp__c, INTR_WI_Box_DMNSN_MediumTemp__c, Lights_To_Be_RPC_RLC_MediumTemp__c, Fire_PRTC_Head_Issues_MediumTemp__c, Heat_TRC_INT_And_FNC_MediumTemp__c, Wiring_Safety_CNCRNS_MediumTemp__c, Air_Leakage_TSR_MediumTemp__c, Air_Leakage_TC_MediumTemp__c, AIr_Leakage_TSA_MediumTemp__c, UPP_MediumTemp__c, Box_Issues_WPMDP_MediumTemp__c, Mold_MILD_INS_Freezer_MediumTemp__c, Mold_MILDODF_MediumTemp__c, Box_Issues_SC_MediumTemp__c, Ice_Form_In_C_F_MediumTemp__c, Ice_Form_On_DF_MediumTemp__c, Number_Of_Glass_Doors_MediumTemp__c, Door_Issues_CG_MediumTemp__c, Door_Issues_HD_MediumTemp__c, Door_Issues_DDO_CC_MediumTemp__c, Door_Issues_DS_GS_MediumTemp__c, Door_Issues_DF_MediumTemp__c, Door_Issues_FG_MediumTemp__c, Door_Issues_GN_MediumTemp__c, Door_Issues_AEDL_MediumTemp__c, Hinge_CND_CPN_Mediumtemp__c, Door_Frame_HF_MediumTemp__c, WI_Cooler_GD_Width_MediumTemp__c, WI_Cooler_GD_Height_MediumTemp__c, WI_Cooler_GD_WO_MediumTemp__c, WI_Cooler_GD_Note_MediumTemp__c, Brkn_Or_Missing_Cooler_Or_FS_MediumTemp__c, Number_of_SB_M_MediumTemp__c, Was_a_picture_taken_MediumTemp__c, Width_Of_Shelves_MediumTemp__c, Length_Of_Shelves_MediumTemp__c, CS_Look_Like_The_Picture_MediumTemp__c, WI_Door_Width_MediumTemp__c, BOHCase_1_Con_VI_MedTemp__c,
             IS_WRBOVIOC_PF_Elec_MedTemp__c, Survey_M_Issues_Note__c, Manufacturer_LowTemp__c, Date_Of_Mfg_Low_Temp__c, CU_M1_L1_Model_LowTemp__c, Surveyor_Observations__c, ListLowMedTemp__c, Freezer_Floor__c, Cooler_Floor__c, CU_M1_L1_Serial_Low_Temp__c, CU_M1_L1_WagAssetTag_LowTemp__c, Decom_LkdCondUnits_LowTemp__c, Eva_M1_L1_Model_Low_Temp__c, Eva_M1_L1_Serial_Low_Temp__c, Eva_M1_L1_WagAssetTag_LowTemp__c, Eva_M2_L2_Model_Low_Temp__c, Eva_M2_L2_Serial_Low_Temp__c, Eva_M2_L2_WagAssetTag_LowTemp__c, General_Sales_Stock_Room__c, Eva_M3_L3_Model_LowTemp__c, Eva_M3_L3_Serial_LowTemp__c, Eva_M3_L3_WagAssetTag_LowTemp__c, WillNewOrExistingReach_LowTemp__c, PermReachAtStore_LowTemp__c, Reach_InCaseSC_R_LowTemp__c, Reach_InCase_1Mfg_LowTemp__c, Reach_InCase_1_Model_LowTemp__c, Reach_InCase_1_Serial_LowTemp__c, Reach_InCase_1EleCon_LowTemp__c, Reach_InCase_1_DoorWidth_LowTemp__c, Reach_InCase_2Mfg_LowTemp__c, Reach_InCase_2_Model_LowTemp__c, Reach_InCase_2_Serial_LowTemp__c, Reach_InCase_2EleCon_LowTemp__c, Reach_InCase_2_DoorWidth_LowTemp__c, Reach_InCase_3Mfg_LowTemp__c, Reach_InCase_3_Model_LowTemp__c, Reach_InCase_3_Serial_LowTemp__c, Reach_InCase_3EleCon_LowTemp__c, Reach_InCase_3_DoorWidth_LowTemp__c, SharedCU_LowTemp__c, NumberOfTotalDoors_LowTemp__c, BackOfHouse_BOH_Cases_LowTemp__c, BOHCases_SC_R_LowTemp__c, BOHCase_1_Model_LowTemp__c, BOHCase_1_Serial_LowTemp__c, BOHCase_1_Age_LowTemp__c, BOHCase_1_Con_VI_LowTemp__c, BOHCase_2_Model_LowTemp__c, BOHCase_2_Serial_LowTemp__c, BOHCase_2_Age_LowTemp__c, BOHCase_2_Con_VI_LowTemp__c, BOHCase_3_Model_LowTemp__c, BOHCase_3_Serial_LowTemp__c, BOHCase_3_Age_LowTemp__c, BOHCase_3_Con_VI_LowTemp__c, INT_EXT_Elec_LowTemp__c, QF_Elec_LowTemp__c, FUSE_BB_VD_ELE_LowTemp__c, FUSE_BM_VD_Ele_LowTemp__c, Fuse_BT_VD_Ele_LowTemp__c, Rating_VD_Ele_LowTemp__c, Voltage_PS_Elec_LowTemp__c, Phase_PS_Elec_LowTemp__c, Fuse_BS_EP_Elec_LowTemp__c, Rating_EP_Elec_LowTemp__c, Fuse_BB_EP_Elec_LowTemp__c, Fuse_BM_EP_Elec_LowTemp__c, WS_PF_Elec_LowTemp__c, WQ_PF_Elec_LowTemp__c, IS_WRBOVIOC_PF_Elec_LowTemp__c, CS_PF_Elec_LowTemp__c, INT_EXT_D_CU_Elec_LowTemp__c, NP_D_CU_Elec_LowTemp__c, F_NF_D_CU_Elec_LowTemp__c, QF_D_CU_Elec_LowTemp__c, Fuse_BB_D_CU_Elec_LowTemp__c, Fuse_B_DM_D_CU_Elec_LowTemp__c, Fuse_BT_D_CU_Elec_LowTemp__c, Rating_D_CU_Elec_LowTemp__c, Voltage_PS_CU_Elec_LowTemp__c, Phase_PS_CU_Elec_LowTemp__c, Fuse_B_EP_CU_Elec_LowTemp__c, Rating_EP_CU_Elec_LowTemp__c, Fuse_BB_EP_CU_Elec_LowTemp__c, Fuse_BM_EP_CU_Elec_LowTemp__c, WILL_NECNTBA_EP_CU_Elec_LowTemp__c, WS_PF_CU_Elec_LowTemp__c, WQ_PF_CU_Elec_LowTemp__c, IS_WRBOVIOC_PF_CU_Elec_LowTemp__c, CS_PF_CU_Elec_LowTemp__c, Temp_In_C_F_LowTemp__c, Temp_Reading_At_M_D_LowTemp__c, Box_Vs_MTR_Temp_Diff_LowTemp__c, Box_Temp_5_ABV_DSG_Temp_LowTemp__c, DTHMTR_Bulb_EXT_PROP_INST_LowTemp__c, Box_Vs_MDL_Diff_LowTemp__c, HDR_Door_MC_FD_DMG_LowTemp__c, HDR_Door_ACSRY_DMG_LowTemp__c, WI_Door_Width_LowTemp__c, INTR_WI_Box_DMNSN_LowTemp__c, Lights_To_Be_RPC_RLC_LowTemp__c, Fire_PRTC_Head_Issues_LowTemp__c, Heat_TRC_INT_And_FNC_LowTemp__c, Wiring_Safety_CNCRNS_LowTemp__c, Air_Leakage_TSR_LowTemp__c, Air_Leakage_TC_LowTemp__c, AIr_Leakage_TSA_LowTemp__c, UPP_LowTemp__c, Box_Issues_WPMDP_LowTemp__c, Mold_MILD_INS_Freezer_LowTemp__c, Mold_MILDODF_LowTemp__c, Box_Issues_SC_LowTemp__c, Ice_Form_In_C_F_LowTemp__c, Ice_Form_On_DF_LowTemp__c, Number_Of_Glass_Doors_LowTemp__c, Door_Issues_CG_LowTemp__c, Door_Issues_HD_LowTemp__c, Door_Issues_DDO_CC_LowTemp__c, Door_Issues_DS_GS_LowTemp__c, Door_Issues_DF_LowTemp__c, Door_Issues_FG_LowTemp__c, Door_Issues_GN_LowTemp__c, Door_Issues_AEDL_LowTemp__c, Hinge_CND_CPN_Lowtemp__c, Door_Frame_HF_LowTemp__c, WI_Cooler_GD_Width_LowTemp__c, WI_Cooler_GD_Height_LowTemp__c, WI_Cooler_GD_WO_LowTemp__c, Brkn_Or_Missing_Cooler_Or_FS_LowTemp__c, Number_of_SB_M_LowTemp__c, Was_a_picture_taken_LowTemp__c, Width_Of_Shelves_LowTemp__c, Length_Of_Shelves_LowTemp__c, Loc_Of_Crane_General__c, Require_an_FAA_study_General__c, LocOfRoofHatch_General__c, Store_Energy_General__c, Where_Is_Elec_RR_C_R_General__c, IS_There_C_M_OECW_25ft_C_General__c, IS_Top_WINFU_General__c, IS_There_AOFTWIA_General__c, Location_Of_Cu_General__c, Comp_Have_RE_C_R_General__c, Rail_Dimensions_1_H_General__c, Rail_Dimensions_1_L_General__c, Rail_Dimensions_1_W_General__c, Rail_Dimensions_1_DBR1_General__c, Rail_Dimensions_1_DBR2_General__c, Rail_Dimensions_2_H_General__c, Rail_Dimensions_2_L_General__c, Rail_Dimensions_2_W_General__c, Rail_Dimensions_2_DBR1_General__c, Rail_Dimensions_2_DBR2_General__c, Rail_Dimensions_3_H_General__c, Rail_Dimensions_3_L_General__c, Rail_Dimensions_3_W_General__c, Rail_Dimensions_3_DBR1_General__c, Rail_Dimensions_3_DBR2_General__c, Rail_Dimensions_4_H_General__c, Rail_Dimensions_4_L_General__c, Rail_Dimensions_4_W_General__c, Rail_Dimensions_4_DBR1_General__c, Rail_Dimensions_4_DBR2_General__c, Is_ECDA_General__c, Is_ECDR_General__c, Roof_Rating_General__c, In_front_of_case_General__c, Manufacturer_Beer_Cooler_MedTemp__c, Date_Of_Mfg_Beer_Cooler_MedTemp__c, Decom_LkdCondUnits_BeerCooler_MT__c, Eva_M1_L1_Model_BeerCooler_MT__c, Eva_M1_L1_Serial_BeerCooler_MT__c, Eva_M1_L1_WagAssetTag_BeerCooler_MT__c, Eva_M2_L2_Model_BeerCooler_MT__c, Eva_M2_L2_Serial_BeerCooler_MT__c, Eva_M2_L2_WagAssetTag_BeerCooler_MT__c, Eva_M3_L3_Model_BeerCooler_MT__c, Eva_M3_L3_Serial_BeerCooler_Mt__c, Eva_M3_L3_WagAssetTag_BeerCooler_MT__c, WillNewOrExistingReach_BeerCooler_MT__c, PermReachAtStore_BeerCooler_MT__c, Reach_InCaseSC_R_BeerCooler_MT__c, Reach_InCase_1Mfg_BeerCooler_MT__c, Reach_InCase_1_Model_BeerCooler_MT__c, Reach_InCase_1_Serial_BeerCooler_MT__c, Reach_InCase_1EleCon_BeerCooler_MT__c, Reach_InCase_1_DoorWidth_BeerCooler_MT__c, Reach_InCase_2Mfg_BeerCooler_MT__c, Reach_InCase_2_Model_BeerCooler_MT__c, Reach_InCase_2_Serial_BeerCooler_MT__c, Reach_InCase_2EleCon_BeerCooler_MT__c, Reach_InCase_2_DoorWidth_BeerCooler_MT__c, Reach_InCase_3Mfg_BeerCooler_MT__c, Reach_InCase_3_Model_BeerCooler_MT__c, Reach_InCase_3_Serial_BeerCooler_MT__c, Reach_InCase_3EleCon_BeerCooler_MT__c, Reach_InCase_3_DoorWidth_BeerCooler_MT__c, SharedCU_BeerCooler_MT__c, NumberOfTotalDoors_BeerCooler_MT__c, BackOfHouse_BOH_Cases_BeerCooler_MT__c, BOHCases_SC_R_BeerCooler_MT__c, BOHCase_1_Model_BeerCooler_MT__c, BOHCase_1_Serial_BeerCooler_MT__c, BOHCase_1_Age_BeerCooler_MT__c, BOHCase_1_Con_VI_BeerCooler_MT__c, BOHCase_2_Model_BeerCooler_MT__c, BOHCase_2_Serial_BeerCooler_MT__c, BOHCase_2_Age_BeerCooler__c, BOHCase_2_Con_VI_BeerCooler__c, BOHCase_3_Model_BeerCooler__c, BOHCase_3_Serial_BeerCooler__c, BOHCase_3_Age_BeerCooler__c, BOHCase_3_Con_VI_BeerCooler__c, INT_EXT_Elec_BeerCooler__c, QF_Elec_BeerCooler__c, FUSE_BB_VD_ELE_BeerCooler__c, FUSE_BM_VD_Ele_BeerCooler__c, Fuse_BT_VD_Ele_BeerCooler__c, Rating_VD_Ele_BeerCooler__c, Voltage_PS_Elec_BeerCooler__c, Phase_PS_Elec_BeerCooler__c, Fuse_BS_EP_Elec_BeerCooler__c, Rating_EP_Elec_BeerCooler__c, Fuse_BB_EP_Elec_BeerCooler__c, Fuse_BM_EP_Elec_BeerCooler__c, WS_PF_Elec_BeerCooler__c, WQ_PF_Elec_BeerCooler__c, IS_WRBOVIOC_PF_Elec_BeerCooler__c, CS_PF_Elec_BeerCooler__c, INT_EXT_D_CU_Elec_BeerCooler__c, NP_D_CU_Elec_BeerCooler__c, F_NF_D_CU_Elec_BeerCooler__c, QF_D_CU_Elec_BeerCooler__c, Fuse_BB_D_CU_Elec_BeerCooler__c, Fuse_B_DM_D_CU_Elec_BeerCooler__c, Fuse_BT_D_CU_Elec_BeerCooler__c, Rating_D_CU_Elec_BeerCooler__c, Voltage_PS_CU_Elec_BeerCooler__c, Phase_PS_CU_Elec_BeerCooler__c, Fuse_B_EP_CU_Elec_BeerCooler__c, Rating_EP_CU_Elec_BeerCooler__c, Fuse_BB_EP_CU_Elec_BeerCooler__c, Fuse_BM_EP_CU_Elec_BeerCooler__c, WILL_NECNTBA_EP_CU_Elec_BeerCooler__c, WS_PF_CU_Elec_BeerCooler__c, WQ_PF_CU_Elec_BeerCooler__c, IS_WRBOVIOC_PF_CU_Elec_BeerCooler__c, CS_PF_CU_Elec_BeerCooler__c, Temp_In_C_F_BeerCooler__c, Temp_Reading_At_M_D_BeerCooler__c, Box_Vs_MTR_Temp_Diff_BeerCooler__c, Box_Temp_5_ABV_DSG_Temp_BeerCooler__c, DTHMTR_Bulb_EXT_PROP_INST_BeerCooler__c, Box_Vs_MDL_Diff_BeerCooler__c, HDR_Door_MC_FD_DMG_BeerCooler__c, HDR_Door_ACSRY_DMG_BeerCooler__c, WI_Door_Width_BeerCooler__c, INTR_WI_Box_DMNSN_BeerCooler__c, Lights_To_Be_RPC_RLC_BeerCooler__c, Fire_PRTC_Head_Issues_BeerCooler__c, Heat_TRC_INT_And_FNC_BeerCooler__c, Wiring_Safety_CNCRNS_BeerCooler__c, Air_Leakage_TSR_BeerCooler__c, Air_Leakage_TC_BeerCooler__c, AIr_Leakage_TSA_BeerCooler__c, UPP_BeerCooler__c, Box_Issues_WPMDP_Beercooler__c, Mold_MILD_INS_Freezer_BeerCooler__c, Mold_MILDODF_BeerCooler__c, Box_Issues_SC_BeerCooler__c, Ice_Form_In_C_F_BeerCooler__c, Ice_Form_On_DF_BeerCooler__c, Number_Of_Glass_Doors_BeerCooler__c, Door_Issues_CG_BeerCooler__c, Door_Issues_HD_BeerCooler__c, Door_Issues_DDO_CC_BeerCooler__c, Door_Issues_DS_GS_BeerCooler__c, Door_Issues_DF_BeerCooler__c, Door_Issues_FG_BeerCooler__c, Door_Issues_GN_BeerCooler__c, Door_Issues_AEDL_BeerCooler__c, Hinge_CND_CPN_BeerCooler__c, Door_Frame_HF_BeerCooler__c, Brkn_Or_Missing_Cooler_Or_FS_BeerCooler__c, Number_of_SB_M_BeerCooler__c, Was_a_picture_taken_BeerCooler__c, Width_Of_Shelves_BeerCooler__c, Length_Of_Shelves_BeerCooler__c from Site_Survey__c where Id =:surveyId Limit 1];
            if(lstSurvey.size() > 0){
                surveyRecord = lstSurvey[0];
            }
           
        } catch (Exception e) {
            throw new AuraHandledException('Error While fetching records: ' + e.getMessage());
        }
        return surveyRecord;
    }

    @AuraEnabled
    public static Project__c getProjectRecord(String projectId) {   
        Project__c projectRecord = new Project__c();       
        try {
         List<Project__c> listProject = [Select Id, Name From Project__c Where Id =: projectId LIMIT 1];
            if(listProject.size() > 0){
                projectRecord = listProject[0];
            }
           
        } catch (Exception e) {
            throw new AuraHandledException('Error While fetching records: ' + e.getMessage());
        }
        return projectRecord;
    }

    @AuraEnabled
    public static Site_Survey__c updateSurveyRecord(Site_Survey__c surveyRecord) {   
        if(surveyRecord.Survey_Status__c  == 'Submitted'){
            sendEmailWithSurveyId(surveyRecord.Id);
        }

        try {
            update surveyRecord;
        } catch (Exception e) {
            throw new AuraHandledException('Error updating records: ' + e.getMessage());
        }
        return surveyRecord;
    }

    @AuraEnabled
    public static String createNote(String noteTitle, String noteBody, Id parentId) {
        String message = '';
    
            List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :parentId LIMIT 5000];
            Set<Id> setofId = new Set<Id>();
            for(ContentDocumentLink objCD : documentLinks){
                setofId.add(objCD.ContentDocumentId);
            }
    
    
            // Check for existing notes with the same title for the given parent
            List<ContentNote> existingNotes = [SELECT Id, Title, Content  FROM ContentNote WHERE Id = :setofId AND Title = :noteTitle LIMIT 1];
            
            // If an existing note with the same title exists, update the title and exit
            if (existingNotes.size()>0) {
                ContentNote existingNote = existingNotes[0];
                existingNote.Content = Blob.valueOf(noteBody);
                try{
                    update existingNote;
                }Catch(Exception e){
                    System.debug('Exception while updating ' +e.getMessage());
                }
               
                message = 'Success';
                return message;
            }
            
            // Create a new ContentNote instance
            ContentNote newNote = new ContentNote();
            newNote.Title = noteTitle;
            newNote.Content = Blob.valueOf(noteBody);
            try {
                insert newNote; 
            } Catch(Exception e){
                System.debug('Exception while Inserting ' +e.getMessage());
            }
            
    
            // Create a ContentDocumentLink to associate the note with the parent record
            ContentDocumentLink docLink = new ContentDocumentLink();
            docLink.LinkedEntityId = parentId;
            docLink.ContentDocumentId = newNote.Id;
            docLink.ShareType = 'V'; 
            try {
                insert docLink;  
            } Catch(Exception e){
                System.debug('Exception while Doc Link ' +e.getMessage());
            }
            
    
            message = 'Success';
        
        return message;
    }



    @AuraEnabled
    public static String getNote(String parentId, String noteTitle) {
        String contentBody = ''; 
    
        try {
            // Query ContentDocumentLink to get the ContentDocumentId associated with the parentId
            List<ContentDocumentLink> documentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId = :parentId LIMIT 5000];
    
            Set<Id> setOfContentDocumentIds = new Set<Id>();
            for (ContentDocumentLink objCD : documentLinks) {
                setOfContentDocumentIds.add(objCD.ContentDocumentId);
            }
    
            // Query existing notes with the same title for the given parent
            List<ContentNote> existingNotes = [SELECT Id, Title, Content FROM ContentNote WHERE Id IN :setOfContentDocumentIds AND Title = :noteTitle LIMIT 1];
            
            // If existingNotes is not empty, update contentBody with the content of the first matching note
            if (!existingNotes.isEmpty()) {
                contentBody = existingNotes[0].Content != null ? existingNotes[0].Content.toString() : '';
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error while fetching records: ' + e.getMessage());
        }
        
        return contentBody;
    }

    public static void sendEmailWithSurveyId(Id surveyRecordId) {
        String OrgWideEmailAddressId = Label.OrgWideEmailAddressId;
        String templateName = Label.SurveyEmailTemplate;
        
        // Retrieve the org-wide email address
        OrgWideEmailAddress[] lstEmailAddress = [SELECT Id FROM OrgWideEmailAddress WHERE Id =: OrgWideEmailAddressId LIMIT 1];
        
        // Get the Survey record
        Site_Survey__c[] listSurvey = [SELECT Id, Name, Contact__c, Project__c FROM Site_Survey__c WHERE Id = :surveyRecordId LIMIT 1];
        
        // Check if Survey record exists
        if (listSurvey.size()>0) {
            // Retrieve the contact email and name
            Contact[] conList = [SELECT Name, Email FROM Contact WHERE Id = :listSurvey[0].Contact__c LIMIT 1];
            
            // Check if contact exists and has an email
            if (conList.size() > 0 && conList[0].Email != null) {
                // Retrieve the email template
                EmailTemplate[] emailTemplates = [SELECT Id, Subject, Body FROM EmailTemplate WHERE DeveloperName =: templateName LIMIT 1];

                Project__c[] listProject = [Select Id, OwnerId, Name From Project__c Where Id =: listSurvey[0].Project__c];
                if(listProject.size() > 0){
                    User[] listUser = [Select Email From User Where Id =: listProject[0].OwnerId];
                    // Check if email template exists
                    if (emailTemplates.size()>0) {
                        // Prepare the email message
                        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                        email.setOrgWideEmailAddressId(lstEmailAddress[0].Id);
                        email.setToAddresses(new List<String>{ conList[0].Email });
                        email.setCcAddresses(new List<String>{ listUser[0].Email });
                        email.setTemplateId(emailTemplates[0].Id);
                        email.setSubject(emailTemplates[0].Subject);
                        email.setTargetObjectId(listSurvey[0].Contact__c);
                        email.setWhatId(listSurvey[0].Id);
                        email.setSaveAsActivity(false);  

                        String subject = emailTemplates[0].Subject.replace('{!projectName}', listProject[0].Name);
                        email.setSubject(subject);

                        String body = emailTemplates[0].Body.replace('{!SurveyorName}', conList[0].Name);
                            body = body.replace('{!surveyNumber}', listSurvey[0].Name);
                            body = body.replace('{!projectName}', listProject[0].Name);
                        email.setPlainTextBody(body);
                        
                        // Send the email
                        Messaging.SendEmailResult[] result = Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });
                        
                    }
                } 
            } 
        } 
    }

}