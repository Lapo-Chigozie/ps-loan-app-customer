import { AccountDetailsDto } from "./AccountInfoDto";
import { BvnAuthDto } from "./BvnAuthDto";
import { BvnRespondsDto } from "./BvnRespondsDto";

export class PersonalDetailsDto 
{
    fullname:string | undefined ;
    PFNumber:string | undefined ;
    DateOfBirth:string | undefined ;
    PhoneNumber:string | undefined;
    AltPhoneNumber:string | undefined ;
    ResidentialAddress:string | undefined ;
    retDate:any | undefined;
    MaritalStatus:string | undefined ;
    nokname:string | undefined ;
    nokphone:string | undefined ;
    nokaddress:string | undefined ;
    bvnAuth!: BvnAuthDto 
    acctDetails !:AccountDetailsDto;
    BvnResponds !:BvnRespondsDto;
    RelationShip:string | undefined ;
    Reasonforthisloan:string | undefined ;


    CusState:string | undefined ;
    CusCity:string | undefined ;
    CusStateName:string | undefined ;
    CusCityName:string | undefined ;
    CusBusinessTypeText:string | undefined ;
    CusBusinessTypeValue:string | undefined ;
    CusBusinessSegmentText:string | undefined ;
    CusBusinessSegmentValue:string | undefined ;
}
