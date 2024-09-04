# Next Safe Action

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-t3-app`](https://create.t3.gg/). It includes a simple example of how to use [next safe action](https://next-safe-action.dev) with [Lucia](https://lucia-auth.com) and [Prisma](https://prisma.io).

## Tech Stack

- [Next.js](https://nextjs.org)
- [Lucia](https://lucia-auth.com)
- [Prisma](https://prisma.io)
- [Next Safe Action](https://next-safe-action.dev)
- [Tailwind CSS](https://tailwindcss.com)

## Getting Started

First, clone the repository:

```bash
git clone git@github.com:tiesen243/next-safe-action.git
```

Then, install the dependencies:

```bash
bun install
```

Next, create a `.env` file in the root of the project and add the following environment variables:

> Note: You can get the `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` via [vercel](https://vercel.com/docs/storage)

```bash
cp .env.example .env
```

Then, run the development server:

```bash
bun db:push
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
