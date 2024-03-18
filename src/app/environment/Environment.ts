
import { OnInit } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { myAppConfig } from "../../assets/ecosystem.config";

export const Environment = 
{
        LiveProduction_CONNECTOR_API: myAppConfig.psloan_NodeExpress_ServerAddress_ProducUrl,
        LapoUrlLocal1_CONNECTOR_API:  myAppConfig.psloan_NodeExpress_ServerAddress_DevUrl,
}

export class ApiHostComponent 
{
    public static IsLive : any = myAppConfig.IsProducOrDev;
        
    public static GetHostUrl(State: ApiHostState): string 
    {
            if(this.IsLive == 0)
            {
                return Environment.LapoUrlLocal1_CONNECTOR_API;
            }
            else
            {
                if(State == ApiHostState.ConnectConveyorApi)
                {
                    return Environment.LiveProduction_CONNECTOR_API;
                }
                else
                {
                    return Environment.LiveProduction_CONNECTOR_API;
                }
            }

            switch (State) 
            {
                case ApiHostState.ConnectProductionApi:
                    return Environment.LiveProduction_CONNECTOR_API;
                    break;
                default:
                return Environment.LapoUrlLocal1_CONNECTOR_API;
            }
    }
}

enum ApiHostState 
{
         ConnectProductionApi = 1,
         ConnectConveyorApi = 0,
}

/**
    * name
*/

/*
* For easier debugging in development mode, you can import the following file
* to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
*
* This import should be commented out in production mode because it will have a negative impact
* on performance if an error is thrown.
*/
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.