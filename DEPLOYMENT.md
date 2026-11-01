# Despliegue de pruebas en Vercel

Estado: cambios locales preparados; todavía no publicados.
Repositorio: https://github.com/davidmanueldev/restaurante-bambu
Se usará el mismo MongoDB solicitado por el propietario. Los datos de las pruebas se guardarán allí.

## Configuración del proyecto

- Importar el repositorio en Vercel tras revisar y subir estos cambios.
- Framework: Next.js.
- Root Directory: raíz del repositorio (`.`).
- Node.js: 24.x, igual que en `package.json`.
- Package manager: pnpm 12.15.0, fijado en `packageManager`.
- Activar `ENABLE_EXPERIMENTAL_COREPACK=1` para que Vercel use esa versión.
- Build Command: `pnpm build`.
- Mantener el directorio de salida predeterminado de Next.js.
- Usar un dominio estable `https://<proyecto>.vercel.app` para las pruebas de OAuth.
- No introducir secretos en Git ni en el chat. Cargarlos en Environment Variables de Vercel.

## Variables

Copiar los valores válidos del entorno local a Vercel; no copiar las comillas del archivo.
Configurar el entorno al que se vaya a desplegar.

| Variable | Configuración |
| --- | --- |
| MONGO_URL | URI vigente del mismo clúster, con la base de datos actual. |
| NEXTAUTH_URL | URL estable de Vercel con HTTPS. |
| SECRET | Secreto aleatorio para firmar sesiones, por ejemplo generado con `openssl rand -base64 32`. |
| GOOGLE_CLIENT_ID | Cliente OAuth de Google. |
| GOOGLE_CLIENT_SECRET | Secreto del cliente OAuth. |
| MY_AWS_ACCESS_KEY | Credencial con permiso de subida al bucket. |
| MY_AWS_SECRET_KEY | Secreto de AWS. |
| AWS_REGION | Región real del bucket; valor predeterminado actual: us-east-2. |
| AWS_S3_BUCKET | Bucket actual: restaurante-bambu. |
| STRIPE_SK | Clave de Stripe en modo test. |
| STRIPE_SIGN_SECRET | Secreto del webhook registrado para esta URL, distinto al de Stripe CLI local. |
| GEMINI_API_KEY | Clave válida de Google AI Studio; actualmente falta en el entorno local. |
| ENABLE_EXPERIMENTAL_COREPACK | 1. |

`STRIPE_PK` aparece en el archivo histórico pero el código actual no la consume.
Si se cambia el bucket, actualizar también el hostname permitido en `next.config.js`.

## Google OAuth

En el cliente OAuth de Google Cloud, conservar las URLs de localhost y añadir:

- Origen autorizado: `https://<proyecto>.vercel.app`.
- URI de redirección: `https://<proyecto>.vercel.app/api/auth/callback/google`.

Si la aplicación OAuth está en modo de pruebas, añadir el email del tester a los usuarios de prueba.
Usar siempre el dominio configurado en NEXTAUTH_URL para iniciar sesión.
Las sesiones ahora usan JWT para admitir también el login por contraseña; hay que volver a iniciar sesión tras este cambio.

## MongoDB Atlas

Verificar que Network Access permite conexiones desde el despliegue de Vercel.
Antes de ampliar el acceso de red, acordar la configuración con el propietario.
No cambiar credenciales o permisos de Atlas durante la publicación sin consultarlo.

## Stripe

Mantener todas las pruebas en modo test y usar tarjetas de prueba de Stripe.

- Endpoint: `https://<proyecto>.vercel.app/api/webhook`.
- Eventos: `checkout.session.completed` y `checkout.session.async_payment_succeeded`.
- Copiar su signing secret a STRIPE_SIGN_SECRET y volver a desplegar tras cambiarlo.
- Probar pago total, adelanto del 30%, cancelación y confirmación en MongoDB.
- El importe se calcula desde el menú y se verifica junto con la sesión de Stripe al confirmar.
- El webhook nuevo confirma pedidos creados por esta versión, que incluyen stripeSessionId y expectedPaymentAmount.
- No se ha efectuado ningún cobro ni creado un webhook externo durante la preparación local.

## AWS

Comprobar región, credenciales y permisos sobre el bucket existente.
La subida conserva `ACL: public-read` del proyecto; verificar que la configuración del bucket lo admite.
No cambiar la política de acceso público del bucket sin revisar su configuración con el propietario.
La API requiere sesión, admite JPG/PNG/WebP/GIF y limita a 3 MB por imagen.
Las imágenes se decodifican y vuelven a codificar antes de subirlas; los GIF se guardan como imagen estática.

## Gemini

Crear o seleccionar una API key de AI Studio y cargar GEMINI_API_KEY.
Probar una conversación real y revisar cuotas de la cuenta.
No se ha enviado ninguna consulta a Gemini durante las pruebas locales.

## Verificación

Comprobaciones locales disponibles:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm lint
pnpm build
pnpm start
```

Las pruebas automatizadas usan dobles de MongoDB/Stripe para no crear pedidos ni cobros reales.
También se verificaron por HTTP el inicio, el menú, las rutas de autenticación y el rechazo de peticiones anónimas.

Antes de dar el enlace al tester, verificar en el despliegue:
login Google y por contraseña, perfil propio, restricciones de perfiles/pedidos ajenos,
gestión de usuarios por administrador, productos/categorías, subida de imágenes,
pedidos pequeños en efectivo, pago total y adelanto Stripe, webhook, chatbot y analíticas.
Las pruebas completas de Google, AWS, Stripe y Gemini quedan pendientes hasta configurar los servicios.

Referencias:
- https://nextjs.org/blog/nextjs-security-update-october-14-2026
- https://vercel.com/docs/package-managers
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
