import axios from 'axios';
import { environment } from 'src/environments/environment';

const URL = environment.urlAPI;

export const ViewerAPI = {

    async load(): Promise<{ success: boolean, data: any }> {
        let success = true;

          if (success) {
            return {success: success, data: null }
          } else {
            return {success: success, data: null}
          }  
      }
    }