const env = (window as any).env;
const exp = new RegExp(/\${([^}]+)}/g);
export const environment = {
  production: true,
};
