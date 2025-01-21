import axios from 'axios';
import { ViewerWidget } from 'src/app/models/viewer.model';
import { environment } from 'src/environments/environment';

const URL = environment.urlAPI;

export const EeAPI = {
  async map(from: string, to: string, geometry: any): Promise<any> {
    let fr = "2000-01-01";
    let t = "2001-01-01";
      const response = await axios.post<any>(`${URL}/api/get_deforestation_url`,{  
            "fromDateFccreacion": from, 
            "toDateFccreacion": to,
          "geometry" : geometry
          });
      return response.data;
  },
};