import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { accesoService } from '../servicios/acceso.service';
import { ValidarToken } from '../interfaces/ValidarToken';

export const authGuard: CanActivateFn = (route, state) => 
{

  const router = inject(Router);
  const accesoServiceInstance = inject(accesoService);
  const objeto: ValidarToken = {token: (localStorage.getItem('token') || '')}

  return accesoServiceInstance.validarToken(objeto).toPromise().then(data => 
  {

    if (data && data.exito == true) 
    {
      return true;
    } 
    else 
    {
      const url = router.createUrlTree([""]);
      return url;
    }

  }).

  catch(error => 
  {
    const url = router.createUrlTree([""]);
    return url;
  });
  
};
