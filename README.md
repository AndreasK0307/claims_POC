# Claims Management System

This is a simple claims management system used to manage claims internally within an office context using Deno, Express and PostgreSQL, with Prisma ORM for database management.

## Requirements

Deno V2 runtime is required to run the code within the repo.

## Installation

After cloning or forking the repository, run the following command to install all of the necessary dependencies.

```bash
deno install --allow-scripts
```

## Pushing Models to DB

To push your `schema.prisma` file containing your models into the database and generate the Prisma Client, run the following commands:

```bash
deno task pushDB
deno task generate
```

## Seeding the DB

The seeding code is found in `prisma/seed.ts`, in the same directory as the `schema.prisma` file. You can modify this file to seed the database with your required data. Once done, just run the following code in the command line. 

```bash
deno task seed
```
## Starting the dev server

To start the dev server, run the following command. 

```bash
deno task dev 
```