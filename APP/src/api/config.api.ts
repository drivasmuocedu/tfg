import axios from 'axios';
import { ViewerWidget } from 'src/app/models/viewer.model';
import { environment } from 'src/environments/environment';

const URL = environment.urlAPI;

export const ConfigAPI = {
  async loadWidgets(scenarioId?: number): Promise<ViewerWidget[]> {
    if (typeof scenarioId === 'undefined') {
      const response = await axios.get<ViewerWidget[]>(`${URL}/api/Config/Widgets`);
      return response.data;
    } else {
      const response = await axios.get<ViewerWidget[]>(`${URL}/api/Config/Widgets/${scenarioId}`);
      return response.data;
    }
  },
};
