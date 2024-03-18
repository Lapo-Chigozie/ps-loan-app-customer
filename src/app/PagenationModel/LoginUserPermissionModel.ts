export class LoginUserPermissionModel
{
    public  IsRELATIONSHIPOFFICER:boolean  = false;
    public  IsTEAMLEADS :boolean  = false;
    public  IsRECONCILIATIONANDACCOUNTOFFICER :boolean  = false;
    public  IsASSISTANTHEADOFOPERATION:boolean  = false;
    public  IsHEADOFOPERATIONS:boolean  = false;
    public  IsGROUPHEAD :boolean  = false;
    public  IsDISBURSEMENTOFFICER :boolean  = false;

    public  IsGeneralPermissionsAccessRight :boolean  = false;
    public  IsTenureAccessRight :boolean  = false;
    public  IsLoanSettingAccessRight :boolean  = false;
    public  IsNetPaysAccessRight :boolean  = false;

    public  IsCustomerLoanPermission :boolean  = false;

    public  GroupId !:number;
    public  GroupName !:string;
    public  TeamId!:number;

    public  IsDeveloperTeam :boolean  = false;
    public  AccessRightToAnonymousLoanApplication :boolean  = false;

    public  AccessRightToApprovedLoan :boolean  = false;
    public  AccessRightToCancelLoan :boolean  = false;
    public  AccessRightToExportDISBURSEMENTLoan :boolean  = false;
    public  AccessRightToUploadBackDISBURSEMENTLoan:boolean  = false;
    public  AccessRightToViewLoan:boolean  = false;

    public  AccessRightToUploadBackRepaymentLoan :boolean  = false;
    public  AccessRightToViewUploadBackRepaymentLoan :boolean  = false;

    public  AccessRightToViewDisbursementLoan :boolean  = false;


    public  AccessRightToPrintLoan :boolean  = false;
    public  AccessRightToProceedLoan :boolean  = false;
}