# Trabajo práctico individual

La primera entrega (TP1) está en el branch **tp1**

La segunda entrega (TP2) está en el branch **tp2** y **master**

## Compilación

Primero descargar las dependencias utilizando

```
npm install
```

Luego compilar código Typescript utilizando

```
npx webpack
```

Este comando también se encarga de unificar todos los archivos .js en un único archivo main.js y además se encarga de copiar los shaders a la carpeta `dist`


## Server de pruebas

Para iniciar el server de pruebas utilizar 

```
npm start
```

## Compilación automática

Si ejecutamos `npm run watch`, iniciamos *webpack watch*, que detecta los cambios en los archivos fuente y recompila el archivo de salida cuando es necesario.
