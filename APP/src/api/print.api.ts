import axios from 'axios';
import { UserSignedIn } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

const URL = environment.urlAPI;

export const PrintAPI = {

    async print(format: string, base64: string): Promise<{success: boolean, data: any }> {
        let success = true;
        let errorResponse;
        const local = localStorage.getItem('userGeoviewer')
      let data: UserSignedIn | null = null;
      if (local){
        data = JSON.parse(local)
      }
        const response = await axios.post<any>(`${URL}/api/report/print`,{  
            "format": format, 
            "contentb64": base64
          }, {
          headers: {'Authorization': 'Bearer '+ data?.accessToken}})
          .catch(error => {
            if (error.response) {
              success = false;
              errorResponse = error.response;
            }
          });
          if (success) {
            return {success: success, data: response }
          } else {
            return {success: success, data: errorResponse}
          }
        
      }
    }