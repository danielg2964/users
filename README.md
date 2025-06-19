# Proyecto Node.js para BRM

Proyecto en Node.Js haciendo uso de una arquitectura limpia y clara para su correcta lectura y entendimiento.

## Características

- Estructura modular y clara
- Uso de `node --env-file-if-exists` para configuración
- Uso del framework  `Fastify` para mayor velocidad
- Uso de las últimas caracterisitcas de `Node.js LTS`
- Uso nativo de `Typescript` gracias a `node --experimental-strip-types`
- Uso de la suite de testing nativa de `Node.js` `node:test` y `node:assert/strict`

## Requisitos

- [Node.js](https://nodejs.org/) v22.6.0 o superior
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

## Instalación

```bash
git clone https://github.com/danielg2964/users
cd users
npm install
```

## Pruebas

```bash
node --run test
```

## Ejecución

```bash
node --run start
```

### o con Docker
```bash
docker compose up
```

# Conocimientos Adquiridos y Posibles Mejoras

Durante el desarrollo de este pequeño proyecto, aprendí y apliqué lo siguiente:

- **Uso de Value Objects**

  Considero fundamental el uso de *Value Objects*, ya que me ayudaron a resolver una problemática que he observado con frecuencia en mi experiencia.

  Cuando se construyen objetos que reciben tipos primitivos en su constructor, pueden surgir errores al pasar argumentos, especialmente desde estructuras como los DTOs. Por ejemplo, es posible pasar un valor incorrecto pero del mismo tipo, como asignar la contraseña en lugar del correo electrónico, sin que TypeScript lo detecte como error.

  Para prevenir este tipo de fallos, utilicé varios *Value Objects* en las entidades del dominio. Además, implementé un getter asociado a un `unique symbol` (los getters no afectan la serialización del objeto en la base de datos) con el objetivo de evitar que TypeScript permita pasar instancias de diferentes clases que tengan el mismo *shape*. Esta solución me pareció efectiva y cómoda de implementar, aunque sea más vebosa.

- **Posible Mejora: Patrón Unit of Work**

  Una mejora que considero valiosa sería implementar el patrón `Unit of Work` para evitar operaciones innecesariamente grandes contra MongoDB al momento de guardar un usuario durante una actualización.

  ORMs como `Mongoose` ya implementan este patrón por defecto. Sin embargo, como en este proyecto utilicé el conector oficial de MongoDB, este patrón no está incorporado, por lo que sería necesario implementarlo desde cero.

---

# Patrones Aplicados

Desde el inicio tuve un objetivo claro: aplicar una arquitectura limpia y por capas. Separando los casos de uso de lectura y escritura, logré una estructura ordenada, comprensible y fácil de mantener.

La arquitectura que empleé está inspirada en los principios de `Domain-Driven Design (DDD)` y `CQRS`. No afirmo estar aplicando estas arquitecturas de forma estricta o “pura”, pero posiblemente, al revisar el proyecto, puedas identificar con claridad su influencia y concluir: *"Esto es DDD con CQRS"*.

